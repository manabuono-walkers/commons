"use client";
import { useState, useRef } from "react";
import BottomNav from "@/components/BottomNav";
import AppHeader from "@/components/AppHeader";

interface Reply {
  id: number;
  name: string;
  handle: string;
  avatar: string;
  body: string;
  time: string;
  likes: number;
  liked: boolean;
  replies: Reply[];
}

interface Post {
  id: number;
  name: string;
  handle: string;
  role: string;
  avatar: string;
  body: string;
  images: string[];
  time: string;
  likes: number;
  liked: boolean;
  reposts: number;
  reposted: boolean;
  following: boolean;
  blocked: boolean;
  replies: Reply[];
}

interface DmConversation {
  id: number;
  name: string;
  avatar: string;
  lastMsg: string;
  time: string;
  unread: number;
  isGroup?: boolean;
}

interface DmMessage {
  id: number;
  fromMe: boolean;
  body: string;
  time: string;
}

const MY_HANDLE = "@aoyama_r";

const initialPosts: Post[] = [
  {
    id: 1, name: "田中 康介", handle: "@tanaka_k", role: "GOLD", avatar: "/images/tanaka.png",
    body: "昨日のワインサロン、ブルゴーニュが最高でした！次回も絶対参加します🍷 ソムリエの解説も勉強になって、最近は自分でも選べるようになってきました。",
    images: [], time: "1時間前", likes: 14, liked: false, reposts: 3, reposted: false, following: true, blocked: false,
    replies: [
      { id: 101, name: "山本 彩花", handle: "@yamamoto_a", avatar: "/images/yamamoto.png", body: "同じく！ポマールの余韻がまだ残ってます。次回のシャンパーニュ特集も楽しみですね。", time: "45分前", likes: 5, liked: false, replies: [
        { id: 1011, name: "田中 康介", handle: "@tanaka_k", avatar: "/images/tanaka.png", body: "ですよね！シャンパーニュはビンテージものが来るらしいです🥂", time: "30分前", likes: 2, liked: false, replies: [] }
      ]},
    ],
  },
  {
    id: 2, name: "山本 彩花", handle: "@yamamoto_a", role: "PLATINUM", avatar: "/images/yamamoto.png",
    body: "谷中フォトウォーク、朝の光が最高でした✨ Leicaとの相性も抜群。次回は秋に参加したいな。カメラ仲間も増えて嬉しいです。",
    images: [], time: "3時間前", likes: 27, liked: true, reposts: 8, reposted: false, following: true, blocked: false,
    replies: [
      { id: 201, name: "伊藤 健", handle: "@ito_k", avatar: "/images/ito.png", body: "写真、とても素敵でした！次回ぜひ参加させてください。", time: "2時間前", likes: 4, liked: false, replies: [] },
    ],
  },
  {
    id: 3, name: "伊藤 健", handle: "@ito_k", role: "SILVER", avatar: "/images/ito.png",
    body: "コーヒーカッピングの抽選、当たった方いますか？初参加なので楽しみです！どんな服装で行くといいのかな…",
    images: [], time: "昨日", likes: 8, liked: false, reposts: 1, reposted: false, following: false, blocked: false,
    replies: [],
  },
  {
    id: 4, name: "佐藤 美咲", handle: "@sato_m", role: "GOLD", avatar: "佐",
    body: "はじめまして！先月入会した佐藤と申します。大阪在住ですが、東京のイベントにも積極的に参加したいと思っています。よろしくお願いします🙏",
    images: [], time: "2日前", likes: 42, liked: false, reposts: 5, reposted: false, following: false, blocked: false,
    replies: [],
  },
  {
    id: 5, name: "中村 優一", handle: "@nakamura_y", role: "GOLD", avatar: "中",
    body: "Sake Atelierから帰ってきました。杜氏さんたちの情熱に圧倒されました。日本酒の世界、奥深い…。福井の蔵元さんにも行ってみたくなりました。",
    images: [], time: "3日前", likes: 19, liked: false, reposts: 4, reposted: false, following: false, blocked: false,
    replies: [],
  },
];

const initialDms: DmConversation[] = [
  { id: 1, name: "田中 康介", avatar: "/images/tanaka.png", lastMsg: "次のワインサロンも一緒に行きましょう！", time: "1時間前", unread: 2 },
  { id: 2, name: "山本 彩花", avatar: "/images/yamamoto.png", lastMsg: "写真送りますね〜📷", time: "昨日", unread: 0 },
  { id: 3, name: "伊藤 健", avatar: "/images/ito.png", lastMsg: "了解です！よろしくお願いします", time: "2日前", unread: 0 },
  { id: 4, name: "ワインクラブグループ", avatar: "🍷", lastMsg: "次回の候補日を教えてください", time: "3日前", unread: 5, isGroup: true },
];

const dmMessagesMap: Record<number, DmMessage[]> = {
  1: [
    { id: 1, fromMe: false, body: "先日のワインサロンはいかがでしたか？", time: "昨日 19:20" },
    { id: 2, fromMe: true, body: "最高でした！ブルゴーニュが特に印象的でした。", time: "昨日 19:35" },
    { id: 3, fromMe: false, body: "次のワインサロンも一緒に行きましょう！", time: "1時間前" },
  ],
  2: [
    { id: 1, fromMe: false, body: "フォトウォークの写真、送りますね〜📷", time: "昨日 10:00" },
    { id: 2, fromMe: true, body: "ありがとうございます！楽しみにしています", time: "昨日 10:15" },
    { id: 3, fromMe: false, body: "写真送りますね〜📷", time: "昨日 11:00" },
  ],
  3: [
    { id: 1, fromMe: true, body: "コーヒーカッピング、楽しみですね！", time: "2日前" },
    { id: 2, fromMe: false, body: "了解です！よろしくお願いします", time: "2日前" },
  ],
  4: [
    { id: 1, fromMe: false, body: "みなさん、次回の候補日を教えてください", time: "3日前" },
    { id: 2, fromMe: true, body: "7月下旬なら空いています！", time: "3日前" },
    { id: 3, fromMe: false, body: "次回の候補日を教えてください", time: "3日前" },
  ],
};

function Avatar({ src, name, size = 10 }: { src: string; name: string; size?: number }) {
  const isPath = src.startsWith("/");
  const cls = `w-${size} h-${size} rounded-full flex-none object-cover border border-[var(--color-line)]`;
  if (isPath) return <img src={src} alt={name} className={cls} style={{ width: size * 4, height: size * 4 }} />;
  return (
    <div className={`rounded-full flex-none flex items-center justify-center bg-[var(--color-ink)] text-[var(--color-bg)] font-display text-sm border border-[var(--color-line)]`}
      style={{ width: size * 4, height: size * 4, minWidth: size * 4 }}>
      {src}
    </div>
  );
}

function ReplyTree({ replies, depth = 0 }: { replies: Reply[]; depth?: number }) {
  const [liked, setLiked] = useState<Record<number, boolean>>({});
  if (!replies.length) return null;
  return (
    <div className={depth > 0 ? "ml-8 border-l border-[var(--color-line)] pl-3 mt-2 space-y-3" : "mt-3 space-y-3"}>
      {replies.map(r => (
        <div key={r.id}>
          <div className="flex gap-2.5">
            <Avatar src={r.avatar} name={r.name} size={8} />
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline gap-1.5 flex-wrap">
                <span className="font-display text-xs font-semibold">{r.name}</span>
                <span className="font-display text-[10px] text-[var(--color-mute)]">{r.handle}</span>
                <span className="font-display text-[10px] text-[var(--color-mute)]">· {r.time}</span>
              </div>
              <p className="text-xs text-[var(--color-ink-soft)] leading-relaxed mt-0.5">{r.body}</p>
              <div className="flex items-center gap-4 mt-1.5">
                <button
                  onClick={() => setLiked(prev => ({ ...prev, [r.id]: !prev[r.id] }))}
                  className="flex items-center gap-1 text-[10px] transition-colors"
                  style={{ color: (liked[r.id] ?? r.liked) ? "var(--color-accent-deep)" : "var(--color-mute)" }}
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill={(liked[r.id] ?? r.liked) ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                  </svg>
                  <span className="num">{r.likes + ((liked[r.id] ?? r.liked) !== r.liked ? (liked[r.id] ? 1 : -1) : 0)}</span>
                </button>
              </div>
            </div>
          </div>
          <ReplyTree replies={r.replies} depth={depth + 1} />
        </div>
      ))}
    </div>
  );
}

export default function CommunityPage() {
  const [tab, setTab] = useState<"all" | "following" | "dm">("all");
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [draft, setDraft] = useState("");
  const [draftImages, setDraftImages] = useState<string[]>([]);
  const [openReplies, setOpenReplies] = useState<Set<number>>(new Set());
  const [replyDraft, setReplyDraft] = useState<Record<number, string>>({});
  const [menuOpen, setMenuOpen] = useState<number | null>(null);
  const [shareSheet, setShareSheet] = useState<Post | null>(null);
  const [shareCopied, setShareCopied] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  // DM state
  const [dmSearch, setDmSearch] = useState("");
  const [dms, setDms] = useState<DmConversation[]>(initialDms);
  const [activeDm, setActiveDm] = useState<DmConversation | null>(null);
  const [dmMessages, setDmMessages] = useState<Record<number, DmMessage[]>>(dmMessagesMap);
  const [dmInput, setDmInput] = useState("");
  const [showGroupCreate, setShowGroupCreate] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [groupMembers, setGroupMembers] = useState("");

  const myAvatar = "/images/icon.png";

  function toggleLike(id: number) {
    setPosts(prev => prev.map(p => p.id === id
      ? { ...p, likes: p.liked ? p.likes - 1 : p.likes + 1, liked: !p.liked }
      : p));
  }

  function toggleRepost(id: number) {
    setPosts(prev => prev.map(p => p.id === id
      ? { ...p, reposts: p.reposted ? p.reposts - 1 : p.reposts + 1, reposted: !p.reposted }
      : p));
  }

  function toggleFollow(id: number) {
    setPosts(prev => prev.map(p => p.id === id ? { ...p, following: !p.following } : p));
    setMenuOpen(null);
  }

  function blockUser(id: number) {
    setPosts(prev => prev.map(p => p.id === id ? { ...p, blocked: true } : p));
    setMenuOpen(null);
  }

  function toggleReplies(id: number) {
    setOpenReplies(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  function submitReply(postId: number) {
    const body = (replyDraft[postId] ?? "").trim();
    if (!body) return;
    const newReply: Reply = {
      id: Date.now(), name: "青山 陸", handle: MY_HANDLE, avatar: myAvatar,
      body, time: "たった今", likes: 0, liked: false, replies: [],
    };
    setPosts(prev => prev.map(p => p.id === postId
      ? { ...p, replies: [...p.replies, newReply] }
      : p
    ));
    setReplyDraft(prev => ({ ...prev, [postId]: "" }));
  }

  function submit() {
    if (!draft.trim() && !draftImages.length) return;
    const newPost: Post = {
      id: Date.now(), name: "青山 陸", handle: MY_HANDLE, role: "GOLD", avatar: myAvatar,
      body: draft, images: draftImages, time: "たった今",
      likes: 0, liked: false, reposts: 0, reposted: false, following: true, blocked: false, replies: [],
    };
    setPosts(prev => [newPost, ...prev]);
    setDraft("");
    setDraftImages([]);
  }

  function handleImageAttach(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []).slice(0, 4 - draftImages.length);
    files.forEach(f => {
      const url = URL.createObjectURL(f);
      setDraftImages(prev => [...prev, url].slice(0, 4));
    });
  }

  function sendDmMessage() {
    if (!dmInput.trim() || !activeDm) return;
    const msg: DmMessage = { id: Date.now(), fromMe: true, body: dmInput.trim(), time: "たった今" };
    setDmMessages(prev => ({ ...prev, [activeDm.id]: [...(prev[activeDm.id] ?? []), msg] }));
    setDms(prev => prev.map(d => d.id === activeDm.id ? { ...d, lastMsg: dmInput.trim(), time: "たった今" } : d));
    setDmInput("");
  }

  function createGroup() {
    if (!groupName.trim()) return;
    const newGroup: DmConversation = {
      id: Date.now(), name: groupName.trim(), avatar: "G", lastMsg: "グループを作成しました", time: "たった今", unread: 0, isGroup: true,
    };
    setDms(prev => [newGroup, ...prev]);
    setDmMessages(prev => ({ ...prev, [newGroup.id]: [{ id: 1, fromMe: true, body: "グループを作成しました", time: "たった今" }] }));
    setGroupName("");
    setGroupMembers("");
    setShowGroupCreate(false);
  }

  const shown = tab === "following"
    ? posts.filter(p => p.following && !p.blocked)
    : posts.filter(p => !p.blocked);

  const filteredDms = dms.filter(d => d.name.toLowerCase().includes(dmSearch.toLowerCase()));

  const isComposableTab = tab === "all" || tab === "following";

  return (
    <div className="flex justify-center bg-[var(--color-bg)] min-h-screen" onClick={() => setMenuOpen(null)}>
      <div className="w-full max-w-[430px]" style={{ paddingBottom: isComposableTab ? 160 : 80 }}>
        <AppHeader />

        {/* Tabs */}
        <div className="flex border-b border-[var(--color-line)] sticky top-[57px] z-30 bg-[var(--color-bg)]/95 backdrop-blur-md">
          {(["all", "following", "dm"] as const).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 py-3.5 font-display text-sm transition ${tab === t ? "border-b-2 text-[var(--color-ink)]" : "text-[var(--color-mute)]"}`}
              style={tab === t ? { borderBottomColor: "var(--color-accent-deep)" } : {}}
            >
              {t === "all" ? "全体" : t === "following" ? "フォロー中" : "DM"}
            </button>
          ))}
        </div>

        {/* Feed (all / following) */}
        {isComposableTab && (
          <div>
            {shown.map(p => (
              <div key={p.id} className="px-4 py-4 border-b border-[var(--color-line)] relative" onClick={e => e.stopPropagation()}>
                <div className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <Avatar src={p.avatar} name={p.name} size={10} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-baseline gap-1.5 flex-wrap min-w-0">
                        <span className="font-display text-sm font-semibold">{p.name}</span>
                        <span className="font-display text-[10px] text-[var(--color-mute)]">{p.handle}</span>
                        <span className="font-display text-[10px] text-[var(--color-mute)]">· {p.time}</span>
                        <span className="tag text-[9px] px-2 py-0.5">{p.role}</span>
                      </div>
                      <div className="flex items-center gap-2 flex-none">
                        {!p.following && (
                          <button
                            onClick={() => toggleFollow(p.id)}
                            className="font-display text-[10px] px-3 py-1 rounded-full border border-[var(--color-accent)] text-[var(--color-accent-deep)] hover:bg-[var(--color-accent)]/10 transition"
                          >
                            フォロー
                          </button>
                        )}
                        <div className="relative">
                          <button
                            onClick={e => { e.stopPropagation(); setMenuOpen(menuOpen === p.id ? null : p.id); }}
                            className="text-[var(--color-mute)] hover:text-[var(--color-ink)] transition w-6 h-6 flex items-center justify-center"
                          >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                              <circle cx="12" cy="5" r="1.5" /><circle cx="12" cy="12" r="1.5" /><circle cx="12" cy="19" r="1.5" />
                            </svg>
                          </button>
                          {menuOpen === p.id && (
                            <div className="absolute right-0 top-7 z-50 w-40 bg-[var(--color-bg-soft)] border border-[var(--color-line)] rounded-xl shadow-xl overflow-hidden" onClick={e => e.stopPropagation()}>
                              <button
                                onClick={() => toggleFollow(p.id)}
                                className="w-full text-left px-4 py-3 font-display text-xs hover:bg-[var(--color-line)] transition"
                              >
                                {p.following ? "フォローを外す" : "フォローする"}
                              </button>
                              <button
                                onClick={() => blockUser(p.id)}
                                className="w-full text-left px-4 py-3 font-display text-xs text-red-400 hover:bg-[var(--color-line)] transition"
                              >
                                ブロックする
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <p className="text-sm text-[var(--color-ink-soft)] leading-relaxed mt-1.5">{p.body}</p>

                    {p.images.length > 0 && (
                      <div className={`mt-3 grid gap-1 rounded-xl overflow-hidden ${p.images.length === 1 ? "grid-cols-1" : "grid-cols-2"}`}>
                        {p.images.map((img, i) => (
                          <img key={i} src={img} alt="" className="w-full h-36 object-cover" />
                        ))}
                      </div>
                    )}

                    <div className="flex items-center gap-5 mt-3">
                      <button
                        onClick={() => toggleReplies(p.id)}
                        className="flex items-center gap-1.5 text-xs text-[var(--color-mute)] hover:text-[var(--color-accent-deep)] transition group"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                        </svg>
                        <span className="num">{p.replies.length}</span>
                      </button>

                      <button
                        onClick={() => toggleRepost(p.id)}
                        className="flex items-center gap-1.5 text-xs transition"
                        style={{ color: p.reposted ? "var(--color-accent-deep)" : "var(--color-mute)" }}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="17 1 21 5 17 9" />
                          <path d="M3 11V9a4 4 0 0 1 4-4h14" />
                          <polyline points="7 23 3 19 7 15" />
                          <path d="M21 13v2a4 4 0 0 1-4 4H3" />
                        </svg>
                        <span className="num">{p.reposts}</span>
                      </button>

                      <button
                        onClick={() => toggleLike(p.id)}
                        className="flex items-center gap-1.5 text-xs transition"
                        style={{ color: p.liked ? "var(--color-accent-deep)" : "var(--color-mute)" }}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill={p.liked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                        </svg>
                        <span className="num">{p.likes}</span>
                      </button>

                      <button
                        onClick={() => { setShareSheet(p); setShareCopied(false); }}
                        className="ml-auto text-[var(--color-mute)] hover:text-[var(--color-accent-deep)] transition"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
                          <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                        </svg>
                      </button>
                    </div>

                    {openReplies.has(p.id) && (
                      <div className="mt-3 border-t border-[var(--color-line)] pt-3">
                        <ReplyTree replies={p.replies} />
                        <div className="flex gap-2.5 mt-3 pt-3 border-t border-[var(--color-line)]">
                          <Avatar src={myAvatar} name="青山 陸" size={8} />
                          <div className="flex-1">
                            <input
                              className="w-full bg-transparent text-xs text-[var(--color-ink)] placeholder-[var(--color-mute)] outline-none"
                              placeholder={`@${p.handle.slice(1)} に返信`}
                              value={replyDraft[p.id] ?? ""}
                              onChange={e => setReplyDraft(prev => ({ ...prev, [p.id]: e.target.value }))}
                              onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); submitReply(p.id); } }}
                            />
                          </div>
                          <button
                            onClick={() => submitReply(p.id)}
                            disabled={!(replyDraft[p.id] ?? "").trim()}
                            className="font-display text-[10px] px-3 py-1 rounded-full disabled:opacity-40 transition"
                            style={{ background: "var(--color-accent)", color: "#0B0F16" }}
                          >
                            返信
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* DM tab */}
        {tab === "dm" && !activeDm && (
          <div>
            {/* Search + Group create */}
            <div className="px-4 py-3 border-b border-[var(--color-line)] space-y-2">
              <div className="flex items-center gap-2 bg-[var(--color-bg-soft)] rounded-xl px-3 py-2.5">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--color-mute)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <input
                  className="flex-1 bg-transparent text-sm outline-none placeholder-[var(--color-mute)]"
                  placeholder="名前で検索..."
                  value={dmSearch}
                  onChange={e => setDmSearch(e.target.value)}
                />
              </div>
              <button
                onClick={() => setShowGroupCreate(true)}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-xl border border-[var(--color-accent)]/30 text-[var(--color-accent-deep)] hover:bg-[var(--color-accent)]/8 transition"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  <line x1="21" y1="9" x2="21" y2="15" />
                  <line x1="18" y1="12" x2="24" y2="12" />
                </svg>
                <span className="font-display text-xs tracking-wide">グループを作成</span>
              </button>
            </div>

            {/* Conversation list */}
            <div>
              {filteredDms.map(d => (
                <button
                  key={d.id}
                  onClick={() => { setActiveDm(d); setDms(prev => prev.map(x => x.id === d.id ? { ...x, unread: 0 } : x)); }}
                  className="w-full flex items-center gap-3 px-4 py-4 border-b border-[var(--color-line)] hover:bg-[var(--color-bg-soft)] transition text-left"
                >
                  <div className="relative flex-none">
                    <Avatar src={d.avatar} name={d.name} size={11} />
                    {d.unread > 0 && (
                      <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-display" style={{ background: "var(--color-accent)", color: "#0B0F16" }}>
                        {d.unread}
                      </span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline justify-between mb-0.5">
                      <span className={`font-display text-sm ${d.unread > 0 ? "text-[var(--color-ink)]" : "text-[var(--color-ink-soft)]"}`}>{d.name}</span>
                      <span className="font-display text-[10px] text-[var(--color-mute)] flex-none ml-2">{d.time}</span>
                    </div>
                    <p className="text-xs text-[var(--color-mute)] truncate">{d.lastMsg}</p>
                  </div>
                </button>
              ))}
              {filteredDms.length === 0 && (
                <div className="px-5 py-12 text-center font-display text-sm text-[var(--color-mute)]">
                  該当するDMが見つかりません
                </div>
              )}
            </div>
          </div>
        )}

        {/* DM chat view */}
        {tab === "dm" && activeDm && (
          <div className="flex flex-col" style={{ minHeight: "calc(100vh - 57px - 57px - 80px)" }}>
            {/* Chat header */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-[var(--color-line)] bg-[var(--color-bg)]/95 backdrop-blur-md sticky top-[57px] z-20">
              <button
                onClick={() => setActiveDm(null)}
                className="text-[var(--color-mute)] hover:text-[var(--color-ink)] transition p-1"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
              </button>
              <Avatar src={activeDm.avatar} name={activeDm.name} size={9} />
              <div>
                <div className="font-display text-sm">{activeDm.name}</div>
                {activeDm.isGroup && <div className="font-display text-[10px] text-[var(--color-mute)]">グループ</div>}
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 px-4 py-4 space-y-4">
              {(dmMessages[activeDm.id] ?? []).map(msg => (
                <div key={msg.id} className={`flex gap-2.5 ${msg.fromMe ? "flex-row-reverse" : ""}`}>
                  {!msg.fromMe && <Avatar src={activeDm.avatar} name={activeDm.name} size={8} />}
                  <div>
                    <div
                      className="text-sm px-4 py-2.5 rounded-2xl max-w-[240px] leading-relaxed"
                      style={msg.fromMe
                        ? { background: "linear-gradient(135deg, #CBAE74, #B8985A)", color: "#0B0F16" }
                        : { background: "var(--color-bg-soft)", color: "var(--color-ink)", border: "1px solid var(--color-line)" }
                      }
                    >
                      {msg.body}
                    </div>
                    <div className={`font-display text-[10px] text-[var(--color-mute)] mt-1 ${msg.fromMe ? "text-right" : ""}`}>{msg.time}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* DM input */}
            <div className="px-4 py-3 border-t border-[var(--color-line)] bg-[var(--color-bg)] flex gap-2 items-end sticky bottom-[57px]">
              <div className="flex-1 bg-[var(--color-bg-soft)] rounded-2xl px-4 py-2.5 border border-[var(--color-line)]">
                <input
                  className="w-full bg-transparent text-sm outline-none placeholder-[var(--color-mute)]"
                  placeholder="メッセージを入力..."
                  value={dmInput}
                  onChange={e => setDmInput(e.target.value)}
                  onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendDmMessage(); } }}
                />
              </div>
              <button
                onClick={sendDmMessage}
                disabled={!dmInput.trim()}
                className="flex-none w-10 h-10 rounded-full flex items-center justify-center transition disabled:opacity-40"
                style={{ background: "linear-gradient(135deg, #CBAE74, #B8985A)" }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0B0F16" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* Share sheet */}
        {shareSheet && (
          <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60" onClick={() => setShareSheet(null)}>
            <div
              className="w-full max-w-[430px] bg-[var(--color-bg-soft)] rounded-t-3xl px-5 pt-4 pb-10"
              onClick={e => e.stopPropagation()}
            >
              <div className="w-10 h-1 bg-[var(--color-line)] rounded-full mx-auto mb-5" />
              <h2 className="font-display text-lg mb-1">共有</h2>
              <p className="font-display text-[10px] text-[var(--color-mute)] mb-5 line-clamp-2">{shareSheet.name}: {shareSheet.body.slice(0, 50)}…</p>
              <div className="space-y-2">
                {[
                  { label: "リンクをコピー", icon: (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                    </svg>
                  ), action: () => { setShareCopied(true); } },
                  { label: "投稿をブックマーク", icon: (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                    </svg>
                  ), action: () => setShareSheet(null) },
                  { label: "DM で送る", icon: (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
                    </svg>
                  ), action: () => setShareSheet(null) },
                ].map(item => (
                  <button
                    key={item.label}
                    onClick={item.action}
                    className="w-full flex items-center gap-4 px-5 py-3.5 rounded-xl bg-[var(--color-bg)] hover:bg-[var(--color-line)] transition text-left"
                  >
                    <span className="text-[var(--color-accent-deep)]">{item.icon}</span>
                    <span className="font-display text-sm flex-1">{item.label}</span>
                    {item.label === "リンクをコピー" && shareCopied && (
                      <span className="font-display text-[10px] text-[var(--color-accent-deep)]">コピー済み</span>
                    )}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setShareSheet(null)}
                className="w-full mt-4 py-3.5 rounded-xl font-display text-sm text-[var(--color-mute)] hover:text-[var(--color-ink)] border border-[var(--color-line)] transition"
              >
                キャンセル
              </button>
            </div>
          </div>
        )}

        {/* Group create modal */}
        {showGroupCreate && (
          <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60" onClick={() => setShowGroupCreate(false)}>
            <div
              className="w-full max-w-[430px] bg-[var(--color-bg-soft)] rounded-t-3xl px-5 pt-4 pb-10"
              onClick={e => e.stopPropagation()}
            >
              <div className="w-10 h-1 bg-[var(--color-line)] rounded-full mx-auto mb-5" />
              <h2 className="font-display text-xl mb-5">グループを作成</h2>
              <div className="space-y-4 mb-6">
                <div>
                  <label className="font-display text-xs text-[var(--color-accent-deep)] block mb-2">グループ名</label>
                  <input
                    className="w-full bg-[var(--color-bg)] border border-[var(--color-line)] rounded-xl px-4 py-3 text-sm outline-none focus:border-[var(--color-accent)]/50"
                    placeholder="グループ名を入力..."
                    value={groupName}
                    onChange={e => setGroupName(e.target.value)}
                  />
                </div>
                <div>
                  <label className="font-display text-xs text-[var(--color-accent-deep)] block mb-2">メンバーを追加</label>
                  <input
                    className="w-full bg-[var(--color-bg)] border border-[var(--color-line)] rounded-xl px-4 py-3 text-sm outline-none focus:border-[var(--color-accent)]/50"
                    placeholder="名前を入力して検索..."
                    value={groupMembers}
                    onChange={e => setGroupMembers(e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-3">
                <button
                  onClick={createGroup}
                  disabled={!groupName.trim()}
                  className="w-full py-4 rounded-full font-display text-base transition-all hover:opacity-90 active:scale-95 disabled:opacity-40"
                  style={{ background: "linear-gradient(135deg, #CBAE74, #B8985A)", color: "#0B0F16" }}
                >
                  グループを作成
                </button>
                <button
                  onClick={() => setShowGroupCreate(false)}
                  className="w-full btn-outline justify-center"
                >
                  キャンセル
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Fixed compose bar (タイムライン・フォロー中のみ) */}
        {isComposableTab && (
          <div className="fixed bottom-[57px] left-0 right-0 z-40 flex justify-center pointer-events-none">
            <div className="w-full max-w-[430px] pointer-events-auto bg-[var(--color-bg)]/95 backdrop-blur-md border-t border-[var(--color-line)] px-4 py-3">
              <div className="flex gap-3">
                <Avatar src={myAvatar} name="青山 陸" size={10} />
                <div className="flex-1 min-w-0">
                  <textarea
                    className="w-full bg-transparent text-sm text-[var(--color-ink)] placeholder-[var(--color-mute)] outline-none resize-none leading-relaxed"
                    placeholder="いまどうしてる？"
                    rows={draft ? 3 : 1}
                    value={draft}
                    onChange={e => setDraft(e.target.value)}
                  />
                  {draftImages.length > 0 && (
                    <div className="flex gap-2 mt-2 flex-wrap">
                      {draftImages.map((img, i) => (
                        <div key={i} className="relative w-20 h-20 rounded-lg overflow-hidden">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={img} alt="" className="w-full h-full object-cover" />
                          <button
                            onClick={() => setDraftImages(prev => prev.filter((_, j) => j !== i))}
                            className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/60 text-white text-[10px] flex items-center justify-center"
                          >×</button>
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-[var(--color-line)]">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => fileRef.current?.click()}
                        disabled={draftImages.length >= 4}
                        className="text-[var(--color-accent-deep)] disabled:opacity-30"
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="3" y="3" width="18" height="18" rx="2" />
                          <circle cx="8.5" cy="8.5" r="1.5" />
                          <polyline points="21 15 16 10 5 21" />
                        </svg>
                      </button>
                      <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={handleImageAttach} />
                      <span className="font-display text-[10px] text-[var(--color-mute)]">画像4枚まで</span>
                    </div>
                    <button
                      onClick={submit}
                      disabled={!draft.trim() && !draftImages.length}
                      className="font-display text-xs px-4 py-2 rounded-full border border-[var(--color-accent)]/50 text-[var(--color-accent-deep)] tracking-[0.06em] hover:bg-[var(--color-accent)]/10 transition disabled:opacity-30"
                    >
                      投稿する
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <BottomNav />
      </div>
    </div>
  );
}
