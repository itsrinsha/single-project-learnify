import axiosInstance from '../features/axiosInstance';

export const createCourseDraft = async (courseData) => {
  try {
    const response = await axiosInstance.post('/instructor/courses/create', courseData);
    return response.data;
  } catch (error) {
    console.error('Error creating course draft:', error);
    throw error;
  }
};

export const addModule = async (courseId, moduleData) => {
  try {
    const response = await axiosInstance.post(`/instructor/courses/${courseId}/modules`, moduleData);
    return response.data;
  } catch (error) {
    console.error('Error adding module:', error);
    throw error;
  }
};

export const addLesson = async (courseId, moduleId, lessonData) => {
  try {
    const response = await axiosInstance.post(`/instructor/courses/${courseId}/modules/${moduleId}/lessons`, lessonData);
    return response.data;
  } catch (error) {
    console.error('Error adding lesson:', error);
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

export const uploadThumbnail = async (file) => {
  const formData = new FormData();
  formData.append('thumbnail', file);
  const response = await axiosInstance.post('/uploads/thumbnail', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return response.data;
};

export const uploadVideo = async (file) => {
  const formData = new FormData();
  formData.append('video', file);
  const response = await axiosInstance.post('/uploads/video', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return response.data;
};

export const getCourseDetails = async (courseId) => {
  try {
    const response = await axiosInstance.get(`/instructor/courses/${courseId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching course details:', error);
    throw error;
  }
};

export const updateCourse = async (courseId, updateData) => {
  try {
    const response = await axiosInstance.put(`/instructor/courses/${courseId}`, updateData);
    return response.data;
  } catch (error) {
    console.error('Error updating course:', error);
    throw error;
  }
};

export const updateLesson = async (courseId, lessonId, updateData) => {
  try {
    const response = await axiosInstance.put(`/instructor/courses/${courseId}/lessons/${lessonId}`, updateData);
    return response.data;
  } catch (error) {
    console.error('Error updating lesson:', error);
    throw error;
  }
};

export const deleteCourse = async (courseId) => {
  try {
    const response = await axiosInstance.delete(`/instructor/courses/${courseId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting course:', error);
    throw error;
  }
};

export const getInstructorDashboardStats = async () => {
  try {
    const response = await axiosInstance.get('/instructor/dashboard');
    return response.data;
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    throw error;
  }
};

export default {
  createCourseDraft,
  addModule,
  addLesson,
  publishCourse,
  uploadThumbnail,
  uploadVideo,
  getCourseDetails,
  updateCourse,
  updateLesson,
  deleteCourse,
  getInstructorDashboardStats
};
