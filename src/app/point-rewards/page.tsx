"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import BottomNav from "@/components/BottomNav";

type Reward = {
  id: string;
  title: string;
  point: number;
  /** 有効期限 */
  expiry: string;
  /** 利用方法 */
  howTo: string;
  /** 対象店舗・対象イベント */
  where: string;
  /** 注意事項 */
  notes: string[];
};

// 累計ポイントごとの獲得クーポン
const rewards: Reward[] = [
  {
    id: "r1", title: "500円OFFクーポン", point: 1, expiry: "2026年9月30日まで",
    howTo: "会計時にマイページ＞クーポンから本クーポンを提示してください。",
    where: "COMMONS提携店舗（全12店舗）",
    notes: ["1会計につき1枚まで利用可能", "他クーポンとの併用不可"],
  },
  {
    id: "r2", title: "1,000円OFFクーポン", point: 3, expiry: "2026年10月31日まで",
    howTo: "イベント申込画面のクーポン欄で選択すると参加費から自動割引されます。",
    where: "COMMONS主催イベント（参加費3,000円以上）",
    notes: ["1イベントにつき1枚まで利用可能", "キャンセル時は返却されません"],
  },
  {
    id: "r3", title: "1,000円OFFクーポン", point: 5, expiry: "2026年10月31日まで",
    howTo: "会計時にマイページ＞クーポンから本クーポンを提示してください。",
    where: "COMMONS提携飲食店（渋谷・麻布十番エリア）",
    notes: ["1会計につき1枚まで利用可能", "他クーポンとの併用不可"],
  },
  {
    id: "r4", title: "1,000円OFFクーポン", point: 7, expiry: "2026年11月30日まで",
    howTo: "イベント申込画面のクーポン欄で選択すると参加費から自動割引されます。",
    where: "COMMONS WINE SALON シリーズ",
    notes: ["1イベントにつき1枚まで利用可能", "先着枠のみ対象"],
  },
  {
    id: "r5", title: "2,000円OFFクーポン", point: 10, expiry: "2026年12月31日まで",
    howTo: "イベント申込画面のクーポン欄で選択すると参加費から自動割引されます。",
    where: "COMMONS主催イベント全般（参加費5,000円以上）",
    notes: ["1イベントにつき1枚まで利用可能", "抽選イベントは当選後に適用"],
  },
  {
    id: "r6", title: "1,000円OFFクーポン", point: 12, expiry: "2026年12月31日まで",
    howTo: "会計時にマイページ＞クーポンから本クーポンを提示してください。",
    where: "COMMONS提携店舗（全12店舗）",
    notes: ["1会計につき1枚まで利用可能", "他クーポンとの併用不可"],
  },
  {
    id: "r7", title: "1,000円OFFクーポン", point: 14, expiry: "2027年1月31日まで",
    howTo: "イベント申込画面のクーポン欄で選択すると参加費から自動割引されます。",
    where: "COMMONS MUSIC BAR シリーズ",
    notes: ["1イベントにつき1枚まで利用可能", "同伴者分には利用できません"],
  },
  {
    id: "r8", title: "1,000円OFFクーポン", point: 16, expiry: "2027年1月31日まで",
    howTo: "会計時にマイページ＞クーポンから本クーポンを提示してください。",
    where: "COMMONS提携飲食店（渋谷・麻布十番エリア）",
    notes: ["1会計につき1枚まで利用可能", "ディナータイムのみ対象"],
  },
  {
    id: "r9", title: "1,000円OFFクーポン", point: 18, expiry: "2027年2月28日まで",
    howTo: "イベント申込画面のクーポン欄で選択すると参加費から自動割引されます。",
    where: "COMMONS CLUB主催イベント",
    notes: ["1イベントにつき1枚まで利用可能", "主催者側での利用は不可"],
  },
  {
    id: "r10", title: "2,000円OFFクーポン", point: 20, expiry: "2027年3月31日まで",
    howTo: "イベント申込画面のクーポン欄で選択、または提携店舗の会計時に提示してください。",
    where: "COMMONS主催イベント・提携店舗の両方で利用可",
    notes: ["1会計・1イベントにつき1枚まで", "他クーポンとの併用不可"],
  },
];

const HELD_POINT = 20;

export default function PointRewardsPage() {
  const router = useRouter();
  const [redeemed, setRedeemed] = useState<Set<string>>(new Set(["r1"]));
  const [toast, setToast] = useState<string | null>(null);
  const [detail, setDetail] = useState<Reward | null>(null);
  const [confirming, setConfirming] = useState<Reward | null>(null);

  function redeem(r: Reward) {
    setRedeemed(prev => new Set(prev).add(r.id));
    setConfirming(null);
    setDetail(null);
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
                  <button type="button" onClick={() => setDetail(r)} className="flex-1 min-w-0 text-left">
                    <div className="font-display text-[11px] text-[var(--color-mute)] mb-1">累計 {r.point}pt</div>
                    <div className="font-display text-sm leading-snug">{r.title}</div>
                    <div className="font-display text-[10px] text-[var(--color-mute)] mt-1.5 leading-relaxed">
                      有効期限：{r.expiry}
                    </div>
                    <div className="font-display text-[10px] text-[var(--color-mute)] leading-relaxed truncate">
                      利用先：{r.where}
                    </div>
                    <div className="font-display text-[10px] text-[var(--color-accent-deep)] mt-1 flex items-center gap-1">
                      詳細を見る
                      <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
                    </div>
                  </button>
                  <div className="flex-none flex flex-col items-end gap-1.5">
                    <div className="num text-base text-[var(--color-accent-deep)]">{r.point}<span className="text-[10px] text-[var(--color-mute)] ml-0.5">pt</span></div>
                    <button
                      disabled={!canRedeem}
                      onClick={() => setConfirming(r)}
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

        {/* 景品 詳細モーダル */}
        {detail && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4" onClick={() => setDetail(null)}>
            <div className="w-full max-w-[360px] rounded-2xl bg-[var(--color-bg-soft)] border border-[var(--color-line)] p-5" onClick={e => e.stopPropagation()}>
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="min-w-0">
                  <div className="font-display text-[10px] tracking-[0.2em] text-[var(--color-accent-deep)] mb-1">COUPON DETAIL</div>
                  <h2 className="font-display text-lg leading-snug">{detail.title}</h2>
                </div>
                <button onClick={() => setDetail(null)} aria-label="閉じる"
                  className="flex-none w-7 h-7 flex items-center justify-center rounded-full text-[var(--color-mute)] hover:text-[var(--color-ink)] transition">✕</button>
              </div>

              <div className="flex items-center gap-2 mb-4">
                <span className="tag tag-accent text-[10px]">必要 {detail.point}pt</span>
                {redeemed.has(detail.id) && <span className="tag text-[10px]">交換済み</span>}
              </div>

              <dl className="space-y-3 border-t border-[var(--color-line)] pt-3">
                <div>
                  <dt className="font-display text-[10px] text-[var(--color-mute)] mb-0.5">有効期限</dt>
                  <dd className="font-display text-xs leading-relaxed">{detail.expiry}</dd>
                </div>
                <div>
                  <dt className="font-display text-[10px] text-[var(--color-mute)] mb-0.5">利用方法</dt>
                  <dd className="font-display text-xs leading-relaxed">{detail.howTo}</dd>
                </div>
                <div>
                  <dt className="font-display text-[10px] text-[var(--color-mute)] mb-0.5">利用できる場所</dt>
                  <dd className="font-display text-xs leading-relaxed">{detail.where}</dd>
                </div>
                <div>
                  <dt className="font-display text-[10px] text-[var(--color-mute)] mb-0.5">注意事項</dt>
                  <dd>
                    <ul className="space-y-1">
                      {detail.notes.map((n, i) => (
                        <li key={i} className="flex items-start gap-2 text-[11px] text-[var(--color-mute)] leading-relaxed">
                          <span className="flex-none mt-0.5 text-[var(--color-accent-deep)]">·</span>{n}
                        </li>
                      ))}
                    </ul>
                  </dd>
                </div>
              </dl>

              <div className="mt-5 flex gap-2">
                {HELD_POINT >= detail.point && !redeemed.has(detail.id) && (
                  <button onClick={() => { setConfirming(detail); setDetail(null); }} className="flex-1 btn-primary justify-center text-sm">
                    交換する
                  </button>
                )}
                <button onClick={() => setDetail(null)} className="flex-1 btn-outline justify-center text-sm">閉じる</button>
              </div>
            </div>
          </div>
        )}

        {/* 交換確認モーダル */}
        {confirming && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4" onClick={() => setConfirming(null)}>
            <div className="w-full max-w-[340px] rounded-2xl bg-[var(--color-bg-soft)] border border-[var(--color-line)] p-5" onClick={e => e.stopPropagation()}>
              <div className="font-display text-[10px] tracking-[0.2em] text-[var(--color-accent-deep)] mb-1">CONFIRM</div>
              <h2 className="font-display text-lg leading-snug mb-4">この景品と交換しますか？</h2>

              <div className="rounded-xl border border-[var(--color-line)] p-4 space-y-2.5">
                <div className="flex items-start justify-between gap-3">
                  <span className="font-display text-[11px] text-[var(--color-mute)] flex-none">景品</span>
                  <span className="font-display text-xs text-right">{confirming.title}</span>
                </div>
                <div className="flex items-start justify-between gap-3">
                  <span className="font-display text-[11px] text-[var(--color-mute)] flex-none">必要ポイント</span>
                  <span className="num text-sm text-[var(--color-accent-deep)]">{confirming.point}<span className="text-[10px] text-[var(--color-mute)] ml-0.5">pt</span></span>
                </div>
                <div className="flex items-start justify-between gap-3">
                  <span className="font-display text-[11px] text-[var(--color-mute)] flex-none">交換後の保有ポイント</span>
                  <span className="num text-sm">{HELD_POINT}<span className="text-[10px] text-[var(--color-mute)] ml-0.5">pt</span></span>
                </div>
                <div className="flex items-start justify-between gap-3">
                  <span className="font-display text-[11px] text-[var(--color-mute)] flex-none">有効期限</span>
                  <span className="font-display text-xs text-right">{confirming.expiry}</span>
                </div>
                <div className="flex items-start justify-between gap-3">
                  <span className="font-display text-[11px] text-[var(--color-mute)] flex-none">利用先</span>
                  <span className="font-display text-xs text-right">{confirming.where}</span>
                </div>
              </div>

              <p className="mt-3 text-[11px] text-[var(--color-mute)] leading-relaxed">
                ※ ポイントは累積式のため、交換しても保有ポイントは減少しません。<br />
                ※ 交換後のキャンセルはできません。
              </p>

              <div className="mt-5 flex gap-2">
                <button onClick={() => redeem(confirming)} className="flex-1 btn-primary justify-center text-sm">交換する</button>
                <button onClick={() => setConfirming(null)} className="flex-1 btn-outline justify-center text-sm">キャンセル</button>
              </div>
            </div>
          </div>
        )}

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
