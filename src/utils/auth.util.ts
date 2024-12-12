import { OTP_EXPIRY } from "../configs/env.config";
import redisClient from "../configs/redis.config";
import crypto from 'crypto';

const generateOTP = (): string => {
    return Array.from(crypto.getRandomValues(new Uint8Array(6)), (num) => (num % 10).toString()).join('');
};

export const generateAndStoreOtp = async (systemId: string): Promise<string> => {
    const otp = generateOTP();
    await redisClient.setEx(`otp:${systemId}`, OTP_EXPIRY, otp);
    console.log(`OTP for ${systemId}: ${otp}`);

    return otp;
};

