import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/mongodb";
import User from "@/lib/models/User";

export async function POST(request: Request) {
  try {
    // Read data sent from the signup form
    const body = await request.json();

    const {
      name,
      email,
      password,
      confirmPassword,
      department,
      year,
      termsAccepted,
    } = body;

    // Basic validation
    if (
      !name ||
      !email ||
      !password ||
      !confirmPassword ||
      !department ||
      !year
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Please fill in all required fields",
        },
        { status: 400 }
      );
    }

    // Check terms and conditions
    if (!termsAccepted) {
      return NextResponse.json(
        {
          success: false,
          message: "You must accept the terms and privacy policy",
        },
        { status: 400 }
      );
    }

    // Only allow XIE student email addresses
    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail.endsWith("@student.xavier.ac.in")) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Only XIE student email addresses are allowed",
        },
        { status: 400 }
      );
    }

    // Check password length
    if (password.length < 6) {
      return NextResponse.json(
        {
          success: false,
          message: "Password must be at least 6 characters long",
        },
        { status: 400 }
      );
    }

    // Check passwords match
    if (password !== confirmPassword) {
      return NextResponse.json(
        {
          success: false,
          message: "Passwords do not match",
        },
        { status: 400 }
      );
    }

    // Connect to MongoDB
    await connectDB();

    // Check whether the email is already registered
    const existingUser = await User.findOne({
      email: normalizedEmail,
    });

    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          message: "An account with this email already exists",
        },
        { status: 409 }
      );
    }

    // Hash the password
    const passwordHash = await bcrypt.hash(password, 12);

    // Create the user
    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      passwordHash,
      department,
      year,
      termsAccepted: true,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Account created successfully",
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          department: user.department,
          year: user.year,
          role: user.role,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Signup error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong while creating your account",
      },
      { status: 500 }
    );
  }
}