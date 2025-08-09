const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  type: { type: String, required: true, enum: ["report", "cleanup"] },
  latitude: { type: Number },
  longitude: { type: Number },
  mediaUrls: [{ type: String }],
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  severity: { type: String, default: "Not specified" },
  status: { type: String, default: "Reported" },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Report", reportSchema);
