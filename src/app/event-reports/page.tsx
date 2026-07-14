"use client";
import Link from "next/link";
import BottomNav from "@/components/BottomNav";

const reports = [
  {
    href: "/event-report-2",
    img: "/images/eventrepo2.png",
    label: "COMMONS WINE NIGHT Vol.15 開催レポート",
    meta: "7月5日（土）· La Cave 麻布十番 · 24名",
    date: "2026.07.05",
  },
  {
    href: "/event-report",
    img: "/images/eventrepo.png",
    label: "AGE 26+ NIGHT 開催レポート",
    meta: "6月26日（金）· THE THEATRE TABLE · 65名",
    date: "2026.06.26",
  },
];

export default function EventReportsPage() {
  return (
    <div className="flex justify-center bg-[var(--color-bg)] min-h-screen">
      <div className="w-full max-w-[430px] pb-24">

        {/* Header */}
        <header className="sticky top-0 z-40 bg-[var(--color-bg)]/95 backdrop-blur-md border-b border-[var(--color-line)] px-5 py-3 flex items-center justify-between">
          <Link href="/home" className="font-display text-sm text-[var(--color-mute)] hover:text-[var(--color-ink)] transition">← 戻る</Link>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/logo.png" alt="COMMONS" style={{ height: 24, width: "auto", objectFit: "contain" }} />
          <span className="w-12" />
        </header>

        {/* Page title */}
        <div className="px-5 pt-8 pb-6 border-b border-[var(--color-line)]">
          <div className="font-display text-[10px] tracking-[0.2em] text-[var(--color-accent-deep)] mb-2">ARCHIVES</div>
          <h1 className="font-display text-2xl">EVENT REPORT</h1>
          <p className="mt-2 text-xs text-[var(--color-mute)]">開催されたイベントのレポートをご覧いただけます。</p>
        </div>

        {/* Report list */}
        <div className="px-5 pt-6 space-y-5">
          {reports.map((r) => (
            <Link key={r.href} href={r.href} className="block rounded-2xl overflow-hidden border border-[var(--color-line)] hover:border-[var(--color-accent)]/60 transition group">
              {/* Image */}
              <div className="relative h-[180px]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={r.img} alt="" className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500" />
                <div className="absolute inset-0" style={{ background: "linear-gradient(160deg, rgba(11,15,22,0.45) 0%, rgba(11,15,22,0.75) 100%)" }} />
                <div className="absolute top-4 left-4">
                  <div className="font-display text-[9px] tracking-[0.2em] text-[var(--color-accent-deep)]">EVENT REPORT</div>
                </div>
                <div className="absolute bottom-4 left-4">
                  <div className="num text-sm text-white/50 mb-1">{r.date}</div>
                  <div className="font-display text-lg leading-tight text-white">{r.label}</div>
                </div>
              </div>
              {/* Footer */}
              <div className="px-4 py-3 bg-[var(--color-bg-soft)] flex items-center justify-between">
                <p className="text-[10px] text-[var(--color-mute)]">{r.meta}</p>
                <span className="font-display text-[10px] text-[var(--color-accent-deep)] flex items-center gap-1">
                  読む
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
