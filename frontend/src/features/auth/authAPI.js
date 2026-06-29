import axiosInstance from "../axiosInstance";

// Register user
export const registerAPI = async (userData) => {
  const response = await axiosInstance.post("/auth/register", userData);
  return response.data;
};

// Login user
export const loginAPI = async (userData) => {
  const response = await axiosInstance.post("/auth/login", userData);
  return response.data;
};

// Verify OTP
export const verifyOtpAPI = async (data) => {
  const response = await axiosInstance.post("/auth/verify-otp", data);
  return response.data;
};

// Resend OTP
export const resendOtpAPI = async (email) => {
  const response = await axiosInstance.post("/auth/otp-sender", { email });
  return response.data;
};

// Get current profile
export const getProfileAPI = async () => {
  const response = await axiosInstance.get("/users/profile");
  return response.data;
};

// Update profile
export const updateProfileAPI = async (profileData) => {
  const response = await axiosInstance.put("/users/profile", profileData);
  return response.data;
};
