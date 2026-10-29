"use server";

import bcrypt from "bcryptjs";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { passwordChangeSchema } from "@/lib/validators";

export async function changePassword(prevState, formData) {
  const session = await auth();
  if (!session || !session.user.id) {
    return { ok: false, error: "Not authenticated" };
  }

  const raw = {
    currentPassword: formData.get("currentPassword")?.toString() || "",
    newPassword: formData.get("newPassword")?.toString() || "",
    confirmPassword: formData.get("confirmPassword")?.toString() || "",
  };

  const parsed = passwordChangeSchema.safeParse(raw);
  if (!parsed.success) {
    return { ok: false, errors: parsed.error.flatten().fieldErrors };
  }

  const data = parsed.data;

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });
    if (!user) {
      return { ok: false, error: "User not found" };
    }

    const valid = await bcrypt.compare(data.currentPassword, user.passwordHash);
    if (!valid) {
      return {
        ok: false,
        errors: { currentPassword: ["Current password is incorrect"] },
      };
    }

    const newHash = await bcrypt.hash(data.newPassword, 10);
    await prisma.user.update({
      where: { id: user.id },
      data: { passwordHash: newHash },
    });

    return { ok: true };
  } catch (err) {
    console.error("changePassword error:", err);
    return { ok: false, error: "Failed to change password. Please try again." };
  }
}