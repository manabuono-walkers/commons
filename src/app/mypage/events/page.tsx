"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import BottomNav from "@/components/BottomNav";

const events = [
  { id: "music-bar-0715", month: "7月", day: "15", weekday: "土", name: "COMMONS MUSIC BAR", venue: "SOUND BAR HOWL · 渋谷", time: "18:00〜" },
  { id: "wine-salon-0802", month: "8月", day: "2",  weekday: "土", name: "COMMONS WINE SALON", venue: "La Cave · 麻布十番",    time: "19:00〜" },
  { id: "coffee-0810",     month: "8月", day: "10", weekday: "月", name: "コーヒーカッピング Vol.3", venue: "BLUE BOTTLE COFFEE · 青山", time: "14:00〜" },
];

export default function UpcomingEventsPage() {
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

        <main className="px-5 pt-6">
          <h1 className="font-display text-xl font-semibold mb-5">参加予定イベント</h1>
          <div className="card p-4">
            {events.length === 0 ? (
              <p className="text-xs text-[var(--color-mute)]">参加予定のイベントはありません。</p>
            ) : (
              <div className="space-y-0">
                {events.map((ev, i) => (
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
          </div>
        </main>

        <BottomNav />
      </div>
    </div>
  );
}
