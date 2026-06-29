import { asyncHandler } from "../middleware/trycatchmiddleware.js";
import { getConversationsService, getMessagesService, markAsReadService, sendMessageService } from "../services/chatServices.js";
import { createNotification } from "./notificationController.js";
import User from "../models/User.js";

// ✅ Get conversations
export const getConversations = asyncHandler(async (req, res) => {
  const contacts = await getConversationsService(req.user.id);
  res.json(contacts);
});

// ✅ Send message
export const sendMessage = asyncHandler(async (req, res) => {
  const { receiver, message } = req.body;

  const newMessage = await sendMessageService({
    sender: req.user.id,
    receiver,
    message,
  });

  // 🔔 Notify receiver about the new message
  const sender = await User.findById(req.user.id).select('name');
  createNotification({
    recipient: receiver,
    type: 'new_message',
    title: '💬 New Message',
    message: `${sender?.name || 'Someone'} sent you a message: "${message.length > 60 ? message.slice(0, 60) + '…' : message}"`,
    link: '/student/messages',
  });

  res.status(201).json(newMessage);
});


// ✅ Get conversation
export const getMessages = asyncHandler(async (req, res) => {
  const messages = await getMessagesService({
    userId: req.params.userId,
    currentUserId: req.user.id,
  });

  res.json(messages);
});

// ✅ Mark messages as read
export const markAsRead = asyncHandler(async (req, res) => {
  await markAsReadService({
    currentUserId: req.user.id,
    userId: req.params.userId,
  });

  res.json({ message: "Messages marked as read" });
});



