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
  },
  {
    timestamps: true,
  }
);

const User =
  models.User ||
  mongoose.model("User", UserSchema);

export default User;