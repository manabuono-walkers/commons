"use client";
import Link from "next/link";
import BottomNav from "@/components/BottomNav";

export default function Campaign2Page() {
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

        {/* Hero image */}
        <div className="relative h-[280px] overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/campaign2.jpeg" alt="新ポイント制度" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(11,15,22,1) 0%, rgba(11,15,22,0.2) 60%, transparent 100%)" }} />
          <div className="absolute bottom-0 left-0 right-0 px-5 pb-6">
            <p className="font-display text-[10px] tracking-[0.2em] text-[var(--color-accent-deep)] mb-2">CAMPAIGN</p>
            <h1 className="font-display text-3xl leading-tight text-white">新ポイント制度<br />スタート</h1>
          </div>
        </div>

        {/* Meta info */}
        <div className="px-5 py-5 border-b border-[var(--color-line)]">
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "単位", value: "XP（経験値）" },
              { label: "開始", value: "2026年7月" },
              { label: "対象", value: "全会員" },
            ].map(item => (
              <div key={item.label} className="text-center">
                <div className="font-display text-[10px] text-[var(--color-mute)] mb-1">{item.label}</div>
                <div className="font-display text-xs text-[var(--color-ink-soft)]">{item.value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Body */}
        <div className="px-5 py-7 space-y-6">

          <section>
            <h2 className="font-display text-xs text-[var(--color-accent-deep)] tracking-[0.1em] mb-4">制度概要</h2>
            <div className="space-y-4 text-sm text-[var(--color-ink-soft)] leading-[1.9]">
              <p>
                COMMONSに<strong className="text-[var(--color-ink)] font-normal">新しいポイント制度「XP（経験値）」</strong>が導入されました。
              </p>
              <p>
                イベントへの参加・コミュニティへの投稿・友達紹介など、様々なアクティビティでXPを獲得できます。貯まったXPはランクアップに直結し、より多くの特典が解放されます。
              </p>
              <p>
                ランクはSILVER・GOLD・PLATINUMの3段階。上位ランクになるほど、イベント優先予約・提携店舗割引率アップなどの特典が充実します。
              </p>
            </div>
          </section>

          <div className="h-px bg-[var(--color-line)]" />

          <section>
            <h2 className="font-display text-xs text-[var(--color-accent-deep)] tracking-[0.1em] mb-4">XP獲得方法</h2>
            <div className="space-y-2">
              {[
                { action: "イベント参加", xp: "+200 XP" },
                { action: "コミュニティ投稿", xp: "+50 XP" },
                { action: "友達紹介", xp: "+300 XP" },
                { action: "提携店舗利用", xp: "+100 XP" },
                { action: "クラブ参加", xp: "+150 XP" },
              ].map(item => (
                <div key={item.action} className="card p-4 flex items-center justify-between">
                  <span className="font-display text-sm">{item.action}</span>
                  <span className="num text-sm" style={{ color: "var(--color-accent-deep)" }}>{item.xp}</span>
                </div>
              ))}
            </div>
          </section>

          <div className="h-px bg-[var(--color-line)]" />

          <section>
            <h2 className="font-display text-xs text-[var(--color-accent-deep)] tracking-[0.1em] mb-4">ランク基準</h2>
            <div className="space-y-2">
              {[
                { rank: "SILVER", range: "0 〜 1,999 XP", color: "#8E8A80" },
                { rank: "GOLD", range: "2,000 〜 4,999 XP", color: "#B8985A" },
                { rank: "PLATINUM", range: "5,000 XP 〜", color: "#e2e8f0" },
              ].map(r => (
                <div key={r.rank} className="card p-4 flex items-center justify-between">
                  <span className="font-display text-sm" style={{ color: r.color }}>{r.rank}</span>
                  <span className="font-display text-xs text-[var(--color-mute)]">{r.range}</span>
                </div>
              ))}
            </div>
          </section>

          <div className="pt-2">
            <Link
              href="/rank-detail"
              className="block w-full py-4 rounded-full font-display text-sm text-center transition-all hover:opacity-90 active:scale-95"
              style={{ background: "linear-gradient(135deg, #CBAE74, #B8985A)", color: "#0B0F16" }}
            >
              ランク詳細を見る
            </Link>
          </div>
        </div>

        <BottomNav />
      </div>
    </div>
  );
}
