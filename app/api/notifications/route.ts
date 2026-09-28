import { failure, success } from "@/lib/api";
import { requireAuth } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Notification from "@/lib/models/Notification";
export async function GET() { const user = await requireAuth(); if (!user) return failure("Not authenticated", 401); await connectDB(); const notifications = await Notification.find({ recipient: user._id }).sort({ createdAt: -1 }).limit(50).lean(); return success({ notifications, unreadCount: notifications.filter((item) => !item.read).length }); }
