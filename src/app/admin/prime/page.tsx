"use client";
import { useState } from "react";
import { usePrimeCapacity, type PrimeArea } from "@/lib/primeCapacity";

const AI_MODELS = [
  { value: "claude-sonnet", label: "Claude Sonnet" },
  { value: "claude-haiku", label: "Claude Haiku" },
  { value: "gemini-flash", label: "Gemini Flash" },
  { value: "gemini-pro", label: "Gemini Pro" },
  { value: "gpt-4o", label: "GPT-4o" },
] as const;
type AiModel = (typeof AI_MODELS)[number]["value"];

const DEFAULT_PROMPT = `あなたはCOMMONSのPRIME会員向けAI店舗コンシェルジュです。
株式会社ONE LIKEの飲食店データベース（一次情報）をもとに、会員の要望（エリア・人数・予算・シーン・料理ジャンルなど）に合う店舗を提案してください。

- 提案は必ずデータベースに存在する店舗のみとし、存在しない情報は答えない
- 店舗の予約代行・店舗との交渉・満席店の特別手配は行わない
- 営業時間や料金は変更される可能性がある旨を必ず案内する
- 常に丁寧で簡潔な言葉遣いを心がける`;

type Tab = "capacity" | "ai";

export default function PrimeManagementPage() {
  const { areas, setLimit, totalCurrent, totalLimit } = usePrimeCapacity();
  const [tab, setTab] = useState<Tab>("capacity");

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

  // AIコンシェルジュ設定
  const [aiModel, setAiModel] = useState<AiModel>("claude-sonnet");
  const [aiApiKey, setAiApiKey] = useState("");
  const [showApiKey, setShowApiKey] = useState(false);
  const [aiPrompt, setAiPrompt] = useState(DEFAULT_PROMPT);
  const [aiSaved, setAiSaved] = useState(false);

  function saveAiSettings() {
    setAiSaved(true);
    setTimeout(() => setAiSaved(false), 1800);
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <div className="px-8 py-6 border-b border-[var(--color-line)] flex-none">
        <div className="font-display text-[10px] tracking-[0.12em] text-[var(--color-accent-deep)]">PRIME</div>
        <h1 className="font-display text-2xl mt-0.5">PRIME管理</h1>
      </div>

      {/* Inline tabs */}
      <div className="px-8 border-b border-[var(--color-line)] flex gap-6 flex-none">
        {([["capacity", "定員設定"], ["ai", "AI設定"]] as const).map(([k, l]) => (
          <button key={k} onClick={() => setTab(k)}
            className={`font-display text-sm py-4 border-b-2 transition ${tab === k ? "border-[var(--color-accent)] text-[var(--color-accent-deep)]" : "border-transparent text-[var(--color-mute)]"}`}>
            {l}
          </button>
        ))}
      </div>

      {tab === "capacity" && (
        <>
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
        </>
      )}

      {tab === "ai" && (
        <div className="flex-1 overflow-y-auto px-8 py-6">
          <div className="max-w-[760px]">
            <h2 className="font-display text-lg mb-1">AIコンシェルジュ設定</h2>
            <p className="font-display text-xs text-[var(--color-mute)] mb-5">
              PRIME特典「AI店舗コンシェルジュ」で使用するAIモデル・APIキー・プロンプトを設定します。
            </p>
            <div className="card p-6 space-y-5">
              <div>
                <label className="font-display text-xs text-[var(--color-mute)] block mb-1.5">AIモデル</label>
                <select value={aiModel} onChange={e => setAiModel(e.target.value as AiModel)}
                  className="w-full max-w-[320px] bg-[var(--color-bg)] border border-[var(--color-line)] rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[var(--color-accent)]/50">
                  {AI_MODELS.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
                </select>
              </div>

              <div>
                <label className="font-display text-xs text-[var(--color-mute)] block mb-1.5">APIキー</label>
                <div className="flex gap-2 max-w-[480px]">
                  <input
                    type={showApiKey ? "text" : "password"}
                    value={aiApiKey}
                    onChange={e => setAiApiKey(e.target.value)}
                    placeholder="sk-ant-xxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                    className="flex-1 bg-[var(--color-bg)] border border-[var(--color-line)] rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[var(--color-accent)]/50 placeholder-[var(--color-mute)]"
                  />
                  <button type="button" onClick={() => setShowApiKey(v => !v)} className="btn-outline !py-2 text-xs flex-none">
                    {showApiKey ? "隠す" : "表示"}
                  </button>
                </div>
                <p className="font-display text-[10px] text-[var(--color-mute)] mt-1.5">選択したAIモデルに対応するAPIキーを入力してください。この画面以外には表示されません。</p>
              </div>

              <div>
                <label className="font-display text-xs text-[var(--color-mute)] block mb-1.5">プロンプト（システムプロンプト）</label>
                <textarea
                  value={aiPrompt}
                  onChange={e => setAiPrompt(e.target.value)}
                  rows={12}
                  className="w-full bg-[var(--color-bg)] border border-[var(--color-line)] rounded-xl px-4 py-3 text-sm outline-none focus:border-[var(--color-accent)]/50 resize-none leading-relaxed"
                />
              </div>

              <div className="flex items-center gap-3 pt-2 border-t border-[var(--color-line)]">
                {aiSaved && <span className="font-display text-[10px] text-[var(--color-accent-deep)]">✓ 保存しました</span>}
                <button onClick={saveAiSettings} className="btn-primary !py-2 text-xs ml-auto">設定を保存する</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
