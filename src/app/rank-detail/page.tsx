"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import BottomNav from "@/components/BottomNav";

const ranks = [
  {
    id: "standard",
    label: "スタンダード",
    labelEn: "STANDARD",
    color: "#8E8A80",
    bg: "rgba(142,138,128,0.08)",
    border: "rgba(142,138,128,0.25)",
    xpNeeded: 100,
    perks: [
      "名前横にランクアイコン表示",
      "COMMONS CLUBへの応募",
    ],
    current: false,
    achieved: true,
  },
  {
    id: "bronze",
    label: "ブロンズ",
    labelEn: "BRONZE",
    color: "#A07840",
    bg: "rgba(160,120,64,0.08)",
    border: "rgba(160,120,64,0.25)",
    xpNeeded: 800,
    perks: [
      "スタンダード特典を継承",
      "イベントクーポン（500円 OFF）",
      "CLUBイベント開催可能",
    ],
    current: false,
    achieved: true,
  },
  {
    id: "silver",
    label: "シルバー",
    labelEn: "SILVER",
    color: "#9BB0BA",
    bg: "rgba(155,176,186,0.08)",
    border: "rgba(155,176,186,0.25)",
    xpNeeded: 2000,
    perks: [
      "ブロンズ特典を継承",
      "イベントクーポン（1,000円 OFF）",
      "シルバー会員以上限定イベント招待",
    ],
    current: false,
    achieved: true,
  },
  {
    id: "gold",
    label: "ゴールド",
    labelEn: "GOLD",
    color: "#B8985A",
    bg: "rgba(184,152,90,0.10)",
    border: "rgba(184,152,90,0.35)",
    xpNeeded: 5000,
    perks: [
      "シルバー特典を継承",
      "会員費免除",
      "イベント参加確約権利",
      "競争率の高いイベントへの優先参加",
    ],
    current: true,
    achieved: true,
  },
  {
    id: "platinum",
    label: "プラチナ",
    labelEn: "PLATINUM",
    color: "#C8D8E0",
    bg: "rgba(200,216,224,0.06)",
    border: "rgba(200,216,224,0.2)",
    xpNeeded: 10000,
    perks: [
      "ゴールド特典を継承",
      "月1回イベント無償招待",
      "シークレット・プラチナイベント（運営との接点）",
      "日常では体験できない限定コンテンツ",
    ],
    current: false,
    achieved: false,
  },
];

const xpActions = [
  { action: "自己紹介投稿", xp: "100 XP", note: "最初のミッション・一回限り", href: "/community" },
  { action: "イベント参加", xp: "300 XP", note: "支払い完了時に加算", href: "/events" },
  { action: "タイムライン・クラブ投稿", xp: "1〜 XP", note: "発言数に応じて変動", href: "/community" },
  { action: "CLUBイベント主催・企画", xp: "200 XP", note: "開催完了で加算", href: "/clubs" },
  { action: "継続利用ボーナス", xp: "100 XP", note: "毎月自動加算", href: null },
  { action: "手動付与（運営判断）", xp: "任意", note: "キャンペーン等で利用", href: null },
];

const CURRENT_XP = 1840;
const NEXT_XP = 5000;
const PROGRESS = Math.min(Math.round((CURRENT_XP / NEXT_XP) * 100), 100);

export default function RankDetailPage() {
  const router = useRouter();
  return (
    <div className="flex justify-center bg-[var(--color-bg)] min-h-screen">
      <div className="w-full max-w-[430px] pb-24">
        <header className="sticky top-0 z-40 bg-[var(--color-bg)]/95 backdrop-blur-md border-b border-[var(--color-line)] px-5 py-3 flex items-center justify-between">
          <button onClick={() => router.back()} className="font-display text-sm text-[var(--color-mute)] hover:text-[var(--color-ink)] transition">← 戻る</button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/logo.png" alt="COMMONS" style={{ height: 24, width: "auto", objectFit: "contain" }} />
          <span className="w-12" />
        </header>

        <main className="px-5 pt-8 pb-8 space-y-8">
          <div>
            <p className="font-display text-[10px] tracking-[0.2em] text-[var(--color-accent-deep)] mb-1">MEMBERSHIP RANK</p>
            <h1 className="font-display text-3xl">ランク制度</h1>
            <p className="text-xs text-[var(--color-mute)] mt-2 leading-relaxed">XPを獲得してランクアップ。ランクに応じた特典が解放されます。</p>
          </div>

          {/* 現在のXP・ランク */}
          <section className="card p-5">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="font-display text-xs text-[var(--color-mute)] mb-1">現在のランク</div>
                <div className="font-display text-3xl" style={{ color: "#B8985A" }}>GOLD</div>
                <div className="font-display text-sm text-[var(--color-mute)]">ゴールド</div>
              </div>
              <div className="text-right">
                <div className="font-display text-xs text-[var(--color-mute)] mb-1">保有XP</div>
                <div className="num text-2xl" style={{ color: "#B8985A" }}>1,840</div>
                <div className="font-display text-[10px] text-[var(--color-mute)]">XP</div>
              </div>
            </div>
            <div className="mb-2 flex items-center justify-between text-xs font-display text-[var(--color-mute)]">
              <span>次のランク：PLATINUM</span>
              <span>あと {(NEXT_XP - CURRENT_XP).toLocaleString()} XP</span>
            </div>
            <div className="h-2 bg-[var(--color-line)] rounded-full">
              <div className="h-2 rounded-full" style={{ width: `${PROGRESS}%`, background: "linear-gradient(90deg, #B8985A, #CBAE74)" }} />
            </div>
            <div className="mt-1 text-right font-display text-[10px] text-[var(--color-mute)]">
              {CURRENT_XP.toLocaleString()} / {NEXT_XP.toLocaleString()} XP
            </div>
          </section>

          {/* XP獲得アクション */}
          <section>
            <div className="font-display text-xs text-[var(--color-mute)] mb-3">XPを獲得する方法</div>
            <div className="card overflow-hidden divide-y divide-[var(--color-line)]">
              {xpActions.map((a, i) => (
                a.href ? (
                  <Link key={i} href={a.href} className="flex items-center justify-between px-4 py-3 hover:bg-[var(--color-bg-soft)] transition">
                    <div>
                      <div className="font-display text-sm">{a.action}</div>
                      <div className="font-display text-[10px] text-[var(--color-mute)] mt-0.5">{a.note}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="tag tag-accent font-display text-[10px]">{a.xp}</span>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--color-mute)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
                    </div>
                  </Link>
                ) : (
                  <div key={i} className="flex items-center justify-between px-4 py-3">
                    <div>
                      <div className="font-display text-sm">{a.action}</div>
                      <div className="font-display text-[10px] text-[var(--color-mute)] mt-0.5">{a.note}</div>
                    </div>
                    <span className="tag font-display text-[10px]">{a.xp}</span>
                  </div>
                )
              ))}
            </div>
          </section>

          {/* ランク一覧 */}
          <section className="space-y-4">
            <div className="font-display text-xs text-[var(--color-mute)]">全ランク一覧</div>
            {ranks.map((r, idx) => (
              <div
                key={r.id}
                className="rounded-2xl border p-5"
                style={{ background: r.bg, borderColor: r.border }}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-display text-xl" style={{ color: r.color }}>{r.labelEn}</span>
                    <span className="font-display text-sm text-[var(--color-mute)]">（{r.label}）</span>
                    {r.current && <span className="tag tag-accent text-[9px]">現在のランク</span>}
                    {r.achieved && !r.current && <span className="font-display text-[10px] text-[var(--color-mute)]">✓ 達成済み</span>}
                  </div>
                  {idx < ranks.length - 1 && (
                    <div className="text-right flex-none">
                      <div className="num text-sm" style={{ color: r.color }}>{r.xpNeeded.toLocaleString()}</div>
                      <div className="font-display text-[9px] text-[var(--color-mute)]">XP到達</div>
                    </div>
                  )}
                </div>
                <ul className="space-y-1.5">
                  {r.perks.map((p, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-[var(--color-mute)]">
                      <span style={{ color: r.color }} className="flex-none mt-0.5">·</span>
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            <p className="text-[10px] text-[var(--color-mute)] leading-relaxed px-1">
              ※ 月1回イベント参加 + 2ヶ月継続でブロンズに到達。<br />
              ※ プロフィール画面にプログレスバーで現在XP／次ランクまでの必要XPを表示。
            </p>
          </section>
        </main>

        <BottomNav />
      </div>
    </div>
  );
}
