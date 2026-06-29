import axiosInstance from '../features/axiosInstance';

export const getMyCertificates = async () => {
  try {
    const response = await axiosInstance.get('/student/certificates');
    return response.data;
  } catch (error) {
    console.error('Error fetching certificates:', error);
    throw error;
  }
};

export const getCertificateById = async (id) => {
  try {
    const response = await axiosInstance.get(`/student/certificate/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching certificate details:', error);
    throw error;
  }
};

export const claimCertificate = async (examId) => {
  try {
    const response = await axiosInstance.post('/certificates/claim', { examId });
    return response.data;
  } catch (error) {
    console.error('Error claiming certificate:', error);
    throw error;
  }
};

export const getCertificateDownloadUrl = (certId) => {
  // Uses VITE_API_URL or default local port 5000 base
  const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
  const token = localStorage.getItem("token");
  return `${baseUrl}/api/student/certificate/download/${certId}${token ? `?token=${token}` : ""}`;
};

export const getPendingCertificates = async () => {
  const response = await axiosInstance.get('/instructor/certificates/pending');
  return response.data;
};

export const approveCertificate = async (certId) => {
  const response = await axiosInstance.patch(`/instructor/certificates/${certId}/approve`);
  return response.data;
};

export const rejectCertificate = async (certId, rejectionReason) => {
  const response = await axiosInstance.patch(`/instructor/certificates/${certId}/reject`, { rejectionReason });
  return response.data;
};

export const verifyCertificate = async (certificateCode) => {
  const response = await axiosInstance.get(`/certificates/verify/${certificateCode}`);
  return response.data;
};

export default {
  getMyCertificates,
  getCertificateById,
  claimCertificate,
  getCertificateDownloadUrl,
  getPendingCertificates,
  approveCertificate,
  rejectCertificate,
  verifyCertificate,
};
