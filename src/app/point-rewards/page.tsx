"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import BottomNav from "@/components/BottomNav";

type Reward = {
  id: string;
  title: string;
  point: number;
};

// 累計ポイントごとの獲得クーポン
const rewards: Reward[] = [
  { id: "r1", title: "500円OFFクーポン", point: 1 },
  { id: "r2", title: "1,000円OFFクーポン", point: 3 },
  { id: "r3", title: "1,000円OFFクーポン", point: 5 },
  { id: "r4", title: "1,000円OFFクーポン", point: 7 },
  { id: "r5", title: "2,000円OFFクーポン", point: 10 },
  { id: "r6", title: "1,000円OFFクーポン", point: 12 },
  { id: "r7", title: "1,000円OFFクーポン", point: 14 },
  { id: "r8", title: "1,000円OFFクーポン", point: 16 },
  { id: "r9", title: "1,000円OFFクーポン", point: 18 },
  { id: "r10", title: "2,000円OFFクーポン", point: 20 },
];

const HELD_POINT = 20;

export default function PointRewardsPage() {
  const router = useRouter();
  const [redeemed, setRedeemed] = useState<Set<string>>(new Set(["r1"]));
  const [toast, setToast] = useState<string | null>(null);

  function redeem(r: Reward) {
    setRedeemed(prev => new Set(prev).add(r.id));
    setToast(`${r.title}と交換しました`);
    setTimeout(() => setToast(null), 2500);
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

          {/* 景品リスト */}
          <div className="space-y-3">
            {rewards.map(r => {
              const isRedeemed = redeemed.has(r.id);
              const canRedeem = HELD_POINT >= r.point && !isRedeemed;
              return (
                <div key={r.id} className="card p-4 flex items-center gap-4" style={isRedeemed ? { opacity: 0.5 } : undefined}>
                  <div className="flex-1 min-w-0">
                    <div className="font-display text-[11px] text-[var(--color-mute)] mb-1">累計 {r.point}pt</div>
                    <div className="font-display text-sm leading-snug">{r.title}</div>
                  </div>
                  <div className="flex-none flex flex-col items-end gap-1.5">
                    <div className="num text-base text-[var(--color-accent-deep)]">{r.point}<span className="text-[10px] text-[var(--color-mute)] ml-0.5">pt</span></div>
                    <button
                      disabled={!canRedeem}
                      onClick={() => redeem(r)}
                      className="font-display text-[11px] px-3 py-1.5 rounded-full transition disabled:cursor-not-allowed"
                      style={isRedeemed
                        ? { border: "1px solid var(--color-accent)", color: "var(--color-accent-deep)" }
                        : canRedeem
                          ? { background: "linear-gradient(135deg,#CBAE74,#B8985A)", color: "#0B0F16" }
                          : { border: "1px solid var(--color-line)", color: "var(--color-mute)", opacity: 0.4 }}>
                      {isRedeemed ? "交換済み" : canRedeem ? "交換する" : "ポイント不足"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* 注記 */}
          <div className="space-y-1.5 pt-1">
            <p className="text-[11px] text-[var(--color-mute)] leading-relaxed">
              ※ ポイントは景品と交換しても減少せず、累積されます。
            </p>
            <p className="text-[11px] text-[var(--color-mute)] leading-relaxed">
              ※ 20ポイントまでのすべての景品と交換すると、ポイントは0になります。
            </p>
          </div>
        </main>

        {/* 交換完了トースト */}
        {toast && (
          <div className="fixed bottom-[80px] left-0 right-0 z-50 flex justify-center pointer-events-none">
            <div className="px-5 py-3 rounded-full font-display text-xs shadow-lg flex items-center gap-2"
              style={{ background: "linear-gradient(135deg,#CBAE74,#B8985A)", color: "#0B0F16" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0B0F16" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              {toast}
            </div>
          </div>
        )}

        <BottomNav />
      </div>
    </div>
  );
}
