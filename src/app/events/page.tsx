"use client";

import { useState } from "react";
import Link from "next/link";
import BottomNav from "@/components/BottomNav";
import AppHeader from "@/components/AppHeader";

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
  },
  {
    id: "wine-salon-0802",
    title: "COMMONS WINE SALON",
    date: { month: "8月", day: "2", weekday: "土" },
    time: "19:00〜22:00",
    venue: "La Cave",
    station: "麻布十番駅",
    state: "受付準備中",
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
  },
];

export default function EventsPage() {
  const [tab, setTab] = useState<"all" | "available">("all");
  const shown = tab === "available"
    ? events.filter(e => e.state === "募集中")
    : events;

  return (
    <div className="flex justify-center bg-[var(--color-bg)] min-h-screen">
      <div className="w-full max-w-[430px] pb-24">

        <AppHeader />

        <div className="px-5 pt-8 pb-5 text-center">
          <p className="font-display text-xs tracking-[0.2em] text-[var(--color-accent-deep)] mb-2">Scheduled Events</p>
          <h1 className="font-display text-3xl tracking-wide">開催イベント</h1>
        </div>

        <div className="h-px bg-[var(--color-line)] mx-5 mb-6" />

        {/* Tab switcher */}
        <div className="flex mx-5 mb-2 rounded-full border border-[var(--color-line)] overflow-hidden bg-[var(--color-bg-soft)]">
          <button
            onClick={() => setTab("all")}
            className={`flex-1 py-3 font-display text-sm transition-all ${tab === "all" ? "bg-[var(--color-ink)] text-[var(--color-bg)]" : "text-[var(--color-mute)]"}`}
          >
            すべてのイベント
          </button>
          <button
            onClick={() => setTab("available")}
            className={`flex-1 py-3 font-display text-sm transition-all ${tab === "available" ? "bg-[var(--color-ink)] text-[var(--color-bg)]" : "text-[var(--color-mute)]"}`}
          >
            参加可能なイベント
          </button>
        </div>

        {/* Event cards */}
        <div className="px-5 space-y-6">
          {shown.map((ev) => (
            <Link key={ev.id} href={`/events/${ev.id}`}>
              <article className="rounded-2xl overflow-hidden border border-[var(--color-line)] transition hover:border-[var(--color-accent)]/60">
                {/* Hero image */}
                <div
                  className="h-[220px] bg-cover bg-center"
                  style={ev.image.startsWith("/") ? { backgroundImage: `url(${ev.image})` } : { background: ev.image }}
                />
              </article>
            </Link>
          ))}
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
