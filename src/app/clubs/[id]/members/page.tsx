"use client";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import AppHeader from "@/components/AppHeader";
import BottomNav from "@/components/BottomNav";
import { getRoster, getClubName, type ClubMember } from "../clubMembers";

function MemberAvatar({ src, name }: { src: string; name: string }) {
  if (src.startsWith("/")) {
    return (
      <Image
        src={src}
        alt={name}
        width={40}
        height={40}
        className="w-10 h-10 rounded-full object-cover flex-none"
      />
    );
  }
  return (
    <div className="w-10 h-10 rounded-full flex-none flex items-center justify-center bg-[var(--color-line)] font-display text-sm text-[var(--color-ink-soft)]">
      {src}
    </div>
  );
}

export default function ClubMembersPage() {
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : (params.id ?? "");
  const clubName = getClubName(id);
  const roster = getRoster(id);
  const [query, setQuery] = useState("");

  const filtered: ClubMember[] = query.trim()
    ? roster.filter(m => m.name.toLowerCase().includes(query.trim().toLowerCase()))
    : roster;

  return (
    <div className="flex justify-center bg-[var(--color-bg)] min-h-screen">
      <div className="w-full max-w-[430px] pb-24">
        <AppHeader backHref={`/clubs/${id}`} />

        <div className="px-5 pt-6 pb-4 border-b border-[var(--color-line)]">
          <p className="font-display text-[10px] tracking-[0.2em] text-[var(--color-accent-deep)] mb-1">{clubName}</p>
          <h1 className="text-xl">参加メンバー</h1>
          <div className="font-display text-xs text-[var(--color-mute)] mt-1.5">
            <span className="num">{roster.length}</span>人が参加しています
          </div>
        </div>

        {/* 名前で絞り込み */}
        <div className="px-5 pt-4">
          <div className="relative">
            <svg
              className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-[var(--color-mute)]"
              width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
              strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="メンバー名で検索…"
              className="w-full bg-[var(--color-bg-soft)] border border-[var(--color-line)] rounded-full pl-9 pr-8 py-2.5 text-sm outline-none focus:border-[var(--color-accent)]/60 placeholder-[var(--color-mute)] transition font-display"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--color-mute)]"
                aria-label="検索条件をクリア"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            )}
          </div>
          {query && (
            <div className="font-display text-[10px] text-[var(--color-mute)] mt-2">
              <span className="num">{filtered.length}</span>件が該当
            </div>
          )}
        </div>

        {/* メンバー一覧 */}
        <div className="px-5 pt-4">
          {filtered.length === 0 ? (
            <div className="py-16 text-center font-display text-sm text-[var(--color-mute)]">
              該当するメンバーがいません
            </div>
          ) : (
            <div className="card divide-y divide-[var(--color-line)]">
              {filtered.map((m, i) => (
                <div key={`${m.name}-${i}`} className="flex items-center gap-3 px-4 py-3">
                  <MemberAvatar src={m.avatar} name={m.name} />
                  <div className="flex-1 min-w-0">
                    <div className="font-display text-sm truncate">{m.name}</div>
                    <div className="font-display text-[10px] text-[var(--color-mute)] mt-0.5">参加：{m.join}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="px-5 mt-6">
          <Link
            href={`/clubs/${id}`}
            className="w-full py-3.5 rounded-xl font-display text-sm text-[var(--color-mute)] hover:text-[var(--color-ink)] border border-[var(--color-line)] transition flex items-center justify-center"
          >
            クラブページへ戻る
          </Link>
        </div>

        <BottomNav />
      </div>
    </div>
  );
}
