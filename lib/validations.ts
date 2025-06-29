import { z } from "zod";

export const signUpSchema = z.object({
  fullName: z.string().min(3),
  email: z.string().email(),
  universityId: z
    .string()
    .regex(/^[A-Z0-9]+$/, "University ID must be uppercase alphanumeric"),
  universityCard: z.string().nonempty("University Card is required"),
  password: z.string().min(8),
});

export const signInSchema = z.object({
  universityId: z
    .string()
    .regex(/^[A-Z0-9]+$/, "University ID must be uppercase alphanumeric"),
  password: z.string().min(8),
});
