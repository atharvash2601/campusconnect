import { failure, isObjectId, success } from "@/lib/api";
import { requireAuth } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Bookmark from "@/lib/models/Bookmark";
import RequestModel from "@/lib/models/Request";
export async function POST(_: Request, { params }: { params: Promise<{ requestId: string }> }) { const user = await requireAuth(); const { requestId } = await params; if (!user) return failure("Not authenticated", 401); if (!isObjectId(requestId)) return failure("Invalid request id"); await connectDB(); if (!await RequestModel.exists({ _id: requestId })) return failure("Request not found", 404); const bookmark = await Bookmark.findOneAndUpdate({ user: user._id, request: requestId }, {}, { upsert: true, new: true, setDefaultsOnInsert: true }); return success(bookmark, "Request saved", 201); }
export async function DELETE(_: Request, { params }: { params: Promise<{ requestId: string }> }) { const user = await requireAuth(); const { requestId } = await params; if (!user) return failure("Not authenticated", 401); if (!isObjectId(requestId)) return failure("Invalid request id"); await connectDB(); await Bookmark.deleteOne({ user: user._id, request: requestId }); return success(null, "Bookmark removed"); }
