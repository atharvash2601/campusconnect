import { failure, success } from "@/lib/api";
import { requireAuth } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Bookmark from "@/lib/models/Bookmark";
export async function GET() { const user = await requireAuth(); if (!user) return failure("Not authenticated", 401); await connectDB(); return success(await Bookmark.find({ user: user._id }).populate({ path: "request", populate: { path: "author", select: "name department year" } }).sort({ createdAt: -1 }).lean()); }
