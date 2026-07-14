"use client";
import { useState } from "react";
import Link from "next/link";

export default function PasswordResetPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  return (
    <div className="flex justify-center bg-[var(--color-bg)] min-h-screen">
      <div className="w-full max-w-[430px] flex flex-col items-center justify-center px-8 py-16">
        {/* Logo */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/logo.png" alt="COMMONS" style={{ height: 36, width: "auto", objectFit: "contain" }} className="mb-10" />

        {sent ? (
          <div className="w-full text-center space-y-4">
            <div className="w-14 h-14 rounded-full border border-[var(--color-accent)]/40 flex items-center justify-center mx-auto">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--color-accent-deep)]">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <div className="font-display text-xl">メールを送信しました</div>
            <p className="text-sm text-[var(--color-mute)] leading-relaxed">
              {email} にパスワード再設定のメールをお送りしました。メール内のリンクからパスワードを再設定してください。
            </p>
            <p className="text-xs text-[var(--color-mute)]">メールが届かない場合は迷惑メールフォルダをご確認ください。</p>
            <div className="pt-4">
              <Link href="/login" className="font-display text-xs text-[var(--color-accent-deep)] hover:underline">
                ← ログイン画面に戻る
              </Link>
            </div>
          </div>
        ) : (
          <div className="w-full space-y-5">
            <div className="text-center mb-6">
              <h1 className="font-display text-2xl">パスワード再設定</h1>
              <p className="text-xs text-[var(--color-mute)] mt-2 leading-relaxed">
                登録済みのメールアドレスを入力してください。<br />パスワード再設定用のリンクをお送りします。
              </p>
            </div>

            <div>
              <label className="font-display text-xs text-[var(--color-mute)] block mb-2">メールアドレス</label>
              <input
                type="email"
                className="input-field w-full"
                placeholder="example@email.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>

            <button
              onClick={() => { if (email.trim()) setSent(true); }}
              className="w-full btn-primary justify-center"
            >
              再設定メールを送信
            </button>

            <div className="text-center pt-2">
              <Link href="/login" className="font-display text-xs text-[var(--color-mute)] hover:text-[var(--color-accent-deep)] transition">
                ← ログイン画面に戻る
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
