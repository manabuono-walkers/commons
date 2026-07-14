"use client";
import { useState, useRef } from "react";
import BottomNav from "@/components/BottomNav";
import AppHeader from "@/components/AppHeader";

const clubData: Record<string, {
  name: string; icon: string; color: string; members: number;
  memberList: { name: string; avatar: string; role?: string; join: string }[];
  chat: { id: number; name: string; handle: string; avatar: string; body: string; time: string; likes: number; liked: boolean }[];
  events: { id: number; title: string; date: string; cap: string; fee: string; state: string }[];
  reports: { id: number; title: string; date: string; body: string; images: number }[];
}> = {
  wine: {
    name: "ワイン部", icon: "🍷", color: "#722F37", members: 38,
    memberList: [
      { name: "田中 康介", avatar: "/images/tanaka.png", role: "モデレータ", join: "2025.04" },
      { name: "山本 彩花", avatar: "/images/yamamoto.png", join: "2025.06" },
      { name: "伊藤 健", avatar: "/images/ito.png", join: "2026.05" },
      { name: "青山 陸", avatar: "/images/icon.png", join: "2025.11" },
      { name: "中村 優一", avatar: "中", join: "2025.08" },
      { name: "鈴木 花", avatar: "鈴", join: "2026.01" },
      { name: "渡辺 直人", avatar: "渡", join: "2026.03" },
      { name: "小林 さくら", avatar: "小", join: "2026.06" },
    ],
    chat: [
      { id: 1, name: "田中 康介", handle: "@tanaka_k", avatar: "/images/tanaka.png", body: "昨日のサロン最高でした！ポマールの2019年、まだ余韻が残っています🍷", time: "1時間前", likes: 8, liked: false },
      { id: 2, name: "山本 彩花", handle: "@yamamoto_a", avatar: "/images/yamamoto.png", body: "同じく！次回はシャンパーニュ特集らしいですね。今から楽しみ。", time: "45分前", likes: 5, liked: true },
      { id: 3, name: "伊藤 健", handle: "@ito_k", avatar: "/images/ito.png", body: "初めて参加しましたが皆さん優しくて嬉しかったです。ワインの知識もゼロから勉強します！", time: "30分前", likes: 12, liked: false },
      { id: 4, name: "中村 優一", handle: "@nakamura_y", avatar: "中", body: "伊藤さん、いらっしゃい！おすすめの入門書送りますね。", time: "20分前", likes: 3, liked: false },
      { id: 5, name: "青山 陸", handle: "@aoyama_r", avatar: "/images/icon.png", body: "次回7/5のWhisky Nightと被ってる方いますか？どっち優先しようか…", time: "5分前", likes: 2, liked: false },
    ],
    events: [
      { id: 1, title: "シャンパーニュ特集 Vol.3", date: "07.12", cap: "4 / 12", fee: "¥8,500", state: "受付中" },
      { id: 2, title: "ボルドー格付け比較会", date: "08.02", cap: "0 / 10", fee: "¥11,000", state: "準備中" },
      { id: 3, title: "ロワール川ワインツアー（企画中）", date: "09月予定", cap: "- / 8", fee: "未定", state: "企画中" },
    ],
    reports: [
      { id: 1, title: "ブルゴーニュナイト Vol.12 レポート", date: "2026.06.02", body: "12名が参加し、ポマール・ジュブレシャンベルタン・モレサンドニの3種を縦飲み。大盛況でした。", images: 6 },
      { id: 2, title: "春のロゼワイン会", date: "2026.04.20", body: "プロヴァンスのロゼを中心に5種をテイスティング。次回はスパークリングを加える案が出ました。", images: 4 },
    ],
  },
  coffee: {
    name: "コーヒー部", icon: "☕", color: "#4A3728", members: 24,
    memberList: [
      { name: "佐藤 美咲", avatar: "佐", role: "モデレータ", join: "2025.05" },
      { name: "高橋 大輔", avatar: "高", join: "2025.09" },
      { name: "田中 康介", avatar: "/images/tanaka.png", join: "2026.02" },
      { name: "青山 陸", avatar: "/images/icon.png", join: "2026.04" },
    ],
    chat: [
      { id: 1, name: "佐藤 美咲", handle: "@sato_m", avatar: "佐", body: "先週のエチオピア豆、自分でも買って淹れてみました！フルーティーで最高でした☕", time: "2時間前", likes: 6, liked: false },
      { id: 2, name: "高橋 大輔", handle: "@takahashi_d", avatar: "高", body: "佐藤さん、どこのお店で買いました？自分も試したい！", time: "1時間前", likes: 2, liked: false },
    ],
    events: [
      { id: 1, title: "Sunday Coffee Cupping #8", date: "07.05", cap: "3 / 8", fee: "¥3,200", state: "抽選受付中" },
    ],
    reports: [
      { id: 1, title: "エチオピア×コロンビア飲み比べ", date: "2026.06.14", body: "シングルオリジン2種を丁寧にカッピング。風味の違いを体感できる充実した回でした。", images: 3 },
    ],
  },
  travel: {
    name: "旅部", icon: "✈️", color: "#1A4A3A", members: 29,
    memberList: [
      { name: "加藤 恵子", avatar: "加", role: "モデレータ", join: "2025.03" },
      { name: "田中 康介", avatar: "/images/tanaka.png", join: "2025.07" },
      { name: "伊藤 健", avatar: "/images/ito.png", join: "2026.01" },
      { name: "山本 彩花", avatar: "/images/yamamoto.png", join: "2026.04" },
      { name: "青山 陸", avatar: "/images/icon.png", join: "2026.06" },
    ],
    chat: [
      { id: 1, name: "加藤 恵子", handle: "@kato_k", avatar: "加", body: "先週の京都旅、宿のおすすめ教えてもらって助かりました！一澤信三郎帆布、素晴らしかったです。", time: "3時間前", likes: 7, liked: false },
      { id: 2, name: "田中 康介", handle: "@tanaka_k", avatar: "/images/tanaka.png", body: "良かった！次は金沢も検討してみてください。最近リノベホテルが増えてきました。", time: "2時間前", likes: 4, liked: false },
    ],
    events: [
      { id: 1, title: "金沢日帰りグルメ旅", date: "08.23", cap: "6 / 10", fee: "¥15,000", state: "受付中" },
    ],
    reports: [
      { id: 1, title: "春の京都旅レポート", date: "2026.04.05", body: "祇園・東山エリアを中心に、隠れ家的なお店を6軒巡りました。写真80枚のアルバムを共有中。", images: 12 },
    ],
  },
};

function ChatAvatar({ src, name }: { src: string; name: string }) {
  const isPath = src.startsWith("/");
  if (isPath) return <img src={src} alt={name} className="w-10 h-10 rounded-full flex-none object-cover border border-[var(--color-line)]" />;
  return (
    <div className="w-10 h-10 rounded-full flex-none flex items-center justify-center bg-[var(--color-ink)] text-[var(--color-bg)] font-display text-sm border border-[var(--color-line)]">
      {src}
    </div>
  );
}

const fallback = clubData.wine;
type TabType = "chat" | "events" | "reports" | "members";

export default function ClubDetailClient({ id }: { id: string }) {
  const club = clubData[id] ?? fallback;
  const [tab, setTab] = useState<TabType>("chat");
  const [chatMessages, setChatMessages] = useState(club.chat);
  const [chatLiked, setChatLiked] = useState<Record<number, boolean>>({});
  const [draft, setDraft] = useState("");
  const [draftImages, setDraftImages] = useState<string[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);

  function toggleChatLike(id: number) {
    setChatLiked(prev => ({ ...prev, [id]: !prev[id] }));
  }

  function sendMessage() {
    if (!draft.trim() && !draftImages.length) return;
    const newMsg = {
      id: Date.now(), name: "青山 陸", handle: "@aoyama_r", avatar: "/images/icon.png",
      body: draft, time: "たった今", likes: 0, liked: false,
    };
    setChatMessages(prev => [...prev, newMsg]);
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

  return (
    <div className="flex justify-center bg-[var(--color-bg)] min-h-screen">
      <div className="w-full max-w-[430px]" style={{ paddingBottom: tab === "chat" ? 160 : 96 }}>
        <AppHeader backHref="/clubs" rightSlot={
          <div className="text-right">
            <div className="font-display text-sm">{club.name}</div>
            <div className="font-display text-[10px] text-[var(--color-mute)]">{club.members}人参加中</div>
          </div>
        } />

        <div className="flex border-b border-[var(--color-line)] sticky top-[57px] z-30 bg-[var(--color-bg)]/95 backdrop-blur-md">
          {(["chat", "events", "reports", "members"] as TabType[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 py-3.5 font-display text-[10px] transition ${tab === t ? "border-b-2 text-[var(--color-accent-deep)]" : "text-[var(--color-mute)]"}`}
              style={tab === t ? { borderBottomColor: "var(--color-accent-deep)" } : {}}
            >
              {t === "chat" ? "チャット" : t === "events" ? "イベント" : t === "reports" ? "レポート" : "メンバー"}
            </button>
          ))}
        </div>

        {tab === "chat" && (
          <div>
            {/* Posts feed */}
            <div>
              {chatMessages.map(m => {
                const isLiked = chatLiked[m.id] ?? m.liked;
                return (
                  <div key={m.id} className="px-4 py-4 border-b border-[var(--color-line)]">
                    <div className="flex gap-3">
                      <ChatAvatar src={m.avatar} name={m.name} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-baseline gap-1.5 flex-wrap">
                          <span className="font-display text-sm font-semibold">{m.name}</span>
                          <span className="font-display text-[10px] text-[var(--color-mute)]">{m.handle}</span>
                          <span className="font-display text-[10px] text-[var(--color-mute)]">· {m.time}</span>
                        </div>
                        <p className="text-sm text-[var(--color-ink-soft)] leading-relaxed mt-1.5">{m.body}</p>
                        <div className="flex items-center gap-5 mt-3">
                          {/* Reply */}
                          <button className="flex items-center gap-1.5 text-xs text-[var(--color-mute)] hover:text-[var(--color-accent-deep)] transition">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                            </svg>
                          </button>
                          {/* Like */}
                          <button
                            onClick={() => toggleChatLike(m.id)}
                            className="flex items-center gap-1.5 text-xs transition"
                            style={{ color: isLiked ? "var(--color-accent-deep)" : "var(--color-mute)" }}
                          >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill={isLiked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                            </svg>
                            <span className="num">{m.likes + (isLiked !== m.liked ? (isLiked ? 1 : -1) : 0)}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {tab === "events" && (
          <div className="px-5 pt-5 space-y-4">
            {club.events.map(ev => (
              <div key={ev.id} className="card p-5">
                <div className="flex items-start justify-between mb-3">
                  <span className="num text-3xl leading-none">{ev.date}</span>
                  <span className={`tag ${ev.state === "受付中" ? "tag-accent" : ev.state === "抽選受付中" ? "tag-ink" : ""}`}>{ev.state}</span>
                </div>
                <h3 className="font-display text-lg">{ev.title}</h3>
                <dl className="mt-3 grid grid-cols-2 gap-2 text-xs">
                  <dt className="font-display text-[var(--color-mute)]">定員</dt><dd className="num">{ev.cap}</dd>
                  <dt className="font-display text-[var(--color-mute)]">参加費</dt><dd className="num">{ev.fee}</dd>
                </dl>
                {ev.state === "受付中" && (
                  <button className="mt-4 w-full btn-primary justify-center text-xs">参加申込する</button>
                )}
              </div>
            ))}
          </div>
        )}

        {tab === "reports" && (
          <div className="px-5 pt-5 space-y-4">
            {club.reports.map(r => (
              <div key={r.id} className="card p-5">
                <div className="font-display text-xs text-[var(--color-mute)] mb-2">{r.date}</div>
                <h3 className="font-display text-lg">{r.title}</h3>
                <p className="mt-2 text-sm text-[var(--color-mute)] leading-relaxed">{r.body}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {Array.from({ length: Math.min(r.images, 4) }).map((_, i) => (
                    <div key={i} className="w-[70px] h-[70px] rounded-lg bg-[var(--color-line)] flex items-center justify-center text-xs text-[var(--color-mute)]">📷</div>
                  ))}
                  {r.images > 4 && (
                    <div className="w-[70px] h-[70px] rounded-lg bg-[var(--color-line)] flex items-center justify-center text-xs text-[var(--color-mute)]">+{r.images - 4}</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "members" && (
          <div className="px-5 pt-5 space-y-1">
            <div className="font-display text-xs text-[var(--color-mute)] mb-4">{club.members}人参加中</div>
            {club.memberList.map((m, i) => (
              <div key={i} className="flex items-center gap-3 py-3 border-b border-[var(--color-line)] last:border-0">
                <ChatAvatar src={m.avatar} name={m.name} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-display text-sm">{m.name}</span>
                    {m.role && <span className="tag text-[9px]">{m.role}</span>}
                  </div>
                  <div className="font-display text-[10px] text-[var(--color-mute)] mt-0.5">参加：{m.join}</div>
                </div>
              </div>
            ))}
            {club.members > club.memberList.length && (
              <div className="py-4 text-center font-display text-xs text-[var(--color-mute)]">他 {club.members - club.memberList.length}名参加中</div>
            )}
          </div>
        )}

        {/* Fixed compose bar (chat tab only) */}
        {tab === "chat" && (
          <div className="fixed bottom-[57px] left-0 right-0 z-40 flex justify-center pointer-events-none">
            <div className="w-full max-w-[430px] pointer-events-auto bg-[var(--color-bg)]/95 backdrop-blur-md border-t border-[var(--color-line)] px-4 py-3">
              <div className="flex gap-3">
                <ChatAvatar src="/images/icon.png" name="青山 陸" />
                <div className="flex-1 min-w-0">
                  <textarea
                    className="w-full bg-transparent text-sm text-[var(--color-ink)] placeholder-[var(--color-mute)] outline-none resize-none leading-relaxed"
                    placeholder="COMMONS CLUBに投稿する…"
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
                    <button
                      onClick={sendMessage}
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
