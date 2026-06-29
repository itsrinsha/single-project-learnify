import mongoose from "mongoose";

const liveSessionSchema = new mongoose.Schema(
  {
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
    },

    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    title: String,

    startTime: Date,

    isLive: {
      type: Boolean,
      default: false,
    },

    isCompleted: {
      type: Boolean,
      default: false,
    },

    meetingLink: String, // Zoom / WebRTC link
  },
  { timestamps: true }
);

export const LiveSession= mongoose.model("LiveSession", liveSessionSchema);