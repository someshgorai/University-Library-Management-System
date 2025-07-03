import { sendEmail } from "@/lib/workflow";
// import { otpStore } from "@/lib/otp-store";
import { randomInt } from "crypto";
import { serve } from "@upstash/workflow/nextjs";

interface OtpPayload {
  email: string;
  name?: string;
  reason?: "sign-up" | "login" | "reset";
}

export const { POST } = serve<OtpPayload>(async (context) => {
  const {
    email,
    name = "User",
    reason = "verification",
  } = context.requestPayload;

  await context.run("generate-and-send-otp", async () => {
    const otp = 890456;

    const greeting =
      reason === "sign-up" ? "Welcome to Bookery!" : "OTP Verification";

    await sendEmail({
      email,
      subject: `${greeting}`,
      message: `
        <p>Hi ${name},</p>
        <p>Your OTP for <strong>${reason}</strong> is:</p>
        <h2>${otp}</h2>
        <p>This OTP is valid for 5 minutes.</p>
      `,
    });
  });

  // Optional retry/email flow can be added here (e.g. re-ping after 2 days)
});
