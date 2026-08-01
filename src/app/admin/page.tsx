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

// 会員数サマリー（※仮の内訳データ）
const memberSummary = {
  newThisMonth: 51,
  cumulativeTotal: 1570, // 累計会員数（退会者含む、これまでの入会総数）
  activeTotal: 1412,     // 在籍会員数（現在アクティブ）
  suspendedTotal: 24,    // 休会中会員数
  withdrawnTotal: 158,   // 退会済み累計
};

// 男女比（入会・退会・在籍）（※仮のデータ）
const genderBreakdown = {
  joined:    { male: 27, female: 24 },
  withdrawn: { male: 5,  female: 3 },
  active:    { male: 780, female: 632 },
};

const segments = [
  { level:"高", label:"エンゲージ高", description:"直近3ヶ月以内に活動・イベント参加8回以上", count:287, pct:20.3, churnRate:"0.2%", avgMonths:14.2, avgCouponUse:8.4, tagClass:"bg-green-500/15 text-green-400 border-green-500/30", barClass:"bg-green-500" },
  { level:"中", label:"エンゲージ中", description:"直近3ヶ月以内に活動・イベント参加3〜7回", count:812, pct:57.5, churnRate:"0.6%", avgMonths:8.7, avgCouponUse:3.1, tagClass:"bg-[var(--color-accent)]/15 text-[var(--color-accent-deep)] border-[var(--color-accent)]/30", barClass:"bg-[var(--color-accent)]" },
  { level:"低", label:"エンゲージ低", description:"直近90日以上活動なし or 参加3回未満", count:313, pct:22.2, churnRate:"2.8%", avgMonths:5.1, avgCouponUse:0.8, tagClass:"bg-red-400/10 text-red-400 border-red-400/20", barClass:"bg-red-400" },
];

// ===== コホート分析（月別入会コホートの継続率） =====
type Cohort = { month: string; label: string; size: number; retention: number[] };
const cohorts: Cohort[] = [
  { month: "2026-01", label: "2026年1月", size: 62, retention: [100, 93.5, 88.7, 83.9, 80.6, 77.4, 74.2] },
  { month: "2026-02", label: "2026年2月", size: 38, retention: [100, 92.1, 86.8, 84.2, 78.9, 76.3, 73.7] },
  { month: "2026-03", label: "2026年3月", size: 61, retention: [100, 95.1, 90.2, 86.9, 83.6, 80.3] },
  { month: "2026-04", label: "2026年4月", size: 43, retention: [100, 90.7, 86.0, 81.4, 79.1] },
  { month: "2026-05", label: "2026年5月", size: 55, retention: [100, 94.5, 89.1, 85.5] },
  { month: "2026-06", label: "2026年6月", size: 48, retention: [100, 91.7, 87.5] },
  { month: "2026-07", label: "2026年7月", size: 51, retention: [100, 96.1] },
];
const COHORT_MONTHS = [0, 1, 2, 3, 4, 5, 6];

function cohortAverageAt(rows: Cohort[], idx: number) {
  const vals = rows.map(c => c.retention[idx]).filter((v): v is number => typeof v === "number");
  if (vals.length === 0) return null;
  return vals.reduce((a, b) => a + b, 0) / vals.length;
}

function retentionCellStyle(v: number) {
  // 継続率の高低で var(--color-accent) の透明度を変えるヒートマップ
  const t = Math.max(0, Math.min(1, (v - 60) / 40));
  return {
    backgroundColor: `color-mix(in srgb, var(--color-accent) ${(6 + t * 44).toFixed(0)}%, transparent)`,
  };
}

// ===== 予測LTV =====
const ltvInput = {
  monthly: {
    members: 1180,
    avgFee: 11000,            // 平均月額会費
    eventRevenue: 18468000,   // 月額会員のイベント売上合計
    memberMonths: 4860,       // 延べ在籍月数
    churnRate: 0.019,         // 月次解約率
  },
  annual: {
    members: 232,
    avgFee: 110000,           // 平均年会費
    eventRevenue: 6732000,    // 年間会員のイベント売上合計
    memberMonths: 1530,       // 延べ在籍月数
    nonRenewalRate: 0.22,     // 年間非更新率
    hasRenewalRecord: true,   // 更新実績の有無
  },
};

const mo = ltvInput.monthly;
const an = ltvInput.annual;
const monthlyEventPerMonth = mo.eventRevenue / mo.memberMonths;
const monthlyLTV = (mo.avgFee + monthlyEventPerMonth) / mo.churnRate;
const annualEventPerMonth = an.eventRevenue / an.memberMonths;
const annualFirstYearRevenue = an.avgFee + annualEventPerMonth * 12;
const annualLTV = an.hasRenewalRecord ? annualFirstYearRevenue / an.nonRenewalRate : null;
const blendedLTV =
  annualLTV === null
    ? null
    : (monthlyLTV * mo.members + annualLTV * an.members) / (mo.members + an.members);

const yen = (v: number) => "¥" + Math.round(v).toLocaleString();

// 属性・流入経路別LTV（ダミー）
const ltvBySegment = [
  { group: "性別", name: "男性", members: 780, monthlyLTV: 742000, annualLTV: 705000, blended: 736000, cpa: 245000 },
  { group: "性別", name: "女性", members: 632, monthlyLTV: 824000, annualLTV: 781000, blended: 817000, cpa: 272000 },
  { group: "流入経路", name: "Instagram", members: 496, monthlyLTV: 698000, annualLTV: 664000, blended: 692000, cpa: 231000 },
  { group: "流入経路", name: "紹介", members: 612, monthlyLTV: 912000, annualLTV: 868000, blended: 905000, cpa: 302000 },
  { group: "流入経路", name: "その他", members: 304, monthlyLTV: 631000, annualLTV: 602000, blended: 626000, cpa: 209000 },
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

type MainTab = "analytics" | "coupon" | "segments" | "cohort" | "ltv";
type ChartTab = "members" | "coupon" | "revenue";
type PeriodGranularity = "daily" | "weekly" | "monthly" | "custom";

const PERIOD_LABELS: Record<PeriodGranularity, string> = {
  daily: "日次", weekly: "週次", monthly: "月次", custom: "任意期間",
};

export default function AnalyticsPage() {
  const [tab, setTab] = useState<MainTab>("analytics");
  const [chartTab, setChartTab] = useState<ChartTab>("members");
  const [notifyModal, setNotifyModal] = useState<string | null>(null);
  const [couponModal, setCouponModal] = useState<string | null>(null);
  const [period, setPeriod] = useState<PeriodGranularity>("monthly");
  const [customFrom, setCustomFrom] = useState("2026-07-01");
  const [customTo, setCustomTo] = useState("2026-07-31");

  // Gender usage rate for current month
  const totalM = couponUseMale[couponUseMale.length - 1];
  const totalF = couponUseFemale[couponUseFemale.length - 1];
  const maleMembers = 780; const femaleMembers = 632;
  const maleRate = ((totalM / maleMembers) * 100).toFixed(1);
  const femaleRate = ((totalF / femaleMembers) * 100).toFixed(1);

  const periodLabelText = period === "custom" ? `${customFrom} 〜 ${customTo}` : PERIOD_LABELS[period];

  // 期間指定フィルタ（モック: 任意期間のときは対象コホートを絞り込む）
  const filteredCohorts = period === "custom"
    ? cohorts.filter(c => c.month >= customFrom.slice(0, 7) && c.month <= customTo.slice(0, 7))
    : cohorts;
  const cohortRows = filteredCohorts.length > 0 ? filteredCohorts : cohorts;

  const periodFilter = (
    <div className="card p-4 flex items-center gap-4 flex-wrap">
      <span className="font-display text-[10px] text-[var(--color-mute)] flex-none">期間指定</span>
      <div className="flex gap-1.5 flex-wrap">
        {(Object.keys(PERIOD_LABELS) as PeriodGranularity[]).map(p => (
          <button key={p} onClick={() => setPeriod(p)}
            className={`font-display text-xs px-3.5 py-1.5 rounded-full border transition ${period === p ? "bg-[var(--color-accent)]/15 border-[var(--color-accent)] text-[var(--color-accent-deep)]" : "border-[var(--color-line)] text-[var(--color-mute)]"}`}>
            {PERIOD_LABELS[p]}
          </button>
        ))}
      </div>
      {period === "custom" && (
        <div className="flex items-center gap-2">
          <input type="date" value={customFrom} onChange={e => setCustomFrom(e.target.value)}
            className="bg-[var(--color-bg)] border border-[var(--color-line)] rounded-lg px-3 py-1.5 text-xs outline-none focus:border-[var(--color-accent)]/60" />
          <span className="font-display text-xs text-[var(--color-mute)]">〜</span>
          <input type="date" value={customTo} onChange={e => setCustomTo(e.target.value)}
            className="bg-[var(--color-bg)] border border-[var(--color-line)] rounded-lg px-3 py-1.5 text-xs outline-none focus:border-[var(--color-accent)]/60" />
        </div>
      )}
    </div>
  );

  function downloadDashboardCSV() {
    const header = "月,新規入会,解約,退会率,売上,平均P,クーポン利用";
    const rows = kpiTable.map(r => `${r.month},${r.newMembers},${r.churned},${r.churnRate},${r.revenue},${r.avgPoint},${r.couponUse}`);
    const csv = [header, ...rows].join("\n");
    const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "dashboard_summary.csv"; a.click();
    URL.revokeObjectURL(url);
  }

  function saveCSV(csv: string, filename: string) {
    const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = filename; a.click();
    URL.revokeObjectURL(url);
  }

  function downloadCohortCSV() {
    const header = ["入会月", "入会者数", ...COHORT_MONTHS.map(i => `${i}ヶ月目`)].join(",");
    const rows = cohortRows.map(c =>
      [c.label, c.size, ...COHORT_MONTHS.map(i => (c.retention[i] === undefined ? "" : `${c.retention[i]}%`))].join(",")
    );
    const avg = ["平均", cohortRows.reduce((a, c) => a + c.size, 0),
      ...COHORT_MONTHS.map(i => { const v = cohortAverageAt(cohortRows, i); return v === null ? "" : `${v.toFixed(1)}%`; })].join(",");
    saveCSV([`期間,${periodLabelText}`, "", header, ...rows, avg].join("\n"), "cohort_retention.csv");
  }

  function downloadLtvCSV() {
    const lines: string[] = [];
    lines.push("区分,項目,値");
    lines.push(`月額会員,会員数,${mo.members}`);
    lines.push(`月額会員,平均月額会費,${mo.avgFee}`);
    lines.push(`月額会員,イベント売上合計,${mo.eventRevenue}`);
    lines.push(`月額会員,延べ在籍月数,${mo.memberMonths}`);
    lines.push(`月額会員,平均月間イベント売上,${Math.round(monthlyEventPerMonth)}`);
    lines.push(`月額会員,月次解約率,${(mo.churnRate * 100).toFixed(1)}%`);
    lines.push(`月額会員,月額会員LTV,${Math.round(monthlyLTV)}`);
    lines.push(`年間会員,会員数,${an.members}`);
    lines.push(`年間会員,平均年会費,${an.avgFee}`);
    lines.push(`年間会員,イベント売上合計,${an.eventRevenue}`);
    lines.push(`年間会員,延べ在籍月数,${an.memberMonths}`);
    lines.push(`年間会員,平均月間イベント売上,${Math.round(annualEventPerMonth)}`);
    lines.push(`年間会員,初年度予測売上,${Math.round(annualFirstYearRevenue)}`);
    lines.push(`年間会員,年間非更新率,${(an.nonRenewalRate * 100).toFixed(1)}%`);
    lines.push(`年間会員,年間会員LTV,${annualLTV === null ? "算出不可（更新実績なし）" : Math.round(annualLTV)}`);
    lines.push(`統合,統合LTV,${blendedLTV === null ? "算出不可" : Math.round(blendedLTV)}`);
    lines.push("");
    lines.push("区分,セグメント,会員数,月額会員LTV,年間会員LTV,統合LTV,許容CPA(1/3)");
    ltvBySegment.forEach(s => {
      lines.push([s.group, s.name, s.members, s.monthlyLTV, s.annualLTV, s.blended, s.cpa].join(","));
    });
    saveCSV(lines.join("\n"), "ltv_forecast.csv");
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <div className="px-8 py-6 border-b border-[var(--color-line)] flex-none flex items-center justify-between">
        <div>
          <div className="font-display text-[10px] tracking-[0.12em] text-[var(--color-accent-deep)]">ANALYTICS & BI</div>
          <h1 className="font-display text-2xl mt-0.5">分析・BI</h1>
        </div>
        <button onClick={downloadDashboardCSV} className="btn-outline !py-2 text-xs">CSV出力</button>
      </div>

      {/* Main inline tabs */}
      <div className="px-8 border-b border-[var(--color-line)] flex gap-6 flex-none">
        {([["analytics","概要ダッシュボード"],["coupon","クーポン分析"],["segments","会員セグメント"],["cohort","コホート分析"],["ltv","予測LTV"]] as const).map(([k,l])=>(
          <button key={k} onClick={() => setTab(k)}
            className={`font-display text-sm py-4 border-b-2 transition whitespace-nowrap ${tab===k?"border-[var(--color-accent)] text-[var(--color-accent-deep)]":"border-transparent text-[var(--color-mute)]"}`}>
            {l}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto px-8 py-6">
        {tab === "analytics" && (
          <div className="max-w-[1100px] space-y-6">
            {/* 期間指定 */}
            <div className="card p-4 flex items-center gap-4 flex-wrap">
              <span className="font-display text-[10px] text-[var(--color-mute)] flex-none">期間指定</span>
              <div className="flex gap-1.5">
                {(Object.keys(PERIOD_LABELS) as PeriodGranularity[]).map(p => (
                  <button key={p} onClick={() => setPeriod(p)}
                    className={`font-display text-xs px-3.5 py-1.5 rounded-full border transition ${period === p ? "bg-[var(--color-accent)]/15 border-[var(--color-accent)] text-[var(--color-accent-deep)]" : "border-[var(--color-line)] text-[var(--color-mute)]"}`}>
                    {PERIOD_LABELS[p]}
                  </button>
                ))}
              </div>
              {period === "custom" && (
                <div className="flex items-center gap-2">
                  <input type="date" value={customFrom} onChange={e => setCustomFrom(e.target.value)}
                    className="bg-[var(--color-bg)] border border-[var(--color-line)] rounded-lg px-3 py-1.5 text-xs outline-none focus:border-[var(--color-accent)]/60" />
                  <span className="font-display text-xs text-[var(--color-mute)]">〜</span>
                  <input type="date" value={customTo} onChange={e => setCustomTo(e.target.value)}
                    className="bg-[var(--color-bg)] border border-[var(--color-line)] rounded-lg px-3 py-1.5 text-xs outline-none focus:border-[var(--color-accent)]/60" />
                </div>
              )}
            </div>

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

            {/* 会員数（新規・累計・在籍） */}
            <div className="card p-6">
              <div className="font-display text-sm mb-4">会員数（{PERIOD_LABELS[period]}）</div>
              <div className="grid grid-cols-4 gap-4">
                <div className="bg-[var(--color-bg)] rounded-xl p-4 border border-[var(--color-line)]">
                  <div className="font-display text-[10px] text-[var(--color-mute)] mb-1">新規入会数</div>
                  <div className="num text-2xl text-green-400">+{memberSummary.newThisMonth}<span className="font-display text-xs text-[var(--color-mute)] ml-1">名</span></div>
                </div>
                <div className="bg-[var(--color-bg)] rounded-xl p-4 border border-[var(--color-line)]">
                  <div className="font-display text-[10px] text-[var(--color-mute)] mb-1">累計会員数</div>
                  <div className="num text-2xl">{memberSummary.cumulativeTotal.toLocaleString()}<span className="font-display text-xs text-[var(--color-mute)] ml-1">名</span></div>
                  <div className="font-display text-[9px] text-[var(--color-mute)] mt-1">退会済み {memberSummary.withdrawnTotal}名を含む</div>
                </div>
                <div className="bg-[var(--color-bg)] rounded-xl p-4 border border-[var(--color-accent)]/30">
                  <div className="font-display text-[10px] text-[var(--color-mute)] mb-1">在籍会員数</div>
                  <div className="num text-2xl text-[var(--color-accent-deep)]">{memberSummary.activeTotal.toLocaleString()}<span className="font-display text-xs text-[var(--color-mute)] ml-1">名</span></div>
                </div>
                <div className="bg-[var(--color-bg)] rounded-xl p-4 border border-[var(--color-line)]">
                  <div className="font-display text-[10px] text-[var(--color-mute)] mb-1">休会中会員数</div>
                  <div className="num text-2xl">{memberSummary.suspendedTotal.toLocaleString()}<span className="font-display text-xs text-[var(--color-mute)] ml-1">名</span></div>
                </div>
              </div>
            </div>

            {/* 男女比（入会・退会・在籍） */}
            <div className="card p-6">
              <div className="font-display text-sm mb-4">男女比（{PERIOD_LABELS[period]}）</div>
              <div className="grid grid-cols-3 gap-4">
                {([
                  { key: "joined", label: "入会", data: genderBreakdown.joined },
                  { key: "withdrawn", label: "退会", data: genderBreakdown.withdrawn },
                  { key: "active", label: "在籍", data: genderBreakdown.active },
                ] as const).map(g => {
                  const total = g.data.male + g.data.female;
                  const maleRate = total > 0 ? (g.data.male / total * 100) : 0;
                  return (
                    <div key={g.key} className="bg-[var(--color-bg)] rounded-xl p-4 border border-[var(--color-line)]">
                      <div className="font-display text-[10px] text-[var(--color-mute)] mb-2">{g.label}会員</div>
                      <div className="num text-xl mb-2">{total.toLocaleString()}<span className="font-display text-xs text-[var(--color-mute)] ml-1">名</span></div>
                      <div className="h-1.5 rounded-full bg-[var(--color-line)] overflow-hidden flex mb-2">
                        <div className="bg-blue-400 h-full" style={{ width: `${maleRate}%` }} />
                        <div className="bg-[var(--color-accent)] h-full flex-1" />
                      </div>
                      <div className="flex justify-between font-display text-[10px]">
                        <span className="text-blue-400">男性 {g.data.male}名（{maleRate.toFixed(0)}%）</span>
                        <span className="text-[var(--color-accent-deep)]">女性 {g.data.female}名（{(100 - maleRate).toFixed(0)}%）</span>
                      </div>
                    </div>
                  );
                })}
              </div>
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

        {tab === "cohort" && (
          <div className="max-w-[1100px] space-y-6">
            {periodFilter}

            <div className="flex items-center justify-between flex-wrap gap-3">
              <div>
                <div className="font-display text-[10px] text-[var(--color-accent-deep)] mb-1">COHORT RETENTION</div>
                <h3 className="font-display text-base">月別入会コホートの継続率</h3>
                <div className="font-display text-[10px] text-[var(--color-mute)] mt-1">
                  対象期間: {periodLabelText} ／ {cohortRows.length}コホート・計{cohortRows.reduce((a, c) => a + c.size, 0)}名
                </div>
              </div>
              <button onClick={downloadCohortCSV} className="btn-outline !py-2 text-xs">CSV出力</button>
            </div>

            {/* コホートテーブル */}
            <div className="card overflow-hidden">
              <div className="px-5 py-4 border-b border-[var(--color-line)] flex items-center justify-between">
                <div className="font-display text-[10px] text-[var(--color-accent-deep)]">継続率ヒートマップ</div>
                <div className="flex items-center gap-2 font-display text-[9px] text-[var(--color-mute)]">
                  <span>低</span>
                  <span className="flex">
                    {[60, 70, 80, 90, 100].map(v => (
                      <span key={v} className="w-5 h-2.5 inline-block" style={retentionCellStyle(v)} />
                    ))}
                  </span>
                  <span>高</span>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm min-w-[760px]">
                  <thead>
                    <tr className="font-display text-[10px] text-[var(--color-mute)] border-b border-[var(--color-line)]">
                      <th className="px-5 py-3 text-left whitespace-nowrap">入会月</th>
                      <th className="px-5 py-3 text-center whitespace-nowrap">入会者数</th>
                      {COHORT_MONTHS.map(i => (
                        <th key={i} className="px-3 py-3 text-center whitespace-nowrap">{i}ヶ月目</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--color-line)]">
                    {cohortRows.map(c => (
                      <tr key={c.month} className="hover:bg-[var(--color-bg-soft)] transition">
                        <td className="px-5 py-3 font-display text-xs whitespace-nowrap">{c.label}</td>
                        <td className="px-5 py-3 num text-xs text-center whitespace-nowrap">{c.size}名</td>
                        {COHORT_MONTHS.map(i => {
                          const v = c.retention[i];
                          if (v === undefined) {
                            return <td key={i} className="px-3 py-3 text-center font-display text-[10px] text-[var(--color-line)]">—</td>;
                          }
                          return (
                            <td key={i} className="px-3 py-3 text-center num text-xs" style={retentionCellStyle(v)}>
                              {v.toFixed(1)}%
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                    <tr className="bg-[var(--color-bg-soft)]">
                      <td className="px-5 py-3 font-display text-xs">平均</td>
                      <td className="px-5 py-3 num text-xs text-center">{cohortRows.reduce((a, c) => a + c.size, 0)}名</td>
                      {COHORT_MONTHS.map(i => {
                        const v = cohortAverageAt(cohortRows, i);
                        return (
                          <td key={i} className="px-3 py-3 text-center num text-xs text-[var(--color-accent-deep)]">
                            {v === null ? "—" : `${v.toFixed(1)}%`}
                          </td>
                        );
                      })}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* 平均継続率サマリー */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { l: "平均継続率（1ヶ月後）", idx: 1 },
                { l: "平均継続率（3ヶ月後）", idx: 3 },
                { l: "平均継続率（6ヶ月後）", idx: 6 },
              ].map(k => {
                const v = cohortAverageAt(cohortRows, k.idx);
                const n = cohortRows.filter(c => c.retention[k.idx] !== undefined).length;
                return (
                  <div key={k.l} className="card p-5">
                    <div className="font-display text-[10px] text-[var(--color-mute)] mb-2">{k.l}</div>
                    <div className="num text-3xl mb-1 text-[var(--color-accent-deep)]">{v === null ? "—" : `${v.toFixed(1)}%`}</div>
                    <div className="font-display text-xs text-[var(--color-mute)]">対象 {n}コホート</div>
                  </div>
                );
              })}
            </div>

            <div className="card p-5">
              <div className="font-display text-[10px] text-[var(--color-mute)] leading-relaxed">
                ※ 継続率 ＝ 各コホートの入会者のうち、経過月時点で在籍している会員の割合。0ヶ月目は入会月のため常に100%。
                セルの濃淡は継続率の高低を表す（濃いほど高い）。「—」は経過月数に到達していない未確定期間。
              </div>
            </div>
          </div>
        )}

        {tab === "ltv" && (
          <div className="max-w-[1100px] space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div>
                <div className="font-display text-[10px] text-[var(--color-accent-deep)] mb-1">PREDICTED LTV</div>
                <h3 className="font-display text-base">会員属性別の予測LTV</h3>
                <div className="font-display text-[10px] text-[var(--color-mute)] mt-1">許容CPA判断用の参考指標（2026年7月時点）</div>
              </div>
              <button onClick={downloadLtvCSV} className="btn-outline !py-2 text-xs">CSV出力</button>
            </div>

            {/* LTV KPIカード */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="card p-6">
                <div className="font-display text-[10px] text-[var(--color-mute)] mb-2">月額会員LTV</div>
                <div className="num text-4xl mb-2">{yen(monthlyLTV)}</div>
                <div className="font-display text-[10px] text-[var(--color-mute)]">
                  月額会員 {mo.members.toLocaleString()}名 ／ 許容CPA目安 {yen(monthlyLTV / 3)}
                </div>
              </div>
              <div className="card p-6">
                <div className="font-display text-[10px] text-[var(--color-mute)] mb-2">
                  {annualLTV === null ? "年間会員 初年度予測売上" : "年間会員LTV"}
                </div>
                <div className="num text-4xl mb-2">{yen(annualLTV === null ? annualFirstYearRevenue : annualLTV)}</div>
                <div className="font-display text-[10px] text-[var(--color-mute)]">
                  年間会員 {an.members.toLocaleString()}名 ／ 許容CPA目安 {yen((annualLTV === null ? annualFirstYearRevenue : annualLTV) / 3)}
                </div>
              </div>
              <div className="card p-6 border-[var(--color-accent)]/30">
                <div className="font-display text-[10px] text-[var(--color-mute)] mb-2">統合LTV</div>
                <div className="num text-4xl mb-2 text-[var(--color-accent-deep)]">
                  {blendedLTV === null ? "算出不可" : yen(blendedLTV)}
                </div>
                <div className="font-display text-[10px] text-[var(--color-mute)]">
                  全会員 {(mo.members + an.members).toLocaleString()}名 ／ 許容CPA目安 {blendedLTV === null ? "—" : yen(blendedLTV / 3)}
                </div>
              </div>
            </div>

            {annualLTV === null && (
              <div className="card p-5 border-[var(--color-accent)]/30">
                <div className="font-display text-xs text-[var(--color-accent-deep)] mb-1">注記: 年間会員LTVは未算出</div>
                <div className="font-display text-[10px] text-[var(--color-mute)] leading-relaxed">
                  年間会員の更新実績（更新／非更新の確定データ）がまだ無いため、年間非更新率を確定できません。
                  現時点では「年間会員LTV」ではなく「初年度予測売上」までしか算出できません。統合LTVも同様に確定値を出せません。
                </div>
              </div>
            )}

            {/* 月額会員LTV 内訳 */}
            <div className="card overflow-hidden">
              <div className="px-5 py-4 border-b border-[var(--color-line)] font-display text-[10px] text-[var(--color-accent-deep)]">① 月額会員LTV の計算内訳</div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm min-w-[560px]">
                  <thead>
                    <tr className="font-display text-[10px] text-[var(--color-mute)] text-left border-b border-[var(--color-line)]">
                      <th className="px-5 py-3">項目</th>
                      <th className="px-5 py-3 text-right">値</th>
                      <th className="px-5 py-3">算出根拠</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--color-line)]">
                    {[
                      { l: "月額会員数", v: `${mo.members.toLocaleString()}名`, s: "在籍中の月額プラン会員" },
                      { l: "平均月額会費", v: yen(mo.avgFee), s: "月額会費の会員平均" },
                      { l: "月額会員のイベント売上合計", v: yen(mo.eventRevenue), s: "集計期間の実績合計" },
                      { l: "月額会員の延べ在籍月数", v: `${mo.memberMonths.toLocaleString()}ヶ月`, s: "会員 × 在籍月数の合計" },
                      { l: "平均月間イベント売上", v: yen(monthlyEventPerMonth), s: "イベント売上合計 ÷ 延べ在籍月数" },
                      { l: "月次解約率", v: `${(mo.churnRate * 100).toFixed(1)}%`, s: "直近12ヶ月の平均月次解約率" },
                      { l: "月額会員LTV", v: yen(monthlyLTV), s: "（平均月額会費 ＋ 平均月間イベント売上）÷ 月次解約率" },
                    ].map((r, i, arr) => (
                      <tr key={r.l} className={i === arr.length - 1 ? "bg-[var(--color-bg-soft)]" : "hover:bg-[var(--color-bg-soft)] transition"}>
                        <td className="px-5 py-3 font-display text-xs">{r.l}</td>
                        <td className="px-5 py-3 num text-xs text-right whitespace-nowrap">{r.v}</td>
                        <td className="px-5 py-3 font-display text-[10px] text-[var(--color-mute)]">{r.s}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="px-5 py-3 border-t border-[var(--color-line)] font-display text-[10px] text-[var(--color-mute)] leading-relaxed">
                ※ 平均月間イベント売上 ＝ イベント売上合計 ÷ 延べ在籍月数<br />
                ※ 月額会員LTV ＝（平均月額会費 ＋ 平均月間イベント売上）÷ 月次解約率
              </div>
            </div>

            {/* 年間会員LTV 内訳 */}
            <div className="card overflow-hidden">
              <div className="px-5 py-4 border-b border-[var(--color-line)] font-display text-[10px] text-[var(--color-accent-deep)]">② 年間会員LTV の計算内訳</div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm min-w-[560px]">
                  <thead>
                    <tr className="font-display text-[10px] text-[var(--color-mute)] text-left border-b border-[var(--color-line)]">
                      <th className="px-5 py-3">項目</th>
                      <th className="px-5 py-3 text-right">値</th>
                      <th className="px-5 py-3">算出根拠</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--color-line)]">
                    {[
                      { l: "年間会員数", v: `${an.members.toLocaleString()}名`, s: "在籍中の年間プラン会員" },
                      { l: "平均年会費", v: yen(an.avgFee), s: "年会費の会員平均" },
                      { l: "年間会員のイベント売上合計", v: yen(an.eventRevenue), s: "集計期間の実績合計" },
                      { l: "年間会員の延べ在籍月数", v: `${an.memberMonths.toLocaleString()}ヶ月`, s: "会員 × 在籍月数の合計" },
                      { l: "平均月間イベント売上", v: yen(annualEventPerMonth), s: "イベント売上合計 ÷ 延べ在籍月数" },
                      { l: "初年度予測売上", v: yen(annualFirstYearRevenue), s: "平均年会費 ＋ 平均月間イベント売上 × 12" },
                      { l: "年間非更新率", v: an.hasRenewalRecord ? `${(an.nonRenewalRate * 100).toFixed(1)}%` : "未確定（更新実績なし）", s: "更新期を迎えた会員のうち非更新の割合" },
                      { l: "年間会員LTV", v: annualLTV === null ? "算出不可" : yen(annualLTV), s: "初年度予測売上 ÷ 年間非更新率" },
                    ].map((r, i, arr) => (
                      <tr key={r.l} className={i === arr.length - 1 ? "bg-[var(--color-bg-soft)]" : "hover:bg-[var(--color-bg-soft)] transition"}>
                        <td className="px-5 py-3 font-display text-xs">{r.l}</td>
                        <td className="px-5 py-3 num text-xs text-right whitespace-nowrap">{r.v}</td>
                        <td className="px-5 py-3 font-display text-[10px] text-[var(--color-mute)]">{r.s}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="px-5 py-3 border-t border-[var(--color-line)] font-display text-[10px] text-[var(--color-mute)] leading-relaxed">
                ※ 平均月間イベント売上 ＝ イベント売上合計 ÷ 延べ在籍月数<br />
                ※ 初年度予測売上 ＝ 平均年会費 ＋ 平均月間イベント売上 × 12<br />
                ※ 年間会員LTV ＝ 初年度予測売上 ÷ 年間非更新率（更新実績が出た後にのみ算出可能。更新者がいない場合は初年度予測売上までしか出せません）
              </div>
            </div>

            {/* 統合LTV 内訳 */}
            <div className="card overflow-hidden">
              <div className="px-5 py-4 border-b border-[var(--color-line)] font-display text-[10px] text-[var(--color-accent-deep)]">③ 統合LTV の計算内訳</div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm min-w-[560px]">
                  <thead>
                    <tr className="font-display text-[10px] text-[var(--color-mute)] text-left border-b border-[var(--color-line)]">
                      <th className="px-5 py-3">項目</th>
                      <th className="px-5 py-3 text-right">値</th>
                      <th className="px-5 py-3">算出根拠</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--color-line)]">
                    {[
                      { l: "月額会員LTV × 月額会員数", v: yen(monthlyLTV * mo.members), s: `${yen(monthlyLTV)} × ${mo.members.toLocaleString()}名` },
                      { l: "年間会員LTV × 年間会員数", v: annualLTV === null ? "算出不可" : yen(annualLTV * an.members), s: annualLTV === null ? "年間会員LTV未確定のため算出不可" : `${yen(annualLTV)} × ${an.members.toLocaleString()}名` },
                      { l: "会員数合計", v: `${(mo.members + an.members).toLocaleString()}名`, s: "月額会員数 ＋ 年間会員数" },
                      { l: "統合LTV", v: blendedLTV === null ? "算出不可" : yen(blendedLTV), s: "｛月額LTV×月額会員数 ＋ 年間LTV×年間会員数｝÷ 会員数合計" },
                    ].map((r, i, arr) => (
                      <tr key={r.l} className={i === arr.length - 1 ? "bg-[var(--color-bg-soft)]" : "hover:bg-[var(--color-bg-soft)] transition"}>
                        <td className="px-5 py-3 font-display text-xs">{r.l}</td>
                        <td className="px-5 py-3 num text-xs text-right whitespace-nowrap">{r.v}</td>
                        <td className="px-5 py-3 font-display text-[10px] text-[var(--color-mute)]">{r.s}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="px-5 py-3 border-t border-[var(--color-line)] font-display text-[10px] text-[var(--color-mute)] leading-relaxed">
                ※ 統合LTV ＝｛月額会員LTV × 月額会員数 ＋ 年間会員LTV × 年間会員数｝÷（月額会員数 ＋ 年間会員数）<br />
                ※ 許容CPA目安は統合LTVの 1/3（{blendedLTV === null ? "—" : yen(blendedLTV / 3)}）。回収期間を重視する場合は 1/4（{blendedLTV === null ? "—" : yen(blendedLTV / 4)}）も併用します。
              </div>
            </div>

            {/* 属性・流入経路別 LTV比較 */}
            <div className="card overflow-hidden">
              <div className="px-5 py-4 border-b border-[var(--color-line)] flex items-center justify-between">
                <div className="font-display text-[10px] text-[var(--color-accent-deep)]">会員属性・流入経路別 LTV比較</div>
                <div className="font-display text-[10px] text-[var(--color-mute)]">許容CPA ＝ 統合LTV × 1/3</div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm min-w-[720px]">
                  <thead>
                    <tr className="font-display text-[10px] text-[var(--color-mute)] text-left border-b border-[var(--color-line)]">
                      <th className="px-5 py-3">区分</th>
                      <th className="px-5 py-3">セグメント</th>
                      <th className="px-5 py-3 text-center">会員数</th>
                      <th className="px-5 py-3 text-right">月額会員LTV</th>
                      <th className="px-5 py-3 text-right">年間会員LTV</th>
                      <th className="px-5 py-3 text-right">統合LTV</th>
                      <th className="px-5 py-3 text-right">許容CPA</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--color-line)]">
                    {ltvBySegment.map(s => (
                      <tr key={`${s.group}-${s.name}`} className="hover:bg-[var(--color-bg-soft)] transition">
                        <td className="px-5 py-3 font-display text-[10px] text-[var(--color-mute)] whitespace-nowrap">{s.group}</td>
                        <td className="px-5 py-3 font-display text-xs whitespace-nowrap">{s.name}</td>
                        <td className="px-5 py-3 num text-xs text-center">{s.members.toLocaleString()}名</td>
                        <td className="px-5 py-3 num text-xs text-right whitespace-nowrap">{yen(s.monthlyLTV)}</td>
                        <td className="px-5 py-3 num text-xs text-right whitespace-nowrap">{yen(s.annualLTV)}</td>
                        <td className="px-5 py-3 num text-xs text-right whitespace-nowrap text-[var(--color-accent-deep)]">{yen(s.blended)}</td>
                        <td className="px-5 py-3 num text-xs text-right whitespace-nowrap">{yen(s.cpa)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
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
