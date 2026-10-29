"use server";

import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { studentSchema } from "@/lib/validators";

export async function createStudent(prevState, formData) {
  const session = await auth();
  if (!session || session.user.role !== "UNIVERSITY" || !session.user.universityId) {
    return { ok: false, error: "Not authorized" };
  }

  const raw = {
    name: formData.get("name")?.toString().trim() || "",
    email: formData.get("email")?.toString().trim().toLowerCase() || "",
    enrollmentNo: formData.get("enrollmentNo")?.toString().trim() || "",
    password: formData.get("password")?.toString() || "",
  };

  const parsed = studentSchema.safeParse(raw);
  if (!parsed.success) {
    return { ok: false, errors: parsed.error.flatten().fieldErrors };
  }

  const data = parsed.data;

  try {
    // Check email uniqueness
    const emailExists = await prisma.user.findUnique({
      where: { email: data.email },
    });
    if (emailExists) {
      return {
        ok: false,
        errors: { email: ["This email is already registered"] },
      };
    }

    // Check enrollment uniqueness within this university
    const enrollmentExists = await prisma.user.findFirst({
      where: {
        universityId: session.user.universityId,
        enrollmentNo: data.enrollmentNo,
        role: "STUDENT",
      },
    });
    if (enrollmentExists) {
      return {
        ok: false,
        errors: {
          enrollmentNo: ["This enrollment number already has an account at your university"],
        },
      };
    }

    const passwordHash = await bcrypt.hash(data.password, 10);

    await prisma.user.create({
      data: {
        email: data.email,
        name: data.name,
        passwordHash,
        role: "STUDENT",
        universityId: session.user.universityId,
        enrollmentNo: data.enrollmentNo,
      },
    });

    revalidatePath("/issuer");
    revalidatePath("/issuer/students");
    revalidatePath("/admin");

    return { ok: true };
  } catch (err) {
    console.error("createStudent error:", err);
    return { ok: false, error: "Failed to create student. Please try again." };
  }
}