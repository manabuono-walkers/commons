"use client";
import Link from "next/link";
import BottomNav from "@/components/BottomNav";
import AppHeader from "@/components/AppHeader";

const history = [
  { date: "2026.06.02", type: "イベント", desc: "ワインサロン Vol.12", pt: "+120" },
  { date: "2026.05.18", type: "イベント", desc: "Whisky Night Vol.7", pt: "+120" },
  { date: "2026.05.12", type: "クーポン", desc: "La Cave 10% OFF 利用", pt: "—" },
  { date: "2026.05.10", type: "イベント", desc: "Sunday Coffee Cupping #6", pt: "+80" },
  { date: "2026.05.01", type: "お支払い", desc: "月額会費 ¥500", pt: "+5" },
];

const upcomingEvents = [
  { id: "music-bar-0715", date: "7月15日（土）", name: "COMMONS MUSIC BAR", venue: "SOUND BAR HOWL · 渋谷", time: "18:00〜21:00" },
  { id: "wine-salon-0802", date: "8月2日（土）", name: "COMMONS WINE SALON", venue: "La Cave · 麻布十番", time: "19:00〜22:00" },
];

const menuItems = [
  { label: "参加履歴・ポイント履歴", badge: "", href: "/history" },
  { label: "クーポン", badge: "3枚", href: "/stores?tab=coupons" },
  { label: "お問い合わせ", badge: "", href: "/contact" },
  { label: "意見箱", badge: "", href: "/feedback" },
  { label: "会員証", badge: "", href: "/member-card" },
  { label: "通知設定", badge: "", href: "/notification-settings" },
  { label: "退会", badge: "", href: "/withdraw" },
];

export default function MyPage() {

  return (
    <div className="flex justify-center bg-[var(--color-bg)] min-h-screen">
      <div className="w-full max-w-[430px] pb-24">
        <AppHeader />

        <main className="px-5 pt-6 space-y-6">
          {/* Profile */}
          <section className="card p-5">
            <div className="flex items-center gap-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/icon.png" alt="アカウント" className="w-16 h-16 rounded-full object-cover flex-none border border-[var(--color-line)]" />
              <div className="flex-1 min-w-0">
                <div className="font-display text-xl">青山 陸</div>
                <div className="font-display text-xs text-[var(--color-mute)] mt-0.5">No.0824</div>
                <div className="mt-1.5 flex items-center gap-2">
                  <span className="tag tag-accent">GOLD会員</span>
                </div>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-[var(--color-line)] flex items-center justify-between">
              <Link href="/profile-edit" className="font-display text-xs text-[var(--color-accent-deep)] hover:opacity-70 transition flex items-center gap-1">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                プロフィールを編集
              </Link>
              <Link href="/rank-detail" className="font-display text-xs text-[var(--color-mute)] hover:text-[var(--color-accent-deep)] transition flex items-center gap-1">
                ランク詳細
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
              </Link>
            </div>
          </section>

          {/* VIP upgrade banner */}
          <Link
            href="/vip"
            className="block rounded-2xl overflow-hidden relative"
            style={{ background: "linear-gradient(135deg, #1a0a2e, #2d1157, #1a0a2e)" }}
          >
            {/* Glow effect */}
            <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 30% 50%, rgba(147,51,234,0.35) 0%, transparent 70%)" }} />
            <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 80% 30%, rgba(192,132,252,0.2) 0%, transparent 60%)" }} />
            {/* Border shimmer */}
            <div className="absolute inset-0 rounded-2xl" style={{ border: "1px solid rgba(167,139,250,0.4)" }} />
            <div className="relative flex items-center gap-4 px-5 py-4">
              <div className="flex-none w-10 h-10 rounded-full flex items-center justify-center" style={{ background: "linear-gradient(135deg, #a855f7, #7c3aed)" }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="white" stroke="none">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-display text-[10px] tracking-[0.2em]" style={{ color: "#c084fc" }}>EXCLUSIVE · VIP</div>
                <div className="font-display text-base mt-0.5" style={{ color: "#f3e8ff" }}>VIPにアップグレード</div>
                <div className="font-display text-[10px] mt-0.5" style={{ color: "#a78bfa" }}>限定特典・優先予約・コンシェルジュサービス</div>
              </div>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#c084fc" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-none">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </div>
          </Link>

          {/* Stats */}
          <section className="grid grid-cols-3 gap-3">
            {[
              { label: "保有ポイント", val: "1,840", sub: "pt", highlight: true },
              { label: "参加回数", val: "15", sub: "回" },
              { label: "入会", val: "8", sub: "ヶ月目" },
            ].map(s => (
              <div key={s.label} className="card p-4 text-center">
                <div className="font-display text-[10px] text-[var(--color-mute)]">{s.label}</div>
                <div className={`mt-2 num text-2xl ${s.highlight ? "text-[var(--color-accent-deep)]" : ""}`}>
                  {s.val}<span className="text-xs text-[var(--color-mute)] ml-0.5">{s.sub}</span>
                </div>
              </div>
            ))}
          </section>

          {/* Rank progress */}
          <Link href="/rank-detail" className="card block p-5 hover:border-[var(--color-accent)]/60 transition">
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
            <div className="mb-2 flex items-center justify-between font-display text-[10px] text-[var(--color-mute)]">
              <span>次のランク：PLATINUM</span>
              <span>あと 3,160 XP</span>
            </div>
            <div className="h-1.5 bg-[var(--color-line)] rounded-full">
              <div className="h-1.5 rounded-full" style={{ width: "37%", background: "linear-gradient(90deg, #B8985A, #CBAE74)" }} />
            </div>
            <div className="mt-1 text-right font-display text-[10px] text-[var(--color-mute)]">1,840 / 5,000 XP</div>
          </Link>

          {/* 契約プラン */}
          <section className="card p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="font-display text-xs text-[var(--color-accent-deep)]">契約プラン</div>
              <Link href="/plan-change" className="font-display text-xs text-[var(--color-mute)] hover:text-[var(--color-accent-deep)] transition flex items-center gap-1">
                プラン変更
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
              </Link>
            </div>
            <div className="flex gap-3">
              <div className="flex-1 rounded-xl border border-[var(--color-line)] p-3 text-center opacity-60">
                <div className="font-display text-xs text-[var(--color-mute)]">切り替え可</div>
                <div className="font-display text-sm mt-1">月額プラン</div>
                <div className="num text-base mt-0.5">¥980<span className="text-xs text-[var(--color-mute)]">税込/月</span></div>
              </div>
              <div className="flex-1 rounded-xl border-2 border-[var(--color-accent)] bg-[var(--color-accent)]/10 p-3 text-center">
                <div className="font-display text-xs text-[var(--color-accent-deep)]">選択中</div>
                <div className="font-display text-sm mt-1">年間プラン</div>
                <div className="num text-base mt-0.5">¥500<span className="text-xs text-[var(--color-mute)]">税込/月</span></div>
                <div className="font-display text-[9px] text-[var(--color-mute)] mt-0.5">12ヶ月一括 ¥6,000</div>
                <div className="font-display text-[9px] text-[var(--color-accent-deep)] mt-0.5">月額より¥5,760お得</div>
              </div>
            </div>
          </section>

          {/* 支払い状況 */}
          <section className="card p-5">
            <div className="font-display text-xs text-[var(--color-accent-deep)] mb-3">支払い状況</div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-display text-sm">7月分 月額会費</div>
                  <div className="font-display text-[10px] text-[var(--color-mute)] mt-0.5">2026年7月1日 請求</div>
                </div>
                <span className="tag tag-accent text-[10px]">支払済</span>
              </div>
              <div className="flex items-center justify-between border-t border-[var(--color-line)] pt-3">
                <div>
                  <div className="font-display text-sm">支払い方法</div>
                  <div className="font-display text-[10px] text-[var(--color-mute)] mt-0.5">VISA ····4242</div>
                </div>
                <Link href="/payment-method" className="font-display text-xs text-[var(--color-accent-deep)]">変更</Link>
              </div>
              <div className="flex items-center justify-between border-t border-[var(--color-line)] pt-3">
                <div>
                  <div className="font-display text-sm">次回請求</div>
                  <div className="font-display text-[10px] text-[var(--color-mute)] mt-0.5">2026年8月1日</div>
                </div>
                <div className="num text-base">¥500</div>
              </div>
            </div>
          </section>

          {/* 参加予定イベント */}
          <section className="card p-5">
            <div className="font-display text-xs text-[var(--color-accent-deep)] mb-3">参加予定イベント</div>
            {upcomingEvents.length === 0 ? (
              <p className="text-xs text-[var(--color-mute)]">参加予定のイベントはありません。</p>
            ) : (
              <div className="space-y-3">
                {upcomingEvents.map((ev, i) => (
                  <Link key={i} href={`/events/${ev.id}`} className={`flex gap-4 hover:bg-[var(--color-bg-soft)] -mx-1 px-1 rounded-xl transition ${i > 0 ? "border-t border-[var(--color-line)] pt-3" : ""}`}>
                    <div className="flex-none text-center w-14">
                      <div className="font-display text-[10px] text-[var(--color-mute)]">{ev.date.split("（")[0]}</div>
                      <div className="font-display text-[9px] text-[var(--color-mute)]">（{ev.date.split("（")[1]}</div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-display text-sm">{ev.name}</div>
                      <div className="font-display text-[10px] text-[var(--color-mute)] mt-0.5">{ev.venue}</div>
                      <div className="font-display text-[10px] text-[var(--color-mute)]">{ev.time}</div>
                    </div>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--color-mute)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-none self-center">
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  </Link>
                ))}
              </div>
            )}
          </section>

          {/* Menu */}
          <section>
            <div className="space-y-px bg-[var(--color-line)] rounded-2xl overflow-hidden border border-[var(--color-line)]">
              {menuItems.map((m) => (
                <Link
                  key={m.label}
                  href={m.href}
                  className="w-full flex items-center gap-4 px-5 py-4 bg-[var(--color-bg)] hover:bg-[var(--color-bg-soft)] transition"
                >
                  <span className="font-display text-sm flex-1">{m.label}</span>
                  {m.badge && <span className="tag tag-accent text-[10px]">{m.badge}</span>}
                  <span className="text-[var(--color-mute)]">›</span>
                </Link>
              ))}
            </div>
          </section>
        </main>

        <BottomNav />
      </div>
    </div>
  );
}
