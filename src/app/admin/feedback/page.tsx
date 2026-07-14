"use client";
import { useState } from "react";

interface FeedbackItem {
  id: string;
  rating: number;
  categories: string[];
  text: string;
  date: string;
}

const feedbacks: FeedbackItem[] = [
  { id:"FB-0041", rating:3, categories:["イベント企画"], text:"イベントの開始時間をもう少し早くしてほしいです。21時スタートだと終電が心配になります。", date:"2026.07.09" },
  { id:"FB-0040", rating:4, categories:["コミュニティ運営"], text:"ワインクラブのイベントがいつも満員で参加できません。定員を増やすか開催回数を増やしてほしいです。", date:"2026.07.08" },
  { id:"FB-0039", rating:5, categories:["UI/UX改善"], text:"アプリのDM機能がとても使いやすくなりました！ありがとうございます。", date:"2026.07.07" },
  { id:"FB-0038", rating:4, categories:["その他"], text:"福岡でも開催してほしいです。地方在住の会員も増やしてほしい。", date:"2026.07.06" },
  { id:"FB-0037", rating:3, categories:["機能要望"], text:"クーポンの使い方がわかりにくいです。チュートリアルがあると良いと思います。", date:"2026.07.05" },
];

const catColor: Record<string, string> = {
  "イベント企画": "tag-accent",
  "UI/UX改善": "tag-ink",
  "コミュニティ運営": "",
  "提携店舗": "",
  "機能要望": "",
  "その他": "",
};

const allCategories = ["イベント企画","UI/UX改善","コミュニティ運営","提携店舗","機能要望","その他"];

function StarDisplay({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1,2,3,4,5].map(n => (
        <span key={n} className="text-sm" style={{ opacity: n <= rating ? 1 : 0.2 }}>⭐</span>
      ))}
    </div>
  );
}

export default function FeedbackAdminPage() {
  const [selected, setSelected] = useState<string>(feedbacks[0].id);
  const [catFilter, setCatFilter] = useState("すべて");

  const filtered = catFilter === "すべて"
    ? feedbacks
    : feedbacks.filter(f => f.categories.includes(catFilter));

  const item = filtered.find(f => f.id === selected) ?? filtered[0];

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <div className="px-8 py-6 border-b border-[var(--color-line)] flex items-center justify-between flex-none">
        <div>
          <div className="font-display text-[10px] tracking-[0.12em] text-[var(--color-accent-deep)]">FEEDBACK</div>
          <h1 className="font-display text-2xl mt-0.5">意見箱</h1>
        </div>
        <div className="flex items-center gap-3">
          <div className="font-display text-xs text-[var(--color-mute)]">新着 <span className="num text-[var(--color-accent-deep)]">2</span> 件</div>
          <button className="btn-outline !py-2 text-xs">CSV出力</button>
        </div>
      </div>

      {/* Category filter */}
      <div className="px-8 py-3 border-b border-[var(--color-line)] flex gap-2 flex-wrap flex-none">
        {["すべて", ...allCategories].map(f => (
          <button key={f} onClick={() => setCatFilter(f)}
            className={`font-display text-xs px-4 py-1.5 rounded-full border transition ${catFilter===f?"bg-[var(--color-ink)] text-[var(--color-bg)] border-[var(--color-ink)]":"border-[var(--color-line)] text-[var(--color-mute)]"}`}>
            {f}
          </button>
        ))}
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* List */}
        <div className="w-[340px] border-r border-[var(--color-line)] overflow-y-auto flex-none">
          {filtered.map(f => (
            <button key={f.id} onClick={() => setSelected(f.id)}
              className={`w-full text-left px-5 py-4 border-b border-[var(--color-line)] transition ${selected===f.id?"bg-[var(--color-accent)]/8":"hover:bg-[var(--color-bg-soft)]"}`}>
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex gap-1 flex-wrap">
                  {f.categories.map(c => <span key={c} className={`tag text-[9px] ${catColor[c]||""}`}>{c}</span>)}
                </div>
                <StarDisplay rating={f.rating} />
              </div>
              <p className="font-display text-xs leading-relaxed line-clamp-2 text-[var(--color-ink)]">{f.text}</p>
              <div className="mt-2">
                <span className="num text-[10px] text-[var(--color-mute)]">{f.date}</span>
              </div>
            </button>
          ))}
        </div>

        {/* Detail */}
        {item && (
          <div className="flex-1 overflow-y-auto px-8 py-6">
            <div className="max-w-[640px]">
              <div className="flex items-center gap-3 mb-6">
                {item.categories.map(c => <span key={c} className={`tag text-[9px] ${catColor[c]||""}`}>{c}</span>)}
                <span className="num text-xs text-[var(--color-mute)]">{item.id}</span>
                <span className="font-display text-xs text-[var(--color-mute)]">{item.date}</span>
              </div>

              <div className="card p-6 mb-5">
                <div className="flex items-center justify-between mb-4">
                  <div className="font-display text-[10px] text-[var(--color-accent-deep)]">満足度</div>
                  <StarDisplay rating={item.rating} />
                </div>
                <div className="font-display text-[10px] text-[var(--color-accent-deep)] mb-3">会員からの意見</div>
                <p className="text-sm leading-relaxed">{item.text}</p>
                <div className="mt-4 pt-4 border-t border-[var(--color-line)]">
                  <span className="font-display text-xs text-[var(--color-mute)]">投稿者: 匿名</span>
                </div>
              </div>

              <div className="card p-5">
                <div className="font-display text-[10px] text-[var(--color-accent-deep)] mb-3">対応メモ（内部用）</div>
                <textarea rows={4} placeholder="対応内容・検討事項などをメモ（会員には非公開）"
                  className="w-full bg-[var(--color-bg)] border border-[var(--color-line)] rounded-xl px-4 py-3 text-sm outline-none resize-none placeholder-[var(--color-mute)]" />
                <button className="mt-3 btn-outline !py-1.5 text-xs">メモを保存</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
