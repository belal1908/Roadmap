import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-xl items-center justify-center px-4">
      <div className="rounded-2xl border border-slate-700 bg-slate-900/70 p-8 text-center">
        <p className="text-xs uppercase tracking-widest text-cyan-300">404</p>
        <h1 className="mt-2 text-3xl font-bold text-slate-100">
          Roadmap not found
        </h1>
        <p className="mt-3 text-sm text-slate-300">
          This roadmap may have been removed or the URL is incorrect.
        </p>
        <Link
          href="/"
          className="mt-5 inline-flex rounded-lg bg-cyan-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400"
        >
          Back to Home
        </Link>
      </div>
    </main>
  );
}
