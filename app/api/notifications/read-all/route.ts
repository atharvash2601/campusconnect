import { failure, success } from "@/lib/api";
import { requireAuth } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Notification from "@/lib/models/Notification";
export async function PATCH() { const user = await requireAuth(); if (!user) return failure("Not authenticated", 401); await connectDB(); await Notification.updateMany({ recipient: user._id, read: false }, { read: true }); return success(null, "Notifications marked read"); }
