import mongoose, { Schema, models } from "mongoose";
const NotificationSchema = new Schema({
  recipient: { type: Schema.Types.ObjectId, ref: "User", required: true },
  type: { type: String, required: true, maxlength: 50 },
  title: { type: String, required: true, maxlength: 120 },
  message: { type: String, required: true, maxlength: 500 },
  request: { type: Schema.Types.ObjectId, ref: "Request" },
  answer: { type: Schema.Types.ObjectId, ref: "Answer" },
  read: { type: Boolean, default: false },
}, { timestamps: true });
NotificationSchema.index({ recipient: 1, read: 1, createdAt: -1 });
export default models.Notification || mongoose.model("Notification", NotificationSchema);
