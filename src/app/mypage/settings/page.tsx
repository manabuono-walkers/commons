"use client";
import { useState } from "react";
import Link from "next/link";
import BottomNav from "@/components/BottomNav";

export default function SettingsPage() {
  const [showWithdraw, setShowWithdraw] = useState(false);

  return (
    <div className="flex justify-center bg-[var(--color-bg)] min-h-screen">
      <div className="w-full max-w-[430px] pb-24">
        <header className="sticky top-0 z-40 bg-[var(--color-bg)]/95 backdrop-blur-md border-b border-[var(--color-line)] px-5 py-3 flex items-center justify-between">
          <Link href="/mypage" className="font-display text-sm text-[var(--color-mute)] hover:text-[var(--color-ink)] transition">← 戻る</Link>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/logo.png" alt="COMMONS" style={{ height: 24, width: "auto", objectFit: "contain" }} />
          <span className="w-12" />
        </header>

        <main className="px-5 pt-6 pb-10">
          <h1 className="font-display text-xl font-semibold mb-5">各種設定</h1>

          <div className="space-y-px bg-[var(--color-line)] rounded-2xl overflow-hidden border border-[var(--color-line)]">
            <Link href="/history" className="w-full flex items-center gap-4 px-5 py-4 bg-[var(--color-bg)] hover:bg-[var(--color-bg-soft)] transition">
              <span className="font-display text-sm flex-1">参加履歴・ポイント履歴</span>
              <span className="text-[var(--color-mute)]">›</span>
            </Link>
            <Link href="/feedback" className="w-full flex items-center gap-4 px-5 py-4 bg-[var(--color-bg)] hover:bg-[var(--color-bg-soft)] transition">
              <span className="font-display text-sm flex-1">意見箱</span>
              <span className="text-[var(--color-mute)]">›</span>
            </Link>
            <Link href="/notification-settings" className="w-full flex items-center gap-4 px-5 py-4 bg-[var(--color-bg)] hover:bg-[var(--color-bg-soft)] transition">
              <span className="font-display text-sm flex-1">通知設定</span>
              <span className="text-[var(--color-mute)]">›</span>
            </Link>
            <button
              onClick={() => setShowWithdraw(true)}
              className="w-full flex items-center gap-4 px-5 py-4 bg-[var(--color-bg)] hover:bg-[var(--color-bg-soft)] transition text-left"
            >
              <span className="font-display text-sm flex-1 text-red-400">退会する</span>
              <span className="text-[var(--color-mute)]">›</span>
            </button>
          </div>
        </main>

        {showWithdraw && (
          <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm" onClick={() => setShowWithdraw(false)}>
            <div className="w-full max-w-[430px] bg-[var(--color-bg-soft)] rounded-t-3xl p-6 pb-10" onClick={e => e.stopPropagation()}>
              <div className="w-10 h-1 bg-[var(--color-line)] rounded-full mx-auto mb-6" />
              <h2 className="font-display text-xl font-semibold">退会の確認</h2>
              <p className="mt-3 text-sm text-[var(--color-mute)] leading-relaxed">
                退会するとすべてのデータが削除され、復元できません。本当に退会しますか？
              </p>
              <div className="mt-6 space-y-3">
                <button className="w-full py-3.5 rounded-full font-display text-sm bg-red-500/90 text-white hover:bg-red-500 transition">退会する</button>
                <button onClick={() => setShowWithdraw(false)} className="w-full py-3.5 rounded-full font-display text-sm border border-[var(--color-line)] text-[var(--color-mute)] hover:text-[var(--color-ink)] hover:border-[var(--color-ink)] transition">キャンセル</button>
              </div>
            </div>
          </div>
        )}

        <BottomNav />
      </div>
    </div>
  );
}
