"use client";
import { useState } from "react";
import { usePrimeCapacity, type PrimeArea } from "@/lib/primeCapacity";

export default function PrimeManagementPage() {
  const { areas, setLimit, totalCurrent, totalLimit } = usePrimeCapacity();
  const [drafts, setDrafts] = useState<Record<PrimeArea, string>>(
    Object.fromEntries(areas.map(a => [a.area, String(a.limit)])) as Record<PrimeArea, string>
  );
  const [savedArea, setSavedArea] = useState<PrimeArea | null>(null);

  function handleSave(area: PrimeArea) {
    const value = Number(drafts[area]);
    if (!Number.isFinite(value) || value < 0) return;
    setLimit(area, value);
    setSavedArea(area);
    setTimeout(() => setSavedArea(prev => (prev === area ? null : prev)), 1800);
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <div className="px-8 py-6 border-b border-[var(--color-line)] flex-none">
        <div className="font-display text-[10px] tracking-[0.12em] text-[var(--color-accent-deep)]">PRIME</div>
        <h1 className="font-display text-2xl mt-0.5">PRIME管理</h1>
      </div>

      {/* Stats */}
      <div className="px-8 py-4 border-b border-[var(--color-line)] flex flex-wrap gap-6 flex-none">
        <div className="card px-5 py-3 flex items-center gap-4">
          <div className="font-display text-[10px] text-[var(--color-mute)]">現在のPRIME会員数（全エリア）</div>
          <div className="num text-xl text-[var(--color-accent-deep)]">{totalCurrent}名 <span className="text-sm text-[var(--color-mute)]">/ 定員 {totalLimit}名</span></div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-8 py-6">
        <div className="max-w-[760px]">
          <h2 className="font-display text-lg mb-1">各エリアの定員数設定</h2>
          <p className="font-display text-xs text-[var(--color-mute)] mb-5">
            エリアごとにPRIME会員の受入上限人数を設定します。審査管理「PRIME申込一覧」の「定員に空きがある」の自動判定に使用されます。
          </p>
          <div className="card overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="font-display text-[10px] text-[var(--color-mute)] text-left border-b border-[var(--color-line)]">
                  <th className="px-5 py-3">エリア</th>
                  <th className="px-5 py-3">現在の会員数</th>
                  <th className="px-5 py-3">定員（上限）</th>
                  <th className="px-5 py-3">空き状況</th>
                  <th className="px-5 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-line)]">
                {areas.map(a => (
                  <tr key={a.area}>
                    <td className="px-5 py-4 font-display text-sm">{a.area}</td>
                    <td className="px-5 py-4 num text-sm">{a.current}名</td>
                    <td className="px-5 py-4">
                      <input
                        type="number"
                        min={0}
                        value={drafts[a.area]}
                        onChange={e => setDrafts(prev => ({ ...prev, [a.area]: e.target.value }))}
                        className="w-24 bg-[var(--color-bg)] border border-[var(--color-line)] rounded-lg px-3 py-1.5 text-sm outline-none focus:border-[var(--color-accent)]/50"
                      />
                    </td>
                    <td className="px-5 py-4">
                      {a.hasSpace ? (
                        <span className="tag text-[9px] tag-accent">空きあり（残{a.remaining}名）</span>
                      ) : (
                        <span className="tag text-[9px] border-red-400/30 text-red-400">満枠</span>
                      )}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center gap-2 justify-end">
                        {savedArea === a.area && <span className="font-display text-[10px] text-[var(--color-accent-deep)]">✓ 保存しました</span>}
                        <button onClick={() => handleSave(a.area)} className="btn-outline !py-1.5 text-xs">保存</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
