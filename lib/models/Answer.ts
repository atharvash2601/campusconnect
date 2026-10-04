import mongoose, { Schema, models } from "mongoose";
const AnswerSchema = new Schema({
  request: { type: Schema.Types.ObjectId, ref: "Request", required: true },
  author: { type: Schema.Types.ObjectId, ref: "User", required: true },
  content: { type: String, trim: true, maxlength: 5000, default: "" },
  attachment: {
    type: { type: String, enum: ["image", "video"] },
    url: { type: String, maxlength: 2048 },
    publicId: { type: String, maxlength: 255 },
    originalName: { type: String, maxlength: 255 },
    width: { type: Number, min: 1 },
    height: { type: Number, min: 1 },
  },
  helpful: { type: Boolean, default: false },
  accepted: { type: Boolean, default: false },
}, { timestamps: true });
AnswerSchema.index({ request: 1 }); AnswerSchema.index({ author: 1 }); AnswerSchema.index({ createdAt: -1 });
export default models.Answer || mongoose.model("Answer", AnswerSchema);
