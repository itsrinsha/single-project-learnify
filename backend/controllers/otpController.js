import { requestOtpService, resendOtpService, verifyOtpService } from "../services/authServices.js";
import { asyncHandler } from "../middleware/trycatchmiddleware.js";

// ✅ Request OTP
export const otpController = asyncHandler(async (req, res) => {
    const { email } = req.body;
    const response = await requestOtpService(email);
    res.status(200).json(response);
});

// ✅ Verify OTP
export const otpverifyController = asyncHandler(async (req, res) => {
    const { otp, email } = req.body;
    
    if (!otp || !email) {
        const error = new Error("OTP and email are required");
        error.statusCode = 400;
        throw error;
    }

    const verifyResponse = await verifyOtpService({ otp: String(otp), email });
    res.status(200).json(verifyResponse);
});

// ✅ Resend OTP
export const resendOtpController = asyncHandler(async (req, res) => {
    const { email } = req.body;
    const response = await resendOtpService(email);
    res.status(200).json(response);
});
