import bcrypt from "bcryptjs";
import { createToken, publicUser } from "@/lib/auth";
import { failure, success } from "@/lib/api";
import { connectDB } from "@/lib/mongodb";
import User from "@/lib/models/User";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    if (typeof email !== "string" || typeof password !== "string") return failure("Please enter your email and password");
    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail.endsWith("@student.xavier.ac.in")) return failure("Only XIE student email addresses are allowed");
    await connectDB();
    const user = await User.findOne({ email: normalizedEmail });
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) return failure("Invalid email or password", 401);
    const response = success(publicUser(user), "Login successful");
    response.cookies.set("auth_token", createToken(user), { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", maxAge: 604800, path: "/" });
    return response;
  } catch { return failure("Something went wrong while logging in", 500); }
}
