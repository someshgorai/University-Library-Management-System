"use server";

import { hash } from "bcryptjs";
import { users } from "@/database/schema";
import { eq } from "drizzle-orm";
import { db } from "@/database/drizzle";
import { signIn } from "@/auth";
import { headers } from "next/headers";
import ratelimit from "@/lib/ratelimit";
import { redirect } from "next/navigation";
import config from "@/lib/config";
import { workflowClient } from "@/lib/workflow";

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
  } catch (error) {
    console.error("Error while signing-in user:", error);
    return { success: false, error: "Error while signing-in user" };
  }
};

export const signUp = async (params: AuthCredentials) => {
  const { fullName, universityId } = params;

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

  const reason = "sign-up";

  // Add OTP-based Authentication via officialEmailId
  try {
    // Generate OTP + send email via workflow
    await workflowClient.trigger({
      url: `${config.env.prodApiEndpoint}/api/workflows/send-otp`,
      body: { email: officialEmailId, fullName, reason },
    });

    return {
      success: true,
      otpSent: true,
      email: officialEmailId,
    };
  } catch (error) {
    console.error("Error sending OTP:", error);
    return { success: false, error: "Failed to send OTP" };
  }
};
// ✅ Complete sign-up after OTP is verified
export const completeSignUp = async (params: AuthCredentials) => {
  const { fullName, universityId, password, universityCard } = params;
  const officialEmailId = `${universityId.toLowerCase()}@nitjsr.ac.in`;

  try {
    const hashedPassword = await hash(
      password,
      Number(process.env.PASSWORD_SALT_ROUNDS!),
    );

    await db.insert(users).values({
      fullName,
      email: officialEmailId,
      universityId,
      password: hashedPassword,
      universityCard,
    });

    await workflowClient.trigger({
      url: `${config.env.prodApiEndpoint}/api/workflows/onboarding`,
      body: { email: officialEmailId, fullName },
    });

    await signInWithCredentials({ universityId, password });

    return { success: true };
  } catch (error) {
    console.error("Error completing sign-up:", error);
    return { success: false, error: "Sign-up failed" };
  }
};
