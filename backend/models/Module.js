import mongoose from "mongoose";

const moduleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: String,
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// Virtual for lessons to keep it lightweight
moduleSchema.virtual("lessons", {
  ref: "Lesson",
  localField: "_id",
  foreignField: "moduleId",
});

moduleSchema.set("toObject", { virtuals: true });
moduleSchema.set("toJSON", { virtuals: true });

export default mongoose.model("Module", moduleSchema);
