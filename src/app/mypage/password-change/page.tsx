"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import BottomNav from "@/components/BottomNav";

export default function PasswordChangePage() {
  const router = useRouter();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordConfirm, setNewPasswordConfirm] = useState("");
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  function handleSave() {
    if (!currentPassword || !newPassword || !newPasswordConfirm) {
      setError("すべての項目を入力してください。");
      return;
    }
    if (newPassword.length < 8) {
      setError("新しいパスワードは8文字以上で入力してください。");
      return;
    }
    if (newPassword !== newPasswordConfirm) {
      setError("新しいパスワード（確認用）が一致しません。");
      return;
    }
    setError("");
    setDone(true);
  }

  if (done) {
    return (
      <div className="flex justify-center bg-[var(--color-bg)] min-h-screen">
        <div className="w-full max-w-[430px] flex flex-col items-center justify-center px-8 py-20 text-center">
          <div className="w-14 h-14 rounded-full border border-[var(--color-accent)]/50 flex items-center justify-center mx-auto mb-6">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent-deep)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <h1 className="font-display text-2xl mb-2">パスワードを変更しました</h1>
          <p className="text-sm text-[var(--color-mute)] leading-relaxed mb-8">
            新しいパスワードでログインできるようになりました。
          </p>
          <button onClick={() => router.back()} className="btn-primary justify-center">各種設定へ戻る</button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center bg-[var(--color-bg)] min-h-screen">
      <div className="w-full max-w-[430px] pb-24">
        <header className="sticky top-0 z-40 bg-[var(--color-bg)]/95 backdrop-blur-md border-b border-[var(--color-line)] px-5 py-3 flex items-center justify-between">
          <button onClick={() => router.back()} className="font-display text-sm text-[var(--color-mute)] hover:text-[var(--color-ink)] transition">← 戻る</button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/logo.png" alt="COMMONS" style={{ height: 24, width: "auto", objectFit: "contain" }} />
          <span className="w-12" />
        </header>

        <main className="px-5 pt-8 space-y-6">
          <div>
            <p className="font-display text-[10px] tracking-[0.2em] text-[var(--color-accent-deep)] mb-1">My Account</p>
            <h1 className="font-display text-2xl">パスワード変更</h1>
          </div>

          <div className="card p-5 space-y-4">
            <div>
              <label className="font-display text-[10px] text-[var(--color-mute)] block mb-1.5">現在のパスワード</label>
              <input
                type="password"
                className="input-field"
                placeholder="••••••••"
                value={currentPassword}
                onChange={e => setCurrentPassword(e.target.value)}
              />
            </div>
            <div>
              <label className="font-display text-[10px] text-[var(--color-mute)] block mb-1.5">新しいパスワード</label>
              <input
                type="password"
                className="input-field"
                placeholder="8文字以上"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
              />
            </div>
            <div>
              <label className="font-display text-[10px] text-[var(--color-mute)] block mb-1.5">新しいパスワード（確認用）</label>
              <input
                type="password"
                className="input-field"
                placeholder="もう一度入力してください"
                value={newPasswordConfirm}
                onChange={e => setNewPasswordConfirm(e.target.value)}
              />
            </div>
          </div>

          {error && (
            <div className="px-4 py-3 rounded-xl bg-red-400/8 border border-red-400/30 font-display text-xs text-red-400">{error}</div>
          )}

          <div className="space-y-3 pb-4">
            <button
              onClick={handleSave}
              className="w-full py-4 rounded-full font-display text-base transition-all hover:opacity-90 active:scale-95"
              style={{ background: "linear-gradient(135deg, #CBAE74, #B8985A)", color: "#0B0F16" }}
            >
              保存する
            </button>
            <button onClick={() => router.back()} className="w-full btn-outline justify-center">
              戻る
            </button>
          </div>
        </main>

        <BottomNav />
      </div>
    </div>
  );
}
