import { failure, isObjectId, success } from "@/lib/api";
import { requireAuth } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Answer from "@/lib/models/Answer";
import Notification from "@/lib/models/Notification";
import RequestModel from "@/lib/models/Request";
import User from "@/lib/models/User";
export async function POST(request: Request) {
  try {
    const user = await requireAuth();
    if (!user) return failure("Not authenticated", 401);
    const { requestId, content, attachment } = await request.json();
    if (!isObjectId(requestId)) return failure("Please provide a valid request", 400);
    await connectDB();
    const helpRequest = await RequestModel.findById(requestId);
    if (!helpRequest) return failure("Request not found", 404);
    if (String(helpRequest.author) === String(user._id)) return failure("You cannot answer your own request", 403);
    if (helpRequest.deadline && helpRequest.deadline.getTime() <= Date.now()) return failure("This request has expired and is no longer accepting responses.", 409);
    if (helpRequest.status !== "open") return failure("This request is no longer accepting responses.", 409);

    const cleanContent = typeof content === "string" ? content.trim() : "";
    if (cleanContent.length > 5000 || (cleanContent.length < 2 && !attachment)) return failure("Please provide an answer or attachment");
    let safeAttachment: { type: "image" | "video"; url: string; publicId: string; originalName: string; width?: number; height?: number } | undefined;
    if (attachment !== undefined) {
      if (!attachment || !["image", "video"].includes(attachment.type) || typeof attachment.url !== "string" || typeof attachment.publicId !== "string" || !attachment.publicId.startsWith("campus-connect/answers/") || typeof attachment.originalName !== "string") return failure("Invalid attachment metadata");
      let url: URL;
      try { url = new URL(attachment.url); } catch { return failure("Invalid attachment metadata"); }
      if (url.protocol !== "https:" || url.hostname !== "res.cloudinary.com" || !url.pathname.includes(`/${attachment.type}/upload/`) || !decodeURIComponent(url.pathname).includes(attachment.publicId)) return failure("Invalid attachment metadata");
      safeAttachment = { type: attachment.type, url: url.toString(), publicId: attachment.publicId, originalName: attachment.originalName.slice(0, 255), ...(Number.isFinite(attachment.width) && attachment.width > 0 ? { width: attachment.width } : {}), ...(Number.isFinite(attachment.height) && attachment.height > 0 ? { height: attachment.height } : {}) };
    }

    const answer = await Answer.create({ request: requestId, author: user._id, content: cleanContent, ...(safeAttachment ? { attachment: safeAttachment } : {}) });
    await RequestModel.findByIdAndUpdate(requestId, { $inc: { answerCount: 1 } });
    await User.findByIdAndUpdate(user._id, { $inc: { answersGiven: 1, points: 10 } });
    await Notification.create({ recipient: helpRequest.author, type: "answer", title: "New answer", message: `${user.name} answered your request.`, request: helpRequest._id, answer: answer._id });
    return success(await answer.populate("author", "name department year points"), "Answer posted", 201);
  } catch { return failure("Unable to post answer", 500); }
}
