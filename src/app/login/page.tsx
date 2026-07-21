"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    setTimeout(() => {
      router.push("/events");
    }, 600);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg)] px-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-[var(--color-accent)]/4 blur-[120px]" />
      </div>
      <div className="relative w-full max-w-[400px]">
        <div className="text-center mb-10">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/logo.png" alt="COMMONS" className="h-7 w-auto mx-auto mb-3 object-contain" />
          <div className="font-display text-[10px] tracking-[0.2em] text-[var(--color-mute)] uppercase">Member Login</div>
        </div>
        <div className="bg-[var(--color-bg-soft)] rounded-2xl border border-[var(--color-line)] p-8">
          <h1 className="font-display text-2xl mb-1">ログイン</h1>
          <p className="font-display text-xs text-[var(--color-mute)] mb-7">COMMONSへようこそ</p>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="font-display text-xs text-[var(--color-mute)] block mb-1.5">メールアドレス</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="member@commons.jp"
                className="w-full bg-[var(--color-bg)] border border-[var(--color-line)] rounded-xl px-4 py-3 text-sm outline-none focus:border-[var(--color-accent)]/60 placeholder-[var(--color-mute)] transition" />
            </div>
            <div>
              <label className="font-display text-xs text-[var(--color-mute)] block mb-1.5">パスワード</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••"
                className="w-full bg-[var(--color-bg)] border border-[var(--color-line)] rounded-xl px-4 py-3 text-sm outline-none focus:border-[var(--color-accent)]/60 placeholder-[var(--color-mute)] transition" />
            </div>
            {error && (
              <div className="px-4 py-3 rounded-xl bg-red-400/8 border border-red-400/30 font-display text-xs text-red-400">{error}</div>
            )}
            <button type="submit" disabled={loading} className="w-full btn-primary justify-center py-3 text-sm mt-2 disabled:opacity-60">
              {loading ? "ログイン中..." : "ログイン"}
            </button>
          </form>
          <div className="mt-6 pt-5 border-t border-[var(--color-line)]">
            <div className="font-display text-[10px] text-[var(--color-mute)] text-center">
              デモ用: member@commons.jp / commons2026
            </div>
          </div>
        </div>
        <div className="text-center mt-6">
          <span className="font-display text-[10px] text-[var(--color-mute)]">© 2026 COMMONS. Powered by Walkers</span>
        </div>
      </div>
    </div>
  );
}
