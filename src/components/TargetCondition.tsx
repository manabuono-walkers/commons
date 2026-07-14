"use client";
import { useState } from "react";

const REGIONS = ["東京", "大阪", "福岡", "名古屋"];
const GENDERS = ["男性", "女性", "その他"];
const RANKS = ["スタンダード", "ブロンズ", "シルバー", "ゴールド", "プラチナ", "VIP"];
const JOBS = ["会社員", "経営者・役員", "フリーランス", "医師・医療従事者", "弁護士・士業", "クリエイター", "学生", "その他"];
const CLUBS = ["ワインクラブ", "コーヒークラブ", "フォトウォーク部", "ジャズ部", "アート部"];

type Mode = "all" | "individual" | "condition";

interface Props {
  label?: string;
}

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex items-center gap-2 cursor-pointer select-none">
      <div onClick={() => onChange(!checked)} className={`w-4 h-4 rounded flex items-center justify-center border transition ${checked ? "bg-[var(--color-accent)] border-[var(--color-accent)]" : "border-[var(--color-line)]"}`}>
        {checked && <span className="text-[var(--color-bg)] text-[9px] font-bold">✓</span>}
      </div>
      <span className="font-display text-sm">{label}</span>
    </label>
  );
}

function RadioPill({ label, checked, onClick }: { label: string; checked: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} className={`font-display text-xs px-3 py-1.5 rounded-full border transition ${checked ? "bg-[var(--color-accent)]/15 border-[var(--color-accent)] text-[var(--color-accent-deep)]" : "border-[var(--color-line)] text-[var(--color-mute)] hover:border-[var(--color-accent)]/50"}`}>
      {label}
    </button>
  );
}

function RangeInput({ label, unitLabel }: { label: string; unitLabel: string }) {
  return (
    <div>
      <div className="font-display text-xs text-[var(--color-mute)] mb-2">{label}</div>
      <div className="flex items-center gap-2">
        <input type="number" placeholder="下限" className="w-24 bg-[var(--color-bg)] border border-[var(--color-line)] rounded-lg px-3 py-1.5 text-sm outline-none focus:border-[var(--color-accent)]/50 placeholder-[var(--color-mute)]" />
        <span className="font-display text-xs text-[var(--color-mute)]">〜</span>
        <input type="number" placeholder="上限" className="w-24 bg-[var(--color-bg)] border border-[var(--color-line)] rounded-lg px-3 py-1.5 text-sm outline-none focus:border-[var(--color-accent)]/50 placeholder-[var(--color-mute)]" />
        <span className="font-display text-xs text-[var(--color-mute)]">{unitLabel}</span>
      </div>
    </div>
  );
}

export default function TargetCondition({ label = "配布対象" }: Props) {
  const [mode, setMode] = useState<Mode>("all");
  const [genders, setGenders] = useState<string[]>([]);
  const [region, setRegion] = useState<string | null>(null);
  const [newRegion, setNewRegion] = useState("");
  const [extraRegions, setExtraRegions] = useState<string[]>([]);
  const [jobs, setJobs] = useState<string[]>([]);
  const [ranks, setRanks] = useState<string[]>([]);
  const [clubs, setClubs] = useState<string[]>([]);
  const [showAddRegion, setShowAddRegion] = useState(false);

  function toggleArr(arr: string[], set: (v: string[]) => void, val: string) {
    set(arr.includes(val) ? arr.filter(v => v !== val) : [...arr, val]);
  }

  const allRegions = [...REGIONS, ...extraRegions];

  return (
    <div className="border border-[var(--color-line)] rounded-xl overflow-hidden">
      {/* Mode selector */}
      <div className="px-5 py-4 border-b border-[var(--color-line)] bg-[var(--color-bg)]">
        <div className="font-display text-xs text-[var(--color-mute)] mb-3">{label}</div>
        <div className="flex gap-2">
          {([["all", "全ユーザー"], ["individual", "個別指定"], ["condition", "条件指定"]] as const).map(([m, l]) => (
            <RadioPill key={m} label={l} checked={mode === m} onClick={() => setMode(m)} />
          ))}
        </div>
      </div>

      {/* Individual */}
      {mode === "individual" && (
        <div className="px-5 py-4 bg-[var(--color-bg-soft)]">
          <div className="font-display text-xs text-[var(--color-mute)] mb-2">会員番号または氏名で検索</div>
          <input placeholder="例: 0824 または 青山 陸（複数はカンマ区切り）" className="w-full bg-[var(--color-bg)] border border-[var(--color-line)] rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[var(--color-accent)]/50 placeholder-[var(--color-mute)]" />
          <div className="font-display text-[10px] text-[var(--color-mute)] mt-2">例: 0824, 0827, 0880</div>
        </div>
      )}

      {/* Condition */}
      {mode === "condition" && (
        <div className="px-5 py-5 bg-[var(--color-bg-soft)] space-y-5">

          {/* 年齢 */}
          <RangeInput label="年齢" unitLabel="歳" />

          {/* 性別 */}
          <div>
            <div className="font-display text-xs text-[var(--color-mute)] mb-2">性別（複数選択可）</div>
            <div className="flex gap-4">
              {GENDERS.map(g => (
                <Toggle key={g} label={g} checked={genders.includes(g)} onChange={() => toggleArr(genders, setGenders, g)} />
              ))}
            </div>
          </div>

          {/* 地域 */}
          <div>
            <div className="font-display text-xs text-[var(--color-mute)] mb-2">地域（1つ選択）</div>
            <div className="flex flex-wrap gap-2">
              {allRegions.map(r => (
                <RadioPill key={r} label={r} checked={region === r} onClick={() => setRegion(region === r ? null : r)} />
              ))}
              {showAddRegion ? (
                <div className="flex items-center gap-1">
                  <input
                    value={newRegion}
                    onChange={e => setNewRegion(e.target.value)}
                    placeholder="地域名"
                    className="w-20 bg-[var(--color-bg)] border border-[var(--color-line)] rounded-lg px-2 py-1 text-xs outline-none"
                    onKeyDown={e => {
                      if (e.key === "Enter" && newRegion.trim()) {
                        setExtraRegions([...extraRegions, newRegion.trim()]);
                        setNewRegion("");
                        setShowAddRegion(false);
                      }
                    }}
                  />
                  <button onClick={() => { if (newRegion.trim()) { setExtraRegions([...extraRegions, newRegion.trim()]); setNewRegion(""); setShowAddRegion(false); } }} className="font-display text-xs px-2 py-1 rounded border border-[var(--color-accent)] text-[var(--color-accent-deep)]">追加</button>
                </div>
              ) : (
                <button onClick={() => setShowAddRegion(true)} className="font-display text-xs px-3 py-1.5 rounded-full border border-dashed border-[var(--color-line)] text-[var(--color-mute)] hover:border-[var(--color-accent)]/50">＋ 追加</button>
              )}
            </div>
          </div>

          {/* 職業 */}
          <div>
            <div className="font-display text-xs text-[var(--color-mute)] mb-2">職業（複数選択可）</div>
            <div className="flex flex-wrap gap-2">
              {JOBS.map(j => (
                <Toggle key={j} label={j} checked={jobs.includes(j)} onChange={() => toggleArr(jobs, setJobs, j)} />
              ))}
            </div>
          </div>

          {/* イベント参加回数 */}
          <RangeInput label="イベント参加回数" unitLabel="回" />

          {/* 継続期間 */}
          <RangeInput label="継続期間（会員歴）" unitLabel="日" />

          {/* ランク */}
          <div>
            <div className="font-display text-xs text-[var(--color-mute)] mb-2">ランク（複数選択可）</div>
            <div className="flex flex-wrap gap-2">
              {RANKS.map(r => (
                <Toggle key={r} label={r} checked={ranks.includes(r)} onChange={() => toggleArr(ranks, setRanks, r)} />
              ))}
            </div>
          </div>

          {/* 所属クラブ */}
          <div>
            <div className="font-display text-xs text-[var(--color-mute)] mb-2">所属クラブ（複数選択可）</div>
            <div className="flex flex-wrap gap-2">
              {CLUBS.map(c => (
                <Toggle key={c} label={c} checked={clubs.includes(c)} onChange={() => toggleArr(clubs, setClubs, c)} />
              ))}
            </div>
          </div>

          {/* Preview */}
          <div className="bg-[var(--color-bg)] rounded-lg px-4 py-3 border border-[var(--color-line)]">
            <div className="font-display text-[10px] text-[var(--color-accent-deep)] mb-1">対象条件プレビュー</div>
            <div className="font-display text-xs text-[var(--color-mute)] space-y-0.5">
              {genders.length > 0 && <div>性別: {genders.join("・")}</div>}
              {region && <div>地域: {region}</div>}
              {jobs.length > 0 && <div>職業: {jobs.join("・")}</div>}
              {ranks.length > 0 && <div>ランク: {ranks.join("・")}</div>}
              {clubs.length > 0 && <div>所属クラブ: {clubs.join("・")}</div>}
              {genders.length === 0 && !region && jobs.length === 0 && ranks.length === 0 && clubs.length === 0 && (
                <div className="text-[var(--color-mute)]">条件を選択してください</div>
              )}
            </div>
          </div>
        </div>
      )}

      {mode === "all" && (
        <div className="px-5 py-3 bg-[var(--color-bg-soft)]">
          <div className="font-display text-xs text-[var(--color-mute)]">登録中の全会員（1,412名）が対象になります</div>
        </div>
      )}
    </div>
  );
}
