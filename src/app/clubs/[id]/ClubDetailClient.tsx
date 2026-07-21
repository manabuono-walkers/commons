"use client";
import { useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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

// ============ Types ============
interface Reply { id: number; name: string; handle: string; avatar: string; body: string; time: string; }

interface ChatMsg {
  id: number; name: string; handle: string; avatar: string;
  body: string; time: string;
  likes: number; liked: boolean;
  rx: RxMap;
  bookmarked: boolean; isOwn: boolean; deleted: boolean;
  replies: Reply[];
}

// ============ Club Data ============
const clubData: Record<string, {
  name: string; icon: string; color: string; members: number; joined: boolean;
  memberList: { name: string; avatar: string; join: string }[];
  chat: ChatMsg[];
  events: { id: number; title: string; date: string; time: string; venue: string; cap: string; current: number; fee: string; desc: string; state: string }[];
  reports: { id: number; title: string; date: string; body: string; images: number }[];
}> = {
  wine: {
    name: "ワイン部", icon: "🍷", color: "#722F37", members: 38, joined: true,
    memberList: [
      { name: "田中 康介", avatar: "/images/tanaka.png", join: "2025.04" },
      { name: "山本 彩花", avatar: "/images/yamamoto.png", join: "2025.06" },
      { name: "伊藤 健", avatar: "/images/ito.png", join: "2026.05" },
      { name: "青山 陸", avatar: "/images/icon.png", join: "2025.11" },
      { name: "中村 優一", avatar: "中", join: "2025.08" },
      { name: "鈴木 花", avatar: "鈴", join: "2026.01" },
      { name: "渡辺 直人", avatar: "渡", join: "2026.03" },
      { name: "小林 さくら", avatar: "小", join: "2026.06" },
    ],
    chat: [
      { id: 1, name: "田中 康介", handle: "@tanaka_k", avatar: "/images/tanaka.png", body: "昨日のサロン最高でした！ポマールの2019年、まだ余韻が残っています🍷", time: "1時間前", likes: 8, liked: false, rx: mkRx({"👍":3,"♥️":5}), bookmarked: false, isOwn: false, deleted: false, replies: [] },
      { id: 2, name: "山本 彩花", handle: "@yamamoto_a", avatar: "/images/yamamoto.png", body: "同じく！次回はシャンパーニュ特集らしいですね。今から楽しみ。", time: "45分前", likes: 5, liked: true, rx: mkRx({"😊":2}), bookmarked: false, isOwn: false, deleted: false, replies: [] },
      { id: 3, name: "伊藤 健", handle: "@ito_k", avatar: "/images/ito.png", body: "初めて参加しましたが皆さん優しくて嬉しかったです。ワインの知識もゼロから勉強します！", time: "30分前", likes: 12, liked: false, rx: mkRx({"🙌":4,"♥️":3}), bookmarked: false, isOwn: false, deleted: false, replies: [{id:301, name:"田中 康介", handle:"@tanaka_k", avatar:"/images/tanaka.png", body:"伊藤さん、いらっしゃい！おすすめの入門書送りますね。", time:"20分前"}] },
      { id: 4, name: "青山 陸", handle: "@aoyama_r", avatar: "/images/icon.png", body: "次回7/5のWhisky Nightと被ってる方いますか？どっち優先しようか…", time: "5分前", likes: 2, liked: false, rx: mkRx({"😭":1}), bookmarked: false, isOwn: true, deleted: false, replies: [] },
    ],
    events: [
      { id: 1, title: "シャンパーニュ特集 Vol.3", date: "07.12", time: "19:00", venue: "La Cave 麻布十番", cap: "12", current: 4, fee: "¥8,500", desc: "銘醸シャンパーニュをヴィンテージ違いで飲み比べ。醸造家による特別解説付き。ドレスコードはスマートカジュアルでお越しください。", state: "受付中" },
      { id: 2, title: "ボルドー格付け比較会", date: "08.02", time: "18:30", venue: "Atelier du Vin 銀座", cap: "10", current: 10, fee: "¥11,000", desc: "1〜5級シャトーを縦断してテイスティング。格付けと価格の関係を体感できる贅沢な一夜。", state: "受付中" },
      { id: 3, title: "秋のブルゴーニュナイト Vol.13", date: "09.06", time: "19:00", venue: "La Cave 麻布十番", cap: "12", current: 12, fee: "¥9,500", desc: "ブルゴーニュの赤・白をヴィンテージ違いで楽しむ人気シリーズ第13弾。", state: "申込済み" },

    ],
    reports: [
      { id: 1, title: "ブルゴーニュナイト Vol.12 レポート", date: "2026.06.02", body: "12名が参加し、ポマール・ジュブレシャンベルタン・モレサンドニの3種を縦飲み。大盛況でした。", images: 6 },
      { id: 2, title: "春のロゼワイン会", date: "2026.04.20", body: "プロヴァンスのロゼを中心に5種をテイスティング。次回はスパークリングを加える案が出ました。", images: 4 },
    ],
  },
  coffee: {
    name: "コーヒー部", icon: "☕", color: "#4A3728", members: 24, joined: false,
    memberList: [
      { name: "佐藤 美咲", avatar: "佐", join: "2025.05" },
      { name: "高橋 大輔", avatar: "高", join: "2025.09" },
      { name: "田中 康介", avatar: "/images/tanaka.png", join: "2026.02" },
      { name: "青山 陸", avatar: "/images/icon.png", join: "2026.04" },
    ],
    chat: [
      { id: 1, name: "佐藤 美咲", handle: "@sato_m", avatar: "佐", body: "先週のエチオピア豆、自分でも買って淹れてみました！フルーティーで最高でした☕", time: "2時間前", likes: 6, liked: false, rx: mkRx({"👍":2,"♥️":1}), bookmarked: false, isOwn: false, deleted: false, replies: [] },
      { id: 2, name: "高橋 大輔", handle: "@takahashi_d", avatar: "高", body: "佐藤さん、どこのお店で買いました？自分も試したい！", time: "1時間前", likes: 2, liked: false, rx: mkRx(), bookmarked: false, isOwn: false, deleted: false, replies: [] },
    ],
    events: [
      { id: 1, title: "Sunday Coffee Cupping #8", date: "07.05", time: "11:00", venue: "COFFEE LAB 渋谷", cap: "8", current: 3, fee: "¥3,200", desc: "シングルオリジン3種をスペシャルティコーヒー専門家とカッピング。香りと味わいの違いを丁寧に解説します。", state: "抽選受付中" },
    ],
    reports: [
      { id: 1, title: "エチオピア×コロンビア飲み比べ", date: "2026.06.14", body: "シングルオリジン2種を丁寧にカッピング。風味の違いを体感できる充実した回でした。", images: 3 },
    ],
  },
  travel: {
    name: "旅部", icon: "✈️", color: "#1A4A3A", members: 29, joined: true,
    memberList: [
      { name: "加藤 恵子", avatar: "加", join: "2025.03" },
      { name: "田中 康介", avatar: "/images/tanaka.png", join: "2025.07" },
      { name: "伊藤 健", avatar: "/images/ito.png", join: "2026.01" },
      { name: "山本 彩花", avatar: "/images/yamamoto.png", join: "2026.04" },
      { name: "青山 陸", avatar: "/images/icon.png", join: "2026.06" },
    ],
    chat: [
      { id: 1, name: "加藤 恵子", handle: "@kato_k", avatar: "加", body: "先週の京都旅、宿のおすすめ教えてもらって助かりました！一澤信三郎帆布、素晴らしかったです。", time: "3時間前", likes: 7, liked: false, rx: mkRx({"♥️":3,"🙌":2}), bookmarked: false, isOwn: false, deleted: false, replies: [] },
      { id: 2, name: "田中 康介", handle: "@tanaka_k", avatar: "/images/tanaka.png", body: "良かった！次は金沢も検討してみてください。最近リノベホテルが増えてきました。", time: "2時間前", likes: 4, liked: false, rx: mkRx({"👍":2}), bookmarked: false, isOwn: false, deleted: false, replies: [] },
    ],
    events: [
      { id: 1, title: "金沢日帰りグルメ旅", date: "08.23", time: "07:30", venue: "東京駅（新幹線集合）", cap: "10", current: 6, fee: "¥15,000", desc: "北陸新幹線で金沢へ。近江町市場・ひがし茶屋街・21世紀美術館を巡り、夜は地元料理でディナー。現地解散可。", state: "受付中" },
    ],
    reports: [
      { id: 1, title: "春の京都旅レポート", date: "2026.04.05", body: "祇園・東山エリアを中心に、隠れ家的なお店を6軒巡りました。写真80枚のアルバムを共有中。", images: 12 },
    ],
  },
};

// ============ Sub-components ============
function ChatAvatar({ src, name }: { src: string; name: string }) {
  const isPath = src.startsWith("/");
  if (isPath) return <img src={src} alt={name} className="w-10 h-10 rounded-full flex-none object-cover border border-[var(--color-line)]" />;
  return (
    <div className="w-10 h-10 rounded-full flex-none flex items-center justify-center bg-[var(--color-ink)] text-[var(--color-bg)] font-display text-sm border border-[var(--color-line)]">
      {src}
    </div>
  );
}

function SmAvatar({ src, name }: { src: string; name: string }) {
  const isPath = src.startsWith("/");
  if (isPath) return <img src={src} alt={name} className="w-8 h-8 rounded-full flex-none object-cover border border-[var(--color-line)]" />;
  return (
    <div className="w-8 h-8 rounded-full flex-none flex items-center justify-center bg-[var(--color-ink)] text-[var(--color-bg)] font-display text-xs border border-[var(--color-line)]">
      {src}
    </div>
  );
}

const MY_AVATAR = "/images/icon.png";
const MY_NAME = "青山 陸";
const MY_HANDLE = "@aoyama_r";

const fallback = clubData.wine;
type TabType = "chat" | "events" | "members";

export default function ClubDetailClient({ id }: { id: string }) {
  const club = clubData[id] ?? fallback;
  const router = useRouter();
  const [tab, setTab] = useState<TabType>("chat");
  const [joined, setJoined] = useState(club.joined);
  const [showLeaveMenu, setShowLeaveMenu] = useState(false);
  const [showLeaveConfirm, setShowLeaveConfirm] = useState(false);
  const [leftClub, setLeftClub] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMsg[]>(club.chat);

  // chat interaction state
  const [openReplies, setOpenReplies] = useState<Set<number>>(new Set());
  const [replyDraft, setReplyDraft] = useState<Record<number, string>>({});
  const [rxPicker, setRxPicker] = useState<number | null>(null);
  const [menuOpen, setMenuOpen] = useState<number | null>(null);
  const [shareSheet, setShareSheet] = useState<ChatMsg | null>(null);
  const [showCompose, setShowCompose] = useState(false);
  const [draft, setDraft] = useState("");
  const [draftImages, setDraftImages] = useState<string[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);

  function toggleRx(msgId: number, emoji: RxEmoji) {
    setChatMessages(prev => prev.map(m => {
      if (m.id !== msgId) return m;
      const rx = { ...m.rx } as RxMap;
      (Object.keys(rx) as RxEmoji[]).forEach(e => {
        if (e !== emoji && rx[e].mine) rx[e] = { count: rx[e].count - 1, mine: false };
      });
      const cur = rx[emoji];
      rx[emoji] = { count: cur.mine ? cur.count - 1 : cur.count + 1, mine: !cur.mine };
      return { ...m, rx };
    }));
    setRxPicker(null);
  }

  function toggleLike(msgId: number) {
    setChatMessages(prev => prev.map(m =>
      m.id === msgId ? { ...m, likes: m.liked ? m.likes - 1 : m.likes + 1, liked: !m.liked } : m
    ));
  }

  function toggleBookmark(msgId: number) {
    setChatMessages(prev => prev.map(m => m.id === msgId ? { ...m, bookmarked: !m.bookmarked } : m));
  }

  function deleteMsg(msgId: number) {
    setChatMessages(prev => prev.map(m => m.id === msgId ? { ...m, deleted: true } : m));
    setMenuOpen(null);
  }

  function submitReply(msgId: number) {
    const body = (replyDraft[msgId] ?? "").trim();
    if (!body) return;
    setChatMessages(prev => prev.map(m => m.id === msgId
      ? { ...m, replies: [...m.replies, { id: Date.now(), name: MY_NAME, handle: MY_HANDLE, avatar: MY_AVATAR, body, time: "たった今" }] }
      : m));
    setReplyDraft(prev => ({ ...prev, [msgId]: "" }));
  }

  function sendMessage() {
    if (!draft.trim() && !draftImages.length) return;
    const newMsg: ChatMsg = {
      id: Date.now(), name: MY_NAME, handle: MY_HANDLE, avatar: MY_AVATAR,
      body: draft, time: "たった今",
      likes: 0, liked: false, rx: mkRx(),
      bookmarked: false, isOwn: true, deleted: false, replies: [],
    };
    setChatMessages(prev => [...prev, newMsg]);
    setDraft(""); setDraftImages([]); setShowCompose(false);
  }

  return (
    <div className="flex justify-center bg-[var(--color-bg)] min-h-screen"
      onClick={() => { setMenuOpen(null); setRxPicker(null); }}>
      <div className="w-full max-w-[430px] pb-24">
        <AppHeader backHref="/clubs" rightSlot={
          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="font-display text-sm">{club.name}</div>
              <div className="font-display text-[10px] text-[var(--color-mute)]">{club.members}人参加中</div>
            </div>
            {joined && !leftClub && (
              <button
                onClick={e => { e.stopPropagation(); setShowLeaveMenu(true); }}
                className="w-8 h-8 flex items-center justify-center text-[var(--color-mute)] hover:text-[var(--color-ink)] transition"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <circle cx="12" cy="5" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="12" cy="19" r="1.5"/>
                </svg>
              </button>
            )}
          </div>
        } />

        {/* 活動レポート */}
        <div className="px-5 pt-5 pb-4 border-b border-[var(--color-line)]">
          <div className="flex items-center justify-between mb-3">
            <p className="font-display text-xs text-[var(--color-accent-deep)]">活動レポート</p>
            <Link href={`/clubs/${id}/reports`} className="font-display text-xs text-[var(--color-mute)] hover:text-[var(--color-accent-deep)] transition flex items-center gap-1">
              すべて見る
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
            </Link>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2 -mx-5 px-5">
            {club.reports.map(r => (
              <div key={r.id} className="flex-none w-[200px] rounded-2xl overflow-hidden border border-[var(--color-line)] hover:border-[var(--color-accent)]/60 transition cursor-pointer">
                <div className="relative h-[100px] bg-[var(--color-bg-soft)] flex items-center justify-center">
                  <div className="flex gap-1.5 p-2">
                    {Array.from({ length: Math.min(r.images, 3) }).map((_, i) => (
                      <div key={i} className="w-[54px] h-[70px] rounded-lg bg-[var(--color-line)] flex items-center justify-center text-base">📷</div>
                    ))}
                    {r.images > 3 && (
                      <div className="w-[54px] h-[70px] rounded-lg bg-[var(--color-line)] flex items-center justify-center text-[10px] text-[var(--color-mute)]">+{r.images - 3}</div>
                    )}
                  </div>
                </div>
                <div className="p-3 bg-[var(--color-bg-soft)]">
                  <div className="font-display text-[10px] text-[var(--color-mute)] mb-0.5">{r.date}</div>
                  <div className="font-display text-sm leading-snug">{r.title}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 未参加 */}
        {!joined && (
          <div className="px-5 pt-6 pb-10">
            <div className="card p-6 text-center">
              <div className="font-display text-sm text-[var(--color-mute)] mb-1">このクラブのメンバーになりませんか？</div>
              <div className="text-xs text-[var(--color-mute)] leading-relaxed mb-5">参加するとチャット・イベント・メンバーリストにアクセスできます。</div>
              <button onClick={() => setJoined(true)}
                className="w-full py-3.5 rounded-full font-display text-sm tracking-[0.06em] transition hover:opacity-90 active:scale-95"
                style={{ background: "linear-gradient(135deg, #CBAE74, #B8985A)", color: "#0B0F16" }}>
                参加する
              </button>
            </div>
          </div>
        )}

        {/* 参加済み */}
        {joined && (
          <>
            {/* Tab bar */}
            <div className="flex border-b border-[var(--color-line)] sticky top-[57px] z-30 bg-[var(--color-bg)]/95 backdrop-blur-md">
              {(["chat", "events", "members"] as TabType[]).map(t => (
                <button key={t} onClick={() => setTab(t)}
                  className={`flex-1 py-3.5 font-display text-[10px] transition ${tab === t ? "border-b-2 text-[var(--color-accent-deep)]" : "text-[var(--color-mute)]"}`}
                  style={tab === t ? { borderBottomColor: "var(--color-accent-deep)" } : {}}>
                  {t === "chat" ? "チャット" : t === "events" ? "クラブ会" : "メンバー"}
                </button>
              ))}
            </div>

            {/* ===== Chat Tab ===== */}
            {tab === "chat" && (
              <div>
                {chatMessages.filter(m => !m.deleted).map(m => (
                  <div key={m.id} className="px-4 py-4 border-b border-[var(--color-line)] relative">
                    <div className="flex gap-3">
                      <ChatAvatar src={m.avatar} name={m.name} />
                      <div className="flex-1 min-w-0">
                        {/* Header */}
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-baseline gap-1.5 flex-wrap min-w-0">
                            <span className="font-display text-sm font-semibold">{m.name}</span>
                            <span className="font-display text-[10px] text-[var(--color-mute)]">{m.handle}</span>
                            <span className="font-display text-[10px] text-[var(--color-mute)]">· {m.time}</span>
                          </div>
                          {/* ⋮ menu */}
                          <div className="relative flex-none">
                            <button onClick={e => { e.stopPropagation(); setMenuOpen(menuOpen === m.id ? null : m.id); setRxPicker(null); }}
                              className="text-[var(--color-mute)] hover:text-[var(--color-ink)] transition w-6 h-6 flex items-center justify-center">
                              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                                <circle cx="12" cy="5" r="1.5" /><circle cx="12" cy="12" r="1.5" /><circle cx="12" cy="19" r="1.5" />
                              </svg>
                            </button>
                            {menuOpen === m.id && (
                              <div className="absolute right-0 top-7 z-50 w-44 bg-[var(--color-bg-soft)] border border-[var(--color-line)] rounded-xl shadow-xl overflow-hidden" onClick={e => e.stopPropagation()}>
                                <button onClick={() => { navigator.clipboard.writeText(m.body).catch(() => {}); setMenuOpen(null); }}
                                  className="w-full text-left px-4 py-3 font-display text-xs hover:bg-[var(--color-line)] transition">
                                  テキストをコピー
                                </button>
                                {m.isOwn && (
                                  <button onClick={() => deleteMsg(m.id)}
                                    className="w-full text-left px-4 py-3 font-display text-xs text-red-400 hover:bg-[var(--color-line)] transition">
                                    送信取消
                                  </button>
                                )}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Body */}
                        <p className="text-sm text-[var(--color-ink-soft)] leading-relaxed mt-1.5">{m.body}</p>

                        {/* Action bar */}
                        <div className="flex items-center gap-4 mt-3">
                          {/* Reply */}
                          <button onClick={() => setOpenReplies(prev => { const n = new Set(prev); n.has(m.id) ? n.delete(m.id) : n.add(m.id); return n; })}
                            className="flex items-center gap-1.5 text-xs text-[var(--color-mute)] hover:text-[var(--color-accent-deep)] transition">
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                            </svg>
                            <span className="num">{m.replies.length || ""}</span>
                          </button>

                          {/* Reaction picker */}
                          <div className="relative">
                            <button onClick={e => { e.stopPropagation(); setRxPicker(rxPicker === m.id ? null : m.id); setMenuOpen(null); }}
                              className="flex items-center gap-1 text-xs transition"
                              style={{ color: REACTIONS.some(r => m.rx[r.emoji].mine) ? "var(--color-accent-deep)" : "var(--color-mute)" }}>
                              {(() => {
                                const myRx = REACTIONS.find(r => m.rx[r.emoji].mine);
                                const total = REACTIONS.reduce((s, r) => s + m.rx[r.emoji].count, 0);
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
                            {rxPicker === m.id && (
                              <div className="absolute bottom-8 left-0 z-50 flex gap-0.5 p-1.5 bg-[var(--color-bg-soft)] border border-[var(--color-line)] rounded-2xl shadow-xl" onClick={e => e.stopPropagation()}>
                                {REACTIONS.map(r => (
                                  <button key={r.emoji} onClick={() => toggleRx(m.id, r.emoji)} title={r.label}
                                    className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-[var(--color-line)] transition text-lg"
                                    style={m.rx[r.emoji].mine ? { background: "var(--color-accent)", borderRadius: "50%" } : {}}>
                                    {r.emoji}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>

                          {/* Heart like */}
                          <button onClick={() => toggleLike(m.id)}
                            className="flex items-center gap-1 text-xs transition"
                            style={{ color: m.liked ? "#f87171" : "var(--color-mute)" }}>
                            <svg width="15" height="15" viewBox="0 0 24 24" fill={m.liked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                            </svg>
                            {m.isOwn && m.likes > 0 && <span className="num">{m.likes}</span>}
                          </button>

                          {/* Bookmark */}
                          <button onClick={() => toggleBookmark(m.id)}
                            className="flex items-center gap-1 text-xs transition"
                            style={{ color: m.bookmarked ? "var(--color-accent-deep)" : "var(--color-mute)" }}>
                            <svg width="15" height="15" viewBox="0 0 24 24" fill={m.bookmarked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                            </svg>
                          </button>

                          {/* Share */}
                          <button onClick={() => setShareSheet(m)} className="ml-auto text-[var(--color-mute)] hover:text-[var(--color-accent-deep)] transition">
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                              <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
                              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
                            </svg>
                          </button>
                        </div>

                        {/* Reply thread */}
                        {openReplies.has(m.id) && (
                          <div className="mt-3 border-t border-[var(--color-line)] pt-3">
                            <div className="space-y-3 mb-3">
                              {m.replies.map(r => (
                                <div key={r.id} className="flex gap-2.5">
                                  <SmAvatar src={r.avatar} name={r.name} />
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
                              <SmAvatar src={MY_AVATAR} name={MY_NAME} />
                              <div className="flex-1">
                                <input className="w-full bg-transparent text-xs text-[var(--color-ink)] placeholder-[var(--color-mute)] outline-none"
                                  placeholder="返信する..."
                                  value={replyDraft[m.id] ?? ""}
                                  onChange={e => setReplyDraft(prev => ({ ...prev, [m.id]: e.target.value }))}
                                  onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); submitReply(m.id); } }} />
                              </div>
                              <button onClick={() => submitReply(m.id)} disabled={!(replyDraft[m.id] ?? "").trim()}
                                className="font-display text-[10px] px-3 py-1 rounded-full disabled:opacity-40 transition"
                                style={{ background: "var(--color-accent)", color: "#0B0F16" }}>返信</button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                {/* FAB */}
                <button onClick={() => setShowCompose(true)}
                  className="fixed z-40 w-12 h-12 rounded-full flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-transform"
                  style={{ background: "linear-gradient(135deg,#CBAE74,#B8985A)", bottom: "calc(57px + 12px)", right: 12 }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0B0F16" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                  </svg>
                </button>
              </div>
            )}

            {/* ===== Events Tab ===== */}
            {tab === "events" && (
              <div className="px-5 pt-5 space-y-4">
                <div className="flex gap-3">
                  <Link href={`/clubs/${id}/create-event`}
                    className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-display text-sm transition"
                    style={{ background: "linear-gradient(135deg, #CBAE74, #B8985A)", color: "#0B0F16" }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                    </svg>
                    イベント作成
                  </Link>
                  <Link href={`/clubs/${id}/create-report`}
                    className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-display text-sm transition border"
                    style={{ borderColor: "var(--color-accent)", color: "var(--color-accent-deep)" }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                    </svg>
                    活動レポート作成
                  </Link>
                </div>

                {club.events.map(ev => (
                  <div key={ev.id} className="card p-5">
                    <div className="flex items-start justify-between mb-3">
                      <span className="num text-3xl leading-none">{ev.date}</span>
                    </div>
                    <h3 className="font-display text-lg">{ev.title}</h3>
                    <dl className="mt-3 grid grid-cols-2 gap-2 text-xs">
                      <dt className="font-display text-[var(--color-mute)]">定員</dt>
                      <dd className="num">{ev.current} / {ev.cap}</dd>
                      <dt className="font-display text-[var(--color-mute)]">参加費</dt>
                      <dd className="num">{ev.fee}</dd>
                    </dl>
                    {(ev.state === "受付中" || ev.state === "申込済み") && (
                      <Link href={`/clubs/${id}/events/${ev.id}`}
                        className="mt-4 w-full btn-primary justify-center text-xs flex items-center gap-1.5">
                        {ev.state === "申込済み" ? "申込済み" : "参加申込する"}
                      </Link>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* ===== Members Tab ===== */}
            {tab === "members" && (
              <div className="px-5 pt-5 space-y-1">
                <div className="font-display text-xs text-[var(--color-mute)] mb-4">{club.members}人参加中</div>
                {club.memberList.map((m, i) => (
                  <div key={i} className="flex items-center gap-3 py-3 border-b border-[var(--color-line)] last:border-0">
                    <ChatAvatar src={m.avatar} name={m.name} />
                    <div className="flex-1 min-w-0">
                      <span className="font-display text-sm">{m.name}</span>
                      <div className="font-display text-[10px] text-[var(--color-mute)] mt-0.5">参加：{m.join}</div>
                    </div>
                  </div>
                ))}
                {club.members > club.memberList.length && (
                  <div className="py-4 text-center font-display text-xs text-[var(--color-mute)]">他 {club.members - club.memberList.length}名参加中</div>
                )}
              </div>
            )}
          </>
        )}

        {/* ===== 退会済み表示 ===== */}
        {leftClub && (
          <div className="px-5 pt-10 pb-10 flex flex-col items-center gap-4">
            <div className="w-14 h-14 rounded-full flex items-center justify-center border border-[var(--color-line)]">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--color-mute)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                <polyline points="16 17 21 12 16 7"/>
                <line x1="21" y1="12" x2="9" y2="12"/>
              </svg>
            </div>
            <div className="font-display text-sm text-[var(--color-ink)]">{club.name} を退会しました</div>
            <p className="font-display text-xs text-[var(--color-mute)] text-center leading-relaxed">
              また参加したいときはいつでも申請できます。
            </p>
            <button
              onClick={() => router.push("/clubs")}
              className="mt-2 px-6 py-3 rounded-full font-display text-sm border border-[var(--color-line)] text-[var(--color-mute)] hover:text-[var(--color-ink)] transition"
            >
              クラブ一覧に戻る
            </button>
          </div>
        )}

        {/* ===== Compose Modal ===== */}
        {showCompose && (
          <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60" onClick={() => setShowCompose(false)}>
            <div className="w-full max-w-[430px] bg-[var(--color-bg-soft)] rounded-t-3xl px-5 pt-4 pb-24" onClick={e => e.stopPropagation()}>
              <div className="w-10 h-1 bg-[var(--color-line)] rounded-full mx-auto mb-4" />
              <div className="flex gap-3 mb-4">
                <ChatAvatar src={MY_AVATAR} name={MY_NAME} />
                <div className="flex-1">
                  <textarea
                    className="w-full bg-transparent text-sm text-[var(--color-ink)] placeholder-[var(--color-mute)] outline-none resize-none leading-relaxed"
                    placeholder="クラブに投稿する…" rows={4} value={draft}
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
                <button onClick={sendMessage} disabled={!draft.trim() && !draftImages.length}
                  className="font-display text-sm px-6 py-2.5 rounded-full transition disabled:opacity-40"
                  style={{ background: "linear-gradient(135deg,#CBAE74,#B8985A)", color: "#0B0F16" }}>
                  投稿する
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ===== Share Sheet ===== */}
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

      {/* ===== クラブメニューシート ===== */}
      {showLeaveMenu && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60" onClick={() => setShowLeaveMenu(false)}>
          <div className="w-full max-w-[430px] bg-[var(--color-bg-soft)] rounded-t-3xl pt-4 pb-10" onClick={e => e.stopPropagation()}>
            <div className="w-10 h-1 bg-[var(--color-line)] rounded-full mx-auto mb-5" />
            <div className="px-5 mb-4">
              <div className="font-display text-base font-semibold">{club.name}</div>
            </div>
            <div className="px-4 space-y-2">
              <button
                onClick={() => { setShowLeaveMenu(false); setShowLeaveConfirm(true); }}
                className="w-full flex items-center gap-4 px-4 py-4 rounded-2xl border border-red-400/30 bg-[var(--color-bg)] hover:bg-red-400/5 transition text-left"
              >
                <div className="w-9 h-9 rounded-full flex items-center justify-center flex-none" style={{ background: "rgba(239,68,68,0.1)" }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                    <polyline points="16 17 21 12 16 7"/>
                    <line x1="21" y1="12" x2="9" y2="12"/>
                  </svg>
                </div>
                <div>
                  <div className="font-display text-sm" style={{ color: "#ef4444" }}>退会する</div>
                  <div className="font-display text-[10px] text-[var(--color-mute)] mt-0.5">クラブから退会します</div>
                </div>
              </button>
              <button
                onClick={() => setShowLeaveMenu(false)}
                className="w-full py-3.5 rounded-2xl font-display text-sm text-[var(--color-mute)] hover:text-[var(--color-ink)] border border-[var(--color-line)] transition"
              >
                キャンセル
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===== 退会確認シート ===== */}
      {showLeaveConfirm && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60" onClick={() => setShowLeaveConfirm(false)}>
          <div className="w-full max-w-[430px] bg-[var(--color-bg-soft)] rounded-t-3xl pt-4 pb-10" onClick={e => e.stopPropagation()}>
            <div className="w-10 h-1 bg-[var(--color-line)] rounded-full mx-auto mb-5" />
            <div className="px-5 mb-5">
              <div className="font-display text-base font-semibold mb-1">退会の確認</div>
              <div className="font-display text-xs text-[var(--color-mute)]">{club.name}</div>
            </div>
            <div className="mx-5 mb-5 rounded-2xl border border-[var(--color-line)] bg-[var(--color-bg)] px-4 py-4 space-y-1.5">
              <p className="font-display text-xs text-[var(--color-ink)] leading-relaxed">退会するとチャット・イベント・メンバーリストへのアクセスができなくなります。</p>
              <p className="font-display text-xs text-[var(--color-mute)] leading-relaxed">再参加はいつでも可能です。</p>
            </div>
            <div className="px-5 space-y-3">
              <button
                onClick={() => { setLeftClub(true); setJoined(false); setShowLeaveConfirm(false); }}
                className="w-full py-3.5 rounded-full font-display text-sm transition hover:opacity-90"
                style={{ background: "linear-gradient(135deg,#ef4444,#dc2626)", color: "white" }}
              >
                退会する
              </button>
              <button
                onClick={() => setShowLeaveConfirm(false)}
                className="w-full py-3.5 rounded-full font-display text-sm border border-[var(--color-line)] text-[var(--color-mute)] hover:text-[var(--color-ink)] transition"
              >
                キャンセル
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
