import { failure, isObjectId, success } from "@/lib/api";
import { requireAuth } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Notification from "@/lib/models/Notification";
export async function PATCH(_: Request, { params }: { params: Promise<{ id: string }> }) { const user = await requireAuth(); const { id } = await params; if (!user) return failure("Not authenticated", 401); if (!isObjectId(id)) return failure("Invalid notification id"); await connectDB(); const notification = await Notification.findOneAndUpdate({ _id: id, recipient: user._id }, { read: true }, { new: true }); return notification ? success(notification, "Notification marked read") : failure("Notification not found", 404); }
