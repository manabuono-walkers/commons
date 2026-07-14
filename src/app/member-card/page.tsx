"use client";
import { useRouter } from "next/navigation";

export default function MemberCardPage() {
  const router = useRouter();

  return (
    <div className="flex justify-center bg-[var(--color-bg)] min-h-screen">
      <div className="w-full max-w-[430px] pb-16">
        <header className="sticky top-0 z-40 bg-[var(--color-bg)]/95 backdrop-blur-md border-b border-[var(--color-line)] px-5 py-3">
          <div className="flex items-center justify-between">
            <button onClick={() => router.back()} className="font-display text-sm text-[var(--color-mute)] hover:text-[var(--color-ink)] transition">← 戻る</button>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/logo.png" alt="COMMONS" style={{ height: 24, width: "auto", objectFit: "contain" }} />
            <div className="w-14" />
          </div>
        </header>

        <div className="px-5 pt-8 space-y-6">
          <div>
            <p className="font-display text-[10px] tracking-[0.2em] text-[var(--color-accent-deep)] mb-1">Membership</p>
            <h1 className="font-display text-2xl">会員証</h1>
            <p className="font-display text-xs text-[var(--color-mute)] mt-1">提携店舗でこの画面を提示してください</p>
          </div>

          {/* Card */}
          <div
            className="rounded-3xl overflow-hidden border border-[var(--color-accent)]/40 p-6 relative"
            style={{ background: "linear-gradient(135deg, #141A24, #1e2a38)" }}
          >
            {/* Background decoration */}
            <div className="absolute inset-0 opacity-10" style={{ background: "radial-gradient(circle at 80% 20%, #CBAE74 0%, transparent 60%)" }} />

            <div className="relative">
              <div className="font-display text-[10px] tracking-[0.3em] text-[var(--color-accent-deep)] mb-8">COMMONS MEMBER CARD</div>

              <div className="flex items-end justify-between mb-8">
                <div>
                  <div className="num text-4xl tracking-widest" style={{ color: "var(--color-accent-deep)" }}>No.0824</div>
                  <div className="font-display text-xl mt-3">青山 陸</div>
                  <div className="font-display text-xs text-[var(--color-mute)] mt-1">東京支部 · 2025年11月入会</div>
                </div>
                <div className="text-right space-y-2">
                  <div className="tag tag-accent text-xs">GOLD</div>
                  <div className="font-display text-xs text-[var(--color-mute)]">Lv.3</div>
                  <div className="num text-lg" style={{ color: "var(--color-accent-deep)" }}>1,840 pt</div>
                </div>
              </div>

              {/* Barcode area */}
              <div className="pt-4 border-t border-[var(--color-line)]/40">
                <div className="w-full h-16 flex items-center justify-center">
                  <div className="font-display text-5xl tracking-[0.15em] text-[var(--color-accent-deep)]/25 select-none">
                    |||||||||||||||||||||||||||
                  </div>
                </div>
                <div className="num text-[10px] text-[var(--color-mute)] text-center mt-1">0824-2511-7834-5621</div>
              </div>
            </div>
          </div>

          {/* Benefits */}
          <div className="card p-5 space-y-3">
            <p className="font-display text-xs text-[var(--color-accent-deep)]">GOLD会員特典</p>
            {[
              { label: "提携店舗割引", val: "最大15% OFF" },
              { label: "イベント優先予約", val: "一般の48時間前から" },
              { label: "ゲスト招待", val: "月1名まで無料" },
              { label: "ポイント倍率", val: "通常の1.5倍" },
            ].map(b => (
              <div key={b.label} className="flex items-center justify-between text-sm">
                <span className="font-display text-[var(--color-mute)]">{b.label}</span>
                <span className="font-display text-[var(--color-accent-deep)]">{b.val}</span>
              </div>
            ))}
          </div>

          {/* Rank progress */}
          <div className="card p-5">
            <div className="flex items-center justify-between mb-3">
              <p className="font-display text-xs text-[var(--color-accent-deep)]">次のランクまで</p>
              <p className="font-display text-xs text-[var(--color-mute)]">PLATINUM まであと3回</p>
            </div>
            <div className="h-1.5 bg-[var(--color-line)] rounded-full">
              <div className="h-1.5 rounded-full" style={{ width: "72%", background: "var(--color-accent-deep)" }} />
            </div>
          </div>

          <button onClick={() => router.back()} className="w-full btn-outline justify-center mb-4">
            戻る
          </button>
        </div>
      </div>
    </div>
  );
}
