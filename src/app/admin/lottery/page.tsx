"use client";
import { useState } from "react";

const lotteryEvents = [
  {
    id: "coffee-0720", title: "Coffee Cupping #7", date: "2026.07.20", venue: "Coffee Commons",
    capM: 15, capF: 15, state: "抽選中",
    applicants: [
      { no: "0827", name: "佐藤 美咲", kana: "サトウ ミサキ", gender: "女性", age: 31, job: "マーケター", pref: "東京", applied: "2026.07.01", paid: true, lotteryWins: 5 },
      { no: "0830", name: "中島 誉", kana: "ナカジマ ホマレ", gender: "男性", age: 44, job: "経営者・役員", pref: "大阪", applied: "2026.07.02", paid: true, lotteryWins: 1 },
      { no: "0843", name: "山本 直", kana: "ヤマモト ナオ", gender: "男性", age: 29, job: "会社員", pref: "東京", applied: "2026.07.02", paid: false, lotteryWins: 0 },
      { no: "0851", name: "森田 桂", kana: "モリタ ケイ", gender: "男性", age: 38, job: "医師・医療従事者", pref: "大阪", applied: "2026.07.03", paid: true, lotteryWins: 3 },
      { no: "0873", name: "村瀬 史奈", kana: "ムラセ フミナ", gender: "女性", age: 27, job: "フリーランス", pref: "大阪", applied: "2026.07.03", paid: true, lotteryWins: 0 },
      { no: "0880", name: "田中 康介", kana: "タナカ コウスケ", gender: "男性", age: 33, job: "ITエンジニア", pref: "東京", applied: "2026.07.04", paid: true, lotteryWins: 4 },
      { no: "0885", name: "山本 彩花", kana: "ヤマモト アヤカ", gender: "女性", age: 35, job: "弁護士・士業", pref: "東京", applied: "2026.07.04", paid: true, lotteryWins: 6 },
      { no: "0891", name: "伊藤 健", kana: "イトウ ケン", gender: "男性", age: 31, job: "会社員", pref: "大阪", applied: "2026.07.05", paid: true, lotteryWins: 1 },
      { no: "0898", name: "中村 優一", kana: "ナカムラ ユウイチ", gender: "男性", age: 46, job: "経営者・役員", pref: "東京", applied: "2026.07.05", paid: true, lotteryWins: 2 },
      { no: "0824", name: "青山 陸", kana: "アオヤマ リク", gender: "男性", age: 36, job: "戦略コンサルタント", pref: "東京", applied: "2026.07.06", paid: true, lotteryWins: 2 },
    ],
  },
  {
    id: "wine-0802", title: "COMMONS WINE SALON", date: "2026.08.02", venue: "La Cave",
    capM: 8, capF: 8, state: "受付準備中",
    applicants: [],
  },
];

export default function LotteryPage() {
  const [lotteries, setLotteries] = useState(lotteryEvents);
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [capM, setCapM] = useState(0);
  const [capF, setCapF] = useState(0);
  const [search, setSearch] = useState("");
  const [genderFilter, setGenderFilter] = useState<"" | "男性" | "女性">("");
  const [done, setDone] = useState(false);

  function deleteLottery(id: string) {
    if (!confirm("この抽選イベントを削除しますか？")) return;
    setLotteries(prev => prev.filter(e => e.id !== id));
    if (selectedEvent === id) setSelectedEvent(null);
  }

  const ev = lotteries.find(e => e.id === selectedEvent);

  function handleSelect(no: string) {
    setChecked(prev => ({ ...prev, [no]: !prev[no] }));
  }
  function handleAll(val: boolean) {
    if (!ev) return;
    const next: Record<string, boolean> = {};
    ev.applicants.forEach(a => { next[a.no] = val; });
    setChecked(next);
  }

  function handleRandom() {
    if (!ev) return;
    const males = filtered.filter(a => a.gender === "男性");
    const females = filtered.filter(a => a.gender === "女性");
    const pickN = (arr: typeof males, n: number) => {
      const shuffled = [...arr].sort(() => Math.random() - 0.5);
      return shuffled.slice(0, n);
    };
    const picked = [...pickN(males, capM || ev.capM), ...pickN(females, capF || ev.capF)];
    const next: Record<string, boolean> = {};
    picked.forEach(a => { next[a.no] = true; });
    setChecked(next);
    setDone(false);
  }

  const filtered = ev ? ev.applicants.filter(a =>
    (genderFilter === "" || a.gender === genderFilter) &&
    (search === "" || a.name.includes(search) || a.no.includes(search) || a.kana.includes(search))
  ) : [];

  const selectedCount = Object.values(checked).filter(Boolean).length;
  const selectedM = ev ? ev.applicants.filter(a => checked[a.no] && a.gender === "男性").length : 0;
  const selectedF = ev ? ev.applicants.filter(a => checked[a.no] && a.gender === "女性").length : 0;

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <div className="px-8 py-6 border-b border-[var(--color-line)] flex items-center justify-between flex-none">
        <div>
          <div className="font-display text-[10px] tracking-[0.12em] text-[var(--color-accent-deep)]">LOTTERY</div>
          <h1 className="font-display text-2xl mt-0.5">抽選管理</h1>
        </div>
        {ev && selectedCount > 0 && (
          <button onClick={() => setDone(true)} className="btn-primary !py-2 text-xs">
            当選確定（{selectedCount}名）
          </button>
        )}
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Event list */}
        <div className="w-[280px] border-r border-[var(--color-line)] overflow-y-auto flex-none">
          <div className="px-4 py-3 border-b border-[var(--color-line)]">
            <div className="font-display text-[10px] text-[var(--color-mute)]">抽選対象イベント</div>
          </div>
          {lotteries.map(e => (
            <div key={e.id} className={`border-b border-[var(--color-line)] ${selectedEvent === e.id ? "bg-[var(--color-accent)]/8" : ""}`}>
              <button onClick={() => { setSelectedEvent(e.id); setChecked({}); setDone(false); }}
                className="w-full text-left px-5 py-4 transition hover:bg-[var(--color-bg-soft)]">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-display text-sm">{e.title}</span>
                  <span className={`tag text-[9px] ${e.state === "抽選中" ? "tag-ink" : ""}`}>{e.state}</span>
                </div>
                <div className="font-display text-[10px] text-[var(--color-mute)]">{e.date} · {e.venue}</div>
                <div className="font-display text-[10px] text-[var(--color-mute)] mt-0.5">
                  申込 {e.applicants.length}名 / 定員 男{e.capM} 女{e.capF}
                </div>
              </button>
              <div className="px-5 pb-3 flex justify-end">
                <button onClick={() => deleteLottery(e.id)}
                  className="font-display text-[10px] px-3 py-1 rounded-full border border-red-400/30 text-red-400 hover:bg-red-400/8 transition">
                  削除
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Applicant list */}
        {ev ? (
          <div className="flex-1 overflow-y-auto px-8 py-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="font-display text-xl">{ev.title}</h2>
                <div className="font-display text-xs text-[var(--color-mute)] mt-0.5">
                  {ev.date} · {ev.venue}　定員 男{ev.capM}名 / 女{ev.capF}名
                </div>
              </div>
            </div>

            {/* Random selection controls */}
            <div className="card p-5 mb-5">
              <div className="font-display text-xs text-[var(--color-accent-deep)] mb-3">ランダム抽選設定</div>
              <div className="flex items-end gap-4">
                <div>
                  <label className="font-display text-[10px] text-[var(--color-mute)] block mb-1">男性 当選数</label>
                  <input type="number" value={capM || ev.capM} onChange={e => setCapM(Number(e.target.value))} min={0}
                    className="w-20 bg-[var(--color-bg)] border border-[var(--color-line)] rounded-lg px-3 py-1.5 text-sm outline-none text-center num" />
                </div>
                <div>
                  <label className="font-display text-[10px] text-[var(--color-mute)] block mb-1">女性 当選数</label>
                  <input type="number" value={capF || ev.capF} onChange={e => setCapF(Number(e.target.value))} min={0}
                    className="w-20 bg-[var(--color-bg)] border border-[var(--color-line)] rounded-lg px-3 py-1.5 text-sm outline-none text-center num" />
                </div>
                <button onClick={handleRandom} className="btn-primary !py-2 text-xs">ランダム選択</button>
                <button onClick={() => handleAll(false)} className="btn-outline !py-2 text-xs">選択解除</button>
                {selectedCount > 0 && (
                  <div className="ml-auto font-display text-sm text-[var(--color-accent-deep)]">
                    選択中: <span className="num">男{selectedM}</span> / <span className="num">女{selectedF}</span> 名
                  </div>
                )}
              </div>
            </div>

            {/* Search & filter */}
            <div className="flex items-center gap-3 mb-4">
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="氏名・会員番号で検索"
                className="border border-[var(--color-line)] px-4 py-2 text-sm w-52 bg-transparent rounded-full focus:outline-none focus:border-[var(--color-accent)] placeholder-[var(--color-mute)]" />
              {(["", "男性", "女性"] as const).map(g => (
                <button key={g} onClick={() => setGenderFilter(g)}
                  className={`font-display text-xs px-4 py-2 rounded-full border transition ${genderFilter === g ? "bg-[var(--color-ink)] text-[var(--color-bg)] border-[var(--color-ink)]" : "border-[var(--color-line)] text-[var(--color-mute)]"}`}>
                  {g === "" ? "全員" : g}
                </button>
              ))}
              <label className="flex items-center gap-2 cursor-pointer ml-auto">
                <input type="checkbox" onChange={e => handleAll(e.target.checked)} className="accent-[var(--color-accent)]" />
                <span className="font-display text-xs">全選択</span>
              </label>
            </div>

            {done && (
              <div className="mb-4 px-4 py-3 rounded-xl bg-[var(--color-accent)]/10 border border-[var(--color-accent)]/30 font-display text-sm text-[var(--color-accent-deep)]">
                ✓ 当選者が確定しました。通知を送信してください。
              </div>
            )}

            <table className="w-full text-sm">
              <thead>
                <tr className="font-display text-[10px] text-[var(--color-mute)] text-left border-b border-[var(--color-line)]">
                  <th className="pb-3 pr-3 w-8"></th>
                  <th className="pb-3 pr-4">会員番号</th>
                  <th className="pb-3 pr-4">氏名</th>
                  <th className="pb-3 pr-4">性別</th>
                  <th className="pb-3 pr-4">年齢</th>
                  <th className="pb-3 pr-4">職業</th>
                  <th className="pb-3 pr-4">都道府県</th>
                  <th className="pb-3 pr-4">申込日</th>
                  <th className="pb-3 pr-4">当選回数</th>
                  <th className="pb-3">決済</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-line)]">
                {filtered.map(a => (
                  <tr key={a.no} onClick={() => handleSelect(a.no)}
                    className={`cursor-pointer transition ${checked[a.no] ? "bg-[var(--color-accent)]/8" : "hover:bg-[var(--color-bg-soft)]"}`}>
                    <td className="py-3 pr-3">
                      <input type="checkbox" checked={!!checked[a.no]} onChange={() => handleSelect(a.no)}
                        onClick={e => e.stopPropagation()} className="accent-[var(--color-accent)]" />
                    </td>
                    <td className="py-3 pr-4 num text-xs">{a.no}</td>
                    <td className="py-3 pr-4 font-display">
                      {a.name}
                      {checked[a.no] && <span className="ml-1.5 tag tag-accent text-[8px] !py-0">当選</span>}
                    </td>
                    <td className="py-3 pr-4 text-xs">{a.gender}</td>
                    <td className="py-3 pr-4 num text-xs">{a.age}歳</td>
                    <td className="py-3 pr-4 text-xs">{a.job}</td>
                    <td className="py-3 pr-4 text-xs">{a.pref}</td>
                    <td className="py-3 pr-4 num text-xs text-[var(--color-mute)]">{a.applied}</td>
                    <td className="py-3 pr-4 num text-xs text-center">{a.lotteryWins}</td>
                    <td className="py-3">
                      <span className={`text-xs ${a.paid ? "text-[var(--color-accent-deep)]" : "text-red-400"}`}>{a.paid ? "✓ 完了" : "未決済"}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-[var(--color-mute)] font-display text-sm">
            左から抽選イベントを選択してください
          </div>
        )}
      </div>
    </div>
  );
}
