"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  ChevronRight,
  HeartHandshake,
  ShieldCheck,
} from "lucide-react";

export default function SignupPage() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSignup = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    const form = new FormData(e.currentTarget);

    const data = {
      name: form.get("name"),
      email: form.get("email"),
      password: form.get("password"),
      confirmPassword: form.get("confirmPassword"),
      department: form.get("department"),
      year: form.get("year"),
      termsAccepted: form.get("terms") === "on",
    };

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.message || "Signup failed");
        return;
      }

      // Signup successful
      router.push("/home");
    } catch (error) {
      console.error("Signup request failed:", error);

      setError("Unable to connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">

      {/* CampusConnect Logo */}
      <Link href="/" className="auth-brand">
        <span className="brand-mark">
          <HeartHandshake size={19} />
        </span>

        <span>
          Campus <b>Connect</b>
        </span>
      </Link>

      {/* Signup Card */}
      <div className="auth-card">

        {/* Heading */}
        <div className="auth-heading">

          <span className="form-icon">
            <HeartHandshake size={21} />
          </span>

          <p className="eyebrow">
            XIE STUDENT COMMUNITY
          </p>

          <h1>
            Create your account
          </h1>

          <p>
            Join students helping students across campus.
          </p>

        </div>

        {/* Signup Form */}
        <form
          onSubmit={handleSignup}
          className="auth-form"
        >

          {/* Full Name */}
          <label>
            Full name

            <input
              type="text"
              name="name"
              placeholder="Your full name"
              required
              autoComplete="name"
            />
          </label>

          {/* College Email */}
          <label>
            College email

            <input
              type="email"
              name="email"
              placeholder="you@student.xavier.ac.in"
              required
              autoComplete="email"
            />
          </label>

          {/* Password */}
          <label>
            Password

            <div className="password-wrapper">

              <input
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                name="password"
                placeholder="Create a password"
                required
                minLength={6}
                autoComplete="new-password"
              />

              <button
                type="button"
                className="password-toggle"
                onClick={() =>
                  setShowPassword(!showPassword)
                }
              >
                {showPassword ? "Hide" : "Show"}
              </button>

            </div>
          </label>

          {/* Confirm Password */}
          <label>
            Confirm password

            <div className="password-wrapper">

              <input
                type={
                  showConfirmPassword
                    ? "text"
                    : "password"
                }
                name="confirmPassword"
                placeholder="Confirm your password"
                required
                minLength={6}
                autoComplete="new-password"
              />

              <button
                type="button"
                className="password-toggle"
                onClick={() =>
                  setShowConfirmPassword(
                    !showConfirmPassword
                  )
                }
              >
                {showConfirmPassword
                  ? "Hide"
                  : "Show"}
              </button>

            </div>
          </label>

          {/* Department + Year */}
          <div className="form-two">

            <label>
              Department

              <select
                name="department"
                defaultValue=""
                required
              >
                <option
                  value=""
                  disabled
                >
                  Select
                </option>

                <option>
                  Computer Engineering
                </option>

                <option>
                  Information Technology
                </option>

                <option>
                  Electronics & Telecommunication
                </option>

                <option>
                  Mechanical Engineering
                </option>
              </select>
            </label>

            <label>
              Year

              <select
                name="year"
                defaultValue=""
                required
              >
                <option
                  value=""
                  disabled
                >
                  Select
                </option>

                <option>
                  First
                </option>

                <option>
                  Second
                </option>

                <option>
                  Third
                </option>

                <option>
                  Fourth
                </option>
              </select>
            </label>

          </div>

          {/* Terms */}
          <label className="terms-row">

            <input
              type="checkbox"
              name="terms"
              required
            />

            <span>
              I agree to the CampusConnect terms
              and privacy policy.
            </span>

          </label>

          {/* Backend Error Message */}
          {error && (
            <p
              style={{
                color: "#ef4444",
                fontSize: "14px",
                marginTop: "8px",
              }}
            >
              {error}
            </p>
          )}

          {/* Signup Button */}
          <button
            type="submit"
            className="auth-submit"
            disabled={loading}
          >
            {loading
              ? "Creating account..."
              : "Create account"}

            {!loading && (
              <ChevronRight size={17} />
            )}
          </button>

        </form>

        {/* Login Link */}
        <p className="auth-switch">
          Already have an account{"?"}{" "}

          <Link href="/login">
            Log in
          </Link>
        </p>

      </div>

      {/* Security Note */}
      <p className="auth-note">
        <ShieldCheck size={14} />

        Campus Connect is only available to XIE students.
      </p>

    </main>
  );
}