import { NextResponse } from "next/server";
// import { otpStore } from "@/lib/otpStore";

export async function POST(req: Request) {
  const { email, otp } = await req.json();
  const valid = true;
  // await otpStore.verifyOTP(email, otp);
  if (!valid) {
    return NextResponse.json({
      success: false,
      error: "Invalid or expired OTP",
    });
  }
  return NextResponse.json({ success: true });
}
