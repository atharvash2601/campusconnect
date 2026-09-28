import { failure, isObjectId, success } from "@/lib/api";
import { requireAuth } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Answer from "@/lib/models/Answer";
import Notification from "@/lib/models/Notification";
import RequestModel from "@/lib/models/Request";
import User from "@/lib/models/User";
export async function POST(request: Request) { try { const user = await requireAuth(); if (!user) return failure("Not authenticated", 401); const { requestId, content } = await request.json(); if (!isObjectId(requestId) || typeof content !== "string" || content.trim().length < 2 || content.trim().length > 5000) return failure("Please provide a valid request and answer"); await connectDB(); const helpRequest = await RequestModel.findById(requestId); if (!helpRequest) return failure("Request not found", 404); if (helpRequest.status === "closed") return failure("This request is closed"); const answer = await Answer.create({ request: requestId, author: user._id, content: content.trim() }); await RequestModel.findByIdAndUpdate(requestId, { $inc: { answerCount: 1 } }); await User.findByIdAndUpdate(user._id, { $inc: { answersGiven: 1, points: 10 } }); if (String(helpRequest.author) !== String(user._id)) await Notification.create({ recipient: helpRequest.author, type: "answer", title: "New answer", message: `${user.name} answered your request.`, request: helpRequest._id, answer: answer._id }); return success(await answer.populate("author", "name department year points"), "Answer posted", 201); } catch { return failure("Unable to post answer", 500); } }
