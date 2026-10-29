"use server";

import { createHash } from "node:crypto";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { credentialSchema } from "@/lib/validators";

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

export async function issueCredential(prevState, formData) {
  const session = await auth();
  if (!session || session.user.role !== "UNIVERSITY" || !session.user.universityId) {
    return { ok: false, error: "Not authorized" };
  }

  const raw = {
    studentName: formData.get("studentName")?.toString().trim() || "",
    enrollmentNo: formData.get("enrollmentNo")?.toString().trim() || "",
    degree: formData.get("degree")?.toString().trim() || "",
    branch: formData.get("branch")?.toString().trim() || "",
    yearOfPassing: formData.get("yearOfPassing")?.toString() || "",
    cgpa: formData.get("cgpa")?.toString() || undefined,
  };

  const parsed = credentialSchema.safeParse(raw);
  if (!parsed.success) {
    return { ok: false, errors: parsed.error.flatten().fieldErrors };
  }

  const data = parsed.data;

  try {
    const university = await prisma.university.findUnique({
      where: { id: session.user.universityId },
    });

    if (!university) {
      return { ok: false, error: "University not found" };
    }

    // Duplicate check: same university + enrollment + year
    const existing = await prisma.credential.findFirst({
      where: {
        universityId: university.id,
        enrollmentNo: data.enrollmentNo,
        yearOfPassing: data.yearOfPassing,
      },
    });
    if (existing) {
      return {
        ok: false,
        error: `A degree for enrollment ${data.enrollmentNo} (year ${data.yearOfPassing}) already exists at this university.`,
      };
    }

    // Generate credentialId: CODE-YEAR-XXXXXX
    const issueYear = new Date().getFullYear();
    const prefix = `${university.code}-${issueYear}-`;
    const last = await prisma.credential.findFirst({
      where: { credentialId: { startsWith: prefix } },
      orderBy: { credentialId: "desc" },
    });
    const lastSeq = last ? parseInt(last.credentialId.split("-").pop(), 10) : 0;
    const nextSeq = String(lastSeq + 1).padStart(6, "0");
    const credentialId = `${prefix}${nextSeq}`;

    // Compute hash
    const recordHash = hashRecord({
      studentName: data.studentName,
      enrollmentNo: data.enrollmentNo,
      degree: data.degree,
      branch: data.branch,
      yearOfPassing: data.yearOfPassing,
      universityCode: university.code,
    });

    // Create credential + audit log
    const credential = await prisma.credential.create({
      data: {
        credentialId,
        studentName: data.studentName,
        enrollmentNo: data.enrollmentNo,
        degree: data.degree,
        branch: data.branch,
        yearOfPassing: data.yearOfPassing,
        cgpa: data.cgpa ?? null,
        recordHash,
        status: "ACTIVE",
        universityId: university.id,
        auditLogs: {
          create: {
            action: "ISSUED",
            actor: session.user.email,
            meta: { credentialId },
          },
        },
      },
    });

    revalidatePath("/issuer");
    revalidatePath("/admin");
    revalidatePath("/student");

    return {
      ok: true,
      credentialId: credential.credentialId,
      verifyUrl: `/verify/${credential.credentialId}`,
    };
  } catch (err) {
    console.error("issueCredential error:", err);
    return { ok: false, error: "Failed to issue credential. Please try again." };
  }
}