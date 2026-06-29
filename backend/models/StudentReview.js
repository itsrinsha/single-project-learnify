import mongoose from "mongoose";

const studentReviewSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    instructorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    reviewDate: {
      type: String,
    },
    reviewTime: {
      type: String,
    },
    scheduledDate: {
      type: String, // Can store as String or Date
    },
    meetingLink: {
      type: String,
    },
    roomId: {
      type: String,
    },
    status: {
      type: String,
      enum: ["Scheduled", "Pending", "Pass", "Failed", "Completed", "Cancelled"],
      default: "Pending",
    },
    attempt: {
      type: Number,
      default: 1,
    },
    mark: {
      type: Number,
      default: 0,
    },
    notes: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

// Explicitly map to studentreviews collection
export default mongoose.model("StudentReview", studentReviewSchema, "studentreviews");
