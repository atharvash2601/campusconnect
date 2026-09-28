import jwt, { type JwtPayload } from "jsonwebtoken";
import { cookies } from "next/headers";
import { connectDB } from "@/lib/mongodb";
import User from "@/lib/models/User";

type Token = JwtPayload & { userId: string; role: "student" | "admin" };

function secret() {
  const value = process.env.JWT_SECRET;
  if (!value) throw new Error("JWT_SECRET is not configured");
  return value;
}

export function createToken(user: { _id: { toString(): string }; role: "student" | "admin" }) {
  return jwt.sign({ userId: user._id.toString(), role: user.role }, secret(), { expiresIn: "7d" });
}

export async function getAuthenticatedUser() {
  const token = (await cookies()).get("auth_token")?.value;
  if (!token) return null;
  try {
    const decoded = jwt.verify(token, secret()) as Token;
    if (!decoded.userId) return null;
    await connectDB();
    return await User.findById(decoded.userId).select("-passwordHash");
  } catch {
    return null;
  }
}

export async function requireAuth() {
  return getAuthenticatedUser();
}

export async function requireAdmin() {
  const user = await getAuthenticatedUser();
  return user?.role === "admin" ? user : null;
}

export function publicUser(user: { _id: { toString(): string }; name: string; email: string; department: string; year: string; role: string; bio?: string; skills?: string[]; points?: number; questionsAsked?: number; answersGiven?: number; acceptedAnswers?: number }) {
  return { id: user._id.toString(), name: user.name, email: user.email, department: user.department, year: user.year, role: user.role, bio: user.bio || "", skills: user.skills || [], points: user.points || 0, questionsAsked: user.questionsAsked || 0, answersGiven: user.answersGiven || 0, acceptedAnswers: user.acceptedAnswers || 0 };
}
