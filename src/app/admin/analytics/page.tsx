"use client";
import { useState, useMemo } from "react";

type Log = {
  user_id: string;
  action: string;
  target_id: string;
  timestamp: string;
};

const ACTION_LABELS: Record<string, string> = {
  page_view:     "ページ閲覧",
  event_apply:   "イベント申込",
  event_cancel:  "申込キャンセル",
  coupon_use:    "クーポン使用",
  profile_edit:  "プロフィール編集",
  club_join:     "クラブ参加",
  club_leave:    "クラブ退出",
  dm_send:       "DM送信",
  login:         "ログイン",
  post_create:   "投稿作成",
};

const ALL_LOGS: Log[] = [
  { user_id:"U-0827", action:"page_view",    target_id:"evt_001", timestamp:"2026-07-15 19:32" },
  { user_id:"U-0827", action:"event_apply",  target_id:"evt_001", timestamp:"2026-07-15 19:34" },
  { user_id:"U-0880", action:"page_view",    target_id:"evt_001", timestamp:"2026-07-15 20:01" },
  { user_id:"U-0824", action:"login",        target_id:"",        timestamp:"2026-07-15 09:12" },
  { user_id:"U-0824", action:"page_view",    target_id:"evt_001", timestamp:"2026-07-15 09:15" },
  { user_id:"U-0824", action:"event_apply",  target_id:"evt_001", timestamp:"2026-07-15 09:17" },
  { user_id:"U-0885", action:"page_view",    target_id:"evt_002", timestamp:"2026-07-14 14:30" },
  { user_id:"U-0885", action:"event_apply",  target_id:"evt_002", timestamp:"2026-07-14 14:33" },
  { user_id:"U-0885", action:"coupon_use",   target_id:"cpn_012", timestamp:"2026-07-14 15:01" },
  { user_id:"U-0851", action:"login",        target_id:"",        timestamp:"2026-07-14 11:00" },
  { user_id:"U-0851", action:"page_view",    target_id:"evt_002", timestamp:"2026-07-14 11:03" },
  { user_id:"U-0851", action:"club_join",    target_id:"club_03", timestamp:"2026-07-14 11:10" },
  { user_id:"U-0880", action:"post_create",  target_id:"post_88", timestamp:"2026-07-13 18:45" },
  { user_id:"U-0880", action:"dm_send",      target_id:"U-0827",  timestamp:"2026-07-13 19:02" },
  { user_id:"U-0830", action:"page_view",    target_id:"evt_001", timestamp:"2026-07-13 10:20" },
  { user_id:"U-0830", action:"event_apply",  target_id:"evt_001", timestamp:"2026-07-13 10:22" },
  { user_id:"U-0898", action:"login",        target_id:"",        timestamp:"2026-07-12 08:30" },
  { user_id:"U-0898", action:"page_view",    target_id:"evt_003", timestamp:"2026-07-12 08:32" },
  { user_id:"U-0843", action:"profile_edit", target_id:"",        timestamp:"2026-07-12 13:55" },
  { user_id:"U-0843", action:"page_view",    target_id:"evt_002", timestamp:"2026-07-12 14:01" },
  { user_id:"U-0827", action:"coupon_use",   target_id:"cpn_007", timestamp:"2026-07-10 19:45" },
  { user_id:"U-0827", action:"post_create",  target_id:"post_72", timestamp:"2026-07-09 12:10" },
  { user_id:"U-0891", action:"login",        target_id:"",        timestamp:"2026-07-08 09:00" },
  { user_id:"U-0891", action:"page_view",    target_id:"evt_003", timestamp:"2026-07-08 09:05" },
  { user_id:"U-0885", action:"club_join",    target_id:"club_01", timestamp:"2026-07-07 16:20" },
  { user_id:"U-0851", action:"page_view",    target_id:"evt_003", timestamp:"2026-07-06 10:40" },
  { user_id:"U-0851", action:"event_apply",  target_id:"evt_003", timestamp:"2026-07-06 10:43" },
  { user_id:"U-0824", action:"coupon_use",   target_id:"cpn_010", timestamp:"2026-07-05 20:15" },
  { user_id:"U-0830", action:"dm_send",      target_id:"U-0885",  timestamp:"2026-07-04 17:30" },
  { user_id:"U-0880", action:"club_leave",   target_id:"club_02", timestamp:"2026-07-03 11:00" },
];

const ACTION_COLORS: Record<string, string> = {
  page_view:     "bg-blue-500/10 text-blue-400 border-blue-500/20",
  event_apply:   "bg-green-500/10 text-green-400 border-green-500/20",
  event_cancel:  "bg-red-400/10 text-red-400 border-red-400/20",
  coupon_use:    "bg-[var(--color-accent)]/10 text-[var(--color-accent-deep)] border-[var(--color-accent)]/20",
  profile_edit:  "bg-purple-500/10 text-purple-400 border-purple-500/20",
  club_join:     "bg-teal-500/10 text-teal-400 border-teal-500/20",
  club_leave:    "bg-orange-500/10 text-orange-400 border-orange-500/20",
  dm_send:       "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
  login:         "bg-slate-500/10 text-slate-400 border-slate-500/20",
  post_create:   "bg-pink-500/10 text-pink-400 border-pink-500/20",
};

export default function AnalyticsPage() {
  const [dateFrom, setDateFrom]   = useState("2026-06-01");
  const [dateTo,   setDateTo]     = useState("2026-06-30");
  const [userId,   setUserId]     = useState("U-0827");
  const [action,   setAction]     = useState("page_view");
  const [targetId, setTargetId]   = useState("evt_001");
  const [applied,  setApplied]    = useState(false);

  const filtered = useMemo(() => {
    if (!applied) return ALL_LOGS;
    return ALL_LOGS.filter(l => {
      const date = l.timestamp.slice(0, 10);
      if (dateFrom && date < dateFrom) return false;
      if (dateTo   && date > dateTo)   return false;
      if (userId   && l.user_id   !== userId)   return false;
      if (action   && l.action    !== action)   return false;
      if (targetId && l.target_id !== targetId) return false;
      return true;
    });
  }, [applied, dateFrom, dateTo, userId, action, targetId]);

  const uniqueUsers   = new Set(filtered.map(l => l.user_id)).size;
  const uniqueActions = new Set(filtered.map(l => l.action)).size;

  function handleSearch() { setApplied(true); }
  function handleReset()  { setDateFrom(""); setDateTo(""); setUserId(""); setAction(""); setTargetId(""); setApplied(false); }

  return (
    <div className="p-8 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-2xl text-[var(--color-ink)] tracking-tight">ユーザーログ管理</h1>
          <p className="text-[var(--color-mute)] text-sm mt-1">activity_logs テーブル / 行動履歴の検索・エクスポート</p>
        </div>
        <button
          onClick={() => alert("CSVダウンロード（モック）")}
          className="flex items-center gap-2 px-4 py-2 rounded-xl border border-[var(--color-accent)]/40 text-[var(--color-accent-deep)] text-sm font-display hover:bg-[var(--color-accent)]/8 transition-colors"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
          </svg>
          CSVダウンロード
        </button>
      </div>

      {/* Filter Card */}
      <div className="card p-5 mb-6">
        <div className="text-xs font-display text-[var(--color-mute)] tracking-widest mb-4 uppercase">絞り込み条件</div>
        <div className="grid grid-cols-2 gap-4 mb-4">
          {/* 期間 */}
          <div>
            <label className="block text-xs text-[var(--color-mute)] mb-1.5 font-display">期間</label>
            <div className="flex items-center gap-2">
              <input
                type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)}
                className="flex-1 bg-[var(--color-bg)] border border-[var(--color-line)] rounded-lg px-3 py-2 text-xs text-[var(--color-ink)] focus:outline-none focus:border-[var(--color-accent)]/60"
              />
              <span className="text-[var(--color-mute)] text-xs">〜</span>
              <input
                type="date" value={dateTo} onChange={e => setDateTo(e.target.value)}
                className="flex-1 bg-[var(--color-bg)] border border-[var(--color-line)] rounded-lg px-3 py-2 text-xs text-[var(--color-ink)] focus:outline-none focus:border-[var(--color-accent)]/60"
              />
            </div>
          </div>

          {/* ユーザーID */}
          <div>
            <label className="block text-xs text-[var(--color-mute)] mb-1.5 font-display">
              ユーザーID
              <span className="ml-2 text-[10px] text-[var(--color-mute)]/60">空白＝全員</span>
            </label>
            <input
              type="text" value={userId} onChange={e => setUserId(e.target.value)}
              placeholder="例: U-0827"
              className="w-full bg-[var(--color-bg)] border border-[var(--color-line)] rounded-lg px-3 py-2 text-xs text-[var(--color-ink)] placeholder:text-[var(--color-mute)]/40 focus:outline-none focus:border-[var(--color-accent)]/60"
            />
          </div>

          {/* アクション */}
          <div>
            <label className="block text-xs text-[var(--color-mute)] mb-1.5 font-display">
              アクション
              <span className="ml-2 text-[10px] text-[var(--color-mute)]/60">空白＝全種別</span>
            </label>
            <select
              value={action} onChange={e => setAction(e.target.value)}
              className="w-full bg-[var(--color-bg)] border border-[var(--color-line)] rounded-lg px-3 py-2 text-xs text-[var(--color-ink)] focus:outline-none focus:border-[var(--color-accent)]/60"
            >
              <option value="">— 全種別 —</option>
              {Object.entries(ACTION_LABELS).map(([k, v]) => (
                <option key={k} value={k}>{k}（{v}）</option>
              ))}
            </select>
          </div>

          {/* 対象ID */}
          <div>
            <label className="block text-xs text-[var(--color-mute)] mb-1.5 font-display">
              対象ID（target_id）
              <span className="ml-2 text-[10px] text-[var(--color-mute)]/60">空白＝全対象</span>
            </label>
            <input
              type="text" value={targetId} onChange={e => setTargetId(e.target.value)}
              placeholder="例: evt_001"
              className="w-full bg-[var(--color-bg)] border border-[var(--color-line)] rounded-lg px-3 py-2 text-xs text-[var(--color-ink)] placeholder:text-[var(--color-mute)]/40 focus:outline-none focus:border-[var(--color-accent)]/60"
            />
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleSearch}
            className="btn-primary px-6 py-2 text-sm"
          >
            検索
          </button>
          <button
            onClick={handleReset}
            className="px-4 py-2 text-sm text-[var(--color-mute)] border border-[var(--color-line)] rounded-xl hover:bg-[var(--color-bg-soft)] transition-colors font-display"
          >
            リセット
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: "ログ件数",           value: filtered.length.toLocaleString(), unit: "件" },
          { label: "ユニークユーザー数",  value: uniqueUsers.toLocaleString(),     unit: "人" },
          { label: "アクション種別数",    value: uniqueActions.toLocaleString(),   unit: "種" },
        ].map(s => (
          <div key={s.label} className="card p-4">
            <div className="text-[var(--color-mute)] text-xs font-display mb-2">{s.label}</div>
            <div className="text-2xl font-display text-[var(--color-ink)]">
              <span className="num">{s.value}</span>
              <span className="text-sm text-[var(--color-mute)] ml-1">{s.unit}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="px-5 py-3.5 border-b border-[var(--color-line)] flex items-center justify-between">
          <span className="font-display text-sm text-[var(--color-ink)]">ログ一覧</span>
          <span className="text-xs text-[var(--color-mute)]">{filtered.length} 件</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-[var(--color-line)]">
                {["user_id","action","target_id","timestamp"].map(h => (
                  <th key={h} className="px-5 py-3 text-left font-display text-[10px] tracking-wider text-[var(--color-mute)] uppercase">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-5 py-12 text-center text-[var(--color-mute)] text-sm">
                    条件に一致するログがありません
                  </td>
                </tr>
              ) : (
                filtered.map((log, i) => (
                  <tr key={i} className="border-b border-[var(--color-line)]/50 hover:bg-[var(--color-bg-soft)]/40 transition-colors">
                    <td className="px-5 py-3 font-display text-[var(--color-ink)] font-medium">
                      {log.user_id}
                    </td>
                    <td className="px-5 py-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-display border ${ACTION_COLORS[log.action] ?? "bg-slate-500/10 text-slate-400 border-slate-500/20"}`}>
                        {log.action}
                      </span>
                      <span className="ml-2 text-[var(--color-mute)]">
                        {ACTION_LABELS[log.action] ?? ""}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-[var(--color-mute)] font-display">
                      {log.target_id || <span className="text-[var(--color-line)]">—</span>}
                    </td>
                    <td className="px-5 py-3 text-[var(--color-mute)] tabular-nums">
                      {log.timestamp}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
