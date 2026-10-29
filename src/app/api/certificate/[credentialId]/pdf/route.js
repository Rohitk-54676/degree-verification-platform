import { renderToBuffer } from "@react-pdf/renderer";
import QRCode from "qrcode";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import CertificateDocument from "@/components/certificate/CertificateDocument";

export async function GET(req, { params }) {
  const { credentialId } = await params;

  const session = await auth();
  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }

  const credential = await prisma.credential.findUnique({
    where: { credentialId },
    include: { university: true },
  });

  if (!credential) {
    return new Response("Credential not found", { status: 404 });
  }

  const role = session.user.role;
  const isAdmin = role === "ADMIN";
  const isOwnerIssuer =
    role === "UNIVERSITY" && session.user.universityId === credential.universityId;
  const isOwnerStudent =
    role === "STUDENT" &&
    session.user.enrollmentNo === credential.enrollmentNo &&
    session.user.universityId === credential.universityId;

  if (!isAdmin && !isOwnerIssuer && !isOwnerStudent) {
    return new Response("Forbidden", { status: 403 });
  }

  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const verifyUrl = `${baseUrl}/verify/${credential.credentialId}`;

  // Generate QR as buffer -> base64 data URL
  const qrBuffer = await QRCode.toBuffer(verifyUrl, {
    margin: 1,
    width: 300,
    errorCorrectionLevel: "M",
  });
  const qrDataUrl = `data:image/png;base64,${qrBuffer.toString("base64")}`;

  const pdfBuffer = await renderToBuffer(
    CertificateDocument({
      credential,
      university: credential.university,
      qrDataUrl,
      verifyUrl,
    })
  );

  return new Response(pdfBuffer, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${credential.enrollmentNo}.pdf"`,
    },
  });
}