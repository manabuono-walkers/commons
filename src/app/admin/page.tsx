"use client";
import { useState } from "react";

const memberTrend = [820,870,920,985,1050,1120,1180,1240,1300,1352,1390,1412];
const revenueTrend = [4.2,4.5,4.8,5.1,5.6,5.9,6.3,6.7,7.0,7.4,7.8,8.1];
const couponTrend = [233,258,271,295,318,342];
// クーポン配布数（月別、6ヶ月）
const couponIssuedTrend = [380,420,395,450,480,510];
// 性別毎クーポン使用数（月別）
const couponUseMale = [118,133,140,151,162,176];
const couponUseFemale = [115,125,131,144,156,166];
const months12 = ["8月","9月","10月","11月","12月","1月","2月","3月","4月","5月","6月","7月"];
const months6 = ["2月","3月","4月","5月","6月","7月"];

const kpiTable = [
  { month:"2026.07", newMembers:51, churned:8, churnRate:"0.57%", revenue:"¥8.1M", avgPoint:1820, couponUse:342 },
  { month:"2026.06", newMembers:48, churned:6, churnRate:"0.44%", revenue:"¥7.8M", avgPoint:1740, couponUse:318 },
  { month:"2026.05", newMembers:55, churned:9, churnRate:"0.66%", revenue:"¥7.4M", avgPoint:1680, couponUse:295 },
  { month:"2026.04", newMembers:43, churned:7, churnRate:"0.53%", revenue:"¥7.0M", avgPoint:1620, couponUse:271 },
  { month:"2026.03", newMembers:61, churned:5, churnRate:"0.39%", revenue:"¥6.7M", avgPoint:1580, couponUse:258 },
  { month:"2026.02", newMembers:38, churned:10, churnRate:"0.79%", revenue:"¥6.3M", avgPoint:1520, couponUse:233 },
];

const segments = [
  { level:"高", label:"エンゲージ高", description:"直近3ヶ月以内に活動・イベント参加8回以上", count:287, pct:20.3, churnRate:"0.2%", avgMonths:14.2, avgCouponUse:8.4, tagClass:"bg-green-500/15 text-green-400 border-green-500/30", barClass:"bg-green-500" },
  { level:"中", label:"エンゲージ中", description:"直近3ヶ月以内に活動・イベント参加3〜7回", count:812, pct:57.5, churnRate:"0.6%", avgMonths:8.7, avgCouponUse:3.1, tagClass:"bg-[var(--color-accent)]/15 text-[var(--color-accent-deep)] border-[var(--color-accent)]/30", barClass:"bg-[var(--color-accent)]" },
  { level:"低", label:"エンゲージ低", description:"直近90日以上活動なし or 参加3回未満", count:313, pct:22.2, churnRate:"2.8%", avgMonths:5.1, avgCouponUse:0.8, tagClass:"bg-red-400/10 text-red-400 border-red-400/20", barClass:"bg-red-400" },
];

function LineChart({ data, color, gradientId }: { data: number[]; color: string; gradientId: string }) {
  const W = 480, H = 100, pad = 8;
  const min = Math.min(...data) * 0.95;
  const max = Math.max(...data) * 1.02;
  const xs = data.map((_, i) => pad + (i / (data.length - 1)) * (W - pad * 2));
  const ys = data.map(v => H - pad - ((v - min) / (max - min)) * (H - pad * 2));
  const linePath = xs.map((x, i) => `${i === 0 ? "M" : "L"} ${x} ${ys[i]}`).join(" ");
  const fillPath = `${linePath} L ${xs[xs.length-1]} ${H} L ${xs[0]} ${H} Z`;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" preserveAspectRatio="none">
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={fillPath} fill={`url(#${gradientId})`} />
      <path d={linePath} stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      {xs.map((x, i) => (
        <circle key={i} cx={x} cy={ys[i]} r={i === data.length - 1 ? 3.5 : 2} fill={color} />
      ))}
    </svg>
  );
}

function DualLineChart({ dataA, dataB, colorA, colorB, idA, idB }: { dataA: number[]; dataB: number[]; colorA: string; colorB: string; idA: string; idB: string }) {
  const W = 480, H = 100, pad = 8;
  const all = [...dataA, ...dataB];
  const min = Math.min(...all) * 0.9;
  const max = Math.max(...all) * 1.05;
  function toPath(data: number[]) {
    const xs = data.map((_, i) => pad + (i / (data.length - 1)) * (W - pad * 2));
    const ys = data.map(v => H - pad - ((v - min) / (max - min)) * (H - pad * 2));
    return { xs, ys, line: xs.map((x, i) => `${i === 0 ? "M" : "L"} ${x} ${ys[i]}`).join(" "), fill: xs.map((x, i) => `${i === 0 ? "M" : "L"} ${x} ${ys[i]}`).join(" ") + ` L ${xs[xs.length-1]} ${H} L ${xs[0]} ${H} Z` };
  }
  const a = toPath(dataA), b = toPath(dataB);
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" preserveAspectRatio="none">
      <defs>
        <linearGradient id={idA} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={colorA} stopOpacity="0.2" />
          <stop offset="100%" stopColor={colorA} stopOpacity="0" />
        </linearGradient>
        <linearGradient id={idB} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={colorB} stopOpacity="0.2" />
          <stop offset="100%" stopColor={colorB} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={a.fill} fill={`url(#${idA})`} />
      <path d={b.fill} fill={`url(#${idB})`} />
      <path d={a.line} stroke={colorA} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <path d={b.line} stroke={colorB} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      {a.xs.map((x, i) => <circle key={`a${i}`} cx={x} cy={a.ys[i]} r={i === dataA.length-1 ? 3.5 : 2} fill={colorA} />)}
      {b.xs.map((x, i) => <circle key={`b${i}`} cx={x} cy={b.ys[i]} r={i === dataB.length-1 ? 3.5 : 2} fill={colorB} />)}
    </svg>
  );
}

function BarChart({ data, color }: { data: number[]; color: string }) {
  const max = Math.max(...data);
  return (
    <div className="flex items-end gap-2 h-16">
      {data.map((v, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-1">
          <div className="num text-[10px] text-[var(--color-mute)]">{v}</div>
          <div className={`w-full rounded-sm ${color}`} style={{ height: `${(v / max) * 100}%` }} />
        </div>
      ))}
    </div>
  );
}

type MainTab = "analytics" | "coupon" | "segments";
type ChartTab = "members" | "coupon" | "revenue";

export default function AnalyticsPage() {
  const [tab, setTab] = useState<MainTab>("analytics");
  const [chartTab, setChartTab] = useState<ChartTab>("members");
  const [notifyModal, setNotifyModal] = useState<string | null>(null);
  const [couponModal, setCouponModal] = useState<string | null>(null);

  // Gender usage rate for current month
  const totalM = couponUseMale[couponUseMale.length - 1];
  const totalF = couponUseFemale[couponUseFemale.length - 1];
  const totalUse = totalM + totalF;
  const maleMembers = 780; const femaleMembers = 632;
  const maleRate = ((totalM / maleMembers) * 100).toFixed(1);
  const femaleRate = ((totalF / femaleMembers) * 100).toFixed(1);

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <div className="px-8 py-6 border-b border-[var(--color-line)] flex-none">
        <div className="font-display text-[10px] tracking-[0.12em] text-[var(--color-accent-deep)]">ANALYTICS & BI</div>
        <h1 className="font-display text-2xl mt-0.5">分析・BI</h1>
      </div>

      {/* Main inline tabs */}
      <div className="px-8 border-b border-[var(--color-line)] flex gap-6 flex-none">
        {([["analytics","概要ダッシュボード"],["coupon","クーポン分析"],["segments","会員セグメント"]] as const).map(([k,l])=>(
          <button key={k} onClick={() => setTab(k)}
            className={`font-display text-sm py-4 border-b-2 transition ${tab===k?"border-[var(--color-accent)] text-[var(--color-accent-deep)]":"border-transparent text-[var(--color-mute)]"}`}>
            {l}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto px-8 py-6">
        {tab === "analytics" && (
          <div className="max-w-[1100px] space-y-6">
            {/* KPI cards */}
            <div className="grid grid-cols-4 gap-4">
              {[
                { l: "会員総数", v: "1,412", sub: "前月比 +51", up: true },
                { l: "今月新規入会", v: "51", sub: "先月 48名", up: true },
                { l: "今月解約", v: "8", sub: "先月 6名", up: false },
                { l: "退会率", v: "0.57%", sub: "先月 0.44%", up: false },
              ].map(k => (
                <div key={k.l} className="card p-5">
                  <div className="font-display text-[10px] text-[var(--color-mute)] mb-2">{k.l}</div>
                  <div className="num text-3xl mb-1">{k.v}</div>
                  <div className={`font-display text-xs ${k.up ? "text-green-400" : "text-red-400"}`}>{k.sub}</div>
                </div>
              ))}
            </div>

            {/* Chart inline tabs */}
            <div className="card overflow-hidden">
              <div className="px-5 pt-5 border-b border-[var(--color-line)] flex gap-5">
                {([
                  ["members", "会員数推移"],
                  ["coupon", "クーポン利用数"],
                  ["revenue", "月次売上推移"],
                ] as const).map(([k,l]) => (
                  <button key={k} onClick={() => setChartTab(k)}
                    className={`font-display text-xs pb-3 border-b-2 transition ${chartTab===k?"border-[var(--color-accent)] text-[var(--color-accent-deep)]":"border-transparent text-[var(--color-mute)]"}`}>
                    {l}
                  </button>
                ))}
              </div>
              <div className="p-5">
                {chartTab === "members" && (
                  <>
                    <div className="flex justify-between items-end mb-2">
                      <div className="font-display text-[10px] text-[var(--color-mute)]">直近12ヶ月</div>
                      <div className="num text-2xl text-[var(--color-accent-deep)]">1,412<span className="text-xs ml-1">名</span></div>
                    </div>
                    <div className="h-24 mb-3">
                      <LineChart data={memberTrend} color="#B8985A" gradientId="grad-members" />
                    </div>
                    <div className="flex justify-between">
                      {months12.map((m,i) => (
                        <div key={i} className="font-display text-[8px] text-[var(--color-mute)] text-center">{m}</div>
                      ))}
                    </div>
                  </>
                )}
                {chartTab === "coupon" && (
                  <>
                    <div className="flex justify-between items-end mb-2">
                      <div className="font-display text-[10px] text-[var(--color-mute)]">直近6ヶ月</div>
                      <div className="num text-2xl text-[var(--color-accent-deep)]">342<span className="text-xs ml-1">回（7月）</span></div>
                    </div>
                    <BarChart data={couponTrend} color="bg-[var(--color-accent)]/70" />
                    <div className="flex justify-between mt-1">
                      {months6.map((m,i) => (
                        <div key={i} className="font-display text-[8px] text-[var(--color-mute)] flex-1 text-center">{m}</div>
                      ))}
                    </div>
                  </>
                )}
                {chartTab === "revenue" && (
                  <>
                    <div className="flex justify-between items-end mb-2">
                      <div className="font-display text-[10px] text-[var(--color-mute)]">直近12ヶ月（百万円）</div>
                      <div className="num text-2xl text-[var(--color-accent-deep)]">¥8.1M<span className="text-xs ml-1">（7月）</span></div>
                    </div>
                    <div className="h-24 mb-3">
                      <LineChart data={revenueTrend} color="#CBAE74" gradientId="grad-revenue" />
                    </div>
                    <div className="flex justify-between">
                      {months12.map((m,i) => (
                        <div key={i} className="font-display text-[8px] text-[var(--color-mute)] text-center">{m}</div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* KPI table */}
            <div className="card overflow-hidden">
              <div className="px-5 py-4 border-b border-[var(--color-line)] font-display text-[10px] text-[var(--color-accent-deep)]">月次KPI一覧</div>
              <table className="w-full text-sm">
                <thead>
                  <tr className="font-display text-[10px] text-[var(--color-mute)] text-left border-b border-[var(--color-line)]">
                    <th className="px-5 pb-3 pt-3">月</th>
                    <th className="px-5 pb-3 pt-3 text-center">新規入会</th>
                    <th className="px-5 pb-3 pt-3 text-center">解約</th>
                    <th className="px-5 pb-3 pt-3 text-center">退会率</th>
                    <th className="px-5 pb-3 pt-3 text-center">売上</th>
                    <th className="px-5 pb-3 pt-3 text-center">平均P</th>
                    <th className="px-5 pb-3 pt-3 text-center">クーポン利用</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--color-line)]">
                  {kpiTable.map(r => (
                    <tr key={r.month} className="hover:bg-[var(--color-bg-soft)] transition">
                      <td className="px-5 py-3 num text-xs">{r.month}</td>
                      <td className="px-5 py-3 num text-xs text-center text-green-400">+{r.newMembers}</td>
                      <td className="px-5 py-3 num text-xs text-center text-red-400">-{r.churned}</td>
                      <td className="px-5 py-3 num text-xs text-center">{r.churnRate}</td>
                      <td className="px-5 py-3 num text-xs text-center">{r.revenue}</td>
                      <td className="px-5 py-3 num text-xs text-center">{r.avgPoint.toLocaleString()}</td>
                      <td className="px-5 py-3 num text-xs text-center">{r.couponUse}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab === "coupon" && (
          <div className="max-w-[1000px] space-y-6">
            {/* KPI */}
            <div className="grid grid-cols-4 gap-4">
              {[
                { l:"クーポン配布数（7月）", v:"510", sub:"前月比 +30", up:true },
                { l:"クーポン利用数（7月）", v:"342", sub:"利用率 67.1%", up:true },
                { l:"男性利用数", v:`${totalM}`, sub:`利用率 ${maleRate}%`, up:true },
                { l:"女性利用数", v:`${totalF}`, sub:`利用率 ${femaleRate}%`, up:true },
              ].map(k=>(
                <div key={k.l} className="card p-5">
                  <div className="font-display text-[10px] text-[var(--color-mute)] mb-2">{k.l}</div>
                  <div className="num text-3xl mb-1">{k.v}</div>
                  <div className={`font-display text-xs ${k.up?"text-green-400":"text-red-400"}`}>{k.sub}</div>
                </div>
              ))}
            </div>

            {/* 配布数推移 */}
            <div className="card p-6">
              <div className="flex justify-between items-end mb-4">
                <div>
                  <div className="font-display text-[10px] text-[var(--color-accent-deep)] mb-1">COUPON ISSUED</div>
                  <h3 className="font-display text-base">クーポン配布数推移</h3>
                </div>
                <div className="num text-2xl text-[var(--color-accent-deep)]">510<span className="font-display text-xs text-[var(--color-mute)] ml-1">枚（7月）</span></div>
              </div>
              <BarChart data={couponIssuedTrend} color="bg-[var(--color-accent)]/60" />
              <div className="flex justify-between mt-2">
                {months6.map((m,i) => (
                  <div key={i} className="font-display text-[8px] text-[var(--color-mute)] flex-1 text-center">{m}</div>
                ))}
              </div>
              <div className="mt-4 grid grid-cols-6 gap-2">
                {couponIssuedTrend.map((v, i) => (
                  <div key={i} className="text-center">
                    <div className="num text-sm">{v}</div>
                    <div className="font-display text-[9px] text-[var(--color-mute)]">{months6[i]}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* 性別毎使用率 */}
            <div className="card p-6">
              <div className="flex justify-between items-end mb-4">
                <div>
                  <div className="font-display text-[10px] text-[var(--color-accent-deep)] mb-1">GENDER USAGE</div>
                  <h3 className="font-display text-base">性別毎のクーポン使用数推移</h3>
                </div>
                <div className="flex items-center gap-4 font-display text-[10px]">
                  <div className="flex items-center gap-1.5"><span className="w-3 h-0.5 rounded bg-blue-400 inline-block"></span>男性</div>
                  <div className="flex items-center gap-1.5"><span className="w-3 h-0.5 rounded bg-[var(--color-accent)] inline-block"></span>女性</div>
                </div>
              </div>
              <div className="h-24 mb-3">
                <DualLineChart
                  dataA={couponUseMale} dataB={couponUseFemale}
                  colorA="#60a5fa" colorB="#B8985A"
                  idA="grad-male" idB="grad-female"
                />
              </div>
              <div className="flex justify-between mb-4">
                {months6.map((m,i) => (
                  <div key={i} className="font-display text-[8px] text-[var(--color-mute)] flex-1 text-center">{m}</div>
                ))}
              </div>

              {/* 使用率バー（7月） */}
              <div className="space-y-3 mt-2">
                <div className="font-display text-[10px] text-[var(--color-mute)]">7月 使用率（会員数比）</div>
                <div>
                  <div className="flex justify-between font-display text-xs mb-1.5">
                    <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-blue-400 inline-block"></span>男性 ({maleMembers}名中)</div>
                    <div className="num">{totalM}名 <span className="text-[var(--color-mute)] text-[10px]">({maleRate}%)</span></div>
                  </div>
                  <div className="h-2 rounded-full bg-[var(--color-line)] overflow-hidden">
                    <div className="h-full bg-blue-400 rounded-full" style={{ width: `${maleRate}%` }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between font-display text-xs mb-1.5">
                    <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[var(--color-accent)] inline-block"></span>女性 ({femaleMembers}名中)</div>
                    <div className="num">{totalF}名 <span className="text-[var(--color-mute)] text-[10px]">({femaleRate}%)</span></div>
                  </div>
                  <div className="h-2 rounded-full bg-[var(--color-line)] overflow-hidden">
                    <div className="h-full bg-[var(--color-accent)] rounded-full" style={{ width: `${femaleRate}%` }}></div>
                  </div>
                </div>
              </div>

              {/* 月別テーブル */}
              <div className="mt-5">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="font-display text-[9px] text-[var(--color-mute)] border-b border-[var(--color-line)]">
                      <th className="pb-2 text-left">月</th>
                      <th className="pb-2 text-center">配布数</th>
                      <th className="pb-2 text-center text-blue-400">男性利用</th>
                      <th className="pb-2 text-center text-[var(--color-accent-deep)]">女性利用</th>
                      <th className="pb-2 text-center">合計利用</th>
                      <th className="pb-2 text-center">利用率</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--color-line)]">
                    {months6.map((m,i) => {
                      const issued = couponIssuedTrend[i];
                      const mUse = couponUseMale[i];
                      const fUse = couponUseFemale[i];
                      const total = mUse + fUse;
                      const rate = ((total / issued) * 100).toFixed(0);
                      return (
                        <tr key={m} className="hover:bg-[var(--color-bg-soft)] transition">
                          <td className="py-2 num">2026.0{i+2}</td>
                          <td className="py-2 text-center num">{issued}</td>
                          <td className="py-2 text-center num text-blue-400">{mUse}</td>
                          <td className="py-2 text-center num text-[var(--color-accent-deep)]">{fUse}</td>
                          <td className="py-2 text-center num">{total}</td>
                          <td className="py-2 text-center num">{rate}%</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {tab === "segments" && (
          <div className="max-w-[1000px] space-y-6">
            <div className="grid grid-cols-3 gap-4">
              {segments.map(s => (
                <div key={s.level} className="card p-5">
                  <div className="flex items-center justify-between mb-3">
                    <span className={`font-display text-xs px-3 py-1 rounded-full border ${s.tagClass}`}>エンゲージ{s.level}</span>
                    <span className="num text-2xl">{s.count.toLocaleString()}<span className="font-display text-xs text-[var(--color-mute)] ml-1">名</span></span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-[var(--color-line)] overflow-hidden mb-3">
                    <div className={`h-full rounded-full ${s.barClass}`} style={{ width: `${s.pct}%` }} />
                  </div>
                  <div className="font-display text-[10px] text-[var(--color-mute)]">{s.description}</div>
                  <div className="grid grid-cols-3 gap-2 mt-4">
                    {[
                      { l: "全体比", v: `${s.pct}%` },
                      { l: "退会率", v: s.churnRate },
                      { l: "継続月", v: `${s.avgMonths}ヶ月` },
                    ].map(k => (
                      <div key={k.l} className="text-center">
                        <div className="num text-sm">{k.v}</div>
                        <div className="font-display text-[8px] text-[var(--color-mute)] mt-0.5">{k.l}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="card overflow-hidden">
              <div className="px-5 py-4 border-b border-[var(--color-line)] flex items-center justify-between">
                <div className="font-display text-[10px] text-[var(--color-accent-deep)]">セグメント別詳細 & 施策</div>
                <div className="font-display text-[10px] text-[var(--color-mute)]">全1,412名</div>
              </div>
              <table className="w-full text-sm">
                <thead>
                  <tr className="font-display text-[10px] text-[var(--color-mute)] text-left border-b border-[var(--color-line)]">
                    <th className="px-5 pb-3 pt-3">セグメント</th>
                    <th className="px-5 pb-3 pt-3 text-center">人数</th>
                    <th className="px-5 pb-3 pt-3 text-center">退会率</th>
                    <th className="px-5 pb-3 pt-3 text-center">継続月数</th>
                    <th className="px-5 pb-3 pt-3 text-center">平均クーポン使用</th>
                    <th className="px-5 pb-3 pt-3">施策</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--color-line)]">
                  {segments.map(s => (
                    <tr key={s.level} className="hover:bg-[var(--color-bg-soft)] transition">
                      <td className="px-5 py-4">
                        <span className={`font-display text-xs px-2.5 py-1 rounded-full border ${s.tagClass}`}>エンゲージ{s.level}</span>
                      </td>
                      <td className="px-5 py-4 num text-sm text-center">{s.count.toLocaleString()}名</td>
                      <td className="px-5 py-4 num text-sm text-center">{s.churnRate}</td>
                      <td className="px-5 py-4 num text-sm text-center">{s.avgMonths}ヶ月</td>
                      <td className="px-5 py-4 num text-sm text-center">{s.avgCouponUse}回</td>
                      <td className="px-5 py-4">
                        <div className="flex gap-2">
                          <button onClick={() => setNotifyModal(s.level)}
                            className="font-display text-[10px] px-3 py-1.5 rounded-full border border-[var(--color-accent)]/40 text-[var(--color-accent-deep)] hover:bg-[var(--color-accent)]/8 transition whitespace-nowrap">
                            通知配信
                          </button>
                          <button onClick={() => setCouponModal(s.level)}
                            className="font-display text-[10px] px-3 py-1.5 rounded-full border border-[var(--color-line)] text-[var(--color-mute)] hover:border-[var(--color-accent)]/40 hover:text-[var(--color-accent-deep)] transition whitespace-nowrap">
                            クーポン配布
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {notifyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" onClick={() => setNotifyModal(null)}>
          <div className="bg-[var(--color-bg-soft)] rounded-2xl p-8 w-[480px]" onClick={e => e.stopPropagation()}>
            <h2 className="font-display text-xl mb-1">通知配信</h2>
            <p className="font-display text-xs text-[var(--color-mute)] mb-5">
              エンゲージ<strong>{notifyModal}</strong>会員（{segments.find(s=>s.level===notifyModal)?.count.toLocaleString()}名）へ配信
            </p>
            <div className="space-y-4">
              <div>
                <label className="font-display text-xs text-[var(--color-mute)] block mb-1.5">タイトル</label>
                <input placeholder="通知タイトルを入力" className="w-full bg-[var(--color-bg)] border border-[var(--color-line)] rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[var(--color-accent)]/50 placeholder-[var(--color-mute)]" />
              </div>
              <div>
                <label className="font-display text-xs text-[var(--color-mute)] block mb-1.5">本文</label>
                <textarea rows={4} placeholder="本文を入力..." className="w-full bg-[var(--color-bg)] border border-[var(--color-line)] rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[var(--color-accent)]/50 placeholder-[var(--color-mute)] resize-none" />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button className="flex-1 btn-primary justify-center text-sm">送信する</button>
              <button onClick={() => setNotifyModal(null)} className="flex-1 btn-outline justify-center text-sm">キャンセル</button>
            </div>
          </div>
        </div>
      )}

      {couponModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" onClick={() => setCouponModal(null)}>
          <div className="bg-[var(--color-bg-soft)] rounded-2xl p-8 w-[480px]" onClick={e => e.stopPropagation()}>
            <h2 className="font-display text-xl mb-1">クーポン配布</h2>
            <p className="font-display text-xs text-[var(--color-mute)] mb-5">
              エンゲージ<strong>{couponModal}</strong>会員（{segments.find(s=>s.level===couponModal)?.count.toLocaleString()}名）へ配布
            </p>
            <div className="space-y-4">
              <div>
                <label className="font-display text-xs text-[var(--color-mute)] block mb-1.5">クーポン選択</label>
                <select className="w-full bg-[var(--color-bg)] border border-[var(--color-line)] rounded-xl px-4 py-2.5 text-sm outline-none">
                  <option>ドリンク1杯無料 — SOUND BAR HOWL</option>
                  <option>ドリップコーヒー無料 — Coffee Commons</option>
                  <option>ワイン10%OFF — La Cave</option>
                </select>
              </div>
              <div>
                <label className="font-display text-xs text-[var(--color-mute)] block mb-1.5">有効期限</label>
                <input type="date" className="w-full bg-[var(--color-bg)] border border-[var(--color-line)] rounded-xl px-4 py-2.5 text-sm outline-none" />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button className="flex-1 btn-primary justify-center text-sm">配布する</button>
              <button onClick={() => setCouponModal(null)} className="flex-1 btn-outline justify-center text-sm">キャンセル</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
