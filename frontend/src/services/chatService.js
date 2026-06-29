import axiosInstance from '../features/axiosInstance';

const chatService = {
  getConversations: async () => {
    const response = await axiosInstance.get('/chat/conversations');
    return response.data;
  },

  getMessages: async (userId) => {
    const response = await axiosInstance.get(`/chat/${userId}`);
    return response.data;
  },

  sendMessage: async (receiver, message) => {
    const response = await axiosInstance.post('/chat', { receiver, message });
    return response.data;
  },

  markAsRead: async (userId) => {
    const response = await axiosInstance.put(`/chat/read/${userId}`, {});
    return response.data;
  }
};

export default chatService;
