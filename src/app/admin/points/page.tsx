"use client";
import { useState } from "react";

const ranks = [
  { name: "STANDARD", min: 0,    max: 99,   color: "#8E8A80", members: 245 },
  { name: "BRONZE",   min: 100,  max: 799,  color: "#CD7F32", members: 523 },
  { name: "SILVER",   min: 800,  max: 1999, color: "#C0C0C0", members: 398 },
  { name: "GOLD",     min: 2000, max: 4999, color: "#B8985A", members: 183 },
  { name: "PLATINUM", min: 5000, max: null, color: "#E5E4E2", members: 63  },
];

const history = [
  { no: "0827", name: "佐藤 美咲", type: "イベント参加", xp: "+50", date: "2026.07.08" },
  { no: "0885", name: "山本 彩花", type: "クーポン使用", xp: "+10", date: "2026.07.07" },
  { no: "0880", name: "田中 康介", type: "イベント参加", xp: "+50", date: "2026.07.06" },
  { no: "0824", name: "青山 陸",   type: "管理者付与",   xp: "+200", date: "2026.07.05" },
  { no: "0830", name: "中島 誉",   type: "紹介ボーナス", xp: "+100", date: "2026.07.04" },
];

const rules = [
  { action: "イベント参加", xp: 50,  note: "1回あたり" },
  { action: "クーポン使用", xp: 10,  note: "1枚あたり" },
  { action: "紹介成立",     xp: 100, note: "新規入会1名あたり" },
  { action: "投稿する",     xp: 5,   note: "承認済み投稿1件あたり" },
  { action: "月額会費支払い", xp: 5, note: "毎月" },
];

export default function PointsPage() {
  const [tab, setTab] = useState<"overview" | "history" | "rules">("overview");
  const [rulesList, setRulesList] = useState(rules);
  const [editingRule, setEditingRule] = useState<string | null>(null);
  const [editXp, setEditXp] = useState<number>(0);
  const [hDateFrom, setHDateFrom] = useState("");
  const [hDateTo, setHDateTo] = useState("");
  const [hTypeQ, setHTypeQ] = useState("");
  const [hNameQ, setHNameQ] = useState("");

  const filteredHistory = history.filter(h => {
    if (hDateFrom && h.date < hDateFrom.replace(/-/g,".")) return false;
    if (hDateTo && h.date > hDateTo.replace(/-/g,".")) return false;
    if (hTypeQ && !h.type.includes(hTypeQ)) return false;
    if (hNameQ && !h.name.includes(hNameQ) && !h.no.includes(hNameQ)) return false;
    return true;
  });

  const totalMembers = ranks.reduce((s, r) => s + r.members, 0);

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <div className="px-8 py-6 border-b border-[var(--color-line)] flex-none">
        <div className="font-display text-[10px] tracking-[0.12em] text-[var(--color-accent-deep)]">XP & RANK</div>
        <h1 className="font-display text-2xl mt-0.5">XP・ランク管理</h1>
      </div>

      <div className="px-8 pt-4 border-b border-[var(--color-line)] flex gap-6 flex-none">
        {([["overview", "ランク概要"], ["history", "XP獲得履歴"], ["rules", "XP付与ルール"]] as const).map(([key, label]) => (
          <button key={key} onClick={() => setTab(key)} className={`font-display text-sm pb-4 border-b-2 transition ${tab === key ? "border-[var(--color-accent)] text-[var(--color-accent-deep)]" : "border-transparent text-[var(--color-mute)]"}`}>{label}</button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto px-8 py-6">
        {tab === "overview" && (
          <div className="max-w-[960px]">
            {/* Rank progression note */}
            <div className="mb-6 p-4 rounded-xl border border-[var(--color-line)] bg-[var(--color-bg-soft)] flex items-start gap-3">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-none mt-0.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              <div>
                <div className="font-display text-[10px] text-[var(--color-accent-deep)] mb-1">ランク昇格の仕組み</div>
                <p className="font-display text-[11px] text-[var(--color-mute)] leading-relaxed">
                  各ランクへの進行は累計XPで判定。月1回イベント参加（+50 XP）を2ヶ月継続するとブロンズに到達（100 XP）。
                  プロフィール画面にはプログレスバー（現在XP / 次ランクまでの必要XP）が表示されます。
                </p>
              </div>
            </div>

            {/* Rank cards */}
            <div className="grid grid-cols-5 gap-3 mb-8">
              {ranks.map(r => (
                <div key={r.name} className="card p-5">
                  <div className="font-display text-[10px] mb-3" style={{ color: r.color }}>{r.name}</div>
                  <div className="num text-3xl">{r.members}</div>
                  <div className="font-display text-[10px] text-[var(--color-mute)] mt-2">
                    {r.min.toLocaleString()}{r.max !== null ? ` 〜 ${r.max.toLocaleString()} XP` : " XP〜"}
                  </div>
                  <div className="font-display text-[9px] text-[var(--color-mute)] mt-0.5">
                    次ランクまで: {r.max !== null ? `${(r.max - r.min + 1).toLocaleString()} XP` : "—"}
                  </div>
                  <div className="mt-3 h-1 rounded-full" style={{ background: `${r.color}40` }}>
                    <div className="h-full rounded-full" style={{ background: r.color, width: `${(r.members / totalMembers) * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>

            {/* Rank progression visual */}
            <div className="card p-6 mb-6">
              <h3 className="font-display text-base mb-5">ランク進行テーブル</h3>
              <div className="flex items-center gap-0 overflow-x-auto">
                {ranks.map((r, i) => (
                  <div key={r.name} className="flex items-center flex-none">
                    <div className="flex flex-col items-center">
                      <div className="w-28 text-center">
                        <div className="font-display text-[10px] mb-2" style={{ color: r.color }}>{r.name}</div>
                        <div className="py-2 px-3 rounded-lg text-[10px] font-display" style={{ background: r.color + "25", color: r.color }}>
                          {r.min.toLocaleString()}{r.max !== null ? `〜${r.max.toLocaleString()}` : "〜"} XP
                        </div>
                        <div className="num text-xl mt-2" style={{ color: r.color }}>{r.members}</div>
                        <div className="font-display text-[9px] text-[var(--color-mute)]">名</div>
                      </div>
                    </div>
                    {i < ranks.length - 1 && (
                      <div className="flex flex-col items-center mx-2 flex-none">
                        <div className="font-display text-[9px] text-[var(--color-mute)] mb-1">必要XP</div>
                        <div className="num text-xs text-[var(--color-accent-deep)]">
                          {ranks[i+1].min.toLocaleString()}
                        </div>
                        <div className="text-[var(--color-mute)] text-sm">→</div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="card p-6">
              <h3 className="font-display text-base mb-4">ランク分布（全{totalMembers.toLocaleString()}名）</h3>
              <div className="flex items-end gap-3 h-32">
                {ranks.map(r => (
                  <div key={r.name} className="flex-1 flex flex-col items-center gap-1.5">
                    <div className="num text-xs">{r.members}</div>
                    <div className="w-full rounded-t transition-all" style={{ height: `${(r.members / 523) * 88}px`, background: r.color + "80" }} />
                    <div className="font-display text-[9px]" style={{ color: r.color }}>{r.name}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {tab === "history" && (
          <div className="max-w-[760px]">
            <div className="card p-4 mb-4 space-y-3">
              <div className="flex items-center gap-3">
                <span className="font-display text-[10px] text-[var(--color-mute)] flex-none">期間</span>
                <input type="date" value={hDateFrom} onChange={e=>setHDateFrom(e.target.value)}
                  className="bg-[var(--color-bg)] border border-[var(--color-line)] rounded-lg px-3 py-1.5 text-xs outline-none focus:border-[var(--color-accent)]/50" />
                <span className="font-display text-[10px] text-[var(--color-mute)]">〜</span>
                <input type="date" value={hDateTo} onChange={e=>setHDateTo(e.target.value)}
                  className="bg-[var(--color-bg)] border border-[var(--color-line)] rounded-lg px-3 py-1.5 text-xs outline-none focus:border-[var(--color-accent)]/50" />
              </div>
              <div className="flex items-center gap-3">
                <span className="font-display text-[10px] text-[var(--color-mute)] flex-none w-[32px]">種別</span>
                <input value={hTypeQ} onChange={e=>setHTypeQ(e.target.value)} placeholder="例: イベント参加"
                  className="bg-[var(--color-bg)] border border-[var(--color-line)] rounded-lg px-3 py-1.5 text-xs outline-none focus:border-[var(--color-accent)]/50 placeholder-[var(--color-mute)] flex-1" />
                <span className="font-display text-[10px] text-[var(--color-mute)] flex-none">対象者</span>
                <input value={hNameQ} onChange={e=>setHNameQ(e.target.value)} placeholder="氏名・会員番号"
                  className="bg-[var(--color-bg)] border border-[var(--color-line)] rounded-lg px-3 py-1.5 text-xs outline-none focus:border-[var(--color-accent)]/50 placeholder-[var(--color-mute)] flex-1" />
              </div>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="font-display text-[10px] text-[var(--color-mute)] text-left border-b border-[var(--color-line)]">
                  <th className="pb-3 pr-4">会員</th>
                  <th className="pb-3 pr-4">種別</th>
                  <th className="pb-3 pr-4">XP</th>
                  <th className="pb-3">日付</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-line)]">
                {filteredHistory.map((h, i) => (
                  <tr key={i} className="hover:bg-[var(--color-bg-soft)] transition">
                    <td className="py-3 pr-4">
                      <div className="font-display text-sm">{h.name}</div>
                      <div className="num text-[10px] text-[var(--color-mute)]">#{h.no}</div>
                    </td>
                    <td className="py-3 pr-4"><span className="tag text-[9px]">{h.type}</span></td>
                    <td className="py-3 pr-4 num text-[var(--color-accent-deep)]">{h.xp} XP</td>
                    <td className="py-3 num text-xs text-[var(--color-mute)]">{h.date}</td>
                  </tr>
                ))}
                {filteredHistory.length === 0 && (
                  <tr><td colSpan={4} className="py-8 text-center font-display text-sm text-[var(--color-mute)]">該当する履歴がありません</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {tab === "rules" && (
          <div className="max-w-[680px]">
            <div className="space-y-3">
              {rulesList.map(r => (
                <div key={r.action} className="card p-5 flex items-center justify-between">
                  <div>
                    <div className="font-display text-sm">{r.action}</div>
                    <div className="font-display text-[10px] text-[var(--color-mute)] mt-0.5">{r.note}</div>
                  </div>
                  <div className="flex items-center gap-4">
                    {editingRule === r.action ? (
                      <>
                        <div className="flex items-center gap-1">
                          <span className="num text-xl text-[var(--color-accent-deep)]">+</span>
                          <input type="number" value={editXp} onChange={e => setEditXp(Number(e.target.value))}
                            className="w-20 bg-[var(--color-bg)] border border-[var(--color-accent)]/50 rounded-lg px-2 py-1 num text-xl text-[var(--color-accent-deep)] outline-none text-center" />
                          <span className="font-display text-xs text-[var(--color-mute)]">XP</span>
                        </div>
                        <button onClick={() => {
                          setRulesList(prev => prev.map(x => x.action === r.action ? { ...x, xp: editXp } : x));
                          setEditingRule(null);
                        }} className="btn-primary !py-1.5 text-xs">保存</button>
                        <button onClick={() => setEditingRule(null)} className="btn-outline !py-1.5 text-xs">キャンセル</button>
                      </>
                    ) : (
                      <>
                        <div className="flex items-baseline gap-1">
                          <div className="num text-2xl text-[var(--color-accent-deep)]">+{r.xp}</div>
                          <div className="font-display text-xs text-[var(--color-mute)]">XP</div>
                        </div>
                        <button onClick={() => { setEditingRule(r.action); setEditXp(r.xp); }}
                          className="btn-outline !py-1.5 text-xs">編集</button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
