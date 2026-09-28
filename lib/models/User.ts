import mongoose, { Schema, models } from "mongoose";

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      validate: {
        validator: (email: string) =>
          email.endsWith("@student.xavier.ac.in"),
        message:
          "Only XIE student email addresses are allowed",
      },
    },

    passwordHash: {
      type: String,
      required: true,
    },

    department: {
      type: String,
      required: true,
      enum: [
        "Computer Engineering",
        "Information Technology",
        "Electronics & Telecommunication",
        "Mechanical Engineering",
      ],
    },

    year: {
      type: String,
      required: true,
      enum: [
        "First",
        "Second",
        "Third",
        "Fourth",
      ],
    },

    termsAccepted: {
      type: Boolean,
      required: true,
      default: false,
    },

    role: {
      type: String,
      enum: ["student", "admin"],
      default: "student",
    },
    bio: { type: String, trim: true, maxlength: 500, default: "" },
    skills: { type: [String], default: [], maxlength: 20 },
    points: { type: Number, default: 0, min: 0 },
    questionsAsked: { type: Number, default: 0, min: 0 },
    answersGiven: { type: Number, default: 0, min: 0 },
    acceptedAnswers: { type: Number, default: 0, min: 0 },
  },
  {
    timestamps: true,
  }
);

UserSchema.index({ email: 1 }, { unique: true });

const User =
  models.User ||
  mongoose.model("User", UserSchema);

export default User;
