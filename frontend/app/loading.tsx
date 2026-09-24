export default function Loading() {
    return (
        <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-white">
            <section className="flex flex-col items-center text-center">
                <div className="relative flex h-20 w-20 items-center justify-center">
                    <div className="absolute inset-0 rounded-3xl border border-blue-500/20 bg-blue-500/5 shadow-[0_0_60px_rgba(59,130,246,0.15)]" />

                    <div className="h-10 w-10 animate-spin rounded-full border-2 border-slate-700 border-t-blue-400" />
                </div>

                <p className="mt-7 text-sm font-semibold uppercase tracking-[0.3em] text-blue-400">
                    Personal Notes
                </p>

                <h1 className="mt-3 text-2xl font-bold">
                    Loading your workspace
                </h1>

                <p className="mt-2 text-sm text-slate-500">
                    Please wait a moment...
                </p>
            </section>
        </main>
    );
}