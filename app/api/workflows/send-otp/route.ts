import { sendEmail } from "@/lib/workflow";
import { otpStore } from "@/lib/otpStore";
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
    try {
      const otp = randomInt(100000, 999999).toString();

      await otpStore.saveOTP(email, otp);

      const greeting =
        reason === "sign-up" ? "Welcome to Bookery!" : "OTP Verification";

      await sendEmail({
        email,
        subject: greeting,
        message: `
          <p>Hi ${name},</p>
          <p>Your OTP for <strong>${reason}</strong> is:</p>
          <h2>${otp}</h2>
          <p>This OTP is valid for 5 minutes.</p>
        `,
      });
    } catch (error) {
      // Required: throw to trigger retry in workflow
      throw new Error(`Failed to send OTP to ${email}: ${error}`);
    }
  });
});
