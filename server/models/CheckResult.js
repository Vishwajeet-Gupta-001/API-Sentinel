import mongoose from "mongoose";

const checkResultSchema = new mongoose.Schema({
  monitorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Monitor",
    required: true,
  },

  status: {
    type: String,
    enum: ["SUCCESS", "FAILURE"],
    required: true,
  },

  httpStatus: {
    type: Number,
    default: null,
  },

  responseTime: {
    type: Number,
    default: null,
  },

  error: {
    type: String,
    default: null,
  },

  timedOut: {
    type: Boolean,
    default: false,
  },

  checkedAt: {
    type: Date,
    required: true,
  },
});

const CheckResult = mongoose.model("CheckResult", checkResultSchema);

export default CheckResult;
