"use client";

import Link from "next/link";
import { useState } from "react";
import SiteFooter from "@/components/SiteFooter";

export default function RegisterPage() {
  const [agreed, setAgreed] = useState(false);
  const [showPass, setShowPass] = useState(false);

  return (
    <>
      <main className="min-h-[calc(100vh-180px)]">
        <div className="grid min-h-[calc(100vh-180px)] grid-cols-1 lg:grid-cols-[55%_45%]">

          {/* ── 左: ビジュアルパネル ── */}
          <section className="relative hidden overflow-hidden bg-[var(--color-bg-soft)] text-[var(--color-ink)] lg:flex">
            <div
              className="absolute inset-0 opacity-60"
              style={{
                background:
                  "radial-gradient(circle at 75% 20%, rgba(184,152,90,0.28) 0%, transparent 50%), radial-gradient(circle at 20% 75%, rgba(184,152,90,0.18) 0%, transparent 55%)",
              }}
            />

            {/* 装飾ライン */}
            <div
              className="absolute right-0 top-0 h-full w-px"
              style={{ background: "linear-gradient(to bottom, transparent, rgba(184,152,90,0.3), transparent)" }}
            />

            <div className="relative z-10 flex w-full flex-col justify-between p-12 xl:p-20">
              <Link href="/" className="font-display text-3xl tracking-[0.18em]">
                COMMONS
              </Link>

              <div>
                <div className="font-display text-xs text-[var(--color-accent)] animate-fade-up">
                  New Membership
                </div>
                <h1 className="mt-6 animate-fade-up delay-1 font-display text-[clamp(2.2rem,4.5vw,4rem)] leading-[1.2]">
                  はじめまして。<br />
                  ようこそ、<br />
                  COMMONS へ。
                </h1>
                <p className="mt-6 max-w-md animate-fade-up delay-2 text-[var(--color-ink-soft)]/80 leading-relaxed text-sm">
                  アカウントを作成して、審査をお申込みください。<br />
                  承認後、すべての会員サービスをご利用いただけます。
                </p>

                {/* ステップ表示 */}
                <div className="mt-10 animate-fade-up delay-3 space-y-3">
                  {[
                    { step: "01", label: "アカウント登録", active: true },
                    { step: "02", label: "入会審査申込", active: false },
                    { step: "03", label: "審査結果のご連絡", active: false },
                    { step: "04", label: "決済・会員証発行", active: false },
                  ].map(({ step, label, active }) => (
                    <div key={step} className="flex items-center gap-4">
                      <span
                        className="num text-xs"
                        style={{ color: active ? "var(--color-accent-deep)" : "var(--color-mute)" }}
                      >
                        {step}
                      </span>
                      <div className="h-px w-6" style={{ background: active ? "var(--color-accent)" : "var(--color-line)" }} />
                      <span
                        className="font-display text-sm"
                        style={{ color: active ? "var(--color-ink)" : "var(--color-mute)" }}
                      >
                        {label}
                      </span>
                      {active && (
                        <span className="tag tag-accent ml-1" style={{ fontSize: "0.6rem", padding: "0.15rem 0.55rem" }}>
                          現在
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-end justify-between text-xs text-[var(--color-mute)] font-display animate-fade-in delay-4">
                <span>東京／大阪</span>
                <span>完全審査制</span>
              </div>
            </div>
          </section>

          {/* ── 右: フォームパネル ── */}
          <section className="flex items-start justify-center overflow-y-auto px-6 py-16 md:px-12">
            <div className="w-full max-w-md">

              {/* モバイルロゴ */}
              <Link href="/" className="lg:hidden font-display text-3xl tracking-[0.18em]">
                COMMONS
              </Link>

              {/* タイトル */}
              <div className="mt-10 lg:mt-0">
                <div className="font-display text-xs text-[var(--color-accent-deep)] animate-fade-up">
                  アカウント登録
                </div>
                <h2 className="mt-4 animate-fade-up delay-1 font-display text-4xl">新規登録</h2>
                <p className="mt-3 animate-fade-up delay-2 text-sm text-[var(--color-mute)]">
                  まずはアカウントを作成してください。登録後、入会審査へ進みます。
                </p>
              </div>

              {/* ソーシャル登録 */}
              <div className="mt-10 animate-fade-up delay-3 space-y-3">
                <button className="btn-outline w-full justify-center gap-3">
                  <AppleIcon />
                  Appleで登録する
                </button>
                <button className="btn-outline w-full justify-center gap-3">
                  <GoogleIcon />
                  Googleで登録する
                </button>
              </div>

              {/* 区切り */}
              <div className="my-8 flex items-center gap-4 animate-fade-in delay-4">
                <div className="h-px flex-1 bg-[var(--color-line)]" />
                <span className="font-display text-xs text-[var(--color-mute)]">またはメールで登録</span>
                <div className="h-px flex-1 bg-[var(--color-line)]" />
              </div>

              {/* フォーム */}
              <form className="space-y-6 animate-fade-up delay-4">

                {/* 氏名 */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="input-label">姓</label>
                    <input
                      type="text"
                      className="input-field"
                      placeholder="山田"
                      autoComplete="family-name"
                    />
                  </div>
                  <div>
                    <label className="input-label">名</label>
                    <input
                      type="text"
                      className="input-field"
                      placeholder="太郎"
                      autoComplete="given-name"
                    />
                  </div>
                </div>

                {/* メールアドレス */}
                <div>
                  <label className="input-label">メールアドレス</label>
                  <input
                    type="email"
                    className="input-field"
                    placeholder="member@example.com"
                    autoComplete="email"
                  />
                </div>

                {/* パスワード */}
                <div>
                  <label className="input-label">パスワード</label>
                  <div className="relative">
                    <input
                      type={showPass ? "text" : "password"}
                      className="input-field pr-12"
                      placeholder="8文字以上"
                      autoComplete="new-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass(!showPass)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--color-mute)] hover:text-[var(--color-ink)] transition-colors"
                      style={{ fontSize: "0.75rem", fontFamily: "var(--font-display)" }}
                    >
                      {showPass ? "非表示" : "表示"}
                    </button>
                  </div>
                  <p className="mt-1.5 text-xs text-[var(--color-mute)]">
                    半角英数字・記号を組み合わせた8文字以上
                  </p>
                </div>

                {/* パスワード確認 */}
                <div>
                  <label className="input-label">パスワード（確認）</label>
                  <input
                    type={showPass ? "text" : "password"}
                    className="input-field"
                    placeholder="もう一度入力してください"
                    autoComplete="new-password"
                  />
                </div>

                {/* 規約同意 */}
                <div
                  className="rounded-xl border p-5"
                  style={{ borderColor: agreed ? "var(--color-accent)" : "var(--color-line)", background: "var(--color-bg-soft)" }}
                >
                  <label className="flex cursor-pointer items-start gap-4">
                    <div className="relative mt-0.5 flex-shrink-0">
                      <input
                        type="checkbox"
                        checked={agreed}
                        onChange={(e) => setAgreed(e.target.checked)}
                        className="h-4 w-4 cursor-pointer accent-[var(--color-accent-deep)]"
                      />
                    </div>
                    <span className="text-sm leading-relaxed" style={{ color: "var(--color-ink-soft)" }}>
                      <a className="link-underline accent" style={{ color: "var(--color-accent-deep)" }}>
                        利用規約
                      </a>
                      および
                      <a className="link-underline accent" style={{ color: "var(--color-accent-deep)" }}>
                        プライバシーポリシー
                      </a>
                      に同意して登録する
                    </span>
                  </label>
                </div>

                {/* 登録ボタン */}
                <Link
                  href="/apply"
                  className={`btn-primary w-full justify-center transition-opacity ${agreed ? "opacity-100" : "opacity-40 pointer-events-none"}`}
                >
                  アカウントを作成する →
                </Link>

              </form>

              {/* サインインへ */}
              <div className="mt-10 border-t border-[var(--color-line)] pt-6 text-center animate-fade-in delay-7">
                <p className="text-sm text-[var(--color-mute)]">
                  すでにアカウントをお持ちの方は{" "}
                  <Link href="/login" className="link-underline accent">
                    こちらからサインイン
                  </Link>
                </p>
              </div>

            </div>
          </section>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}

function AppleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701z" />
    </svg>
  );
}

function GoogleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
  );
}
