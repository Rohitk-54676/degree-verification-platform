import { z } from "zod";

// University creation schema
export const universitySchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters").max(120),
  code: z
    .string()
    .min(2, "Code must be at least 2 characters")
    .max(10)
    .regex(/^[A-Z0-9]+$/, "Code must be uppercase letters/numbers only"),
  primaryColor: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/, "Must be a valid hex color (e.g. #1e3a8a)"),
  secondaryColor: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/, "Must be a valid hex color (e.g. #d4af37)"),
  fontFamily: z.enum(["serif", "sans"]),
  borderStyle: z.enum(["single", "double", "ornate"]),
  registrarName: z.string().max(120).optional().or(z.literal("")),
  motto: z.string().max(200).optional().or(z.literal("")),
  address: z.string().max(300).optional().or(z.literal("")),

  // Optional registrar account creation
  createRegistrar: z.boolean().optional(),
  registrarEmail: z
    .string()
    .email("Invalid email")
    .optional()
    .or(z.literal("")),
  registrarPassword: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .optional()
    .or(z.literal("")),
});

// Degree issue schema
export const credentialSchema = z.object({
  studentName: z.string().min(2, "Student name required").max(120),
  enrollmentNo: z.string().min(4, "Enrollment number required").max(50),
  degree: z.string().min(2, "Degree required").max(120),
  branch: z.string().min(2, "Branch required").max(120),
  yearOfPassing: z.coerce
    .number()
    .int()
    .min(1980, "Year must be 1980 or later")
    .max(new Date().getFullYear() + 5, "Year too far in future"),
  cgpa: z.coerce.number().min(0).max(10).optional(),
});

// Student account creation schema
export const studentSchema = z.object({
  name: z.string().min(2, "Name required").max(120),
  email: z.string().email("Invalid email"),
  enrollmentNo: z.string().min(4, "Enrollment number required").max(50),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

// Password change schema
export const passwordChangeSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password required"),
    newPassword: z.string().min(6, "New password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Please confirm new password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });