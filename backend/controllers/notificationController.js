import Notification from '../models/Notification.js';
import { getIo, getReceiverSocketId } from '../sockets/chatSocket.js';

/**
 * Create a notification and push it via socket in real-time
 */
export const createNotification = async ({ recipient, type, title, message, link = '' }) => {
  try {
    const notification = await Notification.create({ recipient, type, title, message, link });

    // Push via socket if user is online
    try {
      const io = getIo();
      const socketId = getReceiverSocketId(recipient.toString());
      if (socketId) {
        io.to(socketId).emit('new_notification', {
          _id: notification._id,
          type: notification.type,
          title: notification.title,
          message: notification.message,
          link: notification.link,
          isRead: false,
          createdAt: notification.createdAt,
        });
      }
    } catch (_) {
      // Socket not ready — notification still saved in DB
    }

    return notification;
  } catch (err) {
    console.error('[Notification] Failed to create notification:', err);
  }
};

/**
 * GET /api/notifications — Get all notifications for logged-in user
 */
export const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ recipient: req.user._id })
      .sort({ createdAt: -1 })
      .limit(50);

    const unreadCount = notifications.filter((n) => !n.isRead).length;

    res.json({ success: true, notifications, unreadCount });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch notifications' });
  }
};

/**
 * PATCH /api/notifications/:id/read — Mark one as read
 */
export const markAsRead = async (req, res) => {
  try {
    await Notification.findOneAndUpdate(
      { _id: req.params.id, recipient: req.user._id },
      { isRead: true }
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to mark notification as read' });
  }
};

/**
 * PATCH /api/notifications/read-all — Mark all as read
 */
export const markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany({ recipient: req.user._id, isRead: false }, { isRead: true });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to mark all as read' });
  }
};

/**
 * DELETE /api/notifications/:id — Delete one notification
 */
export const deleteNotification = async (req, res) => {
  try {
    await Notification.findOneAndDelete({ _id: req.params.id, recipient: req.user._id });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to delete notification' });
  }
};
