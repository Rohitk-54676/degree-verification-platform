"use server";

import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { universitySchema } from "@/lib/validators";

export async function createUniversity(prevState, formData) {
  // 1. Auth check — only ADMIN can create universities
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    return { ok: false, error: "Not authorized" };
  }

  // 2. Parse form values
  const raw = {
    name: formData.get("name")?.toString().trim() || "",
    code: formData.get("code")?.toString().trim().toUpperCase() || "",
    primaryColor: formData.get("primaryColor")?.toString() || "#1e3a8a",
    secondaryColor: formData.get("secondaryColor")?.toString() || "#d4af37",
    fontFamily: formData.get("fontFamily")?.toString() || "serif",
    borderStyle: formData.get("borderStyle")?.toString() || "double",
    registrarName: formData.get("registrarName")?.toString().trim() || "",
    motto: formData.get("motto")?.toString().trim() || "",
    address: formData.get("address")?.toString().trim() || "",
    createRegistrar: formData.get("createRegistrar") === "on",
    registrarEmail: formData.get("registrarEmail")?.toString().trim() || "",
    registrarPassword: formData.get("registrarPassword")?.toString() || "",
  };

  // 3. Validate
  const parsed = universitySchema.safeParse(raw);
  if (!parsed.success) {
    return {
      ok: false,
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  const data = parsed.data;

  // 4. If creating registrar, both fields must be present
  if (data.createRegistrar) {
    if (!data.registrarEmail || !data.registrarPassword) {
      return {
        ok: false,
        error: "Registrar email and password required when creating account",
      };
    }
  }

  try {
    // 5. Check for duplicate code
    const existing = await prisma.university.findUnique({
      where: { code: data.code },
    });
    if (existing) {
      return {
        ok: false,
        errors: { code: ["This code is already in use"] },
      };
    }

    // 6. Create university
    const university = await prisma.university.create({
      data: {
        name: data.name,
        code: data.code,
        primaryColor: data.primaryColor,
        secondaryColor: data.secondaryColor,
        fontFamily: data.fontFamily,
        borderStyle: data.borderStyle,
        registrarName: data.registrarName || null,
        motto: data.motto || null,
        address: data.address || null,
      },
    });

    // 7. Optionally create registrar account
    if (data.createRegistrar && data.registrarEmail && data.registrarPassword) {
      const passwordHash = await bcrypt.hash(data.registrarPassword, 10);
      await prisma.user.create({
        data: {
          email: data.registrarEmail,
          name: data.registrarName || `${data.name} Registrar`,
          passwordHash,
          role: "UNIVERSITY",
          universityId: university.id,
        },
      });
    }

    // 8. Revalidate the admin page so new university shows up
    revalidatePath("/admin");
    revalidatePath("/admin/universities");

    return { ok: true, universityId: university.id };
  } catch (err) {
    console.error("createUniversity error:", err);
    return { ok: false, error: "Failed to create university. Please try again." };
  }
}