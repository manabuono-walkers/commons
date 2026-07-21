"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import BottomNav from "@/components/BottomNav";

const campaigns = [
  {
    href: "/campaign-1",
    img: "/images/campaign1.jpeg",
    label: "友達紹介キャンペーン",
    meta: "紹介するだけで500ptプレゼント",
    period: "〜2026年7月31日",
    badge: "開催中",
  },
  {
    href: "/campaign-2",
    img: "/images/campaign2.jpeg",
    label: "新ポイント制度スタート",
    meta: "イベント参加でXPが貯まる新制度",
    period: "2026年7月〜",
    badge: "NEW",
  },
];

export default function CampaignsPage() {
  const router = useRouter();
  return (
    <div className="flex justify-center bg-[var(--color-bg)] min-h-screen">
      <div className="w-full max-w-[430px] pb-24">

        {/* Header */}
        <header className="sticky top-0 z-40 bg-[var(--color-bg)]/95 backdrop-blur-md border-b border-[var(--color-line)] px-5 py-3 flex items-center justify-between">
          <button onClick={() => router.back()} className="font-display text-sm text-[var(--color-mute)] hover:text-[var(--color-ink)] transition">← 戻る</button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/logo.png" alt="COMMONS" style={{ height: 24, width: "auto", objectFit: "contain" }} />
          <span className="w-12" />
        </header>

        {/* Page title */}
        <div className="px-5 pt-8 pb-6 border-b border-[var(--color-line)]">
          <div className="font-display text-[10px] tracking-[0.2em] text-[var(--color-accent-deep)] mb-2">ARCHIVES</div>
          <h1 className="font-display text-2xl">キャンペーン</h1>
          <p className="mt-2 text-xs text-[var(--color-mute)]">開催中・過去のキャンペーン一覧です。</p>
        </div>

        {/* Campaign list */}
        <div className="px-5 pt-6 space-y-5">
          {campaigns.map((c) => (
            <Link key={c.href} href={c.href} className="block rounded-2xl overflow-hidden border border-[var(--color-line)] hover:border-[var(--color-accent)]/60 transition group">
              {/* Image */}
              <div className="relative h-[200px]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={c.img} alt="" className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500" />
                <div className="absolute inset-0" style={{ background: "linear-gradient(160deg, rgba(11,15,22,0.3) 0%, rgba(11,15,22,0.7) 100%)" }} />
                <div className="absolute top-4 left-4">
                  <span className="font-display text-[10px] tracking-[0.15em] px-2.5 py-1 rounded-full border border-[var(--color-accent)]/50 text-[var(--color-accent-deep)] bg-black/30">{c.badge}</span>
                </div>
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="font-display text-[9px] tracking-[0.2em] text-[var(--color-accent-deep)] mb-1">CAMPAIGN</div>
                  <div className="font-display text-xl leading-tight text-white">{c.label}</div>
                </div>
              </div>
              {/* Footer */}
              <div className="px-4 py-3 bg-[var(--color-bg-soft)] flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-[var(--color-mute)]">{c.meta}</p>
                  <p className="text-[10px] text-[var(--color-mute)] mt-0.5">期間: {c.period}</p>
                </div>
                <span className="font-display text-[10px] text-[var(--color-accent-deep)] flex items-center gap-1">
                  詳細
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
                </span>
              </div>
            </Link>
          ))}
        </div>

        <BottomNav />
      </div>
    </div>
  );
}
