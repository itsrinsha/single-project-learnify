import mongoose from "mongoose";

const offerSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: "",
    },
    discountPercentage: {
      type: Number,
      required: true,
    },
    validUntil: {
      type: Date,
      required: true,
    },
    code: {
      type: String,
      unique: true,
    },
    status: {
      type: String,
      enum: ["active", "expired", "disabled"],
      default: "active",
    },
  },
  { timestamps: true }
);

const Offer = mongoose.model("Offer", offerSchema);

export default Offer;
