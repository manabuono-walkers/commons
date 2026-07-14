"use client";
import Link from "next/link";
import BottomNav from "@/components/BottomNav";
import AppHeader from "@/components/AppHeader";

const notices = [
  { id: 1, badge: "お知らせ", text: "7月のイベントスケジュールを公開しました。先着・抽選あわせて6件です。", time: "2時間前" },
  { id: 2, badge: "システム", text: "アプリv2.1.0リリース。COMMONS CLUBチャット・意見箱が追加されました。", time: "2日前" },
  { id: 3, badge: "提携店舗", text: "7月1日〜7月7日、全提携店舗で会員証提示により飲食代金が20%OFFになります。", time: "3日前" },
];

const campaigns = [
  {
    href: "/campaign-1",
    img: "/images/campaign1.jpeg",
    label: "友達紹介キャンペーン",
    meta: "紹介するだけで500ptプレゼント",
  },
  {
    href: "/campaign-2",
    img: "/images/campaign2.jpeg",
    label: "新ポイント制度スタート",
    meta: "イベント参加でXPが貯まる新制度",
  },
];

const reports = [
  {
    href: "/event-report-2",
    img: "/images/eventrepo2.png",
    label: "COMMONS WINE NIGHT Vol.15",
    meta: "7月5日（土）· La Cave · 24名",
  },
  {
    href: "/event-report",
    img: "/images/eventrepo.png",
    label: "AGE 26+ NIGHT 開催レポート",
    meta: "6月26日（金）· THE THEATRE TABLE · 65名",
  },
];

export default function HomePage() {
  return (
    <div className="flex justify-center bg-[var(--color-bg)] min-h-screen">
      <div className="w-full max-w-[430px] pb-24">
        <AppHeader />

        <main className="px-5 pt-5 space-y-8">
          {/* 全体お知らせ */}
          <section>
            <div className="flex items-baseline justify-between mb-4">
              <h2 className="font-display text-lg">全体お知らせ</h2>
              <Link href="/notifications" className="font-display text-xs text-[var(--color-accent-deep)]">すべて見る →</Link>
            </div>
            <div className="space-y-3">
              {notices.map((n) => (
                <div key={n.id} className="card p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="tag tag-accent">{n.badge}</span>
                    <span className="font-display text-xs text-[var(--color-mute)]">{n.time}</span>
                  </div>
                  <p className="text-sm text-[var(--color-ink-soft)] leading-relaxed">{n.text}</p>
                </div>
              ))}
            </div>
          </section>

          {/* キャンペーン */}
          <section>
            <div className="flex items-baseline justify-between mb-4">
              <h2 className="font-display text-lg">キャンペーン</h2>
              <Link href="/campaigns" className="font-display text-xs text-[var(--color-accent-deep)]">すべてを見る →</Link>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-2 -mx-5 px-5 snap-x snap-mandatory scrollbar-muted">
              {campaigns.map((c) => (
                <a key={c.href} href={c.href} className="flex-none w-[300px] rounded-2xl overflow-hidden snap-start relative" style={{ minHeight: 160 }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={c.img} alt="" className="absolute inset-0 w-full h-full object-cover" />
                </a>
              ))}
            </div>
          </section>

          {/* 全体イベントレポ */}
          <section>
            <div className="flex items-baseline justify-between mb-4">
              <h2 className="font-display text-lg">全体イベントレポ</h2>
              <Link href="/event-reports" className="font-display text-xs text-[var(--color-accent-deep)]">すべてを見る →</Link>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-2 -mx-5 px-5 snap-x snap-mandatory scrollbar-muted">
              {reports.map((r) => (
                <a key={r.href} href={r.href} className="flex-none w-[300px] rounded-2xl overflow-hidden snap-start relative" style={{ minHeight: 170 }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={r.img} alt="" className="absolute inset-0 w-full h-full object-cover" />
                  <div className="absolute inset-0" style={{ background: "linear-gradient(160deg, rgba(11,15,22,0.55) 0%, rgba(11,15,22,0.8) 100%)" }} />
                  <div className="relative z-10 p-6 flex flex-col justify-between" style={{ minHeight: 170 }}>
                    <div className="font-display text-[10px] tracking-[0.2em] text-[var(--color-accent-deep)]">EVENT REPORT</div>
                    <div>
                      <div className="font-display text-xl leading-tight text-white mt-2">{r.label}</div>
                      <div className="mt-1.5 text-[10px] text-white/55">{r.meta}</div>
                      <div className="mt-3 inline-flex items-center gap-1.5 font-display text-[10px] tracking-[0.06em] text-[var(--color-accent-deep)] border border-[var(--color-accent)]/35 rounded-full px-3.5 py-1.5 bg-black/20">
                        レポートを読む
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
                      </div>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </section>

        </main>

        <BottomNav />
      </div>
    </div>
  );
}
