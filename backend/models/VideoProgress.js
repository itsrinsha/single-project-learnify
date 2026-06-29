import mongoose from "mongoose";

const videoProgressSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    lessonId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lesson",
      required: true,
    },
    watchedSeconds: {
      type: Number,
      default: 0,
    },
    duration: {
      type: Number,
      default: 0,
    },
    watchPercentage: {
      type: Number,
      default: 0,
    },
    completed: {
      type: Boolean,
      default: false,
    },
    lastPlaybackPosition: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// Unique index to ensure one progress document per student per lesson
videoProgressSchema.index({ studentId: 1, lessonId: 1 }, { unique: true });

export default mongoose.model("VideoProgress", videoProgressSchema);
