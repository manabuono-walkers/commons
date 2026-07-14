"use client";
import { useState } from "react";
import Link from "next/link";
import BottomNav from "@/components/BottomNav";

const plans = [
  {
    id: "monthly",
    label: "月額プラン",
    price: "¥980",
    sub: "税込 / 月",
    note: "毎月1日に自動更新",
    saving: null,
    current: false,
  },
  {
    id: "yearly",
    label: "年間プラン",
    price: "¥500",
    sub: "税込 / 月",
    note: "12ヶ月一括 ¥6,000",
    saving: "月額より¥5,760お得",
    current: true,
  },
];

export default function PlanChangePage() {
  const [selected, setSelected] = useState("yearly");
  const [done, setDone] = useState(false);

  if (done) {
    return (
      <div className="flex justify-center bg-[var(--color-bg)] min-h-screen">
        <div className="w-full max-w-[430px] pb-24 flex flex-col items-center justify-center gap-5 px-8 text-center">
          <div className="text-5xl">✓</div>
          <div className="font-display text-2xl">プランを変更しました</div>
          <p className="text-sm text-[var(--color-mute)]">次回請求日より新しいプランが適用されます。</p>
          <Link href="/mypage" className="btn-primary px-8 py-3 rounded-full font-display text-sm mt-4">マイページへ戻る</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center bg-[var(--color-bg)] min-h-screen">
      <div className="w-full max-w-[430px] pb-24">
        <header className="sticky top-0 z-40 bg-[var(--color-bg)]/95 backdrop-blur-md border-b border-[var(--color-line)] px-5 py-3 flex items-center justify-between">
          <Link href="/mypage" className="font-display text-sm text-[var(--color-mute)] hover:text-[var(--color-ink)] transition">← 戻る</Link>
          <img src="/images/logo.png" alt="COMMONS" style={{ height: 24, width: "auto", objectFit: "contain" }} />
          <span className="w-12" />
        </header>

        <main className="px-5 pt-8 space-y-8">
          <h1 className="font-display text-2xl">契約プラン変更</h1>

          <div className="space-y-4">
            {plans.map(p => (
              <button
                key={p.id}
                onClick={() => setSelected(p.id)}
                className={`w-full text-left rounded-2xl border-2 p-5 transition ${
                  selected === p.id
                    ? "border-[var(--color-accent)] bg-[var(--color-accent)]/10"
                    : "border-[var(--color-line)] bg-[var(--color-bg)] hover:border-[var(--color-accent)]/40"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-none ${selected === p.id ? "border-[var(--color-accent)]" : "border-[var(--color-line)]"}`}>
                        {selected === p.id && <div className="w-2 h-2 rounded-full bg-[var(--color-accent)]" />}
                      </div>
                      <div className="font-display text-base">{p.label}</div>
                      {p.current && <span className="tag text-[9px]">現在のプラン</span>}
                    </div>
                    <div className="pl-6 space-y-1">
                      <div className="font-display text-xs text-[var(--color-mute)]">{p.note}</div>
                      {p.saving && <div className="font-display text-xs text-[var(--color-accent-deep)]">{p.saving}</div>}
                    </div>
                  </div>
                  <div className="text-right flex-none">
                    <div className="num text-2xl">{p.price}</div>
                    <div className="font-display text-[10px] text-[var(--color-mute)]">{p.sub}</div>
                  </div>
                </div>
              </button>
            ))}
          </div>

          <div className="card p-4 space-y-2 text-xs text-[var(--color-mute)] font-display">
            <div>· プラン変更は次回請求日より適用されます</div>
            <div>· 年間プランへの変更は、現在の月額プラン期間終了後に適用</div>
            <div>· ダウングレード（年額→月額）は次の更新タイミングで適用</div>
          </div>

          <button
            disabled={selected === "yearly"}
            onClick={() => setDone(true)}
            className="w-full py-4 rounded-full font-display text-base transition-all hover:opacity-90 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ background: "linear-gradient(135deg, #CBAE74, #B8985A)", color: "#0B0F16" }}
          >
            {selected === "yearly" ? "現在のプランです" : "このプランに変更する"}
          </button>
        </main>

        <BottomNav />
      </div>
    </div>
  );
}
