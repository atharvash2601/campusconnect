"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ChevronRight, HeartHandshake, ShieldCheck } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Frontend only for now.
    // Later this will connect to the backend.
    router.push("/home");
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
                type={showPassword ? "text" : "password"}
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
          >
            Forgot password?
          </button>


          {/* Login Button */}
          <button
            type="submit"
            className="auth-submit"
          >
            Log in

            <ChevronRight
              size={17}
            />
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