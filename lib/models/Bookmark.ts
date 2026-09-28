import mongoose, { Schema, models } from "mongoose";
const BookmarkSchema = new Schema({ user: { type: Schema.Types.ObjectId, ref: "User", required: true }, request: { type: Schema.Types.ObjectId, ref: "Request", required: true } }, { timestamps: true });
BookmarkSchema.index({ user: 1, request: 1 }, { unique: true });
export default models.Bookmark || mongoose.model("Bookmark", BookmarkSchema);
