import Message from "../models/message.js";
import { getReceiverSocketId, getIo } from "../sockets/chatSocket.js";

// send message
export const sendMessageService = async ({ sender, receiver, message }) => {
  const newMessage = await Message.create({
    sender,
    receiver,
    message,
  });

  // Emit real-time socket event to the receiver
  try {
    const receiverSocketId = getReceiverSocketId(receiver);
    if (receiverSocketId) {
      const io = getIo();
      io.to(receiverSocketId).emit("new-message", newMessage);
    }
  } catch (err) {
    console.error("[Socket] Failed to emit new-message:", err);
  }

  return newMessage;
};

// get conversation
export const getMessagesService = async ({ userId, currentUserId }) => {
  // Mark messages from other user to current user as read
  await Message.updateMany(
    {
      receiver: currentUserId,
      sender: userId,
      read: false,
    },
    {
      read: true,
    }
  );

  // Emit real-time read receipt to the sender and receiver
  try {
    const senderSocketId = getReceiverSocketId(userId);
    const receiverSocketId = getReceiverSocketId(currentUserId);
    const io = getIo();
    if (senderSocketId) {
      io.to(senderSocketId).emit("messages-read", {
        senderId: userId,
        receiverId: currentUserId,
      });
    }
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("messages-read", {
        senderId: userId,
        receiverId: currentUserId,
      });
    }
  } catch (err) {
    console.error("[Socket] Failed to emit read receipt:", err);
  }

  const chatMessages = await Message.find({
    $or: [
      { sender: currentUserId, receiver: userId },
      { sender: userId, receiver: currentUserId },
    ],
  }).sort({ createdAt: 1 });

  return chatMessages;
};

// mark as read
export const markAsReadService = async ({ currentUserId, userId }) => {
  await Message.updateMany(
    {
      receiver: currentUserId,
      sender: userId,
      read: false,
    },
    {
      read: true,
    }
  );

  // Emit real-time read receipt to the sender and receiver
  try {
    const senderSocketId = getReceiverSocketId(userId);
    const receiverSocketId = getReceiverSocketId(currentUserId);
    const io = getIo();
    if (senderSocketId) {
      io.to(senderSocketId).emit("messages-read", {
        senderId: userId,
        receiverId: currentUserId,
      });
    }
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("messages-read", {
        senderId: userId,
        receiverId: currentUserId,
      });
    }
  } catch (err) {
    console.error("[Socket] Failed to emit read receipt:", err);
  }

  return true;
};

// get conversations list (contacts)
export const getConversationsService = async (userId) => {
  const userMessages = await Message.find({
    $or: [{ sender: userId }, { receiver: userId }],
  }).populate("sender receiver", "name email profileImage");

  const contacts = new Map();

 userMessages.forEach((msg) => {
  // Check if sender or receiver was deleted from the database
  if (!msg.sender || !msg.receiver) return;

  const otherUser =
    msg.sender._id.toString() === userId.toString()
      ? msg.receiver
      : msg.sender;

  const isUnread =
    msg.receiver._id.toString() === userId.toString() &&
    !msg.read;

  if (!contacts.has(otherUser._id.toString())) {

    contacts.set(otherUser._id.toString(), {

      _id: otherUser._id,
      name: otherUser.name,
      email: otherUser.email,
      profileImage: otherUser.profileImage,
      lastMessage: msg.message,
      lastMessageTime: msg.createdAt,

      // FIXED
      unreadCount: isUnread ? 1 : 0,

    });

  } else {

    const existing =
      contacts.get(otherUser._id.toString());

    // FIXED
    if (isUnread) {
      existing.unreadCount += 1;
    }

    // Update latest message
    if (
      new Date(msg.createdAt) >
      new Date(existing.lastMessageTime)
    ) {

      existing.lastMessage = msg.message;
      existing.lastMessageTime = msg.createdAt;

    }

  }

});

  const sortedContacts = Array.from(contacts.values()).sort(
    (a, b) => new Date(b.lastMessageTime) - new Date(a.lastMessageTime)
  );

  return sortedContacts;
};