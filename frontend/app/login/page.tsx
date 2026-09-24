"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setMessage("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message);
        return;
      }

      setMessage("Login successful");
      router.push("/dashboard");
    } catch (error) {
      setMessage("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-16 text-white">
      <section className="mx-auto flex min-h-[calc(100vh-8rem)] max-w-6xl items-center justify-center">
        <div className="grid w-full max-w-5xl overflow-hidden rounded-3xl border border-slate-800 bg-slate-900 shadow-[0_0_60px_rgba(79,70,229,0.15)] md:grid-cols-2">
          <div className="hidden flex-col justify-center bg-gradient-to-br from-blue-600 via-indigo-600 to-slate-900 p-12 md:flex">
            <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-2xl border border-white/20 bg-white/10 shadow-[0_0_35px_rgba(96,165,250,0.25)]">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                className="h-8 w-8 text-white"
              >
                <path
                  d="M6 3.75h9.75L19 7v13.25H6V3.75Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinejoin="round"
                />
                <path
                  d="M15 3.75V7h4"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinejoin="round"
                />
                <path
                  d="M9 11h6M9 14.5h6"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </div>

            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.25em] text-blue-100">
              Personal Notes
            </p>

            <h1 className="text-4xl font-bold leading-tight">
              Welcome back to your private space.
            </h1>

            <p className="mt-5 max-w-md text-lg leading-8 text-blue-100">
              Sign in to access your notes and keep your thoughts organized in
              one place.
            </p>
          </div>

          <div className="p-8 sm:p-12">
            <div className="mb-8">
              <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-blue-400">
                Welcome back
              </p>

              <h2 className="text-3xl font-bold">Sign in to your account</h2>

              <p className="mt-2 text-slate-400">
                Enter your details to continue.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Email
                </label>

                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="Enter your email"
                  required
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition-all duration-300 placeholder:text-slate-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Password
                </label>

                <input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Enter your password"
                  required
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition-all duration-300 placeholder:text-slate-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white transition-all duration-300 hover:bg-white hover:text-slate-950 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Signing in..." : "Sign In"}
              </button>
            </form>

            {message && (
              <p className="mt-5 text-center text-sm text-slate-300">
                {message}
              </p>
            )}

            <p className="mt-8 text-center text-sm text-slate-500">
              Don't have an account?{" "}
              <Link
                href="/register"
                className="font-semibold text-blue-400 transition-all duration-300 hover:text-white"
              >
                Create Account
              </Link>
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
