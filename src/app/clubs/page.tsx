"use client";
import { useState } from "react";
import Link from "next/link";
import BottomNav from "@/components/BottomNav";
import AppHeader from "@/components/AppHeader";

const clubImages: Record<string, string> = {
  wine:   "/images/wine.png",
  coffee: "/images/cafe.png",
  photo:  "/images/canera.png",
  sake:   "/images/nihonsyu.png",
  art:    "/images/art.png",
  travel: "/images/ryokou.png",
};

const allClubs = [
  { id: "wine",   name: "ワインクラブ",  icon: "🍷", cat: "グルメ", members: 38, desc: "ワインの知識を深め、銘柄・生産者・ペアリングを語り合うクラブ。月1回のサロンあり。", joined: true,  color: "#722F37" },
  { id: "coffee", name: "コーヒークラブ", icon: "☕", cat: "グルメ", members: 24, desc: "スペシャルティコーヒーからエスプレッソまで。カッピングや抽出方法を一緒に学ぼう。", joined: true,  color: "#4A3728" },
  { id: "photo",  name: "写真クラブ",   icon: "📷", cat: "アート", members: 19, desc: "フィルム・デジタル問わず。フォトウォークや作品共有会を定期開催。", joined: false, color: "#2D3748" },
  { id: "sake",   name: "日本酒クラブ",  icon: "🍶", cat: "グルメ", members: 16, desc: "全国各地の銘酒を探訪。蔵元訪問も企画中。", joined: false, color: "#1A3A5C" },
  { id: "art",    name: "アートクラブ",  icon: "🎨", cat: "アート", members: 12, desc: "美術館巡り・ギャラリー訪問・アーティストとのトーク。感性を磨く部活。", joined: false, color: "#3D2B1F" },
  { id: "travel", name: "旅クラブ",     icon: "✈️", cat: "ライフ", members: 29, desc: "国内・海外問わず、おすすめスポットやホテルを共有。会員限定旅行企画も。", joined: true,  color: "#1A4A3A" },
];

const cats = ["すべて", "グルメ", "アート", "ライフ"];

export default function ClubsPage() {
  const [filter, setFilter] = useState("すべて");
  const [clubs, setClubs] = useState(allClubs);
  const [modal, setModal] = useState<string | null>(null);

  const filtered = filter === "すべて" ? clubs : clubs.filter(c => c.cat === filter);

  function toggleJoin(id: string) {
    const club = clubs.find(c => c.id === id);
    if (!club?.joined) {
      setModal(id);
    } else {
      setClubs(prev => prev.map(c => c.id === id ? { ...c, joined: false, members: c.members - 1 } : c));
    }
  }

  function confirmJoin(id: string) {
    setClubs(prev => prev.map(c => c.id === id ? { ...c, joined: true, members: c.members + 1 } : c));
    setModal(null);
  }

  const modalClub = clubs.find(c => c.id === modal);

  return (
    <div className="flex justify-center bg-[var(--color-bg)] min-h-screen">
      <div className="w-full max-w-[430px] pb-24">
        <AppHeader />

        {/* Quick links */}
        <div className="px-5 pt-5 flex gap-3">
          <Link
            href="/club-guidelines"
            className="flex-1 card p-3 text-center hover:border-[var(--color-accent)]/60 transition"
          >
            <div className="font-display text-[10px] tracking-[0.05em] text-[var(--color-accent-deep)]">ガイドライン</div>
            <div className="font-display text-[9px] text-[var(--color-mute)] mt-0.5">参加前に確認</div>
          </Link>
          <Link
            href="/club-apply"
            className="flex-1 card p-3 text-center hover:border-[var(--color-accent)]/60 transition"
          >
            <div className="font-display text-[10px] tracking-[0.05em] text-[var(--color-accent-deep)]">クラブを申請する</div>
            <div className="font-display text-[9px] text-[var(--color-mute)] mt-0.5">新規クラブ開設</div>
          </Link>
        </div>

        {/* Filters */}
        <div className="px-5 pt-4">
          <div className="flex gap-2 overflow-x-auto pb-1">
            {cats.map(c => (
              <button
                key={c}
                onClick={() => setFilter(c)}
                className={`flex-none font-display text-xs px-4 py-2 rounded-full border transition ${filter === c ? "bg-[var(--color-ink)] text-[var(--color-bg)] border-[var(--color-ink)]" : "border-[var(--color-line)] text-[var(--color-mute)]"}`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* My clubs */}
        {filter === "すべて" && (
          <div className="px-5 mt-6">
            <div className="font-display text-xs text-[var(--color-accent-deep)] mb-3">参加中の COMMONS CLUB</div>
            <div className="flex gap-3 overflow-x-auto pb-2 -mx-5 px-5 scrollbar-muted">
              {clubs.filter(c => c.joined).map(c => (
                <Link key={c.id} href={`/clubs/${c.id}`} className="flex-none w-[160px] rounded-2xl overflow-hidden border border-[var(--color-line)] hover:border-[var(--color-accent)]/60 transition">
                  {/* Club image */}
                  <div className="relative h-[90px] bg-cover bg-center" style={{ backgroundImage: `url(${clubImages[c.id]})` }}>
                    <div className="absolute inset-0 bg-black/40" />
                  </div>
                  <div className="p-3 bg-[var(--color-bg-soft)]">
                    <div className="font-display text-sm">{c.name}</div>
                    <div className="font-display text-[10px] text-[var(--color-mute)] mt-0.5">{c.members}人参加中</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* All clubs */}
        <div className="px-5 mt-6 space-y-3">
          <div className="font-display text-xs text-[var(--color-mute)]">{filtered.length}件の COMMONS CLUB</div>
          {filtered.map((c) => (
            <div key={c.id} className="card overflow-hidden">
              {/* Club image banner */}
              <div className="relative h-[110px] bg-cover bg-center" style={{ backgroundImage: `url(${clubImages[c.id]})` }}>
                <div className="absolute inset-0 bg-black/45" />
                <div className="absolute bottom-3 left-4">
                  <div className="font-display text-base text-white">{c.name}</div>
                  <div className="font-display text-[10px] text-white/60 mt-0.5">{c.cat} · {c.members}人</div>
                </div>
                <div className="absolute top-3 right-3">
                  <button
                    onClick={() => toggleJoin(c.id)}
                    className={`text-xs font-display px-3 py-1.5 rounded-full border transition ${c.joined ? "border-white/30 text-white/60 bg-black/20" : "border-[var(--color-accent)] text-[var(--color-accent-deep)] bg-black/30"}`}
                  >
                    {c.joined ? "参加中" : "参加する"}
                  </button>
                </div>
              </div>
              <div className="p-4">
                <p className="text-xs text-[var(--color-mute)] leading-relaxed">{c.desc}</p>
                {c.joined && (
                  <Link
                    href={`/clubs/${c.id}`}
                    className="mt-3 flex items-center justify-center gap-1.5 w-full font-display text-xs tracking-[0.06em] text-[var(--color-accent-deep)] border border-[var(--color-accent)]/35 rounded-full py-2.5 hover:bg-[var(--color-accent)]/8 transition"
                  >
                    チャンネルを見る
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Guideline modal */}
        {modal && modalClub && (
          <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm" onClick={() => setModal(null)}>
            <div className="w-full max-w-[430px] bg-[var(--color-bg-soft)] rounded-t-3xl p-6 pb-10" onClick={e => e.stopPropagation()}>
              <div className="w-10 h-1 bg-[var(--color-line)] rounded-full mx-auto mb-6" />
              <h2 className="font-display text-2xl">{modalClub.name}に参加する</h2>
              <p className="mt-3 text-sm text-[var(--color-mute)] leading-relaxed">参加前に COMMONS CLUB ガイドラインをご確認ください。</p>
              <div className="mt-4 card p-4 text-xs text-[var(--color-mute)] leading-relaxed space-y-2">
                <p>・メンバーへの敬意を持った発言を心がけてください</p>
                <p>・商業的な宣伝・勧誘はご遠慮ください</p>
                <p>・個人情報の無断共有は禁止です</p>
                <p>・COMMONS CLUBの活動内容はCOMMONS外への共有を控えてください</p>
              </div>
              <div className="mt-5 space-y-3">
                <button onClick={() => confirmJoin(modal)} className="w-full btn-primary justify-center">同意して参加する</button>
                <button onClick={() => setModal(null)} className="w-full btn-outline justify-center">キャンセル</button>
              </div>
            </div>
          </div>
        )}

        <BottomNav />
      </div>
    </div>
  );
}
