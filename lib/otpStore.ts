import redis from "@/database/redis"; // ioredis or @upstash/redis

export const otpStore = {
  saveOTP: async (email: string, otp: string) => {
    await redis.setex(`otp:${email}`, 300, otp); // 5 min
  },
  verifyOTP: async (email: string, otp: string) => {
    const stored = await redis.get(`otp:${email}`);
    const isValid = stored === otp;
    if (isValid) await redis.del(`otp:${email}`);
    return isValid;
  },
};
