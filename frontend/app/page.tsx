import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="mx-auto flex min-h-screen max-w-7xl items-center px-6 py-16">
        <div className="max-w-2xl">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.25em] text-blue-400">
            Personal Notes
          </p>

          <h1 className="text-5xl font-bold leading-tight tracking-tight sm:text-6xl">
            Your thoughts,
            <span className="block text-blue-400">organized simply.</span>
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-8 text-slate-400">
            A private space to create, manage, and organize your personal notes.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/register"
              className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition-all duration-300 hover:bg-white hover:text-slate-950"
            >
              Get Started
            </Link>

            <Link
              href="/login"
              className="rounded-lg border border-slate-700 px-6 py-3 font-semibold text-slate-200 transition-all duration-300 hover:border-white hover:bg-white hover:text-slate-950"
            >
              Login
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
