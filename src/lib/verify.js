import { createHash } from "node:crypto";
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

/**
 * Verify a credential by its public credentialId.
 * Returns { status, credential, university, auditLogged }
 * status: "VALID" | "REVOKED" | "TAMPERED" | "NOT_FOUND"
 */
export async function verifyCredentialById(credentialId, options = {}) {
  const { logAudit = false, ip = null } = options;

  const credential = await prisma.credential.findUnique({
    where: { credentialId },
    include: { university: true },
  });

  if (!credential) {
    return { status: "NOT_FOUND", credential: null, university: null };
  }

  // Compute verification result
  let status;
  if (credential.status === "REVOKED") {
    status = "REVOKED";
  } else {
    const recomputed = hashRecord({
      studentName: credential.studentName,
      enrollmentNo: credential.enrollmentNo,
      degree: credential.degree,
      branch: credential.branch,
      yearOfPassing: credential.yearOfPassing,
      universityCode: credential.university.code,
    });
    status = recomputed === credential.recordHash ? "VALID" : "TAMPERED";
  }

  // Log the audit if requested
  if (logAudit) {
    try {
      await prisma.auditLog.create({
        data: {
          credentialId: credential.id,
          action: "VERIFIED",
          actor: "public-verifier",
          ip: ip || null,
          meta: { result: status },
        },
      });
    } catch (err) {
      console.error("Audit log failed:", err);
    }
  }

  return {
    status,
    credential,
    university: credential.university,
  };
}