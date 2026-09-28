import { failure, success } from "@/lib/api";
import { requireAuth } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import RequestModel from "@/lib/models/Request";
import User from "@/lib/models/User";
const statuses = ["open", "resolved", "closed"];
function cleanTags(value: unknown) { return Array.isArray(value) ? [...new Set(value.filter((tag): tag is string => typeof tag === "string").map((tag) => tag.trim()).filter(Boolean).slice(0, 10))] : []; }
export async function GET(request: Request) {
  try { await connectDB(); const { searchParams } = new URL(request.url); const search = searchParams.get("search")?.trim(); const category = searchParams.get("category"); const status = searchParams.get("status");
    const query: Record<string, unknown> = {}; if (category) query.category = category; if (status && statuses.includes(status)) query.status = status;
    if (search) { const escaped = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); const regex = new RegExp(escaped, "i"); query.$or = [{ title: regex }, { description: regex }, { category: regex }, { tags: regex }]; }
    const requests = await RequestModel.find(query).populate("author", "name department year points").sort({ createdAt: -1 }).lean(); return success(requests);
  } catch { return failure("Unable to load requests", 500); }
}
export async function POST(request: Request) {
  try { const user = await requireAuth(); if (!user) return failure("Not authenticated", 401); const body = await request.json(); const { title, description, category, deadline } = body;
    if (typeof title !== "string" || title.trim().length < 3 || title.trim().length > 140 || typeof description !== "string" || description.trim().length < 10 || description.trim().length > 5000 || typeof category !== "string" || !category.trim() || category.trim().length > 60) return failure("Please provide a valid title, description, and category");
    const parsedDeadline = deadline ? new Date(deadline) : undefined; if (parsedDeadline && Number.isNaN(parsedDeadline.getTime())) return failure("Invalid deadline");
    await connectDB(); const created = await RequestModel.create({ title: title.trim(), description: description.trim(), category: category.trim(), deadline: parsedDeadline, tags: cleanTags(body.tags), author: user._id }); await User.findByIdAndUpdate(user._id, { $inc: { questionsAsked: 1 } }); return success(await created.populate("author", "name department year points"), "Request created", 201);
  } catch { return failure("Unable to create request", 500); }
}
