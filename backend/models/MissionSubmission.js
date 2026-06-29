import mongoose from "mongoose";

const missionSubmissionSchema = new mongoose.Schema(
  {
    mission: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Mission",
      required: true,
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    submissionUrl: {
      type: String,
      required: true,
    },
    studentNotes: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["pending", "completed", "rejected"],
      default: "pending",
    },
    feedback: {
      type: String,
      default: "",
    },
    obtainedMarks: {
      type: Number,
    },
    submittedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const MissionSubmission = mongoose.model("MissionSubmission", missionSubmissionSchema);
export default MissionSubmission;
