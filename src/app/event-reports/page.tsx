"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import BottomNav from "@/components/BottomNav";

const reports = [
  {
    href: "/event-report-2",
    img: "/images/eventrepo2.png",
    label: "COMMONS WINE NIGHT Vol.15 開催レポート",
    meta: "7月5日（土）· La Cave 麻布十番 · 24名",
    date: "2026.07.05",
    body: "ブルゴーニュの造り手を巡る全6本のテイスティング。ソムリエによる解説付きで、ワイン初心者の方にも好評でした。当日はクリスマスシーズンに向けたスパークリングの選び方講座も実施。参加者同士のMBTI診断を使ったアイスブレイクから始まり、席替えを挟みながら和やかに交流いただきました。",
  },
  {
    href: "/event-report",
    img: "/images/eventrepo.png",
    label: "AGE 26+ NIGHT 開催レポート",
    meta: "6月26日（金）· THE THEATRE TABLE · 65名",
    date: "2026.06.26",
    body: "26歳以上の会員限定で開催した大型交流イベント。65名にご参加いただき、業種を越えたつながりが生まれました。MBTIタイプ別のテーブル分けを試験導入し、初対面でも会話が続くと高評価。次回は冬のクリスマスパーティーとして12月に開催予定です。",
  },
];

export default function EventReportsPage() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const q = query.trim().toLowerCase();
  const shown = q
    ? reports.filter(r => r.label.toLowerCase().includes(q) || r.body.toLowerCase().includes(q))
    : reports;

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
          <h1 className="font-display text-xl font-semibold tracking-wide">EVENT REPORT</h1>
          <p className="mt-2 text-xs text-[var(--color-mute)]">開催されたイベントのレポートをご覧いただけます。</p>
        </div>

        {/* フリーワード検索 */}
        <div className="px-5 pt-4 pb-3 border-b border-[var(--color-line)]">
          <div className="relative">
            <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-[var(--color-mute)]"
              width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input
              type="text"
              placeholder="キーワードで検索…（例：MBTI、クリスマス）"
              value={query}
              onChange={e => setQuery(e.target.value)}
              className="w-full bg-[var(--color-bg-soft)] border border-[var(--color-line)] rounded-full pl-9 pr-8 py-2.5 text-sm outline-none focus:border-[var(--color-accent)]/60 placeholder-[var(--color-mute)] transition font-display"
            />
            {query && (
              <button onClick={() => setQuery("")} aria-label="検索をクリア" className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--color-mute)]">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            )}
          </div>
          {query && (
            <p className="font-display text-[11px] text-[var(--color-mute)] mt-2">
              <span className="num">{shown.length}</span>件のレポートが見つかりました
            </p>
          )}
        </div>

        {/* Report list */}
        <div className="px-5 pt-6 space-y-5">
          {shown.length === 0 && (
            <p className="font-display text-xs text-[var(--color-mute)] py-10 text-center">
              「{query}」に一致するレポートはありません。
            </p>
          )}
          {shown.map((r) => (
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
                  <div className="num text-xs text-white/50 mb-1">{r.date}</div>
                  <div
                    className="text-sm leading-snug text-white font-medium pr-4 break-words"
                    style={{ fontFamily: "var(--font-shippori)" }}
                  >
                    {r.label}
                  </div>
                </div>
              </div>
              {/* Footer */}
              <div className="px-4 pt-3 bg-[var(--color-bg-soft)]">
                <p className="text-[11px] text-[var(--color-ink-soft)] leading-relaxed line-clamp-2">{r.body}</p>
              </div>
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
