import axiosInstance from '../features/axiosInstance';

export const getCourseProgress = async (courseId) => {
  try {
    const response = await axiosInstance.get(`/progress/${courseId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching course progress:', error);
    throw error;
  }
};

export const markLessonCompleted = async (courseId, lessonId) => {
  try {
    const response = await axiosInstance.post('/progress/mark-completed', { courseId, lessonId });
    return response.data;
  } catch (error) {
    console.error('Error marking lesson as completed:', error);
    throw error;
  }
};

export const completeLesson = async (courseId, lessonId) => {
  try {
    const response = await axiosInstance.post('/progress/complete-lesson', { courseId, lessonId });
    return response.data;
  } catch (error) {
    console.error('Error completing lesson:', error);
    throw error;
  }
};

export const getVideoProgress = async (lessonId) => {
  try {
    const response = await axiosInstance.get(`/video/progress/${lessonId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching video progress:', error);
    throw error;
  }
};

export const saveVideoProgress = async (data) => {
  try {
    const response = await axiosInstance.post('/video/save-progress', data);
    return response.data;
  } catch (error) {
    console.error('Error saving video progress:', error);
    throw error;
  }
};

export default {
  getCourseProgress,
  markLessonCompleted,
  completeLesson,
  getVideoProgress,
  saveVideoProgress,
};
