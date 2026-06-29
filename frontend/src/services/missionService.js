import axiosInstance from '../features/axiosInstance';

export const getCourseMissions = async (courseId) => {
  const response = await axiosInstance.get(`/missions/course/${courseId}`);
  return response.data;
};

export const createMission = async (missionData) => {
  const response = await axiosInstance.post('/missions', missionData);
  return response.data;
};

export const submitMission = async (missionId, { submissionUrl, studentNotes }) => {
  const response = await axiosInstance.post(`/missions/${missionId}/submit`, {
    submissionUrl,
    studentNotes,
  });
  return response.data;
};

export const getMissionSubmissions = async (missionId) => {
  const response = await axiosInstance.get(`/missions/${missionId}/submissions`);
  return response.data;
};

export const evaluateSubmission = async (subId, { status, feedback }) => {
  const response = await axiosInstance.put(`/missions/submissions/${subId}/evaluate`, {
    status,
    feedback,
  });
  return response.data;
};

export default {
  getCourseMissions,
  createMission,
  submitMission,
  getMissionSubmissions,
  evaluateSubmission,
};
