"use client";
import { useState } from "react";
import BottomNav from "@/components/BottomNav";
import AppHeader from "@/components/AppHeader";

const savedPosts = [
  {
    id: 1,
    name: "田中 康介",
    handle: "@tanaka_k",
    avatar: "/images/tanaka.png",
    date: "2026年7月11日",
    body: "昨日のサロン最高でした！ポマールの2019年、まだ余韻が残っています🍷\n\nフィネスがあってスパイスのニュアンスも感じられる、本当に素晴らしい一本でした。次回のシャンパーニュ特集も今から楽しみです。",
    replies: 3,
    retweets: 2,
    likes: 8,
    views: 1240,
    bookmarked: true,
  },
  {
    id: 2,
    name: "山本 彩花",
    handle: "@yamamoto_a",
    avatar: "/images/yamamoto.png",
    date: "2026年6月28日",
    body: "COMMONSのワイン部に入ってから、飲み方がガラッと変わった気がする。\n\nただ飲むのではなく「なぜこの味なのか」を考えるようになった。知識が体験を豊かにするって、こういうことなのかも。",
    replies: 5,
    retweets: 7,
    likes: 24,
    views: 3600,
    bookmarked: true,
  },
  {
    id: 3,
    name: "伊藤 健",
    handle: "@ito_k",
    avatar: "/images/ito.png",
    date: "2026年6月14日",
    body: "仕事ができる感じがする、即レスの技術\n\n• クライアントや上司からの連絡には、「確認しました、〇〇までに返信いたします」と一旦返事を送り、相手を不安にさせないようにする。\n\n• 回答に時間がかかる場合も、放置せず「現在確認中ですので、本日中にご報告します」と中間報告を忘れずに。\n\n• 相手が多忙なことを前提として、必要最小限の情報を明確に記載する。",
    replies: 12,
    retweets: 18,
    likes: 94,
    views: 12300,
    bookmarked: true,
  },
  {
    id: 4,
    name: "中村 優一",
    handle: "@nakamura_y",
    avatar: "中",
    date: "2026年5月30日",
    body: "先週の金沢旅行で食べた治部煮が忘れられない。\n\nあのなんとも言えない上品な甘みと出汁のバランス…東京で食べられるお店を探しているんですが、COMMONSメンバーでおすすめ知ってる人いますか？",
    replies: 6,
    retweets: 0,
    likes: 15,
    views: 980,
    bookmarked: true,
  },
];

function formatNum(n: number) {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(n);
}

export default function SavedPostsPage() {
  const [query, setQuery] = useState("");
  const [bookmarks, setBookmarks] = useState(savedPosts);

  const filtered = query.trim()
    ? bookmarks.filter(p => p.body.includes(query) || p.name.includes(query) || p.handle.includes(query))
    : bookmarks;

  function removeBookmark(id: number) {
    setBookmarks(prev => prev.filter(p => p.id !== id));
  }

  return (
    <div className="flex justify-center bg-[var(--color-bg)] min-h-screen">
      <div className="w-full max-w-[430px] pb-24">
        <AppHeader backHref="/mypage" />

        <div className="px-5 pt-5 pb-3">
          <h1 className="font-display text-2xl mb-3">保存した投稿</h1>
          {/* 検索バー */}
          <div className="relative">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
              width="16" height="16" viewBox="0 0 24 24" fill="none"
              stroke="var(--color-mute)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input
              type="text"
              placeholder="ブックマークを検索"
              value={query}
              onChange={e => setQuery(e.target.value)}
              className="w-full bg-[var(--color-bg-soft)] border border-[var(--color-line)] rounded-full pl-9 pr-4 py-2.5 text-sm outline-none focus:border-[var(--color-accent)]/60 placeholder-[var(--color-mute)] transition"
            />
          </div>
        </div>

        <div className="divide-y divide-[var(--color-line)] border-t border-[var(--color-line)]">
          {filtered.length === 0 ? (
            <div className="px-5 py-12 text-center">
              <p className="font-display text-sm text-[var(--color-mute)]">該当する投稿が見つかりません</p>
            </div>
          ) : (
            filtered.map(post => (
              <PostItem key={post.id} post={post} onRemove={() => removeBookmark(post.id)} />
            ))
          )}
        </div>

        <BottomNav />
      </div>
    </div>
  );
}

function PostItem({ post, onRemove }: { post: typeof savedPosts[0]; onRemove: () => void }) {
  const isPath = post.avatar.startsWith("/");

  return (
    <div className="px-4 py-4">
      <div className="flex gap-3">
        {/* Avatar */}
        <div className="flex-none">
          {isPath ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={post.avatar} alt={post.name} className="w-10 h-10 rounded-full object-cover border border-[var(--color-line)]" />
          ) : (
            <div className="w-10 h-10 rounded-full flex items-center justify-center bg-[var(--color-ink)] text-[var(--color-bg)] font-display text-sm border border-[var(--color-line)]">
              {post.avatar}
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <div className="flex items-baseline gap-1.5 flex-wrap">
                <span className="font-display text-sm font-semibold truncate">{post.name}</span>
                <span className="font-display text-[11px] text-[var(--color-mute)]">{post.handle}</span>
                <span className="font-display text-[11px] text-[var(--color-mute)]">· {post.date}</span>
              </div>
            </div>
            {/* Remove bookmark */}
            <button
              onClick={onRemove}
              className="flex-none p-1 text-[var(--color-accent-deep)] hover:opacity-70 transition"
              title="ブックマークを解除"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none">
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
              </svg>
            </button>
          </div>

          {/* Body */}
          <p className="mt-1.5 text-sm text-[var(--color-ink)] leading-relaxed whitespace-pre-line">{post.body}</p>

          {/* Actions */}
          <div className="mt-3 flex items-center gap-5">
            <button className="flex items-center gap-1.5 text-xs text-[var(--color-mute)] hover:text-[var(--color-accent-deep)] transition">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
              </svg>
              <span className="num">{post.replies}</span>
            </button>
            <button className="flex items-center gap-1.5 text-xs text-[var(--color-mute)] hover:text-[var(--color-accent-deep)] transition">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/>
              </svg>
              <span className="num">{post.retweets}</span>
            </button>
            <button className="flex items-center gap-1.5 text-xs text-[var(--color-mute)] hover:text-[var(--color-accent-deep)] transition">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
              <span className="num">{post.likes}</span>
            </button>
            <button className="flex items-center gap-1.5 text-xs text-[var(--color-mute)] hover:text-[var(--color-accent-deep)] transition">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
              </svg>
              <span className="num">{formatNum(post.views)}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
