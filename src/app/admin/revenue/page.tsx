"use client";
import { useState } from "react";

const months = ["2月","3月","4月","5月","6月","7月"];

const monthlyData = [
  { month:"2026.02", memberFee:6930000, eventSales:842000, couponDiscount:186400, members:1262, annualMembers:505, monthlyMembers:757 },
  { month:"2026.03", memberFee:7095000, eventSales:1102000, couponDiscount:206400, members:1318, annualMembers:527, monthlyMembers:791 },
  { month:"2026.04", memberFee:7260000, eventSales:924000, couponDiscount:216800, members:1361, annualMembers:544, monthlyMembers:817 },
  { month:"2026.05", memberFee:7480000, eventSales:1034000, couponDiscount:236000, members:1404, annualMembers:562, monthlyMembers:842 },
  { month:"2026.06", memberFee:7700000, eventSales:1187000, couponDiscount:254400, members:1412, annualMembers:565, monthlyMembers:847 },
  { month:"2026.07", memberFee:7766000, eventSales:1254000, couponDiscount:273600, members:1412, annualMembers:568, monthlyMembers:844 },
];

// 売上一覧用のダミー明細データ
const revenueItems = [
  { id:"R0712-001", date:"2026.07.12", category:"会員費", plan:"月払い", name:"青山 陸", no:"0824", amount:980, status:"確定" },
  { id:"R0712-002", date:"2026.07.12", category:"イベント", plan:"Coffee Cupping #7", name:"佐藤 美咲", no:"0827", amount:4000, status:"確定" },
  { id:"R0712-003", date:"2026.07.12", category:"会員費", plan:"年払い", name:"中島 誉", no:"0830", amount:500, status:"確定" },
  { id:"R0712-004", date:"2026.07.12", category:"クーポン", plan:"夏の紹介キャンペーン", name:"山本 直", no:"0843", amount:-500, status:"適用" },
  { id:"R0711-001", date:"2026.07.11", category:"イベント", plan:"COMMONS MUSIC BAR", name:"山本 直", no:"0843", amount:7000, status:"確定" },
  { id:"R0711-002", date:"2026.07.11", category:"会員費", plan:"月払い", name:"森田 桂", no:"0851", amount:980, status:"確定" },
  { id:"R0711-003", date:"2026.07.11", category:"イベント", plan:"COMMONS MUSIC BAR", name:"村瀬 史奈", no:"0873", amount:6000, status:"確定" },
  { id:"R0711-004", date:"2026.07.11", category:"返金対応", plan:"COMMONS MUSIC BAR キャンセル", name:"田中 康介", no:"0880", amount:-7000, status:"返金済" },
  { id:"R0710-001", date:"2026.07.10", category:"会員費", plan:"年払い", name:"田中 康介", no:"0880", amount:500, status:"確定" },
  { id:"R0710-002", date:"2026.07.10", category:"会員費", plan:"月払い", name:"山本 彩花", no:"0885", amount:980, status:"確定" },
  { id:"R0710-003", date:"2026.07.10", category:"イベント", plan:"Coffee Cupping #7", name:"伊藤 健", no:"0891", amount:4000, status:"確定" },
  { id:"R0710-004", date:"2026.07.10", category:"クーポン", plan:"初回入会特典", name:"中村 優一", no:"0898", amount:-980, status:"適用" },
  { id:"R0709-001", date:"2026.07.09", category:"会員費", plan:"月払い", name:"中村 優一", no:"0898", amount:980, status:"確定" },
  { id:"R0709-002", date:"2026.07.09", category:"イベント", plan:"COMMONS MUSIC BAR", name:"青山 陸", no:"0824", amount:7000, status:"未確定" },
  { id:"R0708-001", date:"2026.07.08", category:"会員費", plan:"年払い", name:"佐藤 美咲", no:"0827", amount:500, status:"確定" },
  { id:"R0708-002", date:"2026.07.08", category:"返金対応", plan:"Wine Salon キャンセル", name:"森田 桂", no:"0851", amount:-9800, status:"返金済" },
];

function net(d: typeof monthlyData[0]) { return d.memberFee + d.eventSales - d.couponDiscount; }

const current = monthlyData[monthlyData.length - 1];
const prev = monthlyData[monthlyData.length - 2];

function fmtY(v: number) { return `¥${(v / 10000).toFixed(0)}万`; }

function LineChart({ data, max, color }: { data: number[]; max: number; color: string }) {
  const w = 500, h = 80;
  const pl = 4, pr = 4, pt = 8, pb = 4;
  const cw = w - pl - pr, ch = h - pt - pb;
  const pts = data.map((v, i) => ({
    x: pl + (i / (data.length - 1)) * cw,
    y: pt + ch - (v / max) * ch,
  }));
  const polyline = pts.map(p => `${p.x},${p.y}`).join(" ");
  const area = `${pts[0].x},${pt + ch} ${polyline} ${pts[pts.length - 1].x},${pt + ch}`;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-20">
      <defs>
        <linearGradient id={`g-${color}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.18" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={area} fill={`url(#g-${color})`} />
      <polyline points={polyline} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      {pts.map((p, i) => <circle key={i} cx={p.x} cy={p.y} r="2.5" fill={color} />)}
    </svg>
  );
}

type Tab = "overview" | "member" | "event" | "list";

export default function RevenuePage() {
  const [tab, setTab] = useState<Tab>("overview");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [filterCats, setFilterCats] = useState<Set<string>>(new Set());

  function toggleCat(cat: string) {
    setFilterCats(prev => {
      const next = new Set(prev);
      next.has(cat) ? next.delete(cat) : next.add(cat);
      return next;
    });
  }

  const memberFeeMax = Math.max(...monthlyData.map(d => d.memberFee)) * 1.05;
  const eventMax = Math.max(...monthlyData.map(d => d.eventSales)) * 1.05;
  const netMax = Math.max(...monthlyData.map(d => net(d))) * 1.05;

  const annualFeeArr = monthlyData.map(d => d.annualMembers * 500);
  const monthlyFeeArr = monthlyData.map(d => d.monthlyMembers * 980);

  const currentAnnualFee = current.annualMembers * 500;
  const currentMonthlyFee = current.monthlyMembers * 980;
  const prevAnnualFee = prev.annualMembers * 500;

  const filteredItems = revenueItems.filter(r => {
    if (filterCats.size > 0 && !filterCats.has(r.category)) return false;
    if (dateFrom && r.date.replace(/\./g,"-") < dateFrom.replace(/\./g,"-")) return false;
    if (dateTo && r.date.replace(/\./g,"-") > dateTo.replace(/\./g,"-")) return false;
    return true;
  });

  const kpiCards = [
    { label: "純売上（7月）", value: fmtY(net(current)), sub: `前月比 +${((net(current) - net(prev)) / net(prev) * 100).toFixed(1)}%`, up: true },
    { label: "会員費収入", value: fmtY(current.memberFee), sub: `前月比 +${((current.memberFee - prev.memberFee) / prev.memberFee * 100).toFixed(1)}%`, up: true },
    { label: "イベント売上", value: fmtY(current.eventSales), sub: `前月比 +${((current.eventSales - prev.eventSales) / prev.eventSales * 100).toFixed(1)}%`, up: true },
    { label: "クーポン割引", value: fmtY(current.couponDiscount), sub: "利用促進", up: false },
  ];

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <div className="px-8 py-6 border-b border-[var(--color-line)] flex-none">
        <div className="font-display text-[10px] tracking-[0.12em] text-[var(--color-accent-deep)]">REVENUE</div>
        <h1 className="font-display text-2xl mt-0.5">売上管理</h1>
      </div>

      {/* Tabs */}
      <div className="px-8 border-b border-[var(--color-line)] flex gap-6 flex-none">
        {([["overview","全体推移"],["member","会員費推移"],["event","イベント売上"],["list","売上一覧"]] as const).map(([k,l])=>(
          <button key={k} onClick={()=>setTab(k)}
            className={`font-display text-sm py-4 border-b-2 transition ${tab===k?"border-[var(--color-accent)] text-[var(--color-accent-deep)]":"border-transparent text-[var(--color-mute)]"}`}>{l}</button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto px-8 py-6">
        <div className="max-w-[900px] space-y-6">
          {/* KPI Cards - always visible */}
          <div className="grid grid-cols-4 gap-4">
            {kpiCards.map(k => (
              <div key={k.label} className="card p-5">
                <div className="font-display text-[10px] text-[var(--color-mute)] mb-2">{k.label}</div>
                <div className="num text-2xl mb-1">{k.value}</div>
                <div className={`font-display text-[10px] ${k.up ? "text-green-400" : "text-[var(--color-mute)]"}`}>{k.sub}</div>
              </div>
            ))}
          </div>

          {tab === "overview" && (
            <>
              <div className="card p-6">
                <div className="font-display text-[10px] text-[var(--color-mute)] mb-3">純売上推移（万円）</div>
                <LineChart data={monthlyData.map(d => net(d))} max={netMax} color="var(--color-accent)" />
                <div className="flex justify-between font-display text-[9px] text-[var(--color-mute)] mt-1">
                  {months.map(m => <span key={m}>{m}</span>)}
                </div>
                <div className="grid grid-cols-6 gap-2 mt-4">
                  {monthlyData.map(d => (
                    <div key={d.month} className="text-center">
                      <div className="num text-sm">{fmtY(net(d))}</div>
                      <div className="font-display text-[9px] text-[var(--color-mute)]">{d.month.slice(5)}</div>
                    </div>
                  ))}
                </div>
              </div>
              {/* 会員費内訳 */}
              <div className="card p-6">
                <h2 className="font-display text-sm mb-4">会員費内訳（7月）</h2>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-[var(--color-bg)] rounded-xl p-4 border border-[var(--color-accent)]/20">
                    <div className="flex items-center gap-1.5 mb-1"><span className="w-2 h-2 rounded-full bg-[var(--color-accent)]"></span><div className="font-display text-[10px] text-[var(--color-mute)]">年払いプラン</div></div>
                    <div className="num text-xl">{fmtY(currentAnnualFee)}</div>
                    <div className="font-display text-[10px] text-[var(--color-accent-deep)] mt-1">{current.annualMembers}名 × ¥500/月 ({(current.annualMembers / current.members * 100).toFixed(0)}%)</div>
                  </div>
                  <div className="bg-[var(--color-bg)] rounded-xl p-4 border border-blue-400/20">
                    <div className="flex items-center gap-1.5 mb-1"><span className="w-2 h-2 rounded-full bg-blue-400"></span><div className="font-display text-[10px] text-[var(--color-mute)]">月払いプラン</div></div>
                    <div className="num text-xl">{fmtY(currentMonthlyFee)}</div>
                    <div className="font-display text-[10px] text-blue-400 mt-1">{current.monthlyMembers}名 × ¥980/月 ({(current.monthlyMembers / current.members * 100).toFixed(0)}%)</div>
                  </div>
                </div>
                <div className="h-2 rounded-full overflow-hidden flex mb-1">
                  <div className="bg-[var(--color-accent)] h-full transition-all" style={{ width: `${current.annualMembers / current.members * 100}%` }}></div>
                  <div className="bg-blue-400 h-full flex-1"></div>
                </div>
                <div className="flex justify-between font-display text-[9px] text-[var(--color-mute)]">
                  <span>年払い {(current.annualMembers / current.members * 100).toFixed(0)}%</span>
                  <span>月払い {(current.monthlyMembers / current.members * 100).toFixed(0)}%</span>
                </div>
              </div>
            </>
          )}

          {tab === "member" && (
            <div className="card p-6">
              <div className="font-display text-[10px] text-[var(--color-mute)] mb-3">会員費収入推移</div>
              <LineChart data={monthlyData.map(d => d.memberFee)} max={memberFeeMax} color="var(--color-accent)" />
              <div className="flex justify-between font-display text-[9px] text-[var(--color-mute)] mt-1">{months.map(m => <span key={m}>{m}</span>)}</div>
              <div className="mt-5 space-y-2">
                {monthlyData.slice().reverse().map(d => (
                  <div key={d.month} className="grid grid-cols-5 items-center gap-3 py-2 border-b border-[var(--color-line)] text-xs">
                    <span className="font-display text-[var(--color-mute)]">{d.month}</span>
                    <span className="num">{d.members.toLocaleString()}名</span>
                    <span className="font-display text-[var(--color-accent-deep)] flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent)] inline-block"></span>年払 {d.annualMembers}名</span>
                    <span className="font-display text-blue-400 flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-blue-400 inline-block"></span>月払 {d.monthlyMembers}名</span>
                    <span className="num text-right">{fmtY(d.memberFee)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === "event" && (
            <div className="card p-6">
              <div className="font-display text-[10px] text-[var(--color-mute)] mb-3">イベント売上推移</div>
              <LineChart data={monthlyData.map(d => d.eventSales)} max={eventMax} color="#60a5fa" />
              <div className="flex justify-between font-display text-[9px] text-[var(--color-mute)] mt-1">{months.map(m => <span key={m}>{m}</span>)}</div>
              <div className="mt-5 space-y-2">
                {monthlyData.slice().reverse().map(d => (
                  <div key={d.month} className="flex items-center justify-between py-2 border-b border-[var(--color-line)] text-xs">
                    <span className="font-display text-[var(--color-mute)]">{d.month}</span>
                    <span className="num">¥{d.eventSales.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === "list" && (
            <div className="card overflow-hidden">
              {/* Search bar */}
              <div className="px-5 py-4 border-b border-[var(--color-line)] space-y-3">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2 flex-1">
                    <span className="font-display text-[10px] text-[var(--color-mute)] flex-none">期間</span>
                    <input type="date" value={dateFrom} onChange={e=>setDateFrom(e.target.value)}
                      className="bg-[var(--color-bg)] border border-[var(--color-line)] rounded-lg px-3 py-1.5 text-xs outline-none focus:border-[var(--color-accent)]/50 text-[var(--color-ink)]" />
                    <span className="font-display text-[10px] text-[var(--color-mute)]">〜</span>
                    <input type="date" value={dateTo} onChange={e=>setDateTo(e.target.value)}
                      className="bg-[var(--color-bg)] border border-[var(--color-line)] rounded-lg px-3 py-1.5 text-xs outline-none focus:border-[var(--color-accent)]/50 text-[var(--color-ink)]" />
                    {(dateFrom||dateTo) && (
                      <button onClick={() => { setDateFrom(""); setDateTo(""); }} className="font-display text-[10px] text-[var(--color-mute)] hover:text-[var(--color-ink)]">クリア</button>
                    )}
                  </div>
                  <button onClick={() => {
                    const header = "取引ID,日付,カテゴリ,内容,会員名,会員番号,金額,ステータス";
                    const rows = filteredItems.map(r => `${r.id},${r.date},${r.category},${r.plan},${r.name},${r.no},${r.amount},${r.status}`);
                    const csv = [header,...rows].join("\n");
                    const blob = new Blob(["﻿"+csv], {type:"text/csv"});
                    const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "revenue.csv"; a.click();
                  }} className="font-display text-[10px] px-4 py-2 rounded-full border border-[var(--color-accent)]/60 text-[var(--color-accent-deep)] hover:bg-[var(--color-accent)]/8 transition flex-none">
                    CSV出力
                  </button>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-display text-[10px] text-[var(--color-mute)]">カテゴリ</span>
                  {["イベント","会員費","クーポン","返金対応"].map(cat => (
                    <label key={cat} className="flex items-center gap-1.5 cursor-pointer">
                      <input type="checkbox" checked={filterCats.has(cat)} onChange={() => toggleCat(cat)}
                        className="accent-[var(--color-accent)] w-3.5 h-3.5" />
                      <span className="font-display text-[10px] text-[var(--color-mute)]">{cat}</span>
                    </label>
                  ))}
                  {filterCats.size > 0 && (
                    <button onClick={() => setFilterCats(new Set())} className="font-display text-[10px] text-[var(--color-mute)] hover:text-[var(--color-ink)]">クリア</button>
                  )}
                </div>
              </div>
              <table className="w-full text-sm">
                <thead>
                  <tr className="font-display text-[9px] text-[var(--color-mute)] text-left border-b border-[var(--color-line)]">
                    <th className="px-5 py-3">取引ID</th>
                    <th className="px-5 py-3">日付</th>
                    <th className="px-5 py-3">カテゴリ</th>
                    <th className="px-5 py-3">内容</th>
                    <th className="px-5 py-3">会員</th>
                    <th className="px-5 py-3 text-right">金額</th>
                    <th className="px-5 py-3 text-center">ステータス</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--color-line)]">
                  {filteredItems.map(r => (
                    <tr key={r.id} className="hover:bg-[var(--color-bg-soft)] transition">
                      <td className="px-5 py-3 num text-[10px] text-[var(--color-mute)]">{r.id}</td>
                      <td className="px-5 py-3 num text-xs">{r.date}</td>
                      <td className="px-5 py-3">
                        <span className={`tag text-[9px] ${r.category==="会員費"?"tag-ink":"tag-accent"}`}>{r.category}</span>
                      </td>
                      <td className="px-5 py-3 font-display text-xs">{r.plan}</td>
                      <td className="px-5 py-3">
                        <div className="font-display text-xs">{r.name}</div>
                        <div className="num text-[10px] text-[var(--color-mute)]">#{r.no}</div>
                      </td>
                      <td className="px-5 py-3 num text-sm text-right">¥{r.amount.toLocaleString()}</td>
                      <td className="px-5 py-3 text-center">
                        <span className={`font-display text-[9px] px-2 py-0.5 rounded-full border ${r.status==="確定"?"border-green-500/40 text-green-400":"border-[var(--color-line)] text-[var(--color-mute)]"}`}>{r.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-t border-[var(--color-line)] bg-[var(--color-bg-soft)]">
                    <td colSpan={5} className="px-5 py-3 font-display text-xs text-[var(--color-mute)]">合計 {filteredItems.length}件</td>
                    <td className="px-5 py-3 num text-sm font-bold text-right">
                      ¥{filteredItems.reduce((s,r) => s + r.amount, 0).toLocaleString()}
                    </td>
                    <td></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
