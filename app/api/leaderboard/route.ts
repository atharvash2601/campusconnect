import { failure, success } from "@/lib/api";
import { connectDB } from "@/lib/mongodb";
import User from "@/lib/models/User";
export async function GET() { try { await connectDB(); const users = await User.find().select("name department year points answersGiven acceptedAnswers").sort({ points: -1, acceptedAnswers: -1, name: 1 }).limit(100).lean(); return success(users.map((user, index) => ({ rank: index + 1, user: { id: String(user._id), name: user.name }, department: user.department, year: user.year, points: user.points, solved: user.acceptedAnswers, helped: user.answersGiven }))); } catch { return failure("Unable to load leaderboard", 500); } }
