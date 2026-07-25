"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import BottomNav from "@/components/BottomNav";

function Avatar({ src, name }: { src: string; name: string }) {
  const base = "w-11 h-11 rounded-full flex-none border border-[var(--color-line)]";
  if (src.startsWith("/")) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={name} className={`${base} object-cover`} />;
  }
  return (
    <div className={`${base} flex items-center justify-center bg-[var(--color-ink)] text-[var(--color-bg)] font-display text-sm`}>
      {src}
    </div>
  );
}

const INIT_MUTED = [
  { id: 1, name: "田中 康介", handle: "@tanaka_k", avatar: "/images/tanaka.png" },
];

export default function MutedPage() {
  const router = useRouter();
  const [muted, setMuted] = useState(INIT_MUTED);
  const [unmuted, setUnmuted] = useState<number[]>([]);

  function handleUnmute(id: number) {
    setUnmuted(prev => [...prev, id]);
    setTimeout(() => setMuted(prev => prev.filter(u => u.id !== id)), 500);
  }

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
          <h1 className="font-display text-xl font-semibold mb-1">ミュートリスト</h1>
          <p className="font-display text-xs text-[var(--color-mute)] mb-6">ミュート中のユーザーからの通知はオフになっています</p>

          {muted.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <div className="w-14 h-14 rounded-full flex items-center justify-center border border-[var(--color-line)]">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--color-mute)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 8a6 6 0 0 0-12 0v4l-2 2v1h16v-1l-2-2V8z"/><path d="M12 19v3M8 19h8"/>
                </svg>
              </div>
              <p className="font-display text-sm text-[var(--color-mute)]">ミュートしているユーザーはいません</p>
            </div>
          ) : (
            <div className="space-y-px bg-[var(--color-line)] rounded-2xl overflow-hidden border border-[var(--color-line)]">
              {muted.map(u => (
                <div key={u.id}
                  className="flex items-center gap-3 px-4 py-3.5 bg-[var(--color-bg)] transition"
                  style={{ opacity: unmuted.includes(u.id) ? 0.4 : 1 }}
                >
                  <Avatar src={u.avatar} name={u.name} />
                  <div className="flex-1 min-w-0">
                    <div className="font-display text-sm text-[var(--color-ink)]">{u.name}</div>
                    <div className="font-display text-[11px] text-[var(--color-mute)]">{u.handle}</div>
                  </div>
                  <button
                    onClick={() => handleUnmute(u.id)}
                    disabled={unmuted.includes(u.id)}
                    className="flex-none px-4 py-2 rounded-full font-display text-xs border transition"
                    style={{
                      borderColor: unmuted.includes(u.id) ? "var(--color-line)" : "var(--color-accent)",
                      color: unmuted.includes(u.id) ? "var(--color-mute)" : "var(--color-accent-deep)",
                    }}
                  >
                    {unmuted.includes(u.id) ? "解除済み" : "ミュート解除"}
                  </button>
                </div>
              ))}
            </div>
          )}
        </main>

        <BottomNav />
      </div>
    </div>
  );
}
