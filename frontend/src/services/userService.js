import axiosInstance from '../features/axiosInstance';

// Get current user profile

export const getDashboardAPI = async () => {
  try {

    const response = await axiosInstance.get("/users/dashboard");

    return response.data;

  } catch (error) {

    console.error("Error fetching dashboard:", error);

    throw error;
  }
};

export const getUserProfile = async () => {
  try {
    const response = await axiosInstance.get('/users/profile');
    return response.data;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
};

// Update user profile
export const updateUserProfile = async (profileData) => {
  try {
    const response = await axiosInstance.put('/users/profile', profileData);
    return response.data;
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
};

// Get user stats (courses enrolled, completed, etc.)
export const getUserStats = async () => {
  try {
    const response = await axiosInstance.get('/users/stats');
    return response.data;
  } catch (error) {
    console.error('Error fetching user stats:', error);
    throw error;
  }
};

// Upload user avatar
export const uploadUserAvatar = async (file) => {
  try {
    const formData = new FormData();
    formData.append('profilePicture', file);
    const response = await axiosInstance.post('/uploads/profile-picture', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error uploading avatar:', error);
    throw error;
  }
};

// Get all users (for admin)
export const getAllUsers = async (filters = {}) => {
  try {
    const response = await axiosInstance.get('/users', { params: filters });
    return response.data;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

// Get user by ID
export const getUserById = async (userId) => {
  try {
    const response = await axiosInstance.get(`/users/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user:', error);
    throw error;
  }
};

// Get instructors for student
export const getMyInstructors = async () => {
  try {
    const response = await axiosInstance.get('/users/my-instructors');
    return response.data;
  } catch (error) {
    console.error('Error fetching instructors:', error);
    throw error;
  }
};

// Get enrolled courses for student
export const getEnrolledCourses = async () => {
  try {
    const response = await axiosInstance.get('/users/enrollments');
    return response.data;
  } catch (error) {
    console.error('Error fetching enrolled courses:', error);
    throw error;
  }
};

export default {
  getUserProfile,
  updateUserProfile,
  getUserStats,
  uploadUserAvatar,
  getAllUsers,
  getUserById,
  getMyInstructors,
  getEnrolledCourses,
};
