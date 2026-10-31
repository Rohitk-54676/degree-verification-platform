"use server";

import { prisma } from "@/lib/prisma";

export async function submitInquiry(prevState, formData) {
  const university = formData.get("university")?.toString().trim();
  const contactName = formData.get("contactName")?.toString().trim();
  const email = formData.get("email")?.toString().trim();
  const message = formData.get("message")?.toString().trim();

  if (!university || !contactName || !email) {
    return { ok: false, error: "Please fill in all required fields." };
  }

  try {
    await prisma.inquiry.create({
      data: {
        university,
        contactName,
        email,
        message: message || null,
      },
    });

    return { ok: true };
  } catch (err) {
    console.error("Inquiry error:", err);
    return { ok: false, error: "Failed to send request. Please try again." };
  }
}