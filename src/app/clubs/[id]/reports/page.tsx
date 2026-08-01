"use client";
import Link from "next/link";
import { useParams } from "next/navigation";
import AppHeader from "@/components/AppHeader";
import BottomNav from "@/components/BottomNav";
import { getReports, getClubName } from "./reportData";

export default function ClubReportsPage() {
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : (params.id ?? "");
  const reports = getReports(id);
  const clubName = getClubName(id);

  return (
    <div className="flex justify-center bg-[var(--color-bg)] min-h-screen">
      <div className="w-full max-w-[430px] pb-24">
        <AppHeader backHref={`/clubs/${id}`} />
        <div className="px-5 pt-6 pb-4 border-b border-[var(--color-line)]">
          <p className="font-display text-[10px] tracking-[0.2em] text-[var(--color-accent-deep)] mb-1">{clubName}</p>
          <h1 className="text-xl">活動レポート</h1>
        </div>
        <div className="px-5 pt-5 space-y-4">
          {reports.map(r => (
            <Link
              key={r.id}
              href={`/clubs/${id}/reports/${r.id}`}
              className="card p-5 block hover:border-[var(--color-accent)]/60 transition"
            >
              <div className="font-display text-xs text-[var(--color-mute)] mb-2">{r.date}</div>
              <h3 className="text-sm leading-snug" style={{ fontFamily: "var(--font-mincho)" }}>{r.title}</h3>
              <p className="mt-2 text-sm text-[var(--color-mute)] leading-relaxed">{r.body}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {Array.from({ length: Math.min(r.images, 4) }).map((_, i) => (
                  <div key={i} className="w-[70px] h-[70px] rounded-lg bg-[var(--color-line)] flex items-center justify-center text-xs text-[var(--color-mute)]">📷</div>
                ))}
                {r.images > 4 && (
                  <div className="w-[70px] h-[70px] rounded-lg bg-[var(--color-line)] flex items-center justify-center text-xs text-[var(--color-mute)]">+{r.images - 4}</div>
                )}
              </div>
              <div className="mt-4 font-display text-xs text-[var(--color-accent-deep)]">レポートを読む →</div>
            </Link>
          ))}
        </div>

        <BottomNav />
      </div>
    </div>
  );
}
