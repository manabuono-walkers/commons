"use client";

import { useState } from "react";
import Link from "next/link";
import BottomNav from "@/components/BottomNav";
import AppHeader from "@/components/AppHeader";

export type Attendee = { name: string; img: string };

export const events = [
  {
    id: "music-bar-0715",
    title: "COMMONS MUSIC BAR",
    date: { month: "7月", day: "15", weekday: "土" },
    time: "18:00〜21:00",
    venue: "SOUND BAR HOWL",
    station: "渋谷駅",
    state: "募集中",
    image: "/images/event1.png",
    detailImage: "/images/event_detail.png",
    imageEmoji: "",
    desc: "原宿にある『居酒屋以上クラブ未満』がコンセプトのミュージックバーを貸し切らせていただきます。当日はDJを招待し、オシャレな空間で音楽とお酒と共に交流をお楽しみください。",
    datetime_detail: "7月15日（土）18:00〜21:00\n※17:45〜受付開始",
    venue_map_url: "https://maps.google.com",
    fee_male: "¥7,000",
    fee_female: "¥6,000",
    format: "飲み放題 / フード（8品前後）",
    capacity: "50名前後",
    deadline: "7月10日（木）23時59分まで",
    capacity_male: 25,
    capacity_female: 25,
    remaining_male: 5,
    remaining_female: 3,
    alert_threshold: 8,
    payment_url_male: "#",
    payment_url_female: "#",
    terms_url: "https://x.gd/R00Zm",
    conditions: [],
    genres: ["音楽", "交流会", "DJ"],
    attendees: [
      { name: "伊藤 玲奈", img: "/images/ito.png" },
      { name: "田中 健", img: "/images/tanaka.png" },
      { name: "山本 彩", img: "/images/yamamoto.png" },
    ] as Attendee[],
  },
  {
    id: "wine-salon-0802",
    title: "COMMONS WINE SALON",
    date: { month: "8月", day: "2", weekday: "土" },
    time: "19:00〜22:00",
    venue: "La Cave",
    station: "麻布十番駅",
    state: "申込済み",
    image: "/images/event2.png",
    imageEmoji: "",
    desc: "ブルゴーニュ地方の名門生産者から選び抜いた6本を、ソムリエの解説とともに。",
    datetime_detail: "8月2日（土）19:00〜22:00\n※18:45〜受付開始",
    venue_map_url: "https://maps.google.com",
    fee_male: "¥9,800",
    fee_female: "¥9,800",
    format: "着席式 / ワイン6本 + フードペアリング",
    capacity: "16名",
    deadline: "7月28日（月）23時59分まで",
    capacity_male: 8,
    capacity_female: 8,
    remaining_male: 8,
    remaining_female: 8,
    alert_threshold: 5,
    payment_url_male: "#",
    payment_url_female: "#",
    terms_url: "https://x.gd/R00Zm",
    conditions: ["GOLD以上"],
    genres: ["ワイン", "グルメ", "少人数"],
    attendees: [
      { name: "山本 彩", img: "/images/yamamoto.png" },
      { name: "伊藤 玲奈", img: "/images/ito.png" },
    ] as Attendee[],
  },
  {
    id: "autumn-night-0920",
    title: "COMMONS AUTUMN NIGHT",
    date: { month: "9月", day: "20", weekday: "土" },
    time: "19:00〜22:00",
    venue: "THE THEATRE TABLE",
    station: "銀座駅",
    state: "募集中",
    image: "/images/event1.png",
    imageEmoji: "",
    desc: "秋の夜長を彩るスペシャルディナー。一流シェフによるコース料理と厳選ワインで、特別な夜をお楽しみください。",
    datetime_detail: "9月20日（土）19:00〜22:00\n※18:45〜受付開始",
    venue_map_url: "https://maps.google.com",
    fee_male: "¥12,000",
    fee_female: "¥10,000",
    format: "着席式 / コース料理 + ワインペアリング",
    capacity: "40名",
    deadline: "9月15日（月）23時59分まで",
    capacity_male: 20,
    capacity_female: 20,
    remaining_male: 0,
    remaining_female: 6,
    alert_threshold: 8,
    payment_url_male: "#",
    payment_url_female: "#",
    terms_url: "https://x.gd/R00Zm",
    conditions: [],
    male_cancel_wait: true,
    genres: ["ワイン", "ディナー", "交流会"],
    attendees: [
      { name: "田中 健", img: "/images/tanaka.png" },
      { name: "山本 彩", img: "/images/yamamoto.png" },
      { name: "伊藤 玲奈", img: "/images/ito.png" },
    ] as Attendee[],
  },
  {
    id: "winter-gala-1129",
    title: "COMMONS WINTER GALA",
    date: { month: "11月", day: "29", weekday: "土" },
    time: "19:00〜22:00",
    venue: "GRAND HYATT TOKYO",
    station: "六本木駅",
    state: "募集中",
    image: "/images/event2.png",
    imageEmoji: "",
    desc: "年に一度の特別なガラディナー。ドレスアップした会員同士で、豪華なコース料理と音楽を楽しむCOMMONS最大のイベント。",
    datetime_detail: "11月29日（土）19:00〜22:00\n※18:45〜受付開始",
    venue_map_url: "https://maps.google.com",
    fee_male: "¥18,000",
    fee_female: "¥15,000",
    format: "着席式 / フルコース + フリードリンク",
    capacity: "60名",
    deadline: "11月20日（木）23時59分まで",
    capacity_male: 30,
    capacity_female: 30,
    remaining_male: 0,
    remaining_female: 4,
    alert_threshold: 8,
    payment_url_male: "#",
    payment_url_female: "#",
    terms_url: "https://x.gd/R00Zm",
    conditions: [],
    male_cancel_wait_done: true,
    genres: ["ガラ", "グルメ", "ドレスコード"],
    attendees: [
      { name: "伊藤 玲奈", img: "/images/ito.png" },
      { name: "田中 健", img: "/images/tanaka.png" },
      { name: "山本 彩", img: "/images/yamamoto.png" },
    ] as Attendee[],
  },
];

/** 過去の参加履歴（ダミー）— おすすめ算出の根拠 */
export const participationHistory = [
  { id: "wine-night-15", title: "COMMONS WINE NIGHT Vol.15", genres: ["ワイン", "グルメ"] },
  { id: "age26-night", title: "AGE 26+ NIGHT", genres: ["交流会"] },
  { id: "wine-salon-06", title: "COMMONS WINE SALON 6月", genres: ["ワイン", "少人数"] },
];

/** 参加人数（申込数 / 定員） */
export function attendanceOf(ev: (typeof events)[number]) {
  const capacity = ev.capacity_male + ev.capacity_female;
  const joined = capacity - (ev.remaining_male + ev.remaining_female);
  return { capacity, joined };
}

/** 男女別の募集ステータス（満枠なら「キャンセル待ち」） */
export function recruitStatusOf(ev: (typeof events)[number]) {
  const male = ev.remaining_male <= 0 ? "キャンセル待ち" : "募集中";
  const female = ev.remaining_female <= 0 ? "キャンセル待ち" : "募集中";
  return {
    male,
    female,
    allFull: male === "キャンセル待ち" && female === "キャンセル待ち",
    label:
      male === female
        ? male === "キャンセル待ち"
          ? "キャンセル待ち"
          : "募集中"
        : `男性${male}／女性${female}`,
  };
}

const reports = [
  { href: "/event-report-2", img: "/images/eventrepo2.png", label: "COMMONS WINE NIGHT Vol.15", meta: "7月5日（土）· La Cave · 24名" },
  { href: "/event-report",   img: "/images/eventrepo.png",  label: "AGE 26+ NIGHT 開催レポート",  meta: "6月26日（金）· THE THEATRE TABLE · 65名" },
];

/** 参加履歴から最頻ジャンルを算出 */
function topHistoryGenre() {
  const count = new Map<string, number>();
  participationHistory.forEach(h => h.genres.forEach(g => count.set(g, (count.get(g) ?? 0) + 1)));
  return [...count.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? "";
}

export default function EventsPage() {
  const [tab, setTab] = useState<"all" | "available" | "saved">("all");
  const [saved, setSaved] = useState<string[]>(["autumn-night-0920"]);

  const toggleSaved = (id: string) =>
    setSaved(prev => (prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]));

  const shown =
    tab === "available"
      ? events.filter(e => e.state === "募集中" && !recruitStatusOf(e).allFull)
      : tab === "saved"
        ? events.filter(e => saved.includes(e.id))
        : events;

  const favGenre = topHistoryGenre();
  const recommended = [
    ...events.filter(e => e.genres.includes(favGenre)),
    ...events.filter(e => !e.genres.includes(favGenre)),
  ].slice(0, 4);

  return (
    <div className="flex justify-center bg-[var(--color-bg)] min-h-screen">
      <div className="w-full max-w-[430px] pb-24">

        <AppHeader />

        {/* イベントレポート — COMMONS CLUB style 横スクロール */}
        <div className="pt-5 pb-4">
          <div className="px-5 flex items-baseline justify-between mb-3">
            <h2 className="font-display text-base">イベントレポート</h2>
            <Link href="/event-reports" className="font-display text-xs text-[var(--color-accent-deep)]">すべて見る →</Link>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2 -mx-0 px-5 scrollbar-muted">
            {reports.map((r) => (
              <Link
                key={r.href}
                href={r.href}
                className="flex-none w-[200px] rounded-2xl overflow-hidden border border-[var(--color-line)] hover:border-[var(--color-accent)]/60 transition"
              >
                <div
                  className="h-[110px] bg-cover bg-center"
                  style={{ backgroundImage: `url(${r.img})` }}
                />
                <div className="p-3 bg-[var(--color-bg-soft)]">
                  <div className="font-display text-sm leading-snug">{r.label}</div>
                  <div className="font-display text-[10px] text-[var(--color-mute)] mt-0.5">{r.meta}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="h-px bg-[var(--color-line)] mx-5 mb-5" />

        {/* あなたへのおすすめ */}
        <div className="pb-5">
          <div className="px-5 flex items-baseline justify-between mb-1">
            <h2 className="font-display text-base font-semibold">あなたへのおすすめ</h2>
          </div>
          <p className="px-5 font-display text-[11px] text-[var(--color-mute)] mb-3">
            過去の参加履歴（直近{participationHistory.length}件）をもとに選びました
          </p>
          <div className="flex gap-3 overflow-x-auto pb-2 px-5 scrollbar-muted">
            {recommended.map(ev => {
              const { joined, capacity } = attendanceOf(ev);
              const reason = ev.genres.includes(favGenre)
                ? `${favGenre}イベントによく参加されています`
                : "同世代のメンバーに人気です";
              return (
                <Link
                  key={ev.id}
                  href={`/events/${ev.id}`}
                  className="flex-none w-[210px] rounded-2xl overflow-hidden border border-[var(--color-line)] hover:border-[var(--color-accent)]/60 transition"
                >
                  <div
                    className="h-[100px] bg-cover bg-center"
                    style={ev.image.startsWith("/") ? { backgroundImage: `url(${ev.image})` } : { background: ev.image }}
                  />
                  <div className="p-3 bg-[var(--color-bg-soft)]">
                    <span className="tag tag-accent text-[9px]">{reason}</span>
                    <div className="font-display text-sm leading-snug mt-2">{ev.title}</div>
                    <div className="font-display text-[10px] text-[var(--color-mute)] mt-1">
                      {ev.date.month}{ev.date.day}日（{ev.date.weekday}）· <span className="num">{joined}/{capacity}</span>名
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        <div className="px-5 flex items-baseline justify-between mb-3">
          <h2 className="font-display text-base font-semibold">開催イベント</h2>
        </div>

        {/* 参加予定のイベント */}
        <Link
          href="/mypage/events"
          className="mx-5 mb-3 flex items-center justify-between rounded-full border border-[var(--color-accent)]/40 bg-[var(--color-accent)]/6 px-4 py-2.5 hover:border-[var(--color-accent)]/70 transition"
        >
          <span className="flex items-center gap-2 font-display text-xs text-[var(--color-accent-deep)]">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
            参加予定のイベント
            <span className="num text-[var(--color-accent-deep)]">
              {events.filter(e => e.state === "申込済み").length}
            </span>
          </span>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--color-mute)]">
            <polyline points="9 18 15 12 9 6"/>
          </svg>
        </Link>

        {/* Tab switcher — compact segmented control */}
        <div className="mx-5 mb-4 inline-flex rounded-full border border-[var(--color-line)] bg-[var(--color-bg-soft)] p-0.5">
          {([
            ["all", "すべて"],
            ["available", "参加可能"],
            ["saved", "気になる"],
          ] as const).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`px-3.5 py-1 rounded-full font-display text-[11px] leading-5 transition-all ${
                tab === key ? "bg-[var(--color-ink)] text-[var(--color-bg)]" : "text-[var(--color-mute)]"
              }`}
            >
              {label}
              {key === "saved" && saved.length > 0 && <span className="num ml-1">{saved.length}</span>}
            </button>
          ))}
        </div>

        {/* Event cards */}
        <div className="px-5 space-y-6">
          {shown.length === 0 && (
            <p className="font-display text-xs text-[var(--color-mute)] py-8 text-center">
              該当するイベントはありません。
            </p>
          )}
          {shown.map((ev) => {
            const { joined, capacity } = attendanceOf(ev);
            const status = recruitStatusOf(ev);
            const isSaved = saved.includes(ev.id);
            return (
            <Link key={ev.id} href={`/events/${ev.id}`} className="block">
              <article className="rounded-2xl overflow-hidden border border-[var(--color-line)] transition hover:border-[var(--color-accent)]/60 relative">
                <div
                  className="h-[220px] bg-cover bg-center"
                  style={ev.image.startsWith("/") ? { backgroundImage: `url(${ev.image})` } : { background: ev.image }}
                />

                {/* 気になる */}
                <button
                  type="button"
                  aria-label="気になる"
                  aria-pressed={isSaved}
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleSaved(ev.id); }}
                  className="absolute top-3 left-3 w-8 h-8 rounded-full flex items-center justify-center transition"
                  style={{
                    background: "rgba(11,15,22,0.6)",
                    border: `1px solid ${isSaved ? "rgba(203,174,116,0.8)" : "rgba(242,239,233,0.25)"}`,
                    backdropFilter: "blur(4px)",
                    color: isSaved ? "#CBAE74" : "rgba(242,239,233,0.8)",
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill={isSaved ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
                  </svg>
                </button>

                {ev.state === "申込済み" && (
                  <div className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-full font-display text-[11px]"
                    style={{ background: "linear-gradient(135deg,#CBAE74,#B8985A)", color: "#0B0F16" }}>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                    申込済み
                  </div>
                )}
                {(ev as { male_cancel_wait_done?: boolean }).male_cancel_wait_done && (
                  <div className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-full font-display text-[11px]"
                    style={{ background: "rgba(30,30,40,0.85)", border: "1px solid rgba(184,152,90,0.5)", color: "#CBAE74", backdropFilter: "blur(4px)" }}>
                    <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                    </svg>
                    キャンセル待ち申込済み
                  </div>
                )}

                {/* 情報エリア */}
                <div className="px-4 py-3.5 bg-[var(--color-bg-soft)] border-t border-[var(--color-line)]">
                  <div className="font-display text-[11px] text-[var(--color-mute)]">
                    {ev.date.month}{ev.date.day}日（{ev.date.weekday}）{ev.time} · {ev.station}
                  </div>
                  <h3 className="font-display text-base font-semibold leading-snug mt-1">{ev.title}</h3>

                  {/* ジャンル */}
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {ev.genres.map(g => (
                      <span key={g} className="tag tag-soft text-[10px]">{g}</span>
                    ))}
                  </div>

                  {/* 参加人数 + 参加予定者 */}
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-2">
                      <div className="flex -space-x-2">
                        {ev.attendees.slice(0, 3).map(a => (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            key={a.name}
                            src={a.img}
                            alt={a.name}
                            className="w-6 h-6 rounded-full object-cover border border-[var(--color-bg-soft)]"
                          />
                        ))}
                      </div>
                      <span className="font-display text-[10px] text-[var(--color-mute)]">
                        {ev.attendees[0]?.name} 他<span className="num">{Math.max(joined - 1, 0)}</span>名が参加予定
                      </span>
                    </div>
                    <span className="font-display text-[11px] text-[var(--color-ink-soft)]">
                      <span className="num">{joined}</span>/<span className="num">{capacity}</span>名
                    </span>
                  </div>

                  {/* 募集ステータス（男女別） */}
                  <div className="flex items-center gap-1.5 mt-2.5">
                    <span className={`tag text-[10px] ${status.male === "募集中" ? "tag-accent" : "tag-soft"}`}>
                      男性 {status.male}
                    </span>
                    <span className={`tag text-[10px] ${status.female === "募集中" ? "tag-accent" : "tag-soft"}`}>
                      女性 {status.female}
                    </span>
                  </div>
                </div>
              </article>
            </Link>
          );})}
        </div>

        <BottomNav />
      </div>
    </div>
  );
}

export function CommonsLogo({ size = 28 }: { size?: number }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src="/images/logo.png" alt="COMMONS" style={{ height: size * 1.2, width: "auto", objectFit: "contain" }} />
  );
}
