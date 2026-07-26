"use client";
import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";

type Category = "タイムライン" | "クラブ会チャット" | "クラブ会イベント" | "DM";

interface Interaction {
  id: string;
  memberNo: string;
  memberName: string;
  category: Category;
  club?: string;
  eventTitle?: string;
  dmPartnerName?: string;
  dmPartnerNo?: string;
  content: string;
  sentAt: string; // "2026.07.10 20:11:34"
  retracted: boolean;
  retractedAt?: string;
}

const CATEGORIES: Category[] = ["タイムライン", "クラブ会チャット", "クラブ会イベント", "DM"];

const interactions: Interaction[] = [
  { id:"IT-0412", memberNo:"0824", memberName:"青山 陸", category:"タイムライン", content:"今週末のWine Salon楽しみにしています！参加される方いたらぜひ声かけてください。", sentAt:"2026.07.11 09:20:14", retracted:false },
  { id:"IT-0411", memberNo:"0885", memberName:"山本 彩花", category:"DM", dmPartnerName:"naoki_invest（非会員/退会済アカウント）", dmPartnerNo:"—", content:"投資案件のご案内です。詳しくお話しさせていただけないでしょうか。", sentAt:"2026.07.10 20:11:34", retracted:false },
  { id:"IT-0410", memberNo:"0851", memberName:"森田 桂", category:"クラブ会チャット", club:"ワインクラブ", content:"次回の集まりですが、○○さんへの連絡が多すぎて困っているという声があります。運営で確認してもらえますか。", sentAt:"2026.07.10 18:40:02", retracted:false },
  { id:"IT-0409", memberNo:"0827", memberName:"佐藤 美咲", category:"タイムライン", content:"Coffee Cupping #7でいただいたコーヒー豆、家でも美味しく飲めました☕", sentAt:"2026.07.10 12:03:47", retracted:false },
  { id:"IT-0408", memberNo:"0880", memberName:"田中 康介", category:"DM", dmPartnerName:"COMMONS運営", dmPartnerNo:"—", content:"7月15日のCOMMONS MUSIC BARキャンセルについて相談です。", sentAt:"2026.07.09 14:23:09", retracted:false },
  { id:"IT-0407", memberNo:"0873", memberName:"村瀬 史奈", category:"クラブ会イベント", club:"アート部", eventTitle:"来月のギャラリー巡り企画", content:"来月のギャラリー巡り、企画してみたいと思います！興味ある方いますか。", sentAt:"2026.07.08 21:15:51", retracted:false },
  { id:"IT-0406", memberNo:"0898", memberName:"中村 優一", category:"タイムライン", content:"今度こういうイベントやりませんか？→ https://example-suspicious-link.com （勧誘広告）", sentAt:"2026.07.07 10:45:22", retracted:true, retractedAt:"2026.07.07 11:02:10" },
  { id:"IT-0405", memberNo:"0891", memberName:"伊藤 健", category:"DM", dmPartnerName:"森田 桂", dmPartnerNo:"0851", content:"今度のウイスキーバー巡り、ご一緒しませんか？", sentAt:"2026.07.06 08:30:05", retracted:false },
  { id:"IT-0404", memberNo:"0824", memberName:"青山 陸", category:"クラブ会チャット", club:"ワインクラブ", content:"来週のシャンパーニュ会、楽しみにしています！", sentAt:"2026.07.05 22:11:37", retracted:false },
  { id:"IT-0403", memberNo:"0885", memberName:"山本 彩花", category:"クラブ会イベント", club:"ワインクラブ", eventTitle:"シャンパーニュ特集 Vol.3", content:"当日は少し遅れて参加するかもしれません。よろしくお願いします。", sentAt:"2026.07.05 19:48:00", retracted:false },
  { id:"IT-0402", memberNo:"0830", memberName:"中島 誉", category:"DM", dmPartnerName:"森田 桂", dmPartnerNo:"0851", content:"今度個別で会って投資の話をしませんか？いい情報があるんです。", sentAt:"2026.07.04 21:30:18", retracted:true, retractedAt:"2026.07.04 21:31:02" },
  { id:"IT-0401", memberNo:"0843", memberName:"山本 直", category:"タイムライン", content:"久しぶりにアウトドアイベントに参加したいです。おすすめありますか？", sentAt:"2026.07.03 17:05:44", retracted:false },
];

function InteractionsContent() {
  const searchParams = useSearchParams();
  const [memberQuery, setMemberQuery] = useState(searchParams.get("user") ?? "");
  const [freeQuery, setFreeQuery] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [cats, setCats] = useState<Set<Category>>(new Set());
  const [selectedId, setSelectedId] = useState<string | null>(null);

  function toggleCat(c: Category) {
    setCats(prev => {
      const next = new Set(prev);
      if (next.has(c)) next.delete(c); else next.add(c);
      return next;
    });
  }

  const filtered = interactions.filter(it => {
    if (cats.size > 0 && !cats.has(it.category)) return false;
    if (memberQuery && !it.memberName.includes(memberQuery) && !it.memberNo.includes(memberQuery)) return false;
    if (freeQuery) {
      const q = freeQuery.toLowerCase();
      const hit = it.content.toLowerCase().includes(q)
        || (it.club ?? "").toLowerCase().includes(q)
        || (it.eventTitle ?? "").toLowerCase().includes(q)
        || (it.dmPartnerName ?? "").toLowerCase().includes(q);
      if (!hit) return false;
    }
    if (dateFrom && it.sentAt.replace(/\./g,"-") < dateFrom.replace(/\./g,"-")) return false;
    if (dateTo && it.sentAt.replace(/\./g,"-") > dateTo.replace(/\./g,"-") + " 23:59:59") return false;
    return true;
  });

  const detail = interactions.find(it => it.id === selectedId) ?? filtered[0];
  const hasFilter = memberQuery || freeQuery || dateFrom || dateTo || cats.size > 0;

  function clearAll() { setMemberQuery(""); setFreeQuery(""); setDateFrom(""); setDateTo(""); setCats(new Set()); }

  const catTagClass: Record<Category, string> = {
    "タイムライン": "tag-ink",
    "クラブ会チャット": "tag-accent",
    "クラブ会イベント": "tag-accent",
    "DM": "",
  };

  function targetLabel(it: Interaction): string {
    if (it.category === "DM") return `→ ${it.dmPartnerName}${it.dmPartnerNo && it.dmPartnerNo !== "—" ? `（#${it.dmPartnerNo}）` : ""}`;
    if (it.category === "クラブ会チャット") return it.club ?? "—";
    if (it.category === "クラブ会イベント") return [it.club, it.eventTitle].filter(Boolean).join(" / ");
    return "—";
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <div className={`flex-1 flex flex-col overflow-hidden ${detail ? "max-w-[calc(100%-420px)]" : ""}`}>
        <div className="px-8 py-6 border-b border-[var(--color-line)] flex-none">
          <div className="font-display text-[10px] tracking-[0.12em] text-[var(--color-accent-deep)]">INTERACTIONS</div>
          <h1 className="font-display text-2xl mt-0.5">ユーザーやり取り管理</h1>
          <p className="font-display text-[11px] text-[var(--color-mute)] mt-1">通報・お問い合わせがあった際の確認用に、全ユーザーのやり取りを横断的に検索できます。</p>
        </div>

        <div className="px-8 py-4 border-b border-[var(--color-line)] flex-none space-y-3">
          <div className="flex items-center gap-3 flex-wrap">
            <input value={memberQuery} onChange={e=>setMemberQuery(e.target.value)} placeholder="会員名・会員番号"
              className="w-48 bg-[var(--color-bg)] border border-[var(--color-line)] rounded-lg px-3 py-1.5 text-xs outline-none focus:border-[var(--color-accent)]/50 placeholder-[var(--color-mute)]" />
            <input value={freeQuery} onChange={e=>setFreeQuery(e.target.value)} placeholder="フリーワード検索"
              className="w-56 bg-[var(--color-bg)] border border-[var(--color-line)] rounded-lg px-3 py-1.5 text-xs outline-none focus:border-[var(--color-accent)]/50 placeholder-[var(--color-mute)]" />
            <div className="flex items-center gap-2">
              <span className="font-display text-[10px] text-[var(--color-mute)]">日時</span>
              <input type="date" value={dateFrom} onChange={e=>setDateFrom(e.target.value)} className="bg-[var(--color-bg)] border border-[var(--color-line)] rounded-lg px-3 py-1.5 text-xs outline-none" />
              <span className="font-display text-[10px] text-[var(--color-mute)]">〜</span>
              <input type="date" value={dateTo} onChange={e=>setDateTo(e.target.value)} className="bg-[var(--color-bg)] border border-[var(--color-line)] rounded-lg px-3 py-1.5 text-xs outline-none" />
            </div>
            {hasFilter && <button onClick={clearAll} className="font-display text-[10px] text-[var(--color-mute)] hover:text-[var(--color-ink)]">クリア</button>}
          </div>
          <div className="flex items-center gap-2">
            <span className="font-display text-[10px] text-[var(--color-mute)]">カテゴリ</span>
            {CATEGORIES.map(c => (
              <button key={c} onClick={()=>toggleCat(c)}
                className={`font-display text-[10px] px-3 py-1.5 rounded-full border transition ${cats.has(c)?"bg-[var(--color-accent)]/15 border-[var(--color-accent)] text-[var(--color-accent-deep)]":"border-[var(--color-line)] text-[var(--color-mute)]"}`}>
                {c}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-auto px-8 py-4">
          <table className="w-full text-sm min-w-[1080px]">
            <thead>
              <tr className="font-display text-[10px] text-[var(--color-mute)] text-left border-b border-[var(--color-line)]">
                <th className="pb-3 pr-3">会員番号</th><th className="pb-3 pr-3">会員名</th>
                <th className="pb-3 pr-3">カテゴリ</th><th className="pb-3 pr-3">対象（クラブ/イベント/DM相手）</th>
                <th className="pb-3 pr-3">内容</th>
                <th className="pb-3 pr-3">発信日時</th><th className="pb-3 pr-3 text-center">取消</th>
                <th className="pb-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-line)]">
              {filtered.map(it => (
                <tr key={it.id} onClick={() => setSelectedId(it.id)}
                  className={`cursor-pointer transition ${(selectedId ?? filtered[0]?.id) === it.id ? "bg-[var(--color-accent)]/8" : "hover:bg-[var(--color-bg-soft)]"}`}>
                  <td className="py-3 pr-3 num text-xs">{it.memberNo}</td>
                  <td className="py-3 pr-3 font-display text-sm">{it.memberName}</td>
                  <td className="py-3 pr-3"><span className={`tag text-[9px] ${catTagClass[it.category]}`}>{it.category}</span></td>
                  <td className="py-3 pr-3 text-xs text-[var(--color-mute)] max-w-[180px] truncate">{targetLabel(it)}</td>
                  <td className="py-3 pr-3 text-xs text-[var(--color-mute)] max-w-[240px] truncate">{it.content}</td>
                  <td className="py-3 pr-3 num text-xs text-[var(--color-mute)]">{it.sentAt}</td>
                  <td className="py-3 pr-3 text-center">
                    {it.retracted ? <span className="font-display text-[9px] px-2 py-0.5 rounded-full border border-red-400/30 text-red-400">取消済</span> : <span className="text-xs text-[var(--color-mute)]">—</span>}
                  </td>
                  <td className="py-3"><button className="font-display text-xs text-[var(--color-accent-deep)] hover:underline">詳細</button></td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="py-12 text-center font-display text-xs text-[var(--color-mute)]">条件に一致するやり取りはありません</div>
          )}
        </div>
      </div>

      {detail && (
        <div className="w-[420px] border-l border-[var(--color-line)] flex flex-col overflow-hidden bg-[var(--color-bg-soft)] flex-none">
          <div className="px-6 py-4 border-b border-[var(--color-line)] flex items-center justify-between">
            <h2 className="font-display text-base">やり取り詳細</h2>
            <button onClick={() => setSelectedId(null)} className="text-[var(--color-mute)] hover:text-[var(--color-ink)]">✕</button>
          </div>
          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-3">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-full bg-[var(--color-accent)]/15 flex items-center justify-center font-display text-sm text-[var(--color-accent-deep)]">{detail.memberName[0]}</div>
              <div>
                <div className="font-display text-sm">{detail.memberName}</div>
                <div className="num text-xs text-[var(--color-mute)]">#{detail.memberNo}</div>
              </div>
            </div>

            {[
              {l:"カテゴリ",v:detail.category},
              ...(detail.club ? [{l:"クラブ",v:detail.club}] : []),
              ...(detail.eventTitle ? [{l:"イベント",v:detail.eventTitle}] : []),
              ...(detail.dmPartnerName ? [{l:"DM相手（会員名）",v:detail.dmPartnerName}] : []),
              ...(detail.dmPartnerNo ? [{l:"DM相手（会員番号）",v:detail.dmPartnerNo}] : []),
              {l:"発信日時",v:detail.sentAt},
              {l:"送信取消",v:detail.retracted ? "あり" : "なし"},
              ...(detail.retractedAt ? [{l:"取消日時",v:detail.retractedAt}] : []),
            ].map(r => (
              <div key={r.l} className="flex items-start justify-between border-b border-[var(--color-line)] pb-2">
                <span className="font-display text-xs text-[var(--color-mute)] flex-none w-32">{r.l}</span>
                <span className="text-xs text-right break-all">{r.v}</span>
              </div>
            ))}

            <div className="card p-4 mt-2">
              <div className="font-display text-[10px] text-[var(--color-accent-deep)] mb-2">発信内容</div>
              <p className="text-sm leading-relaxed">{detail.content}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function InteractionsPage() {
  return (
    <Suspense>
      <InteractionsContent />
    </Suspense>
  );
}
