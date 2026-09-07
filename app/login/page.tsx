"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  ChevronRight,
  HeartHandshake,
  ShieldCheck,
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    const form = new FormData(e.currentTarget);

    const data = {
      email: form.get("email"),
      password: form.get("password"),
    };

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.message || "Login failed");
        return;
      }

      // Login successful
      router.push("/home");
    } catch (error) {
      console.error("Login request failed:", error);

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

      {/* Login Card */}
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
            Welcome back
          </h1>

          <p>
            Sign in to continue to CampusConnect.
          </p>

        </div>

        {/* Login Form */}
        <form
          onSubmit={handleLogin}
          className="auth-form"
        >

          {/* Email */}
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
                placeholder="Enter your password"
                required
                autoComplete="current-password"
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

          {/* Forgot Password */}
          <button
            type="button"
            className="forgot"
            onClick={() => {
              setError(
                "Password reset is not available yet."
              );
            }}
          >
            Forgot password?
          </button>

          {/* Backend Error */}
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

          {/* Login Button */}
          <button
            type="submit"
            className="auth-submit"
            disabled={loading}
          >
            {loading
              ? "Logging in..."
              : "Log in"}

            {!loading && (
              <ChevronRight size={17} />
            )}
          </button>

        </form>

        {/* Signup Link */}
        <p className="auth-switch">
          New to Campus Connect?{" "}

          <Link href="/signup">
            Sign up
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