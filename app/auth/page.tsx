"use client";

import { useState } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

export default function AuthPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);

  async function signUp(event: React.FormEvent) {
    event.preventDefault();

    const supabase = getSupabaseBrowserClient();
    if (!supabase) {
      setMessage(
        "Supabase is not configured yet. Add env values to enable auth.",
      );
      return;
    }

    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    setMessage(
      error ? error.message : "Check your inbox to confirm your account.",
    );
  }

  async function signInWithGoogle() {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) {
      setMessage(
        "Supabase is not configured yet. Add env values to enable auth.",
      );
      return;
    }

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
    });

    if (error) {
      setMessage(error.message);
    }
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md items-center px-4 py-10">
      <div className="w-full rounded-2xl border border-slate-700 bg-slate-900/70 p-6">
        <p className="text-xs uppercase tracking-widest text-cyan-300">
          Account
        </p>
        <h1 className="mt-1 text-3xl font-bold text-slate-100">
          Sign up / Log in
        </h1>

        <form onSubmit={signUp} className="mt-6 space-y-3">
          <input
            type="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="Email"
            className="h-11 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 text-sm text-slate-100 outline-none focus:border-cyan-400"
          />
          <input
            type="password"
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Password"
            className="h-11 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 text-sm text-slate-100 outline-none focus:border-cyan-400"
          />
          <button className="h-11 w-full rounded-xl bg-cyan-500 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400">
            Continue with Email
          </button>
        </form>

        <button
          onClick={signInWithGoogle}
          className="mt-3 h-11 w-full rounded-xl border border-slate-600 bg-slate-950 text-sm font-medium text-slate-100 transition hover:border-slate-400"
        >
          Continue with Google
        </button>

        {message ? (
          <p className="mt-4 text-sm text-slate-300">{message}</p>
        ) : null}
      </div>
    </main>
  );
}
