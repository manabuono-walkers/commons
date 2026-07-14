"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
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
      sessionStorage.setItem("commons_auth", "1");
      router.push("/admin");
    }, 700);
  }

  return (
    <div className="min-h-screen flex bg-[var(--color-bg)]">

      {/* ── Left panel: Admin branding ── */}
      <div className="hidden lg:flex w-[480px] flex-none flex-col justify-between bg-[var(--color-bg-soft)] border-r border-[var(--color-line)] px-12 py-10 relative overflow-hidden">
        {/* Grid texture overlay */}
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: "linear-gradient(var(--color-line) 1px, transparent 1px), linear-gradient(90deg, var(--color-line) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
          opacity: 0.3,
        }} />
        {/* Accent glow */}
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] rounded-full bg-[var(--color-accent)]/6 blur-[80px] pointer-events-none" />

        <div className="relative">
          {/* Logo */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/logo.png" alt="COMMONS" className="h-6 w-auto object-contain mb-8" />

          {/* Shield icon */}
          <div className="w-14 h-14 rounded-2xl border border-[var(--color-line)] bg-[var(--color-bg)] flex items-center justify-center mb-6">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              <polyline points="9 12 11 14 15 10"/>
            </svg>
          </div>

          <div className="font-display text-[9px] tracking-[0.25em] text-[var(--color-accent-deep)] uppercase mb-2">COMMONS</div>
          <h2 className="font-display text-3xl leading-tight mb-4">管理コンソール<br />アクセス認証</h2>
          <p className="font-display text-xs text-[var(--color-mute)] leading-relaxed max-w-[280px]">
            このシステムは権限を持つ管理者のみが使用できます。不正アクセスは記録され、法的措置の対象となる場合があります。
          </p>
        </div>

        {/* Restricted notice */}
        <div className="relative space-y-4">
          <div className="flex items-start gap-3 p-4 rounded-xl border border-amber-500/20 bg-amber-500/4">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-none mt-0.5">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
              <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
            <div>
              <div className="font-display text-[10px] text-amber-400/90 mb-0.5">関係者専用システム</div>
              <div className="font-display text-[9px] text-[var(--color-mute)] leading-relaxed">
                一般会員向けのログイン画面は別途ご利用ください
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 px-1">
            <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            <span className="font-display text-[9px] text-[var(--color-mute)]">システム正常稼働中 — v2.4.1</span>
          </div>
        </div>
      </div>

      {/* ── Right panel: Login form ── */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-[380px]">

          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-8">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/logo.png" alt="COMMONS" className="h-6 w-auto mx-auto object-contain" />
          </div>

          {/* Header */}
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[var(--color-line)] bg-[var(--color-bg-soft)] mb-5">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
              <span className="font-display text-[9px] tracking-[0.15em] text-[var(--color-mute)] uppercase">Admin Only</span>
            </div>
            <h1 className="font-display text-3xl mb-1.5">管理者ログイン</h1>
            <p className="font-display text-xs text-[var(--color-mute)]">認証情報を入力してください</p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="font-display text-[10px] tracking-[0.08em] text-[var(--color-mute)] uppercase block mb-2">
                メールアドレス
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="admin@commons.jp"
                               autoComplete="username"
                className="w-full bg-[var(--color-bg-soft)] border border-[var(--color-line)] rounded-xl px-4 py-3 text-sm outline-none focus:border-[var(--color-accent)]/60 placeholder-[var(--color-mute)]/50 transition font-display"
              />
            </div>

            <div>
              <label className="font-display text-[10px] tracking-[0.08em] text-[var(--color-mute)] uppercase block mb-2">
                パスワード
              </label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                               autoComplete="current-password"
                className="w-full bg-[var(--color-bg-soft)] border border-[var(--color-line)] rounded-xl px-4 py-3 text-sm outline-none focus:border-[var(--color-accent)]/60 placeholder-[var(--color-mute)]/50 transition font-display"
              />
            </div>

            {error && (
              <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-red-400/6 border border-red-400/25">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#f87171" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-none">
                  <circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>
                </svg>
                <span className="font-display text-xs text-red-400">{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-[var(--color-accent)] text-[var(--color-bg)] font-display text-sm tracking-wide hover:bg-[var(--color-accent-deep)] transition disabled:opacity-50"
            >
              {loading ? (
                <>
                  <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
                  認証中...
                </>
              ) : (
                <>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/>
                  </svg>
                  管理コンソールへアクセス
                </>
              )}
            </button>
          </form>

          {/* Demo credentials */}
          <div className="mt-6 p-4 rounded-xl border border-[var(--color-line)] bg-[var(--color-bg-soft)]/50">
            <div className="font-display text-[9px] tracking-[0.1em] text-[var(--color-mute)] uppercase mb-2">デモ用認証情報</div>
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-display text-[10px] text-[var(--color-mute)]">ID</span>
                <span className="font-display text-[10px] text-[var(--color-ink-soft)]">admin@commons.jp</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-display text-[10px] text-[var(--color-mute)]">PW</span>
                <span className="font-display text-[10px] text-[var(--color-ink-soft)]">commons2026</span>
              </div>
            </div>
          </div>

          <div className="text-center mt-8">
            <span className="font-display text-[9px] text-[var(--color-mute)]/60">© 2026 COMMONS. Powered by Walkers</span>
          </div>
        </div>
      </div>
    </div>
  );
}
