import { failure, isObjectId, success } from "@/lib/api";
import { connectDB } from "@/lib/mongodb";
import Answer from "@/lib/models/Answer";
export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) { const { id } = await params; if (!isObjectId(id)) return failure("Invalid request id"); await connectDB(); return success(await Answer.find({ request: id }).populate("author", "name department year points").sort({ createdAt: 1 }).lean()); }
