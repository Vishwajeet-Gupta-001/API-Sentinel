import mongoose from "mongoose";

const monitorSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    name: {
      type: String,
      required: true,
    },

    url: {
      type: String,
      required: true,
    },

    method: {
      type: String,
      enum: ["GET", "POST", "PUT", "DELETE"],
      required: true,
    },

    expectedStatus: {
      type: Number,
      required: true,
    },

    interval: {
      type: Number,
      required: true,
    },

    timeout: {
      type: Number,
      required: true,
    },

    failureThreshold: {
      type: Number,
      required: true,
    },

    enabled: {
      type: Boolean,
      default: true,
    },

    status: {
      type: String,
      enum: ["UP", "DOWN", "PAUSED"],
      default: "PAUSED",
    },

    consecutiveFailures: {
      type: Number,
      default: 0,
    },

    lastCheckedAt: {
      type: Date,
      default: null,
    },

    lastSuccessfulAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
});

const Monitor = mongoose.model("Monitor", monitorSchema);

export default Monitor;
