"use client";
import { useParams } from "next/navigation";
import { useState } from "react";
import { useRouter } from "next/navigation";
import AppHeader from "@/components/AppHeader";
import BottomNav from "@/components/BottomNav";

interface EventDetail {
  title: string; date: string; time: string; venue: string;
  fee: string; capacity: string; current: number; desc: string;
  image: string | null; state: string;
}

const EVENTS: Record<string, Record<string, EventDetail>> = {
  wine: {
    "1": { title: "シャンパーニュ特集 Vol.3", date: "2026年7月12日（日）", time: "19:00", venue: "La Cave 麻布十番", fee: "¥8,500", capacity: "12", current: 4, desc: "銘醸シャンパーニュをヴィンテージ違いで飲み比べ。醸造家による特別解説付き。\n\nメゾンの違い、年代の違いによる風味の変化を体感できる特別な夜をご用意しています。ドレスコードはスマートカジュアルでお越しください。\n\n◎ 当日の流れ\n18:45 受付開始\n19:00 開会・自己紹介\n19:15 テイスティング開始\n21:00 クローズ（予定）", image: null, state: "受付中" },
    "2": { title: "ボルドー格付け比較会", date: "2026年8月2日（日）", time: "18:30", venue: "Atelier du Vin 銀座", fee: "¥11,000", capacity: "10", current: 10, desc: "1〜5級シャトーを縦断してテイスティング。格付けと価格の関係を体感できる贅沢な一夜。専門家の解説付き。", image: null, state: "受付中" },
    "3": { title: "秋のブルゴーニュナイト Vol.13", date: "2026年9月6日（日）", time: "19:00", venue: "La Cave 麻布十番", fee: "¥9,500", capacity: "12", current: 12, desc: "ブルゴーニュの赤・白をヴィンテージ違いで楽しむ人気シリーズ第13弾。\n\nピノ・ノワール3種、シャルドネ2種を飲み比べ。当日はソムリエによる詳細解説もあります。ドレスコードはスマートカジュアルでお越しください。\n\n◎ 当日の流れ\n18:45 受付開始\n19:00 開会・自己紹介\n19:15 テイスティング開始\n21:00 クローズ（予定）", image: null, state: "申込済み" },
  },
  coffee: {
    "1": { title: "Sunday Coffee Cupping #8", date: "2026年7月5日（日）", time: "11:00", venue: "COFFEE LAB 渋谷", fee: "¥3,200", capacity: "8", current: 3, desc: "シングルオリジン3種をスペシャルティコーヒー専門家とカッピング。\n\nエチオピア・コロンビア・ブラジルの3カ国を飲み比べ、香りと味わいの違いを丁寧に解説します。初心者歓迎。\n\n◎ 当日の流れ\n10:45 受付開始\n11:00 開会・カッピング説明\n11:15 テイスティング開始\n13:00 終了（予定）", image: null, state: "抽選受付中" },
  },
  travel: {
    "1": { title: "金沢日帰りグルメ旅", date: "2026年8月23日（日）", time: "07:30", venue: "東京駅（新幹線集合）", fee: "¥15,000", capacity: "10", current: 6, desc: "北陸新幹線で金沢へ。近江町市場で海鮮を楽しんだ後、ひがし茶屋街・21世紀美術館を散策。夜は地元料理でディナー。\n\n◎ 当日の流れ\n07:30 東京駅集合・新幹線乗車\n10:30 金沢着・近江町市場\n12:00 ランチ（各自）\n13:30 ひがし茶屋街散策\n15:00 21世紀美術館\n18:00 ディナー（金沢駅前）\n19:30 現地解散（自由帰宅）\n\n※交通費・食事代は別途", image: null, state: "受付中" },
  },
};

const GRAD = "linear-gradient(160deg,#B8985A,#CBAE74 40%,#E8C87A 70%,#B8985A)";

export default function ClubEventDetailPage() {
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : (params.id ?? "");
  const eventId = Array.isArray(params.eventId) ? params.eventId[0] : (params.eventId ?? "");

  const router = useRouter();
  const [applied, setApplied] = useState(false);

  const ev = (EVENTS[id] ?? {})[eventId];

  if (!ev) {
    return (
      <div className="flex justify-center bg-[var(--color-bg)] min-h-screen">
        <div className="w-full max-w-[430px] pb-24 flex items-center justify-center">
          <p className="font-display text-sm text-[var(--color-mute)]">イベントが見つかりません</p>
        </div>
      </div>
    );
  }

  const remaining = parseInt(ev.capacity) - ev.current;
  const isFull = remaining <= 0;

  if (applied) {
    return (
      <div className="flex justify-center bg-[var(--color-bg)] min-h-screen">
        <div className="w-full max-w-[430px] pb-24 flex flex-col items-center justify-center px-5">
          <div className="text-center">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
              style={{ background: "linear-gradient(135deg,#CBAE74,#B8985A)" }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#0B0F16" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            </div>
            <h2 className="font-display text-2xl mb-2">申込が完了しました</h2>
            <p className="font-display text-xs text-[var(--color-mute)] mb-2">{ev.title}</p>
            <p className="font-display text-xs text-[var(--color-mute)] mb-8">確認メールをお送りします。当日はお気をつけてお越しください。</p>
            <button onClick={() => router.back()}
              className="font-display text-sm px-8 py-3 rounded-full"
              style={{ background: "linear-gradient(135deg,#CBAE74,#B8985A)", color: "#0B0F16" }}>
              クラブに戻る
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center bg-[var(--color-bg)] min-h-screen">
      <div className="w-full max-w-[430px] pb-56">
        <AppHeader backHref={`/clubs/${id}`} />

        {/* Hero */}
        <div className="w-full h-48" style={{ background: GRAD }}>
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center">
              <div className="text-5xl mb-2">🍷</div>
              <div className="font-display text-xs text-white/60 tracking-widest">CLUB EVENT</div>
            </div>
          </div>
        </div>

        <div className="px-5 pt-6 space-y-6">
          {/* Status + title */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className={`tag text-[9px] px-2 py-0.5 ${ev.state === "受付中" ? "tag-accent" : ev.state === "抽選受付中" ? "tag-ink" : ""}`}>{ev.state}</span>
            </div>
            <h1 className="font-display text-2xl leading-snug">{ev.title}</h1>
          </div>

          {/* Info grid */}
          <div className="card p-5 space-y-4">
            {[
              { icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>, label: "開催日", value: ev.date },
              { icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>, label: "開始時間", value: ev.time },
              { icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>, label: "会場", value: ev.venue },
              { icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>, label: "参加費", value: ev.fee },
              { icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>, label: "定員", value: `${ev.current} / ${ev.capacity}名` },
            ].map(row => (
              <div key={row.label} className="flex items-start gap-3">
                <span className="text-[var(--color-accent-deep)] mt-0.5 flex-none">{row.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="font-display text-[10px] text-[var(--color-mute)] mb-0.5">{row.label}</div>
                  <div className="font-display text-sm">{row.value}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Remaining */}
          {!isFull && (
            <div className="flex items-center gap-2 px-4 py-3 rounded-xl border border-[var(--color-accent)]/30 bg-[var(--color-accent)]/6">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent-deep)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              <span className="font-display text-xs text-[var(--color-accent-deep)]">残り{remaining}席</span>
            </div>
          )}

          {/* Description */}
          <div>
            <div className="font-display text-xs text-[var(--color-mute)] mb-3">詳細・備考</div>
            <p className="text-sm text-[var(--color-ink-soft)] leading-relaxed whitespace-pre-line">{ev.desc}</p>
          </div>
        </div>

        {/* Fixed apply button */}
        <div className="fixed bottom-[57px] left-0 right-0 z-40 flex justify-center pointer-events-none">
          <div className="w-full max-w-[430px] px-5 py-4 pointer-events-auto bg-[var(--color-bg)]/95 backdrop-blur-md border-t border-[var(--color-line)]">
            {ev.state === "申込済み" ? (
              <button disabled className="w-full py-4 rounded-full font-display text-base opacity-50 border border-[var(--color-accent)]/40 text-[var(--color-accent-deep)]">
                申込済み
              </button>
            ) : isFull ? (
              <button disabled className="w-full py-4 rounded-full font-display text-base opacity-40 border border-[var(--color-line)] text-[var(--color-mute)]">
                満席です
              </button>
            ) : (
              <button onClick={() => setApplied(true)}
                className="w-full py-4 rounded-full font-display text-base transition hover:opacity-90 active:scale-[0.98]"
                style={{ background: "linear-gradient(135deg,#CBAE74,#B8985A)", color: "#0B0F16" }}>
                参加を申し込む
              </button>
            )}
          </div>
        </div>

        <BottomNav />
      </div>
    </div>
  );
}
