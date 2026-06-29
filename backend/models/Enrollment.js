import mongoose from "mongoose";

const enrollmentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
    },

    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    progress: {
      type: Number,
      default: 0,
    },

    completed: {
      type: Boolean,
      default: false,
    },
    completionStatus: {
      type: String,
      enum: ["in-progress", "completed"],
      default: "in-progress",
    },
    completedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

enrollmentSchema.index({user:1,course:1},{unique:true});

export default mongoose.model("Enrollment", enrollmentSchema);