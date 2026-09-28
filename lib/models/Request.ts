import mongoose, { Schema, models } from "mongoose";

const RequestSchema = new Schema({
  title: { type: String, required: true, trim: true, minlength: 3, maxlength: 140 },
  description: { type: String, required: true, trim: true, minlength: 10, maxlength: 5000 },
  category: { type: String, required: true, trim: true, maxlength: 60 },
  deadline: { type: Date },
  tags: { type: [String], default: [], maxlength: 10 },
  author: { type: Schema.Types.ObjectId, ref: "User", required: true },
  status: { type: String, enum: ["open", "resolved", "closed"], default: "open" },
  answerCount: { type: Number, default: 0, min: 0 },
  acceptedAnswer: { type: Schema.Types.ObjectId, ref: "Answer", default: null },
}, { timestamps: true });
RequestSchema.index({ author: 1 });
RequestSchema.index({ category: 1 });
RequestSchema.index({ status: 1 });
RequestSchema.index({ createdAt: -1 });
export default models.Request || mongoose.model("Request", RequestSchema);
