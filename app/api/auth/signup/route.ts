import bcrypt from "bcryptjs";
import { createToken, publicUser } from "@/lib/auth";
import { failure, success } from "@/lib/api";
import { connectDB } from "@/lib/mongodb";
import User from "@/lib/models/User";
const departments = ["Computer Engineering", "Information Technology", "Electronics & Telecommunication", "Mechanical Engineering"];
const years = ["First", "Second", "Third", "Fourth"];
export async function POST(request: Request) {
  let stage = "request received";
  const startedAt = Date.now();
  try {
    console.info("signup: request received");
    const { name, email, password, confirmPassword, department, year, termsAccepted } = await request.json();
    if (![name, email, password, confirmPassword, department, year].every((value) => typeof value === "string" && value.trim())) return failure("Please fill in all required fields");
    if (name.trim().length < 2 || name.trim().length > 80) return failure("Name must be between 2 and 80 characters");
    if (!termsAccepted) return failure("You must accept the terms and privacy policy");
    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail.endsWith("@student.xavier.ac.in")) return failure("Only XIE student email addresses are allowed");
    if (password.length < 6) return failure("Password must be at least 6 characters long");
    if (password !== confirmPassword) return failure("Passwords do not match");
    if (!departments.includes(department) || !years.includes(year)) return failure("Invalid department or year");
    console.info("signup: validation passed");
    stage = "connecting to MongoDB";
    console.info("signup: connecting to MongoDB");
    await connectDB();
    console.info("signup: MongoDB connected");
    stage = "checking existing user";
    console.info("signup: checking existing user");
    if (await User.exists({ email: normalizedEmail })) return failure("An account with this email already exists", 409);
    stage = "hashing password";
    console.info("signup: hashing password");
    const passwordHash = await bcrypt.hash(password, 12);
    stage = "creating user";
    console.info("signup: creating user");
    const user = await User.create({ name: name.trim(), email: normalizedEmail, passwordHash, department, year, termsAccepted: true });
    console.info("signup: user created");
    const response = success(publicUser(user), "Account created successfully", 201);
    stage = "creating auth cookie";
    console.info("signup: creating auth cookie");
    response.cookies.set("auth_token", createToken(user), { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", maxAge: 604800, path: "/" });
    console.info("signup: response ready");
    return response;
  } catch (error) {
    console.error("signup: failed", { stage, elapsedMs: Date.now() - startedAt, errorName: error instanceof Error ? error.name : "UnknownError" });
    return failure("Something went wrong while creating your account", 500);
  }
}
