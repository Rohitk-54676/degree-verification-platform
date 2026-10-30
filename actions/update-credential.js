"use server";

import { createHash } from "node:crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

function canonicalize(c) {
  return [
    c.studentName.trim(),
    c.enrollmentNo.trim(),
    c.degree.trim(),
    c.branch.trim(),
    String(c.yearOfPassing),
    c.universityCode.trim(),
  ].join("|");
}

function hashRecord(c) {
  return createHash("sha256").update(canonicalize(c)).digest("hex");
}

export async function updateCredential(prevState, formData) {
  const session = await auth();
  if (!session || session.user.role !== "UNIVERSITY" || !session.user.universityId) {
    return { ok: false, error: "Not authorized" };
  }

  const originalCredentialId = formData.get("originalCredentialId")?.toString();
  const credentialId = formData.get("credentialId")?.toString().trim() || "";
  const studentName = formData.get("studentName")?.toString().trim() || "";
  const enrollmentNo = formData.get("enrollmentNo")?.toString().trim() || "";
  const degree = formData.get("degree")?.toString().trim() || "";
  const branch = formData.get("branch")?.toString().trim() || "";
  const yearOfPassing = formData.get("yearOfPassing")?.toString() || "";
  const cgpaRaw = formData.get("cgpa")?.toString() || "";
  const status = formData.get("status")?.toString() || "ACTIVE";
  const revokedReason = formData.get("revokedReason")?.toString().trim() || "";

  if (!originalCredentialId) {
    return { ok: false, error: "Missing credential ID" };
  }

  if (!credentialId || !studentName || !enrollmentNo || !degree || !branch || !yearOfPassing) {
    return { ok: false, error: "All required fields must be filled" };
  }

  const yearNum = parseInt(yearOfPassing, 10);
  if (isNaN(yearNum) || yearNum < 1980 || yearNum > new Date().getFullYear() + 5) {
    return { ok: false, error: "Invalid year of passing" };
  }

  const cgpa = cgpaRaw === "" ? null : parseFloat(cgpaRaw);
  if (cgpa !== null && (isNaN(cgpa) || cgpa < 0 || cgpa > 10)) {
    return { ok: false, error: "CGPA must be between 0 and 10" };
  }

  try {
    const credential = await prisma.credential.findUnique({
      where: { credentialId: originalCredentialId },
      include: { university: true },
    });

    if (!credential) {
      return { ok: false, error: "Credential not found" };
    }
    if (credential.universityId !== session.user.universityId) {
      return { ok: false, error: "You can only edit credentials from your university" };
    }

    // If credentialId itself is being changed, check uniqueness
    if (credentialId !== originalCredentialId) {
      const existing = await prisma.credential.findUnique({
        where: { credentialId },
      });
      if (existing) {
        return { ok: false, error: "Credential ID already exists" };
      }
    }

    // Recompute hash — always, because any field may have changed
    const newHash = hashRecord({
      studentName,
      enrollmentNo,
      degree,
      branch,
      yearOfPassing: yearNum,
      universityCode: credential.university.code,
    });

    // Status change handling
    const statusChanged = status !== credential.status;
    const willRevoke = status === "REVOKED" && credential.status === "ACTIVE";
    const willReactivate = status === "ACTIVE" && credential.status === "REVOKED";

    const updateData = {
      credentialId,
      studentName,
      enrollmentNo,
      degree,
      branch,
      yearOfPassing: yearNum,
      cgpa,
      recordHash: newHash,
      status,
    };

    if (willRevoke) {
      updateData.revokedAt = new Date();
      updateData.revokedReason = revokedReason || "Revoked via edit";
    } else if (willReactivate) {
      updateData.revokedAt = null;
      updateData.revokedReason = null;
    }

    // Update credential + audit log
    await prisma.credential.update({
      where: { id: credential.id },
      data: {
        ...updateData,
        auditLogs: {
          create: {
            action: statusChanged && willRevoke ? "REVOKED" : "ISSUED",
            actor: session.user.email,
            meta: {
              edited: true,
              originalCredentialId,
              statusChanged,
              newStatus: status,
            },
          },
        },
      },
    });

    revalidatePath("/issuer");
    revalidatePath("/issuer/credentials");
    revalidatePath(`/certificate/${credentialId}`);
    revalidatePath(`/certificate/${originalCredentialId}`);
    revalidatePath(`/verify/${credentialId}`);
    revalidatePath(`/verify/${originalCredentialId}`);
    revalidatePath("/student");

    return {
      ok: true,
      credentialId,
      verifyUrl: `/verify/${credentialId}`,
    };
  } catch (err) {
    console.error("updateCredential error:", err);
    return { ok: false, error: "Failed to update credential. Please try again." };
  }
}