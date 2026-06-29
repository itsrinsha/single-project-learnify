import mongoose from "mongoose";

const examAttemptSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    exam: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Exam",
      required: true,
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    attemptNumber: {
      type: Number,
      required: true,
    },
    score: {
      type: Number,
      default: 0,
    },
    obtainedMarks: {
      type: Number,
      default: 0,
    },
    result: {
      type: String,
      enum: ["pass", "fail", "pending"],
      default: "pending",
    },
    status: {
      type: String,
      enum: ["draft", "submitted", "approved", "rejected", "evaluated"],
      default: "submitted",
    },
    answers: [
      {
        questionId: String,
        questionIndex: Number,
        answer: mongoose.Schema.Types.Mixed,
        selectedOption: Number,
        isCorrect: Boolean,
        marksAwarded: {
          type: Number,
          default: 0,
        },
      },
    ],
    uploadedFiles: [String],
    submissionUrl: String,
    studentNotes: String,
    feedback: String,
    submittedAt: {
      type: Date,
      default: Date.now,
    },
    attemptedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export default mongoose.model("ExamAttempt", examAttemptSchema);
