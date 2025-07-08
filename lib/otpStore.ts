import redis from "@/database/redis"; // ioredis or @upstash/redis

export const otpStore = {
  saveOTP: async (email: string, otp: string) => {
    const cooldownKey = `otp_cooldown:${email}`;
    const alreadySent = await redis.exists(cooldownKey);

    if (alreadySent) {
      return {
        success: false,
        message:
          "OTP already sent. Please wait 30 seconds before trying again.",
      };
    }

    // Save OTP with 5 min expiry
    await redis.setex(`otp:${email}`, 300, otp);
    // Set a 30-second cooldown
    await redis.setex(cooldownKey, 30, "1");

    // Optional logging
    console.log(
      `[OTP_SAVE] email=${email}, otp=${otp}, time=${new Date().toISOString()}`,
    );

    return {
      success: true,
      message: "OTP sent successfully. Expires in 5 minutes.",
    };
  },

  verifyOTP: async (email: string, otp: string) => {
    const otpKey = `otp:${email}`;
    const attemptsKey = `otp_attempts:${email}`;
    const blockKey = `otp_blocked:${email}`;

    // Blocked check
    const isBlocked = await redis.exists(blockKey);
    if (isBlocked) {
      return {
        success: false,
        message: "Too many failed attempts. Please try again after 1 hour.",
      };
    }

    const stored = await redis.get(otpKey);
    const isValid = stored === otp;

    console.log(
      `[OTP_VERIFY] email=${email}, entered=${otp}, stored=${stored}, valid=${isValid}`,
    );

    if (isValid) {
      await redis.del(otpKey);
      await redis.del(attemptsKey);
      return { success: true, message: "OTP verified successfully." };
    }

    // Track attempts
    const attempts = parseInt((await redis.get(attemptsKey)) || "0") + 1;
    await redis.set(attemptsKey, attempts, { ex: 3600 }); // 1 hour

    if (attempts >= 5) {
      await redis.set(blockKey, "1", { ex: 3600 }); // Block for 1 hour
      return {
        success: false,
        message: "Too many failed attempts. Verification blocked for 1 hour.",
      };
    }

    return {
      success: false,
      message: `Invalid OTP. You have ${5 - attempts} attempts left.`,
    };
  },
};
