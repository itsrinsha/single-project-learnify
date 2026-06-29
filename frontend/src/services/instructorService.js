import axiosInstance from '../features/axiosInstance';

export const getInstructorDashboard = async () => {
  try {
    const response = await axiosInstance.get('/instructor/dashboard');
    return response.data;
  } catch (error) {
    console.error('Error fetching instructor dashboard:', error);
    throw error;
  }
};

export const getInstructorCourses = async () => {
  try {
    const response = await axiosInstance.get('/instructor/courses');
    const data = response.data;
    return data?.courses || data?.data || data;
  } catch (error) {
    console.error('Error fetching instructor courses:', error);
    throw error;
  }
};

export const publishCourse = async (courseId) => {
  try {
    const response = await axiosInstance.put(`/instructor/courses/${courseId}/publish`);
    return response.data;
  } catch (error) {
    console.error('Error publishing course:', error);
    throw error;
  }
};

export const getInstructorStudents = async () => {
  try {
    const response = await axiosInstance.get('/instructor/students');
    return response.data;
  } catch (error) {
    console.error('Error fetching instructor students:', error);
    throw error;
  }
};

export const getReviewHistory = async () => {
  try {
    const response = await axiosInstance.get('/instructor/review-history');
    return response.data;
  } catch (error) {
    console.error('Error fetching review history:', error);
    throw error;
  }
};

export const completeStudentCourse = async (courseId, studentId) => {
  try {
    const response = await axiosInstance.post(`/instructor/course/${courseId}/student/${studentId}/complete`);
    return response.data;
  } catch (error) {
    console.error('Error completing student course:', error);
    throw error;
  }
};

export default {
  getInstructorDashboard,
  getInstructorCourses,
  publishCourse,
  getInstructorStudents,
  getReviewHistory,
  completeStudentCourse,
};
