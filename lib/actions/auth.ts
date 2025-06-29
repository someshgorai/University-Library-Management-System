"use server";

import { hash } from "bcryptjs";
import { users } from "@/database/schema";
import { eq } from "drizzle-orm";
import { db } from "@/database/drizzle";
import { signIn } from "@/auth";
import { headers } from "next/headers";
import ratelimit from "@/lib/ratelimit";
import { redirect } from "next/navigation";

export const signInWithCredentials = async (
  params: Pick<AuthCredentials, "universityId" | "password">,
) => {
  const { universityId, password } = params;

  const ip = (await headers()).get("x-forwarded-for") || "127.0.0.1";
  const { success } = await ratelimit.limit(ip);

  if (!success) return redirect("/too-fast");

  try {
    const result = await signIn("credentials", {
      universityId,
      password,
      redirect: false,
    });

    if (result?.error) {
      return { success: false, error: result.error };
    }

    return { success: true };
    // Todo: Add OTP based Authentication System with Rate limit ( add in client side)
    // Todo: Check for invalid credentials
  } catch (error) {
    console.error("Error while signing-in user:", error);
    return { success: false, error: "Error while signing-in user" };
  }
};

export const signUp = async (params: AuthCredentials) => {
  const { fullName, email, universityId, password, universityCard } = params;

  const ip = (await headers()).get("x-forwarded-for") || "127.0.0.1";
  const { success } = await ratelimit.limit(ip);

  if (!success) return redirect("/too-fast");

  const existingUser = await db
    .select()
    .from(users)
    .where(eq(users.universityId, universityId))
    .limit(1);

  if (existingUser.length > 0) {
    return { success: false, error: "User already exists" };
  }

  // Todo: Create OTP based signUp using official emailId
  const lowerUniversityId = universityId.toLowerCase();
  const officialEmailId = `${lowerUniversityId}@nitjsr.ac.in`;

  // Add OTP-based Authentication via officialEmailId

  const hashedPassword = await hash(
    password,
    Number(process.env.PASSWORD_SALT_ROUNDS!),
  );

  try {
    await db.insert(users).values({
      fullName,
      email: officialEmailId,
      universityId,
      password: hashedPassword,
      universityCard,
    });

    await signInWithCredentials({ universityId, password });
    return { success: true };
  } catch (error) {
    console.error("Error while signing-up user:", error);
    return { success: false, error: "Error while signing-up user" };
  }
};
