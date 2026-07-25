"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import BottomNav from "@/components/BottomNav";

// ※ 景品内容は仮です。正式な内容は別途共有され次第差し替え予定。
type Reward = {
  id: string;
  title: string;
  desc: string;
  point: number;
  category: "クーポン" | "イベント" | "グッズ" | "限定";
  emoji: string;
};

const rewards: Reward[] = [
  { id: "r1", title: "イベント割引券 ¥1,000", desc: "対象イベントで使える1,000円割引クーポン", point: 100, category: "クーポン", emoji: "🎟" },
  { id: "r2", title: "提携店ドリンク1杯無料", desc: "提携バー・カフェで使えるドリンク無料券", point: 150, category: "クーポン", emoji: "🥂" },
  { id: "r3", title: "イベント参加費 半額券", desc: "COMMONS主催イベントの参加費が半額に", point: 300, category: "イベント", emoji: "🎉" },
  { id: "r4", title: "COMMONSオリジナルトート", desc: "会員限定デザインのキャンバストートバッグ", point: 400, category: "グッズ", emoji: "👜" },
  { id: "r5", title: "人気イベント優先予約枠", desc: "満席になりやすい人気イベントの先行予約権", point: 500, category: "限定", emoji: "⭐" },
  { id: "r6", title: "VIPラウンジ1日利用券", desc: "会員制ラウンジを1日利用できる特別券", point: 800, category: "限定", emoji: "🛋" },
];

const CATEGORIES = ["すべて", "クーポン", "イベント", "グッズ", "限定"] as const;

const HELD_POINT = 20;

export default function PointRewardsPage() {
  const router = useRouter();
  const [cat, setCat] = useState<(typeof CATEGORIES)[number]>("すべて");

  const shown = cat === "すべて" ? rewards : rewards.filter(r => r.category === cat);

  return (
    <div className="flex justify-center bg-[var(--color-bg)] min-h-screen">
      <div className="w-full max-w-[430px] pb-24">
        <header className="sticky top-0 z-40 bg-[var(--color-bg)]/95 backdrop-blur-md border-b border-[var(--color-line)] px-5 py-3 flex items-center justify-between">
          <button onClick={() => router.back()} className="font-display text-sm text-[var(--color-mute)] hover:text-[var(--color-ink)] transition">← 戻る</button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/logo.png" alt="COMMONS" style={{ height: 24, width: "auto", objectFit: "contain" }} />
          <span className="w-12" />
        </header>

        <main className="px-5 pt-6 space-y-5">
          <div>
            <div className="font-display text-[10px] tracking-[0.2em] text-[var(--color-accent-deep)] mb-2">POINT REWARDS</div>
            <h1 className="font-display text-2xl">ポイント景品一覧</h1>
            <p className="mt-2 text-xs text-[var(--color-mute)] leading-relaxed">
              貯まったポイントを、お得な特典や限定景品と交換できます。
            </p>
          </div>

          {/* 保有ポイント */}
          <div className="rounded-2xl px-5 py-4 flex items-center justify-between" style={{ background: "linear-gradient(135deg,#1A1005,#3D2E08 60%,#291900)", border: "1px solid rgba(184,152,90,0.5)" }}>
            <div className="font-display text-sm" style={{ color: "#CBAE74" }}>保有ポイント</div>
            <div className="num text-3xl" style={{ color: "#CBAE74" }}>{HELD_POINT}<span className="num text-sm ml-1" style={{ color: "#9d8a63" }}>pt</span></div>
          </div>

          {/* カテゴリ */}
          <div className="flex gap-2 flex-wrap">
            {CATEGORIES.map(c => (
              <button key={c} onClick={() => setCat(c)}
                className="font-display text-xs border px-3.5 py-1.5 rounded-full transition"
                style={cat === c
                  ? { background: "var(--color-accent)", color: "#0B0F16", borderColor: "var(--color-accent)" }
                  : { borderColor: "var(--color-line)", color: "var(--color-mute)" }}>
                {c}
              </button>
            ))}
          </div>

          {/* 景品リスト */}
          <div className="space-y-3">
            {shown.map(r => {
              const canRedeem = HELD_POINT >= r.point;
              return (
                <div key={r.id} className="card p-4 flex items-center gap-4">
                  <div className="flex-none w-14 h-14 rounded-xl flex items-center justify-center text-2xl" style={{ background: "var(--color-bg-soft)", border: "1px solid var(--color-line)" }}>
                    {r.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="tag tag-accent text-[9px]">{r.category}</span>
                    </div>
                    <div className="font-display text-sm leading-snug">{r.title}</div>
                    <div className="font-display text-[11px] text-[var(--color-mute)] mt-0.5 leading-snug">{r.desc}</div>
                  </div>
                  <div className="flex-none flex flex-col items-end gap-1.5">
                    <div className="num text-base text-[var(--color-accent-deep)]">{r.point}<span className="text-[10px] text-[var(--color-mute)] ml-0.5">pt</span></div>
                    <button
                      disabled={!canRedeem}
                      className="font-display text-[11px] px-3 py-1.5 rounded-full transition disabled:opacity-40 disabled:cursor-not-allowed"
                      style={canRedeem
                        ? { background: "linear-gradient(135deg,#CBAE74,#B8985A)", color: "#0B0F16" }
                        : { border: "1px solid var(--color-line)", color: "var(--color-mute)" }}>
                      {canRedeem ? "交換する" : "ポイント不足"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <p className="text-[10px] text-[var(--color-mute)] leading-relaxed pt-2">
            ※ 表示している景品・必要ポイントは仮の内容です。正式な景品ラインナップは今後更新されます。
          </p>
        </main>

        <BottomNav />
      </div>
    </div>
  );
}
