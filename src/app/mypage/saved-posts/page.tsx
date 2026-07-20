"use client";
import { useState, useRef } from "react";
import BottomNav from "@/components/BottomNav";
import AppHeader from "@/components/AppHeader";

// ============ Reactions ============
const REACTIONS = [
  { emoji: "👍", label: "グッド" },
  { emoji: "♥️", label: "ハート" },
  { emoji: "😊", label: "笑顔" },
  { emoji: "😭", label: "涙" },
  { emoji: "🙌", label: "万歳" },
  { emoji: "🙇‍♀️", label: "土下座" },
] as const;
type RxEmoji = typeof REACTIONS[number]["emoji"];
type RxState = { count: number; mine: boolean };
type RxMap = Record<RxEmoji, RxState>;

function mkRx(init: Partial<Record<string, number>> = {}): RxMap {
  const m = {} as Record<string, RxState>;
  REACTIONS.forEach(r => { m[r.emoji] = { count: (init[r.emoji] ?? 0), mine: false }; });
  return m as RxMap;
}

interface Reply { id: number; name: string; handle: string; avatar: string; body: string; time: string; }

interface SavedPost {
  id: number; name: string; handle: string; avatar: string; date: string;
  body: string; rx: RxMap; likes: number; liked: boolean;
  bookmarked: boolean; deleted: boolean; replies: Reply[];
}

const MY_AVATAR = "/images/icon.png";
const MY_NAME = "青山 陸";
const MY_HANDLE = "@aoyama_r";

const INIT_POSTS: SavedPost[] = [
  {
    id: 1, name: "田中 康介", handle: "@tanaka_k", avatar: "/images/tanaka.png", date: "2026年7月11日",
    body: "昨日のサロン最高でした！ポマールの2019年、まだ余韻が残っています🍷\n\nフィネスがあってスパイスのニュアンスも感じられる、本当に素晴らしい一本でした。次回のシャンパーニュ特集も今から楽しみです。",
    rx: mkRx({"♥️":5,"👍":3}), likes: 8, liked: false, bookmarked: true, deleted: false, replies: [],
  },
  {
    id: 2, name: "山本 彩花", handle: "@yamamoto_a", avatar: "/images/yamamoto.png", date: "2026年6月28日",
    body: "COMMONSのワイン部に入ってから、飲み方がガラッと変わった気がする。\n\nただ飲むのではなく「なぜこの味なのか」を考えるようになった。知識が体験を豊かにするって、こういうことなのかも。",
    rx: mkRx({"🙌":4,"♥️":6}), likes: 24, liked: true, bookmarked: true, deleted: false, replies: [{id:201, name:"田中 康介", handle:"@tanaka_k", avatar:"/images/tanaka.png", body:"本当にそれ！入会前とは全然違う楽しみ方できてる。", time:"6日前"}],
  },
  {
    id: 3, name: "伊藤 健", handle: "@ito_k", avatar: "/images/ito.png", date: "2026年6月14日",
    body: "仕事ができる感じがする、即レスの技術\n\n• クライアントや上司からの連絡には、「確認しました、〇〇までに返信いたします」と一旦返事を送り、相手を不安にさせないようにする。\n\n• 回答に時間がかかる場合も、放置せず「現在確認中ですので、本日中にご報告します」と中間報告を忘れずに。\n\n• 相手が多忙なことを前提として、必要最小限の情報を明確に記載する。",
    rx: mkRx({"👍":12,"🙌":8}), likes: 94, liked: false, bookmarked: true, deleted: false, replies: [],
  },
  {
    id: 4, name: "中村 優一", handle: "@nakamura_y", avatar: "中", date: "2026年5月30日",
    body: "先週の金沢旅行で食べた治部煮が忘れられない。\n\nあのなんとも言えない上品な甘みと出汁のバランス…東京で食べられるお店を探しているんですが、COMMONSメンバーでおすすめ知ってる人いますか？",
    rx: mkRx({"😊":3}), likes: 15, liked: false, bookmarked: true, deleted: false, replies: [],
  },
];

function Avatar({ src, name, size = 10 }: { src: string; name: string; size?: number }) {
  const px = size * 4;
  if (src.startsWith("/")) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={name} className="rounded-full flex-none object-cover border border-[var(--color-line)]" style={{ width: px, height: px, minWidth: px }} />;
  }
  return (
    <div className="rounded-full flex-none flex items-center justify-center bg-[var(--color-ink)] text-[var(--color-bg)] font-display text-sm border border-[var(--color-line)]"
      style={{ width: px, height: px, minWidth: px }}>
      {src}
    </div>
  );
}

export default function SavedPostsPage() {
  const [query, setQuery] = useState("");
  const [posts, setPosts] = useState<SavedPost[]>(INIT_POSTS);
  const [openReplies, setOpenReplies] = useState<Set<number>>(new Set());
  const [replyDraft, setReplyDraft] = useState<Record<number, string>>({});
  const [rxPicker, setRxPicker] = useState<number | null>(null);
  const [menuOpen, setMenuOpen] = useState<number | null>(null);
  const [shareSheet, setShareSheet] = useState<SavedPost | null>(null);
  const [showCompose, setShowCompose] = useState(false);
  const [draft, setDraft] = useState("");
  const [draftImages, setDraftImages] = useState<string[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);

  const shown = query.trim()
    ? posts.filter(p => !p.deleted && (p.body.includes(query) || p.name.includes(query) || p.handle.includes(query)))
    : posts.filter(p => !p.deleted && p.bookmarked);

  function toggleRx(postId: number, emoji: RxEmoji) {
    setPosts(prev => prev.map(p => {
      if (p.id !== postId) return p;
      const rx = { ...p.rx } as RxMap;
      (Object.keys(rx) as RxEmoji[]).forEach(e => {
        if (e !== emoji && rx[e].mine) rx[e] = { count: rx[e].count - 1, mine: false };
      });
      const cur = rx[emoji];
      rx[emoji] = { count: cur.mine ? cur.count - 1 : cur.count + 1, mine: !cur.mine };
      return { ...p, rx };
    }));
    setRxPicker(null);
  }

  function toggleLike(postId: number) {
    setPosts(prev => prev.map(p => p.id === postId ? { ...p, likes: p.liked ? p.likes - 1 : p.likes + 1, liked: !p.liked } : p));
  }

  function toggleBookmark(postId: number) {
    setPosts(prev => prev.map(p => p.id === postId ? { ...p, bookmarked: !p.bookmarked } : p));
  }

  function submitReply(postId: number) {
    const body = (replyDraft[postId] ?? "").trim();
    if (!body) return;
    setPosts(prev => prev.map(p => p.id === postId
      ? { ...p, replies: [...p.replies, { id: Date.now(), name: MY_NAME, handle: MY_HANDLE, avatar: MY_AVATAR, body, time: "たった今" }] }
      : p));
    setReplyDraft(prev => ({ ...prev, [postId]: "" }));
  }

  function submitPost() {
    if (!draft.trim() && !draftImages.length) return;
    const newPost: SavedPost = {
      id: Date.now(), name: MY_NAME, handle: MY_HANDLE, avatar: MY_AVATAR, date: "たった今",
      body: draft, rx: mkRx(), likes: 0, liked: false, bookmarked: true, deleted: false, replies: [],
    };
    setPosts(prev => [newPost, ...prev]);
    setDraft(""); setDraftImages([]); setShowCompose(false);
  }

  return (
    <div className="flex justify-center bg-[var(--color-bg)] min-h-screen"
      onClick={() => { setMenuOpen(null); setRxPicker(null); }}>
      <div className="w-full max-w-[430px] pb-24">
        <AppHeader backHref="/mypage" />

        <div className="px-5 pt-5 pb-3">
          <h1 className="font-display text-2xl mb-3">保存した投稿</h1>
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-mute)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input type="text" placeholder="ブックマークを検索" value={query} onChange={e => setQuery(e.target.value)}
              className="w-full bg-[var(--color-bg-soft)] border border-[var(--color-line)] rounded-full pl-9 pr-4 py-2.5 text-sm outline-none focus:border-[var(--color-accent)]/60 placeholder-[var(--color-mute)] transition" />
          </div>
        </div>

        <div className="border-t border-[var(--color-line)]">
          {shown.length === 0 ? (
            <div className="px-5 py-12 text-center">
              <p className="font-display text-sm text-[var(--color-mute)]">該当する投稿が見つかりません</p>
            </div>
          ) : (
            shown.map(p => (
              <div key={p.id} className="px-4 py-4 border-b border-[var(--color-line)] relative">
                <div className="flex gap-3">
                  <Avatar src={p.avatar} name={p.name} size={10} />
                  <div className="flex-1 min-w-0">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-baseline gap-1.5 flex-wrap min-w-0">
                        <span className="font-display text-sm font-semibold">{p.name}</span>
                        <span className="font-display text-[10px] text-[var(--color-mute)]">{p.handle}</span>
                        <span className="font-display text-[10px] text-[var(--color-mute)]">· {p.date}</span>
                      </div>
                      {/* ⋮ menu */}
                      <div className="relative flex-none">
                        <button onClick={e => { e.stopPropagation(); setMenuOpen(menuOpen === p.id ? null : p.id); setRxPicker(null); }}
                          className="text-[var(--color-mute)] hover:text-[var(--color-ink)] transition w-6 h-6 flex items-center justify-center">
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                            <circle cx="12" cy="5" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="12" cy="19" r="1.5"/>
                          </svg>
                        </button>
                        {menuOpen === p.id && (
                          <div className="absolute right-0 top-7 z-50 w-44 bg-[var(--color-bg-soft)] border border-[var(--color-line)] rounded-xl shadow-xl overflow-hidden" onClick={e => e.stopPropagation()}>
                            <button onClick={() => { navigator.clipboard.writeText(p.body).catch(() => {}); setMenuOpen(null); }}
                              className="w-full text-left px-4 py-3 font-display text-xs hover:bg-[var(--color-line)] transition">
                              テキストをコピー
                            </button>
                            <button onClick={() => { toggleBookmark(p.id); setMenuOpen(null); }}
                              className="w-full text-left px-4 py-3 font-display text-xs hover:bg-[var(--color-line)] transition">
                              ブックマークを解除
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Body */}
                    <p className="mt-1.5 text-sm text-[var(--color-ink)] leading-relaxed whitespace-pre-line">{p.body}</p>

                    {/* Action bar */}
                    <div className="flex items-center gap-4 mt-3">
                      {/* Reply */}
                      <button onClick={() => setOpenReplies(prev => { const n = new Set(prev); n.has(p.id) ? n.delete(p.id) : n.add(p.id); return n; })}
                        className="flex items-center gap-1.5 text-xs text-[var(--color-mute)] hover:text-[var(--color-accent-deep)] transition">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                        </svg>
                        <span className="num">{p.replies.length || ""}</span>
                      </button>

                      {/* Reaction picker */}
                      <div className="relative">
                        <button onClick={e => { e.stopPropagation(); setRxPicker(rxPicker === p.id ? null : p.id); setMenuOpen(null); }}
                          className="flex items-center gap-1 text-xs transition"
                          style={{ color: REACTIONS.some(r => p.rx[r.emoji].mine) ? "var(--color-accent-deep)" : "var(--color-mute)" }}>
                          {(() => {
                            const myRx = REACTIONS.find(r => p.rx[r.emoji].mine);
                            const total = REACTIONS.reduce((s, r) => s + p.rx[r.emoji].count, 0);
                            return myRx
                              ? <><span className="text-base leading-none">{myRx.emoji}</span><span className="num ml-0.5">{total}</span></>
                              : <>
                                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="12" cy="12" r="10"/><path d="M8 13s1.5 2 4 2 4-2 4-2"/>
                                    <line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/>
                                  </svg>
                                  {total > 0 && <span className="num">{total}</span>}
                                </>;
                          })()}
                        </button>
                        {rxPicker === p.id && (
                          <div className="absolute bottom-8 left-0 z-50 flex gap-0.5 p-1.5 bg-[var(--color-bg-soft)] border border-[var(--color-line)] rounded-2xl shadow-xl" onClick={e => e.stopPropagation()}>
                            {REACTIONS.map(r => (
                              <button key={r.emoji} onClick={() => toggleRx(p.id, r.emoji)} title={r.label}
                                className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-[var(--color-line)] transition text-lg"
                                style={p.rx[r.emoji].mine ? { background: "var(--color-accent)", borderRadius: "50%" } : {}}>
                                {r.emoji}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Heart like */}
                      <button onClick={() => toggleLike(p.id)}
                        className="flex items-center gap-1 text-xs transition"
                        style={{ color: p.liked ? "#f87171" : "var(--color-mute)" }}>
                        <svg width="15" height="15" viewBox="0 0 24 24" fill={p.liked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                        </svg>
                        {p.likes > 0 && <span className="num">{p.likes}</span>}
                      </button>

                      {/* Bookmark */}
                      <button onClick={() => toggleBookmark(p.id)}
                        className="flex items-center gap-1 text-xs transition"
                        style={{ color: p.bookmarked ? "var(--color-accent-deep)" : "var(--color-mute)" }}>
                        <svg width="15" height="15" viewBox="0 0 24 24" fill={p.bookmarked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
                        </svg>
                      </button>

                      {/* Share */}
                      <button onClick={() => setShareSheet(p)} className="ml-auto text-[var(--color-mute)] hover:text-[var(--color-accent-deep)] transition">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
                          <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
                        </svg>
                      </button>
                    </div>

                    {/* Reply thread */}
                    {openReplies.has(p.id) && (
                      <div className="mt-3 border-t border-[var(--color-line)] pt-3">
                        <div className="space-y-3 mb-3">
                          {p.replies.map(r => (
                            <div key={r.id} className="flex gap-2.5">
                              <Avatar src={r.avatar} name={r.name} size={8} />
                              <div className="flex-1 min-w-0">
                                <div className="flex items-baseline gap-1.5 flex-wrap">
                                  <span className="font-display text-xs font-semibold">{r.name}</span>
                                  <span className="font-display text-[10px] text-[var(--color-mute)]">{r.handle} · {r.time}</span>
                                </div>
                                <p className="text-xs text-[var(--color-ink-soft)] leading-relaxed mt-0.5">{r.body}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="flex gap-2.5 pt-2 border-t border-[var(--color-line)]">
                          <Avatar src={MY_AVATAR} name={MY_NAME} size={8} />
                          <div className="flex-1">
                            <input className="w-full bg-transparent text-xs text-[var(--color-ink)] placeholder-[var(--color-mute)] outline-none"
                              placeholder="返信する..."
                              value={replyDraft[p.id] ?? ""}
                              onChange={e => setReplyDraft(prev => ({ ...prev, [p.id]: e.target.value }))}
                              onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); submitReply(p.id); } }} />
                          </div>
                          <button onClick={() => submitReply(p.id)} disabled={!(replyDraft[p.id] ?? "").trim()}
                            className="font-display text-[10px] px-3 py-1 rounded-full disabled:opacity-40 transition"
                            style={{ background: "var(--color-accent)", color: "#0B0F16" }}>返信</button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* FAB */}
        <button onClick={() => setShowCompose(true)}
          className="fixed z-40 w-12 h-12 rounded-full flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-transform"
          style={{ background: "linear-gradient(135deg,#CBAE74,#B8985A)", bottom: "calc(57px + 12px)", right: 12 }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0B0F16" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
        </button>

        {/* Compose Modal */}
        {showCompose && (
          <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60" onClick={() => setShowCompose(false)}>
            <div className="w-full max-w-[430px] bg-[var(--color-bg-soft)] rounded-t-3xl px-5 pt-4 pb-24" onClick={e => e.stopPropagation()}>
              <div className="w-10 h-1 bg-[var(--color-line)] rounded-full mx-auto mb-4" />
              <div className="flex gap-3 mb-4">
                <Avatar src={MY_AVATAR} name={MY_NAME} size={10} />
                <div className="flex-1">
                  <textarea className="w-full bg-transparent text-sm text-[var(--color-ink)] placeholder-[var(--color-mute)] outline-none resize-none leading-relaxed"
                    placeholder="いまどうしてる？" rows={4} value={draft}
                    onChange={e => setDraft(e.target.value)} autoFocus />
                  {draftImages.length > 0 && (
                    <div className="flex gap-2 mt-2 flex-wrap">
                      {draftImages.map((img, i) => (
                        <div key={i} className="relative w-20 h-20 rounded-lg overflow-hidden">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={img} alt="" className="w-full h-full object-cover" />
                          <button onClick={() => setDraftImages(prev => prev.filter((_, j) => j !== i))}
                            className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/60 text-white text-[10px] flex items-center justify-center">×</button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center justify-between border-t border-[var(--color-line)] pt-3">
                <button onClick={() => fileRef.current?.click()} disabled={draftImages.length >= 4}
                  className="text-[var(--color-accent-deep)] disabled:opacity-30">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
                  </svg>
                </button>
                <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={e => {
                  const files = Array.from(e.target.files ?? []).slice(0, 4 - draftImages.length);
                  files.forEach(f => { const url = URL.createObjectURL(f); setDraftImages(prev => [...prev, url].slice(0, 4)); });
                }} />
                <button onClick={submitPost} disabled={!draft.trim() && !draftImages.length}
                  className="font-display text-sm px-6 py-2.5 rounded-full transition disabled:opacity-40"
                  style={{ background: "linear-gradient(135deg,#CBAE74,#B8985A)", color: "#0B0F16" }}>
                  投稿する
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Share Sheet */}
        {shareSheet && (
          <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60" onClick={() => setShareSheet(null)}>
            <div className="w-full max-w-[430px] bg-[var(--color-bg-soft)] rounded-t-3xl px-5 pt-4 pb-24" onClick={e => e.stopPropagation()}>
              <div className="w-10 h-1 bg-[var(--color-line)] rounded-full mx-auto mb-5" />
              <h2 className="font-display text-lg mb-4">共有</h2>
              <div className="space-y-2">
                {[
                  { label: "リンクをコピー", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg> },
                  { label: "DM で送る", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg> },
                ].map(item => (
                  <button key={item.label} onClick={() => setShareSheet(null)}
                    className="w-full flex items-center gap-4 px-5 py-3.5 rounded-xl bg-[var(--color-bg)] hover:bg-[var(--color-line)] transition text-left">
                    <span className="text-[var(--color-accent-deep)]">{item.icon}</span>
                    <span className="font-display text-sm">{item.label}</span>
                  </button>
                ))}
              </div>
              <button onClick={() => setShareSheet(null)} className="w-full mt-4 py-3.5 rounded-xl font-display text-sm text-[var(--color-mute)] border border-[var(--color-line)] transition">
                キャンセル
              </button>
            </div>
          </div>
        )}

        <BottomNav />
      </div>
    </div>
  );
}
