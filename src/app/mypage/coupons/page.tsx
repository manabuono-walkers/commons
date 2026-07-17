"use client";
import { useState, useRef } from "react";
import BottomNav from "@/components/BottomNav";
import AppHeader from "@/components/AppHeader";

const coupons = [
  {
    id: "cp001",
    shop: "La Cave",
    shopCategory: "ワインバー",
    title: "ドリンク1杯無料",
    detail: "La Caveご来店時、ドリンク1杯を無料でご提供いたします。会員証と併せてご提示ください。",
    terms: "・1回のご来店につき1枚のみご利用可\n・他のクーポン・割引との併用不可\n・有効期限：2026年8月31日まで",
    expiry: "2026.08.31",
    used: false,
  },
  {
    id: "cp002",
    shop: "SOUND BAR HOWL",
    shopCategory: "ミュージックバー",
    title: "入場料20% OFF",
    detail: "SOUND BAR HOWLの入場料が20%OFFになります。COMMONSイベント開催日以外もご利用いただけます。",
    terms: "・1回のご来店につき1枚のみご利用可\n・COMMONSイベント開催日は適用外\n・有効期限：2026年9月30日まで",
    expiry: "2026.09.30",
    used: false,
  },
  {
    id: "cp003",
    shop: "THE THEATRE TABLE",
    shopCategory: "レストラン",
    title: "コース料理10% OFF",
    detail: "THE THEATRE TABLEのランチ・ディナーコース料金が10%OFFになります。要予約。",
    terms: "・ランチ・ディナーコース（4,000円以上）のみ対象\n・事前予約時にCOMMONS会員であることをお伝えください\n・有効期限：2026年10月31日まで",
    expiry: "2026.10.31",
    used: true,
  },
];

type Coupon = typeof coupons[0];

export default function CouponsPage() {
  const [selected, setSelected] = useState<Coupon | null>(null);
  const [usedIds, setUsedIds] = useState<Set<string>>(new Set(coupons.filter(c => c.used).map(c => c.id)));
  const [swipeStage, setSwipeStage] = useState<"idle" | "confirm" | "done">("idle");
  const startX = useRef(0);
  const [swipeX, setSwipeX] = useState(0);
  const isDragging = useRef(false);

  function openCoupon(c: Coupon) {
    setSelected(c);
    setSwipeStage("idle");
    setSwipeX(0);
  }

  function onDragStart(clientX: number) {
    startX.current = clientX;
    isDragging.current = true;
  }

  function onDragMove(clientX: number) {
    if (!isDragging.current) return;
    const dx = clientX - startX.current;
    if (dx > 0) setSwipeX(Math.min(dx, 240));
  }

  function onDragEnd() {
    if (!isDragging.current) return;
    isDragging.current = false;
    if (swipeX > 180) {
      setSwipeStage("confirm");
      setSwipeX(240);
    } else {
      setSwipeX(0);
    }
  }

  function onTouchStart(e: React.TouchEvent) { onDragStart(e.touches[0].clientX); }
  function onTouchMove(e: React.TouchEvent) { onDragMove(e.touches[0].clientX); }
  function onTouchEnd() { onDragEnd(); }
  function onMouseDown(e: React.MouseEvent) { onDragStart(e.clientX); }
  function onMouseMove(e: React.MouseEvent) { onDragMove(e.clientX); }
  function onMouseUp() { onDragEnd(); }
  function onMouseLeave() { if (isDragging.current) onDragEnd(); }

  function confirmUse() {
    if (!selected) return;
    setUsedIds(prev => new Set([...prev, selected.id]));
    setSwipeStage("done");
  }

  const available = coupons.filter(c => !usedIds.has(c.id));
  const used = coupons.filter(c => usedIds.has(c.id));

  if (selected) {
    const isUsed = usedIds.has(selected.id);
    return (
      <div className="flex justify-center bg-[var(--color-bg)] min-h-screen">
        <div className="w-full max-w-[430px] pb-24">
          <AppHeader backHref="/mypage/coupons" />
          <div className="px-5 pt-6">
            <div className="card overflow-hidden">
              {/* Coupon header */}
              <div className="px-5 pt-6 pb-5 border-b border-[var(--color-line)]">
                <div className="font-display text-[10px] tracking-[0.2em] text-[var(--color-accent-deep)] mb-1">{selected.shopCategory}</div>
                <div className="font-display text-2xl mb-1">{selected.title}</div>
                <div className="font-display text-sm text-[var(--color-mute)]">{selected.shop}</div>
                <div className="mt-3 font-display text-[10px] text-[var(--color-mute)]">有効期限：{selected.expiry}</div>
              </div>
              {/* Detail */}
              <div className="px-5 py-5 border-b border-[var(--color-line)]">
                <p className="font-display text-xs text-[var(--color-accent-deep)] mb-2">クーポン詳細</p>
                <p className="text-sm text-[var(--color-ink-soft)] leading-relaxed">{selected.detail}</p>
              </div>
              {/* Terms */}
              <div className="px-5 py-5 border-b border-[var(--color-line)]">
                <p className="font-display text-xs text-[var(--color-accent-deep)] mb-2">ご利用条件</p>
                <p className="text-xs text-[var(--color-mute)] leading-relaxed whitespace-pre-line">{selected.terms}</p>
              </div>
              {/* Swipe to use */}
              <div className="px-5 py-6">
                {isUsed || swipeStage === "done" ? (
                  <div className="text-center py-6">
                    <div className="font-display text-4xl mb-3">✓</div>
                    <div className="font-display text-lg text-[var(--color-accent-deep)]">使用済み</div>
                    <p className="font-display text-xs text-[var(--color-mute)] mt-2">このクーポンは利用済みです</p>
                  </div>
                ) : swipeStage === "confirm" ? (
                  <div className="text-center">
                    <p className="font-display text-sm mb-4 text-[var(--color-ink)]">このクーポンを使用しますか？</p>
                    <div className="flex gap-3">
                      <button
                        onClick={() => { setSwipeStage("idle"); setSwipeX(0); }}
                        className="flex-1 py-3 rounded-full border border-[var(--color-line)] font-display text-sm text-[var(--color-mute)]"
                      >
                        キャンセル
                      </button>
                      <button
                        onClick={confirmUse}
                        className="flex-1 py-3 rounded-full font-display text-sm"
                        style={{ background: "linear-gradient(135deg, #CBAE74, #B8985A)", color: "#0B0F16" }}
                      >
                        使用する
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <p className="font-display text-[10px] text-[var(--color-mute)] text-center mb-3">右にスワイプして使用する</p>
                    <div
                      className="relative h-14 rounded-full overflow-hidden select-none"
                      style={{ background: "var(--color-bg-soft)", border: "1px solid var(--color-line)", cursor: "grab" }}
                      onTouchStart={onTouchStart}
                      onTouchMove={onTouchMove}
                      onTouchEnd={onTouchEnd}
                      onMouseDown={onMouseDown}
                      onMouseMove={onMouseMove}
                      onMouseUp={onMouseUp}
                      onMouseLeave={onMouseLeave}
                    >
                      {/* Track fill */}
                      <div
                        className="absolute inset-y-0 left-0 rounded-full transition-none"
                        style={{
                          width: `calc(${swipeX}px + 56px)`,
                          background: `linear-gradient(90deg, #B8985A44, #CBAE7444)`,
                        }}
                      />
                      {/* Label */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="font-display text-sm text-[var(--color-mute)]" style={{ opacity: Math.max(0, 1 - swipeX / 100) }}>
                          → スワイプして使用
                        </span>
                      </div>
                      {/* Thumb */}
                      <div
                        className="absolute top-1 bottom-1 left-1 w-12 rounded-full flex items-center justify-center transition-none"
                        style={{
                          transform: `translateX(${swipeX}px)`,
                          background: "linear-gradient(135deg, #CBAE74, #B8985A)",
                        }}
                      >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0B0F16" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="9 18 15 12 9 6" />
                        </svg>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <button
              onClick={() => setSelected(null)}
              className="mt-4 w-full py-3 rounded-full border border-[var(--color-line)] font-display text-sm text-[var(--color-mute)]"
            >
              一覧に戻る
            </button>
          </div>
          <BottomNav />
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center bg-[var(--color-bg)] min-h-screen">
      <div className="w-full max-w-[430px] pb-24">
        <AppHeader backHref="/mypage" />
        <div className="px-5 pt-6 pb-3">
          <p className="font-display text-[10px] tracking-[0.2em] text-[var(--color-accent-deep)] mb-1">Member Benefits</p>
          <h1 className="font-display text-2xl">クーポン</h1>
        </div>

        {available.length > 0 && (
          <div className="px-5 mb-6">
            <p className="font-display text-xs text-[var(--color-mute)] mb-3">利用可能 {available.length}枚</p>
            <div className="space-y-3">
              {available.map(c => (
                <button
                  key={c.id}
                  onClick={() => openCoupon(c)}
                  className="w-full card p-5 text-left hover:border-[var(--color-accent)]/60 transition active:scale-[0.99]"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="font-display text-[10px] text-[var(--color-mute)] mb-1">{c.shopCategory} · {c.shop}</div>
                      <div className="font-display text-lg leading-snug">{c.title}</div>
                      <div className="font-display text-[10px] text-[var(--color-mute)] mt-2">期限：{c.expiry}</div>
                    </div>
                    <div
                      className="flex-none w-12 h-12 rounded-full flex items-center justify-center"
                      style={{ background: "linear-gradient(135deg, #CBAE74, #B8985A)" }}
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0B0F16" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="9 18 15 12 9 6" />
                      </svg>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {used.length > 0 && (
          <div className="px-5">
            <p className="font-display text-xs text-[var(--color-mute)] mb-3">使用済み {used.length}枚</p>
            <div className="space-y-3">
              {used.map(c => (
                <button
                  key={c.id}
                  onClick={() => openCoupon(c)}
                  className="w-full card p-5 text-left opacity-50"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="font-display text-[10px] text-[var(--color-mute)] mb-1">{c.shopCategory} · {c.shop}</div>
                      <div className="font-display text-lg leading-snug">{c.title}</div>
                      <div className="font-display text-[10px] text-[var(--color-mute)] mt-2">期限：{c.expiry}</div>
                    </div>
                    <span className="tag text-[10px]">使用済</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        <BottomNav />
      </div>
    </div>
  );
}
