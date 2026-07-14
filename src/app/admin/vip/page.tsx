"use client";
import { useState } from "react";

const vipMembers = [
  { no: "0827", name: "佐藤 美咲", rank: "VIP", plan: "Premium", points: 3870, joined: "2025.05.27", events: 18, area: "東京" },
  { no: "0885", name: "山本 彩花", rank: "VIP", plan: "Premium", points: 4200, joined: "2025.03.01", events: 24, area: "東京" },
  { no: "0830", name: "中島 誉", rank: "PLATINUM", plan: "Standard", points: 980, joined: "2025.05.18", events: 9, area: "大阪" },
  { no: "0851", name: "森田 桂", rank: "PLATINUM", plan: "Premium", points: 2100, joined: "2025.08.02", events: 14, area: "大阪" },
];

export default function VipPage() {
  const [selected, setSelected] = useState<string | null>(null);
  const detail = vipMembers.find(m => m.no === selected);

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <div className="px-8 py-6 border-b border-[var(--color-line)] flex items-center justify-between flex-none">
        <div>
          <div className="font-display text-[10px] tracking-[0.12em] text-[var(--color-accent-deep)]">VIP</div>
          <h1 className="font-display text-2xl mt-0.5">VIPユーザー管理</h1>
        </div>
        <div className="flex gap-2">
          <button className="btn-outline !py-2 text-xs">VIP一括通知</button>
          <button className="btn-primary !py-2 text-xs">＋ VIP手動付与</button>
        </div>
      </div>

      {/* Stats */}
      <div className="px-8 py-4 border-b border-[var(--color-line)] flex gap-6 flex-none">
        {[
          { l: "VIP会員数", v: "2名" },
          { l: "PLATINUM会員数", v: "119名" },
          { l: "VIP平均ポイント", v: "4,035 pt" },
          { l: "VIP平均参加回数", v: "21回" },
        ].map(s => (
          <div key={s.l} className="card px-5 py-3 flex items-center gap-4">
            <div className="font-display text-[10px] text-[var(--color-mute)]">{s.l}</div>
            <div className="num text-xl text-[var(--color-accent-deep)]">{s.v}</div>
          </div>
        ))}
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Table */}
        <div className="flex-1 overflow-y-auto px-8 py-6">
          <table className="w-full text-sm max-w-[860px]">
            <thead>
              <tr className="font-display text-[10px] text-[var(--color-mute)] text-left border-b border-[var(--color-line)]">
                <th className="pb-3 pr-4">会員番号</th>
                <th className="pb-3 pr-4">氏名</th>
                <th className="pb-3 pr-4">ランク</th>
                <th className="pb-3 pr-4">エリア</th>
                <th className="pb-3 pr-4">ポイント</th>
                <th className="pb-3 pr-4">参加回数</th>
                <th className="pb-3 pr-4">入会日</th>
                <th className="pb-3">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-line)]">
              {vipMembers.map(m => (
                <tr key={m.no} onClick={() => setSelected(selected === m.no ? null : m.no)} className={`cursor-pointer transition ${selected === m.no ? "bg-[var(--color-accent)]/8" : "hover:bg-[var(--color-bg-soft)]"}`}>
                  <td className="py-3 pr-4 num text-xs">{m.no}</td>
                  <td className="py-3 pr-4 font-display">{m.name}</td>
                  <td className="py-3 pr-4"><span className="tag tag-accent text-[9px]">{m.rank}</span></td>
                  <td className="py-3 pr-4 text-xs">{m.area}</td>
                  <td className="py-3 pr-4 num text-[var(--color-accent-deep)]">{m.points.toLocaleString()} pt</td>
                  <td className="py-3 pr-4 num">{m.events}回</td>
                  <td className="py-3 pr-4 num text-xs text-[var(--color-mute)]">{m.joined}</td>
                  <td className="py-3">
                    <div className="flex gap-1.5">
                      <button className="font-display text-[10px] px-2 py-1 rounded border border-[var(--color-line)] hover:border-[var(--color-accent)] transition">詳細</button>
                      <button className="font-display text-[10px] px-2 py-1 rounded border border-red-400/30 text-red-400 hover:bg-red-400/8 transition">VIP解除</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* VIP criteria */}
          <div className="max-w-[860px] mt-8">
            <div className="card p-6">
              <h3 className="font-display text-base mb-4">VIP昇格条件設定</h3>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { l: "累計ポイント（以上）", ph: "3500", unit: "pt" },
                  { l: "イベント参加回数（以上）", ph: "20", unit: "回" },
                  { l: "継続期間（以上）", ph: "180", unit: "日" },
                ].map(f => (
                  <div key={f.l}>
                    <label className="font-display text-xs text-[var(--color-mute)] block mb-1.5">{f.l}</label>
                    <div className="flex items-center gap-2">
                      <input defaultValue={f.ph} type="number" className="flex-1 bg-[var(--color-bg)] border border-[var(--color-line)] rounded-xl px-4 py-2 text-sm outline-none focus:border-[var(--color-accent)]/50" />
                      <span className="font-display text-xs text-[var(--color-mute)]">{f.unit}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-3 mt-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" defaultChecked className="accent-[var(--color-accent)]" />
                  <span className="font-display text-sm">条件を全て満たした会員を自動でVIP昇格する</span>
                </label>
                <button className="ml-auto btn-primary !py-2 text-xs">条件を保存</button>
              </div>
            </div>
          </div>
        </div>

        {/* Detail panel */}
        {detail && (
          <div className="w-[300px] border-l border-[var(--color-line)] flex flex-col bg-[var(--color-bg-soft)] flex-none">
            <div className="px-6 py-5 border-b border-[var(--color-line)] flex items-center justify-between">
              <h2 className="font-display text-base">会員詳細</h2>
              <button onClick={() => setSelected(null)} className="text-[var(--color-mute)] hover:text-[var(--color-ink)]">✕</button>
            </div>
            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-[var(--color-accent)]/15 flex items-center justify-center font-display text-lg text-[var(--color-accent-deep)]">{detail.name[0]}</div>
                <div>
                  <div className="font-display text-lg">{detail.name}</div>
                  <div className="num text-xs text-[var(--color-mute)]">#{detail.no}</div>
                </div>
              </div>
              {[
                { l: "ランク", v: detail.rank },
                { l: "プラン", v: detail.plan },
                { l: "エリア", v: detail.area },
                { l: "ポイント", v: `${detail.points.toLocaleString()} pt` },
                { l: "イベント参加", v: `${detail.events}回` },
                { l: "入会日", v: detail.joined },
              ].map(r => (
                <div key={r.l} className="flex items-center justify-between border-b border-[var(--color-line)] pb-3">
                  <span className="font-display text-xs text-[var(--color-mute)]">{r.l}</span>
                  <span className="text-sm">{r.v}</span>
                </div>
              ))}
              <div className="space-y-2 pt-2">
                <button className="w-full btn-primary justify-center text-xs">VIP特典を付与</button>
                <button className="w-full btn-outline justify-center text-xs">ポイント付与</button>
                <button className="w-full py-2.5 rounded-full font-display text-xs border border-red-400/30 text-red-400 hover:bg-red-400/8 transition">VIPランクを解除</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
