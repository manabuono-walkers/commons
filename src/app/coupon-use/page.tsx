"use client";
import { useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import AppHeader from "@/components/AppHeader";

export default function CouponUsePage() {
  const router = useRouter();
  const [used, setUsed] = useState(false);
  const [slideX, setSlideX] = useState(0);
  const [dragging, setDragging] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);
  const startXRef = useRef(0);
  const THUMB_W = 56;

  function getTrackWidth() {
    return (trackRef.current?.clientWidth ?? 280) - THUMB_W;
  }

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    setDragging(true);
    startXRef.current = e.clientX - slideX;
  }, [slideX]);

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!dragging) return;
    const max = getTrackWidth();
    const next = Math.max(0, Math.min(e.clientX - startXRef.current, max));
    setSlideX(next);
  }, [dragging]);

  const onPointerUp = useCallback(() => {
    if (!dragging) return;
    setDragging(false);
    const max = getTrackWidth();
    if (slideX > max * 0.75) {
      setSlideX(max);
      setUsed(true);
    } else {
      setSlideX(0);
    }
  }, [dragging, slideX]);

  const progress = used ? 1 : slideX / Math.max(1, getTrackWidth());

  if (used) {
    return (
      <div className="flex justify-center bg-[var(--color-bg)] min-h-screen">
        <div className="w-full max-w-[430px] flex flex-col items-center justify-center px-8 py-20 text-center">
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center mb-6"
            style={{ background: "linear-gradient(135deg, #CBAE74, #B8985A)" }}
          >
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#0B0F16" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <h1 className="font-display text-2xl mb-2">クーポンを使用しました</h1>
          <p className="text-sm text-[var(--color-mute)] leading-relaxed mb-8">
            スタッフに画面を提示してください。<br />ご利用ありがとうございます。
          </p>
          <button
            onClick={() => router.back()}
            className="btn-primary justify-center"
          >
            戻る
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center bg-[var(--color-bg)] min-h-screen">
      <div className="w-full max-w-[430px]">
        <AppHeader backHref="/stores" />

        <div className="px-5 pt-8 pb-10 flex flex-col items-center">
          <div className="font-display text-[10px] tracking-[0.2em] text-[var(--color-accent-deep)] mb-2">COUPON</div>
          <h1 className="font-display text-2xl mb-1">クーポン使用</h1>
          <p className="text-xs text-[var(--color-mute)] mb-10">スライドしてクーポンを使用する</p>

          {/* Coupon card */}
          <div
            className="w-full rounded-2xl p-6 mb-10 relative overflow-hidden"
            style={{ background: "linear-gradient(135deg, #1a1408, #2a1f0a)", border: "1px solid rgba(184,152,90,0.4)" }}
          >
            <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at 30% 50%, rgba(203,174,116,0.12) 0%, transparent 70%)" }} />
            <div className="relative">
              <div className="font-display text-[10px] tracking-[0.2em] text-[var(--color-accent-deep)] mb-3">COMMONS MEMBER COUPON</div>
              <div className="font-display text-4xl text-[var(--color-accent-deep)] mb-1">20% OFF</div>
              <div className="font-display text-xs text-[var(--color-mute)] mb-5">全提携店舗共通 · 一回限り有効</div>
              <div className="h-px mb-5" style={{ background: "repeating-linear-gradient(90deg, rgba(184,152,90,0.3) 0, rgba(184,152,90,0.3) 6px, transparent 6px, transparent 12px)" }} />
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-display text-[10px] text-[var(--color-mute)]">有効期限</div>
                  <div className="num text-sm text-[var(--color-ink)]">2026年07月31日</div>
                </div>
                <div className="text-right">
                  <div className="font-display text-[10px] text-[var(--color-mute)]">コード</div>
                  <div className="num text-sm tracking-widest text-[var(--color-accent-deep)]">CMN-2026</div>
                </div>
              </div>
            </div>
          </div>

          {/* Slide track */}
          <div className="w-full px-0">
            <div
              ref={trackRef}
              className="relative rounded-full select-none"
              style={{
                height: 64,
                background: `linear-gradient(90deg, rgba(203,174,116,${0.18 + progress * 0.22}) ${progress * 100}%, rgba(39,44,53,0.8) ${progress * 100}%)`,
                border: "1px solid rgba(184,152,90,0.35)",
                overflow: "hidden",
              }}
            >
              {/* Track label */}
              <div
                className="absolute inset-0 flex items-center justify-center font-display text-sm pointer-events-none transition-opacity duration-200"
                style={{ color: "rgba(184,152,90,0.6)", opacity: 1 - progress }}
              >
                → スライドして使用
              </div>

              {/* Thumb */}
              <div
                className="absolute top-1 bottom-1 rounded-full flex items-center justify-center cursor-grab active:cursor-grabbing touch-none"
                style={{
                  width: THUMB_W,
                  left: slideX,
                  background: "linear-gradient(135deg, #CBAE74, #B8985A)",
                  boxShadow: "0 2px 12px rgba(184,152,90,0.5)",
                  transition: dragging ? "none" : "left 0.25s cubic-bezier(0.25,0.46,0.45,0.94)",
                }}
                onPointerDown={onPointerDown}
                onPointerMove={onPointerMove}
                onPointerUp={onPointerUp}
                onPointerCancel={onPointerUp}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0B0F16" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </div>
            </div>

            <p className="text-center font-display text-[10px] text-[var(--color-mute)] mt-4">
              右へスライドすると使用済みになります
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
