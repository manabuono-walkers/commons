"use client";
import { useState } from "react";
import Link from "next/link";
import BottomNav from "@/components/BottomNav";

const participationHistory = [
  { id: 1, date: "2026.06.21", name: "COMMONS MUSIC BAR", venue: "SOUND BAR HOWL", points: "+200" },
  { id: 2, date: "2026.05.10", name: "COMMONS WINE SALON Vol.14", venue: "La Cave", points: "+300" },
  { id: 3, date: "2026.04.05", name: "AGE 26+ NIGHT", venue: "THE THEATRE TABLE", points: "+200" },
  { id: 4, date: "2026.02.22", name: "COMMONS WINE SALON Vol.13", venue: "La Cave", points: "+300" },
  { id: 5, date: "2026.01.18", name: "COMMONS MUSIC BAR", venue: "SOUND BAR HOWL", points: "+200" },
];

const pointHistory = [
  { id: 1, date: "2026.06.21", label: "イベント参加ボーナス — MUSIC BAR", points: "+200", balance: 1840 },
  { id: 2, date: "2026.06.01", label: "友達紹介ボーナス", points: "+500", balance: 1640 },
  { id: 3, date: "2026.05.10", label: "イベント参加ボーナス — WINE SALON", points: "+300", balance: 1140 },
  { id: 4, date: "2026.04.05", label: "イベント参加ボーナス — 26+ NIGHT", points: "+200", balance: 840 },
  { id: 5, date: "2026.03.15", label: "クーポン使用", points: "−200", balance: 640 },
  { id: 6, date: "2026.02.22", label: "イベント参加ボーナス — WINE SALON", points: "+300", balance: 840 },
  { id: 7, date: "2026.01.18", label: "イベント参加ボーナス — MUSIC BAR", points: "+200", balance: 540 },
];

export default function HistoryPage() {
  const [tab, setTab] = useState("participation");

  return (
    <div className="flex justify-center bg-[var(--color-bg)] min-h-screen">
      <div className="w-full max-w-[430px] pb-24">
        <header className="sticky top-0 z-40 bg-[var(--color-bg)]/95 backdrop-blur-md border-b border-[var(--color-line)] px-5 py-3 flex items-center justify-between">
          <Link href="/mypage/settings" className="font-display text-sm text-[var(--color-mute)] hover:text-[var(--color-ink)] transition">← 戻る</Link>
          <img src="/images/logo.png" alt="COMMONS" style={{ height: 24, width: "auto", objectFit: "contain" }} />
          <span className="w-12" />
        </header>
        <div className="px-5 pt-5">
          <h1 className="font-display text-xl font-semibold mb-4">履歴</h1>
          <div className="flex rounded-full border border-[var(--color-line)] overflow-hidden bg-[var(--color-bg-soft)] mb-5">
            <button onClick={() => setTab("participation")} className={`flex-1 py-2.5 font-display text-sm transition ${tab === "participation" ? "bg-[var(--color-ink)] text-[var(--color-bg)]" : "text-[var(--color-mute)]"}`}>参加履歴</button>
            <button onClick={() => setTab("points")} className={`flex-1 py-2.5 font-display text-sm transition ${tab === "points" ? "bg-[var(--color-ink)] text-[var(--color-bg)]" : "text-[var(--color-mute)]"}`}>ポイント履歴</button>
          </div>
        </div>
        {tab === "participation" && (
          <div className="px-5 space-y-3">
            {participationHistory.map(h => (
              <div key={h.id} className="card p-4 flex items-center gap-3">
                <div className="flex-1 min-w-0">
                  <div className="font-display text-sm leading-snug">{h.name}</div>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="num text-xs text-[var(--color-mute)]">{h.date}</div>
                    <div className="font-display text-xs text-[var(--color-mute)]">· {h.venue}</div>
                  </div>
                </div>
                <div className="flex-none"><span className="num text-sm text-[var(--color-accent-deep)]">{h.points} pt</span></div>
              </div>
            ))}
          </div>
        )}
        {tab === "points" && (
          <div className="mx-5 space-y-px bg-[var(--color-line)] rounded-2xl overflow-hidden border border-[var(--color-line)]">
            {pointHistory.map(h => (
              <div key={h.id} className="flex items-center gap-3 px-4 py-3.5 bg-[var(--color-bg)] first:rounded-t-2xl last:rounded-b-2xl">
                <div className="flex-1 min-w-0">
                  <div className="font-display text-sm">{h.label}</div>
                  <div className="num text-xs text-[var(--color-mute)] mt-0.5">{h.date}</div>
                </div>
                <div className="text-right flex-none">
                  <div className={`num text-sm font-semibold ${h.points.startsWith("+") ? "text-[var(--color-accent-deep)]" : "text-[var(--color-mute)]"}`}>{h.points}</div>
                  <div className="num text-xs text-[var(--color-mute)]">{h.balance.toLocaleString()} pt</div>
                </div>
              </div>
            ))}
          </div>
        )}
        <BottomNav />
      </div>
    </div>
  );
}
