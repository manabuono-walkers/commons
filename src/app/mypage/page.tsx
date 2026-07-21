"use client";
import { useState } from "react";
import Link from "next/link";
import BottomNav from "@/components/BottomNav";
import AppHeader from "@/components/AppHeader";

type Rank = "STANDARD" | "BRONZE" | "SILVER" | "GOLD" | "PLATINUM";

const rankConfig: Record<Rank, { bg: string; border: string; textAccent: string; label: string }> = {
  STANDARD: { bg: "linear-gradient(135deg, #1C1C1E 0%, #2C2C2E 50%, #1C1C1E 100%)", border: "rgba(150,150,160,0.4)", textAccent: "#A0A0AA", label: "スタンダード" },
  BRONZE:   { bg: "linear-gradient(135deg, #1F0F05 0%, #4A2010 50%, #1F0F05 100%)", border: "rgba(150,90,50,0.5)",  textAccent: "#CD7F32", label: "ブロンズ" },
  SILVER:   { bg: "linear-gradient(135deg, #1A1F24 0%, #2D3A44 50%, #1A1F24 100%)", border: "rgba(160,180,200,0.5)", textAccent: "#A8C0D0", label: "シルバー" },
  GOLD:     { bg: "linear-gradient(135deg, #1A1005 0%, #3D2E08 40%, #291900 100%)", border: "rgba(184,152,90,0.6)", textAccent: "#CBAE74", label: "ゴールド" },
  PLATINUM: { bg: "linear-gradient(135deg, #0F1820 0%, #1F3040 50%, #0F1820 100%)", border: "rgba(180,210,230,0.5)", textAccent: "#B0D4E8", label: "プラチナ" },
};

const currentRank: Rank = "GOLD";

const upcomingEvents = [
  { id: "music-bar-0715", month: "7月", day: "15", weekday: "土", name: "COMMONS MUSIC BAR", venue: "SOUND BAR HOWL · 渋谷", time: "18:00〜" },
  { id: "wine-salon-0802", month: "8月", day: "2",  weekday: "土", name: "COMMONS WINE SALON", venue: "La Cave · 麻布十番",    time: "19:00〜" },
];


const campaigns = [
  { href: "/campaign-1", img: "/images/campaign1.jpeg", label: "友達紹介キャンペーン", meta: "紹介するだけで500ptプレゼント" },
  { href: "/campaign-2", img: "/images/campaign2.jpeg", label: "新ポイント制度スタート", meta: "イベント参加でXPが貯まる新制度" },
];

const mainMenuItems = [
  { label: "クーポン",      badge: "2枚", href: "/mypage/coupons" },
  { label: "保存した投稿",  badge: "",    href: "/mypage/saved-posts" },
  { label: "使い方ガイド",  badge: "",    href: "/guide" },
];

const onboardingTasks = [
  { id: "profile",  label: "プロフィールを完成させよう",        href: "/profile-edit",  done: false },
  { id: "intro",    label: "自己紹介を投稿しよう",              href: "/community",      done: false },
  { id: "club",     label: "興味のあるクラブに参加しよう",      href: "/clubs",          done: false },
];

export default function MyPage() {
  const rc = rankConfig[currentRank];
  const [tasks, setTasks] = useState(onboardingTasks);
  const [tasksDismissed, setTasksDismissed] = useState(false);

  const remainingTasks = tasks.filter(t => !t.done);

  function toggleTask(id: string) {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t));
  }

  return (
    <div className="flex justify-center bg-[var(--color-bg)] min-h-screen">
      <div className="w-full max-w-[430px] pb-24">
        <AppHeader />

        <main className="px-5 pt-5 space-y-5">

          {/* 0. 未完了タスク */}
          {!tasksDismissed && remainingTasks.length > 0 && (
            <section className="card p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="font-display text-xs font-semibold text-[var(--color-accent-deep)]">はじめてのCOMMONS</div>
                <button
                  onClick={() => setTasksDismissed(true)}
                  className="text-[var(--color-mute)] hover:text-[var(--color-ink)] transition text-xs"
                >
                  ✕
                </button>
              </div>
              <div className="space-y-2">
                {tasks.map(t => (
                  <div key={t.id} className="flex items-center gap-3">
                    <button
                      onClick={() => toggleTask(t.id)}
                      className="flex-none w-5 h-5 rounded-full border flex items-center justify-center transition-all"
                      style={{
                        borderColor: t.done ? "var(--color-accent-deep)" : "var(--color-line)",
                        background: t.done ? "var(--color-accent-deep)" : "transparent",
                      }}
                    >
                      {t.done && (
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#0B0F16" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      )}
                    </button>
                    <Link
                      href={t.href}
                      className={`flex-1 text-sm transition ${t.done ? "line-through text-[var(--color-mute)]" : "text-[var(--color-ink)]"}`}
                    >
                      {t.label}
                    </Link>
                    {!t.done && (
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--color-mute)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-none">
                        <polyline points="9 18 15 12 9 6"/>
                      </svg>
                    )}
                  </div>
                ))}
              </div>
              <div className="mt-3 h-1 bg-[var(--color-line)] rounded-full overflow-hidden">
                <div
                  className="h-1 rounded-full transition-all"
                  style={{ width: `${(tasks.filter(t=>t.done).length / tasks.length) * 100}%`, background: "linear-gradient(90deg, #B8985A, #CBAE74)" }}
                />
              </div>
              <div className="mt-1.5 text-[11px] text-[var(--color-mute)] font-display text-right">
                {tasks.filter(t=>t.done).length} / {tasks.length} 完了
              </div>
            </section>
          )}

          {/* 1. 会員証 */}
          <section
            className="relative rounded-2xl overflow-hidden p-5"
            style={{ background: rc.bg, border: `1px solid ${rc.border}` }}
          >
            <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(ellipse at 30% 40%, ${rc.textAccent}22 0%, transparent 70%)` }} />
            <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(ellipse at 80% 70%, ${rc.textAccent}11 0%, transparent 60%)` }} />
            <div className="relative flex items-center justify-between">
              <div>
                <div className="font-elegant text-[9px] tracking-[0.25em] mb-1" style={{ color: rc.textAccent }}>COMMONS · MEMBER CARD</div>
                <div className="font-elegant text-2xl" style={{ color: "#F2EFE9" }}>青山 陸</div>
                <div className="font-elegant text-[10px] mt-0.5" style={{ color: rc.textAccent }}>No.0824</div>
              </div>
              <div className="text-right">
                <div className="font-elegant text-[9px] tracking-[0.15em] mb-1" style={{ color: rc.textAccent }}>RANK</div>
                <div className="font-elegant text-xl" style={{ color: rc.textAccent }}>{currentRank}</div>
                <div className="font-elegant text-[9px]" style={{ color: `${rc.textAccent}99` }}>{rc.label}</div>
              </div>
            </div>
          </section>

          {/* 2. プロフィール */}
          <section className="card p-4">
            <div className="flex items-center gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/icon.png" alt="アカウント" className="w-14 h-14 rounded-full object-cover flex-none border border-[var(--color-line)]" />
              <div className="flex-1 min-w-0">
                <div className="font-display text-lg font-semibold">青山 陸</div>
                <div className="font-display text-xs text-[var(--color-mute)]">No.0824</div>
              </div>
              <Link
                href="/profile-edit"
                className="flex-none flex items-center gap-1.5 px-3 py-2 rounded-xl border border-[var(--color-line)] font-display text-xs text-[var(--color-mute)] hover:text-[var(--color-accent-deep)] hover:border-[var(--color-accent)]/50 transition"
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                編集
              </Link>
            </div>
          </section>

          {/* 3. 参加予定イベント */}
          <section className="card p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="font-display text-xs font-semibold text-[var(--color-accent-deep)]">参加予定イベント</div>
              <Link href="/mypage/events" className="font-display text-[10px] text-[var(--color-mute)] hover:text-[var(--color-accent-deep)] transition flex items-center gap-1">
                すべて見る
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
              </Link>
            </div>
            {upcomingEvents.length === 0 ? (
              <p className="text-xs text-[var(--color-mute)]">参加予定のイベントはありません。</p>
            ) : (
              <div className="space-y-0">
                {upcomingEvents.map((ev, i) => (
                  <Link
                    key={ev.id}
                    href={`/events/${ev.id}`}
                    className={`flex gap-3 items-center py-3 hover:bg-[var(--color-bg)] -mx-1 px-1 rounded-xl transition ${i > 0 ? "border-t border-[var(--color-line)]" : ""}`}
                  >
                    <div className="flex-none w-16 rounded-xl text-center py-2" style={{ background: "var(--color-bg)", border: "1px solid var(--color-line)" }}>
                      <div className="font-display text-[10px] text-[var(--color-mute)]">{ev.month}</div>
                      <div className="num text-2xl leading-none" style={{ color: "var(--color-accent-deep)" }}>{ev.day}</div>
                      <div className="font-display text-sm font-bold mt-0.5" style={{ color: "var(--color-accent-deep)" }}>（{ev.weekday}）</div>
                      <div className="font-display text-[10px] text-[var(--color-mute)] mt-1">{ev.time}</div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-display text-sm leading-snug">{ev.name}</div>
                      <div className="font-display text-xs text-[var(--color-mute)] mt-1">{ev.venue}</div>
                    </div>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--color-mute)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-none">
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  </Link>
                ))}
              </div>
            )}
          </section>

          {/* 4. 現在のランク */}
          <Link href="/rank-detail" className="card block p-4 hover:border-[var(--color-accent)]/60 transition">
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="font-display text-xs text-[var(--color-mute)] mb-1">現在のランク</div>
                <div className="font-elegant text-3xl" style={{ color: "#B8985A" }}>GOLD</div>
                <div className="font-display text-sm text-[var(--color-mute)]">ゴールド</div>
              </div>
              <div className="text-right">
                <div className="font-display text-xs text-[var(--color-mute)] mb-1">保有XP</div>
                <div className="num text-2xl" style={{ color: "#B8985A" }}>1,840</div>
                <div className="font-display text-xs text-[var(--color-mute)]">XP</div>
              </div>
            </div>
            <div className="mb-2 flex items-center justify-between font-display text-xs text-[var(--color-mute)]">
              <span>次のランク：PLATINUM</span>
              <span>あと 3,160 XP</span>
            </div>
            <div className="h-1.5 bg-[var(--color-line)] rounded-full">
              <div className="h-1.5 rounded-full" style={{ width: "37%", background: "linear-gradient(90deg, #B8985A, #CBAE74)" }} />
            </div>
            <div className="mt-1 text-right font-display text-xs text-[var(--color-mute)]">1,840 / 5,000 XP</div>
          </Link>

          {/* 5. 保有ポイント */}
          <div className="card p-4 flex items-center justify-between">
            <div className="font-display text-sm text-[var(--color-mute)]">保有ポイント</div>
            <div className="num text-2xl text-[var(--color-accent-deep)]">20<span className="num text-sm text-[var(--color-mute)] ml-1">pt</span></div>
          </div>

          {/* 6. VIPにアップグレード */}
          <Link
            href="/vip"
            className="block rounded-2xl overflow-hidden relative"
            style={{ background: "linear-gradient(135deg, #1a0a2e, #2d1157, #1a0a2e)" }}
          >
            <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 30% 50%, rgba(147,51,234,0.35) 0%, transparent 70%)" }} />
            <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 80% 30%, rgba(192,132,252,0.2) 0%, transparent 60%)" }} />
            <div className="absolute inset-0 rounded-2xl" style={{ border: "1px solid rgba(167,139,250,0.4)" }} />
            <div className="relative flex items-center gap-4 px-5 py-4">
              <div className="flex-none w-10 h-10 rounded-full flex items-center justify-center" style={{ background: "linear-gradient(135deg, #a855f7, #7c3aed)" }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="white" stroke="none">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-display text-[10px] tracking-[0.1em]" style={{ color: "#c084fc" }}>EXCLUSIVE · VIP</div>
                <div className="font-display text-base font-semibold mt-0.5" style={{ color: "#f3e8ff" }}>VIPにアップグレード</div>
                <div className="font-display text-xs mt-0.5" style={{ color: "#a78bfa" }}>限定特典・優先予約・コンシェルジュサービス</div>
              </div>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#c084fc" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-none">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </div>
          </Link>

          {/* 7. 契約プラン */}
          <section className="card p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="font-display text-xs font-semibold text-[var(--color-accent-deep)]">契約プラン</div>
              <Link href="/plan-change" className="font-display text-xs text-[var(--color-mute)] hover:text-[var(--color-accent-deep)] transition flex items-center gap-1">
                プラン変更
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
              </Link>
            </div>
            <div className="flex gap-3">
              <div className="flex-1 rounded-xl border border-[var(--color-line)] p-3 text-center opacity-60">
                <div className="font-display text-xs text-[var(--color-mute)]">切り替え可</div>
                <div className="font-display text-sm mt-1">月額プラン</div>
                <div><span className="num text-base">¥980</span><span className="font-display text-xs text-[var(--color-mute)]">税込/月</span></div>
              </div>
              <div className="flex-1 rounded-xl p-3 text-center" style={{ border: "2px solid var(--color-accent)", background: "rgba(184,152,90,0.06)" }}>
                <div className="font-display text-xs text-[var(--color-accent-deep)]">選択中</div>
                <div className="font-display text-sm mt-1">年間プラン</div>
                <div><span className="num text-base">¥500</span><span className="font-display text-xs text-[var(--color-mute)]">税込/月</span></div>
                <div className="font-display text-[10px] text-[var(--color-mute)] mt-0.5">12ヶ月一括 ¥6,000</div>
                <div className="font-display text-[10px] text-[var(--color-accent-deep)] mt-0.5">月額より¥5,760お得</div>
              </div>
            </div>
          </section>

          {/* キャンペーン */}
          <section>
            <div className="flex items-baseline justify-between mb-3">
              <h2 className="font-display text-sm font-semibold">キャンペーン</h2>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-2 -mx-5 px-5 scrollbar-muted">
              {campaigns.map((c) => (
                <a
                  key={c.href}
                  href={c.href}
                  className="flex-none w-[180px] rounded-2xl overflow-hidden border border-[var(--color-line)] hover:border-[var(--color-accent)]/60 transition"
                >
                  <div className="relative h-[100px] bg-cover bg-center" style={{ backgroundImage: `url(${c.img})` }}>
                    <div className="absolute inset-0 bg-black/30" />
                  </div>
                  <div className="p-3 bg-[var(--color-bg-soft)]">
                    <div className="font-display text-sm leading-snug">{c.label}</div>
                    <div className="font-display text-xs text-[var(--color-mute)] mt-0.5">{c.meta}</div>
                  </div>
                </a>
              ))}
            </div>
          </section>

          {/* 8. メニュー */}
          <section>
            <div className="space-y-px bg-[var(--color-line)] rounded-2xl overflow-hidden border border-[var(--color-line)]">
              {mainMenuItems.map((m) => (
                <Link
                  key={m.label}
                  href={m.href}
                  className="w-full flex items-center gap-4 px-5 py-4 bg-[var(--color-bg)] hover:bg-[var(--color-bg-soft)] transition"
                >
                  <span className="font-display text-sm flex-1">{m.label}</span>
                  {m.badge && <span className="tag tag-accent">{m.badge}</span>}
                  <span className="text-[var(--color-mute)]">›</span>
                </Link>
              ))}
              <Link href="/contact" className="w-full flex items-center gap-4 px-5 py-4 bg-[var(--color-bg)] hover:bg-[var(--color-bg-soft)] transition">
                <span className="font-display text-sm flex-1">お問い合わせ</span>
                <span className="text-[var(--color-mute)]">›</span>
              </Link>
              <Link href="/mypage/settings" className="w-full flex items-center gap-4 px-5 py-4 bg-[var(--color-bg)] hover:bg-[var(--color-bg-soft)] transition">
                <span className="font-display text-sm flex-1">各種設定</span>
                <span className="text-[var(--color-mute)]">›</span>
              </Link>
            </div>
          </section>

        </main>

        <BottomNav />
      </div>
    </div>
  );
}
