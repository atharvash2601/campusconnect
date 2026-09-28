import mongoose, { Schema, models } from "mongoose";
const AnswerSchema = new Schema({
  request: { type: Schema.Types.ObjectId, ref: "Request", required: true },
  author: { type: Schema.Types.ObjectId, ref: "User", required: true },
  content: { type: String, required: true, trim: true, minlength: 2, maxlength: 5000 },
  helpful: { type: Boolean, default: false },
  accepted: { type: Boolean, default: false },
}, { timestamps: true });
AnswerSchema.index({ request: 1 }); AnswerSchema.index({ author: 1 }); AnswerSchema.index({ createdAt: -1 });
export default models.Answer || mongoose.model("Answer", AnswerSchema);
