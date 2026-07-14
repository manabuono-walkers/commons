import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

export default function DashboardPage() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-[1400px] px-6 pt-16 pb-24 md:px-10">
        {/* Hero greeting */}
        <section className="grid grid-cols-1 gap-10 md:grid-cols-[1fr_auto] md:items-end">
          <div>
            <div className="animate-fade-up font-display text-xs text-[var(--color-accent-deep)]">
              マイページ／2026年5月26日
            </div>
            <h1 className="mt-4 animate-fade-up delay-1 font-display text-[clamp(2rem,4vw,3.5rem)] leading-[1.2]">
              青山 陸 様、おかえりなさい。
            </h1>
          </div>
          <div className="animate-fade-up delay-2 flex items-center gap-6">
            <div className="h-20 w-20 rounded-full bg-[var(--color-ink)] text-[var(--color-bg)] flex items-center justify-center font-display text-3xl">
              青
            </div>
            <div>
              <div className="font-display text-2xl">青山 陸</div>
              <div className="font-display text-xs text-[var(--color-mute)] mt-1">
                会員番号 No.0824／東京支部
              </div>
            </div>
          </div>
        </section>

        <div className="border-t border-[var(--color-line)] my-12" />

        {/* Status overview */}
        <section className="grid grid-cols-1 gap-px overflow-hidden border border-[var(--color-line)] bg-[var(--color-line)] md:grid-cols-4">
          {[
            { label: "ご契約プラン", value: "月額プラン", sub: "月額 ¥500", tag: "契約中" },
            { label: "次回お支払い", value: "2026.06.10", sub: "¥500 / Stripe", tag: "予定" },
            { label: "現在のランク", value: "GOLD", sub: "Lv.3 / +12回参加", tag: "次：プラチナ" },
            { label: "保有ポイント", value: "1,840", sub: "pt（次月失効 240pt）", tag: "利用可" },
          ].map((s, i) => (
            <div key={s.label} className={`bg-[var(--color-bg)] p-8 animate-fade-up delay-${i + 1}`}>
              <div className="flex items-baseline justify-between">
                <span className="font-display text-xs text-[var(--color-mute)]">{s.label}</span>
                <span className="tag tag-accent">{s.tag}</span>
              </div>
              <div className="mt-6 num text-4xl tracking-tight">{s.value}</div>
              <div className="mt-2 text-xs text-[var(--color-mute)]">{s.sub}</div>
            </div>
          ))}
        </section>

        {/* Two-column: Activity + Upcoming */}
        <section className="mt-16 grid grid-cols-1 gap-12 lg:grid-cols-[1.6fr_1fr]">
          {/* Upcoming events */}
          <div>
            <header className="flex items-baseline justify-between">
              <div>
                <div className="font-display text-xs text-[var(--color-accent-deep)]">今後の予定</div>
                <h2 className="mt-2 font-display text-3xl">参加予定イベント</h2>
              </div>
              <Link href="/events" className="link-underline font-display text-xs">
                すべてのイベント →
              </Link>
            </header>

            <div className="mt-8 space-y-px bg-[var(--color-line)]">
              {[
                { date: "06.02", weekday: "火", time: "19:30 - 22:00", title: "ワインサロン Vol.12 — ブルゴーニュナイト", loc: "麻布十番 · La Cave", status: "確定", cap: "12 / 16" },
                { date: "06.14", weekday: "日", time: "11:00 - 13:00", title: "Sunday Coffee Cupping", loc: "代官山 · COMMONS BASE", status: "抽選結果待ち", cap: "応募 38 / 募集 8" },
                { date: "06.21", weekday: "日", time: "14:00 - 17:00", title: "Sake Atelier — 全国蔵元から3蔵", loc: "渋谷 · The Library", status: "確定", cap: "8 / 10" },
              ].map((e, i) => (
                <div key={e.title} className={`grid grid-cols-[auto_1fr_auto] items-center gap-6 bg-[var(--color-bg)] p-6 md:p-8 transition-colors hover:bg-[var(--color-bg-soft)] animate-fade-up delay-${i + 2}`}>
                  <div className="text-center">
                    <div className="num text-4xl tracking-tight leading-none">{e.date}</div>
                    <div className="mt-1 font-display text-xs text-[var(--color-mute)]">{e.weekday}</div>
                  </div>
                  <div>
                    <div className="font-display text-xl md:text-2xl">{e.title}</div>
                    <div className="mt-1 text-xs text-[var(--color-mute)] flex flex-wrap gap-3">
                      <span>{e.time}</span>
                      <span>·</span>
                      <span>{e.loc}</span>
                      <span>·</span>
                      <span>{e.cap}</span>
                    </div>
                  </div>
                  <span className={`tag ${e.status === "確定" ? "tag-ink" : "tag-accent"}`}>{e.status}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Rank progress + Payment + Coupons */}
          <aside className="space-y-10">
            <div className="card p-8">
              <div className="font-display text-xs text-[var(--color-accent-deep)]">ランク進捗</div>
              <div className="mt-4 flex items-baseline justify-between">
                <div className="font-display text-3xl">GOLD</div>
                <div className="text-xs text-[var(--color-mute)]">プラチナまで あと3回参加</div>
              </div>
              <div className="mt-5 h-px bg-[var(--color-line)]">
                <div className="h-px bg-[var(--color-accent-deep)]" style={{ width: "72%" }} />
              </div>
              <ul className="mt-6 space-y-3 text-xs text-[var(--color-mute)]">
                <li className="flex items-center gap-3"><span className="num">✓</span> 入会後12ヶ月継続</li>
                <li className="flex items-center gap-3"><span className="num">✓</span> イベント参加 12回</li>
                <li className="flex items-center gap-3"><span className="num">·</span> 提携店舗利用 3回 / 5回</li>
              </ul>
            </div>

            <div className="card p-8">
              <div className="font-display text-xs text-[var(--color-accent-deep)]">お支払い情報</div>
              <div className="mt-4 font-display text-2xl">登録カード</div>
              <div className="mt-5 flex items-center justify-between border-t border-[var(--color-line)] pt-5">
                <div>
                  <div className="font-display text-xs tracking-wider">VISA · · · · 4214</div>
                  <div className="text-xs text-[var(--color-mute)] mt-1 font-display">Stripe／登録カード</div>
                </div>
                <button className="link-underline font-display text-xs">変更</button>
              </div>
            </div>

            <div className="card p-8">
              <div className="font-display text-xs text-[var(--color-accent-deep)]">利用可能クーポン</div>
              <div className="mt-4 font-display text-2xl">クーポン <span className="num text-base text-[var(--color-mute)]">3枚</span></div>
              <ul className="mt-5 space-y-3">
                {[
                  { name: "麻布十番 La Cave 10% OFF", until: "〜06.30" },
                  { name: "代官山 COFFEE COMMONS 1杯無料", until: "〜07.15" },
                  { name: "渋谷 The Library 入店無料", until: "〜08.31" },
                ].map((c) => (
                  <li key={c.name} className="flex items-center justify-between border-b border-[var(--color-line)] pb-3 last:border-0">
                    <span className="text-sm">{c.name}</span>
                    <span className="font-display text-xs text-[var(--color-mute)]">{c.until}</span>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </section>

        {/* Past events / activity */}
        <section className="mt-20">
          <header className="flex items-baseline justify-between">
            <div>
              <div className="font-display text-xs text-[var(--color-accent-deep)]">アクティビティ履歴</div>
              <h2 className="mt-2 font-display text-3xl">参加履歴・支払い履歴</h2>
            </div>
            <span className="font-display text-xs text-[var(--color-mute)]">直近12件</span>
          </header>

          <div className="mt-8 overflow-hidden border border-[var(--color-line)] rounded-2xl">
            <table className="w-full text-sm">
              <thead className="bg-[var(--color-bg-soft)]">
                <tr className="font-display text-xs text-[var(--color-mute)]">
                  <th className="px-6 py-4 text-left">日付</th>
                  <th className="px-6 py-4 text-left">種別</th>
                  <th className="px-6 py-4 text-left">内容</th>
                  <th className="px-6 py-4 text-right">ポイント</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["2026.05.18", "イベント", "Whisky Night Vol.7", "+120"],
                  ["2026.05.12", "クーポン", "La Cave 10% OFF 利用", "—"],
                  ["2026.05.10", "イベント", "Sunday Coffee Cupping #6", "+80"],
                  ["2026.05.01", "お支払い", "月額会費 ¥500", "+5"],
                  ["2026.04.27", "イベント", "谷中 Photo Walk", "+60"],
                ].map(([d, t, det, p]) => (
                  <tr key={`${d}-${t}`} className="border-t border-[var(--color-line)] hover:bg-[var(--color-bg-soft)]/60">
                    <td className="px-6 py-4 num">{d}</td>
                    <td className="px-6 py-4 font-display text-xs text-[var(--color-mute)]">{t}</td>
                    <td className="px-6 py-4 font-display text-base">{det}</td>
                    <td className="px-6 py-4 text-right num">{p}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
