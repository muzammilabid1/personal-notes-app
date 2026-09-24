import Link from "next/link";

export default function NotFound() {
    return (
        <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-white">
            <section className="w-full max-w-2xl text-center">
                <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-3xl border border-blue-500/20 bg-blue-500/10 shadow-[0_0_60px_rgba(59,130,246,0.15)]">
                    <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        className="h-12 w-12 text-blue-400"
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
                            d="M9 11h6M9 14.5h4"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                        />
                    </svg>
                </div>

                <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-blue-400">
                    Personal Notes
                </p>

                <h1 className="text-7xl font-bold tracking-tight sm:text-8xl">
                    404
                </h1>

                <h2 className="mt-5 text-2xl font-bold sm:text-3xl">
                    Page not found
                </h2>

                <p className="mx-auto mt-4 max-w-lg text-base leading-7 text-slate-400 sm:text-lg">
                    The page you're looking for doesn't exist or may have been
                    moved somewhere else.
                </p>

                <div className="mt-8 flex flex-wrap justify-center gap-4">
                    <Link
                        href="/"
                        className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition-all duration-300 hover:bg-white hover:text-slate-950"
                    >
                        Go Home
                    </Link>

                    <Link
                        href="/dashboard"
                        className="rounded-xl border border-slate-700 px-6 py-3 font-semibold text-slate-200 transition-all duration-300 hover:border-white hover:bg-white hover:text-slate-950"
                    >
                        Dashboard
                    </Link>
                </div>
            </section>
        </main>
    );
}