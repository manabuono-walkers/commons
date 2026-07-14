"use client";
import { useState } from "react";
import ImageUpload from "@/components/ImageUpload";
import TargetCondition from "@/components/TargetCondition";

interface EventItem {
  id: string; title: string; date: string; venue: string; type: string;
  capM: number; capF: number; remM: number; remF: number; feeM: string; feeF: string;
  applicants: number; published: boolean; description?: string;
}

const initialEvents: EventItem[] = [
  { id: "music-bar-0715", title: "COMMONS MUSIC BAR", date: "2026.07.15", venue: "SOUND BAR HOWL", type: "先着", capM: 25, capF: 25, remM: 5, remF: 3, feeM: "¥7,000", feeF: "¥6,000", applicants: 42, published: true, description: "毎月開催の人気イベント。ジャズ、ソウル、R&Bが心地よく流れるバースペースで、新しい出会いと会話を楽しんでください。" },
  { id: "wine-salon-0802", title: "COMMONS WINE SALON", date: "2026.08.02", venue: "La Cave", type: "抽選", capM: 8, capF: 8, remM: 8, remF: 8, feeM: "¥9,800", feeF: "¥9,800", applicants: 24, published: false, description: "ソムリエが厳選したボトルを囲みながら、ワインの世界を深く掘り下げるサロン。少人数制で贅沢な時間をお届けします。" },
  { id: "coffee-0720", title: "Coffee Cupping #7", date: "2026.07.20", venue: "Coffee Commons", type: "抽選", capM: 15, capF: 15, remM: 0, remF: 0, feeM: "¥4,000", feeF: "¥4,000", applicants: 38, published: true, description: "スペシャルティコーヒーの世界へ。バリスタが丁寧にカッピングの手順を教えてくれます。" },
  { id: "photo-0727", title: "谷中フォトウォーク", date: "2026.07.27", venue: "谷中エリア", type: "先着", capM: 20, capF: 20, remM: 0, remF: 0, feeM: "¥2,000", feeF: "¥2,000", applicants: 40, published: true, description: "下町情緒あふれる谷中を歩きながら、それぞれの「好き」な瞬間をカメラに収めます。" },
];

interface Applicant { no: string; name: string; gender: string; status: string; paid: boolean; }
const dummyApplicants: Applicant[] = [
  { no: "0824", name: "青山 陸", gender: "男性", status: "確定", paid: true },
  { no: "0827", name: "佐藤 美咲", gender: "女性", status: "確定", paid: true },
  { no: "0880", name: "田中 康介", gender: "男性", status: "確定", paid: true },
  { no: "0885", name: "山本 彩花", gender: "女性", status: "確定", paid: true },
  { no: "0843", name: "山本 直", gender: "男性", status: "未払い", paid: false },
  { no: "0891", name: "伊藤 健", gender: "男性", status: "キャンセル待ち", paid: false },
  { no: "0873", name: "村瀬 史奈", gender: "女性", status: "確定", paid: true },
  { no: "0898", name: "中村 優一", gender: "男性", status: "確定", paid: true },
];

interface LotteryApplicant { no: string; name: string; gender: string; wins: number; engage: string; selected: boolean; checked: boolean; }
const lotteryApplicants: LotteryApplicant[] = [
  { no:"0824", name:"青山 陸", gender:"男性", wins:2, engage:"高", selected:false, checked:false },
  { no:"0827", name:"佐藤 美咲", gender:"女性", wins:1, engage:"高", selected:false, checked:false },
  { no:"0830", name:"中島 誉", gender:"男性", wins:0, engage:"中", selected:false, checked:false },
  { no:"0843", name:"山本 直", gender:"男性", wins:1, engage:"中", selected:false, checked:false },
  { no:"0851", name:"森田 桂", gender:"女性", wins:0, engage:"低", selected:false, checked:false },
  { no:"0873", name:"村瀬 史奈", gender:"女性", wins:3, engage:"高", selected:false, checked:false },
  { no:"0880", name:"田中 康介", gender:"男性", wins:0, engage:"中", selected:false, checked:false },
  { no:"0885", name:"山本 彩花", gender:"女性", wins:2, engage:"高", selected:false, checked:false },
  { no:"0891", name:"伊藤 健", gender:"男性", wins:1, engage:"中", selected:false, checked:false },
  { no:"0898", name:"中村 優一", gender:"男性", wins:0, engage:"低", selected:false, checked:false },
];

type RightPanel = "detail" | "applicants" | "lottery" | "edit" | "create";

const engageColors: Record<string,string> = {
  "高": "text-green-400 border-green-500/30 bg-green-500/10",
  "中": "text-[var(--color-accent-deep)] border-[var(--color-accent)]/30 bg-[var(--color-accent)]/10",
  "低": "text-red-400 border-red-400/30 bg-red-400/10",
};

export default function AdminEventsPage() {
  const [events, setEvents] = useState<EventItem[]>(initialEvents);
  const [selectedId, setSelectedId] = useState<string|null>(null);
  const [rightPanel, setRightPanel] = useState<RightPanel>("detail");
  const [lotteryList, setLotteryList] = useState<LotteryApplicant[]>(lotteryApplicants.map(a=>({...a})));
  const [lotteryDone, setLotteryDone] = useState(false);
  const [pickM, setPickM] = useState(8);
  const [pickF, setPickF] = useState(8);
  const [notifyDone, setNotifyDone] = useState(false);
  const [countResult, setCountResult] = useState<number|null>(null);
  const [counting, setCounting] = useState(false);
  const [draftSaved, setDraftSaved] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const selected = events.find(e => e.id === selectedId);

  function selectEvent(id: string) {
    setSelectedId(id); setRightPanel("detail");
    setLotteryDone(false); setNotifyDone(false);
    setLotteryList(lotteryApplicants.map(a=>({...a})));
  }
  function togglePublish(id: string) { setEvents(prev => prev.map(e => e.id===id?{...e,published:!e.published}:e)); }
  function deleteEvent(id: string) {
    if (!confirm("このイベントを削除しますか？")) return;
    setEvents(prev => prev.filter(e => e.id!==id));
    if (selectedId===id) setSelectedId(null);
  }
  function runLottery() {
    const males = lotteryList.filter(a => a.gender==="男性");
    const females = lotteryList.filter(a => a.gender==="女性");
    const shuffle = (arr: LotteryApplicant[]) => [...arr].sort(()=>Math.random()-0.5);
    const selM = shuffle(males).slice(0, pickM).map(a=>a.no);
    const selF = shuffle(females).slice(0, pickF).map(a=>a.no);
    setLotteryList(prev => prev.map(a=>({...a, selected:selM.includes(a.no)||selF.includes(a.no)})));
    setLotteryDone(true); setNotifyDone(false);
  }
  function toggleCheck(no: string) { setLotteryList(prev => prev.map(a=>a.no===no?{...a,checked:!a.checked}:a)); }
  function toggleAllCheck(checked: boolean) { setLotteryList(prev => prev.map(a=>({...a,checked}))); }
  function handleCountCheck() {
    setCounting(true); setCountResult(null);
    setTimeout(()=>{setCounting(false);setCountResult(Math.floor(Math.random()*600+80));},900);
  }

  const allChecked = lotteryList.length > 0 && lotteryList.every(a=>a.checked);

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <div className="px-6 py-6 border-b border-[var(--color-line)] flex items-center justify-between flex-none">
        <div>
          <div className="font-display text-[10px] tracking-[0.12em] text-[var(--color-accent-deep)]">EVENT</div>
          <h1 className="font-display text-2xl mt-0.5">イベント管理</h1>
        </div>
        <button onClick={() => { setSelectedId(null); setRightPanel("create"); }} className="btn-primary !py-2 text-xs">＋ イベント作成</button>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left: event list */}
        <div className="w-[260px] border-r border-[var(--color-line)] overflow-y-auto flex-none bg-[var(--color-bg)]">
          {events.map(e => (
            <div key={e.id} onClick={() => selectEvent(e.id)}
              className={`px-6 py-4 cursor-pointer transition hover:bg-[var(--color-bg-soft)] border-b border-[var(--color-line)] border-l-2 ${selectedId===e.id?"bg-[var(--color-accent)]/8 border-l-[var(--color-accent)]":"border-l-transparent"}`}>
              <div className="flex items-start justify-between gap-2 mb-1.5">
                <span className="font-display text-sm flex-1 leading-snug">{e.title}</span>
                <span className={`font-display text-[8px] px-1.5 py-0.5 rounded-full border flex-none mt-0.5 ${e.published?"border-green-500/40 text-green-400":"border-[var(--color-line)] text-[var(--color-mute)]"}`}>
                  {e.published?"公開":"非公開"}
                </span>
              </div>
              <div className="flex items-center gap-2 mb-1">
                <span className="tag text-[8px]">{e.type}</span>
                <span className="num text-xs text-[var(--color-accent-deep)]">{e.date}</span>
              </div>
              <div className="font-display text-[10px] text-[var(--color-mute)]">{e.venue} · 申込 {e.applicants}名</div>
            </div>
          ))}
        </div>

        {/* Right panel */}
        <div className="flex-1 overflow-y-auto bg-[var(--color-bg-soft)]">
          {!selectedId && rightPanel !== "create" && (
            <div className="flex items-center justify-center h-full text-[var(--color-mute)] font-display text-sm">イベントを選択してください</div>
          )}

          {/* Detail */}
          {selectedId && selected && rightPanel === "detail" && (
            <div className="px-8 py-6 max-w-[800px]">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="tag text-[9px]">{selected.type}</span>
                    <span className={`font-display text-[9px] px-2 py-0.5 rounded-full border ${selected.published?"border-green-500/40 text-green-400":"border-[var(--color-line)] text-[var(--color-mute)]"}`}>
                      {selected.published?"公開中":"非公開"}
                    </span>
                  </div>
                  <h2 className="font-display text-2xl mb-1">{selected.title}</h2>
                  <div className="num text-2xl text-[var(--color-accent-deep)]">{selected.date}</div>
                  <div className="font-display text-sm text-[var(--color-mute)] mt-1">{selected.venue}</div>
                </div>
                <div className="flex flex-col gap-2 flex-none">
                  <button onClick={() => setRightPanel("applicants")} className="btn-outline !py-1.5 text-xs">申込者管理</button>
                  {selected.type==="抽選" && (
                    <button onClick={() => setRightPanel("lottery")}
                      className="font-display text-xs px-3 py-1.5 rounded-full border border-[var(--color-accent)]/50 text-[var(--color-accent-deep)] bg-[var(--color-accent)]/8 hover:bg-[var(--color-accent)]/16 transition text-center">
                      抽選を実施
                    </button>
                  )}
                  <button onClick={() => setRightPanel("edit")} className="btn-outline !py-1.5 text-xs">編集</button>
                  <button onClick={() => togglePublish(selected.id)}
                    className={`font-display text-xs px-3 py-1.5 rounded-full border transition ${selected.published?"border-[var(--color-line)] text-[var(--color-mute)]":"border-green-500/40 text-green-400 hover:bg-green-500/8"}`}>
                    {selected.published?"非公開にする":"公開する"}
                  </button>
                  <button onClick={() => deleteEvent(selected.id)} className="font-display text-xs px-3 py-1.5 rounded-full border border-red-400/30 text-red-400 hover:bg-red-400/8 transition">削除</button>
                </div>
              </div>
              <div className="grid grid-cols-4 gap-3 mb-6">
                {[{l:"男性 残席",v:`${selected.remM}/${selected.capM}`},{l:"女性 残席",v:`${selected.remF}/${selected.capF}`},{l:"申込数",v:`${selected.applicants}名`},{l:"参加費",v:`${selected.feeM}/${selected.feeF}`}].map(s=>(
                  <div key={s.l} className="card p-4"><div className="font-display text-[9px] text-[var(--color-mute)]">{s.l}</div><div className="num text-lg mt-1">{s.v}</div></div>
                ))}
              </div>
              {selected.description && <p className="font-display text-sm text-[var(--color-mute)] leading-relaxed card p-5">{selected.description}</p>}
            </div>
          )}

          {/* Applicant list */}
          {selectedId && selected && rightPanel === "applicants" && (
            <div className="px-8 py-6">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <button onClick={() => setRightPanel("detail")} className="font-display text-[10px] text-[var(--color-mute)] hover:text-[var(--color-ink)] mb-1">← 戻る</button>
                  <h2 className="font-display text-xl">{selected.title} — 申込者一覧</h2>
                  <div className="num text-sm text-[var(--color-accent-deep)]">{selected.date} · {dummyApplicants.length}名</div>
                </div>
                {selected.type==="抽選" && (
                  <button onClick={() => setRightPanel("lottery")}
                    className="font-display text-xs px-4 py-2 rounded-full border border-[var(--color-accent)]/50 text-[var(--color-accent-deep)] bg-[var(--color-accent)]/8 hover:bg-[var(--color-accent)]/16 transition">
                    抽選を実施
                  </button>
                )}
              </div>
              <div className="card overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="font-display text-[9px] text-[var(--color-mute)] text-left border-b border-[var(--color-line)]">
                      <th className="px-5 py-3">会員番号</th><th className="px-5 py-3">氏名</th><th className="px-5 py-3">性別</th><th className="px-5 py-3">ステータス</th><th className="px-5 py-3">決済</th><th className="px-5 py-3">操作</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--color-line)]">
                    {dummyApplicants.map(a=>(
                      <tr key={a.no} className="hover:bg-[var(--color-bg-soft)] transition">
                        <td className="px-5 py-3 num text-xs">{a.no}</td>
                        <td className="px-5 py-3 font-display text-sm">{a.name}</td>
                        <td className="px-5 py-3 font-display text-xs">{a.gender}</td>
                        <td className="px-5 py-3"><span className={`tag text-[9px] ${a.status==="確定"?"tag-ink":""}`}>{a.status}</span></td>
                        <td className="px-5 py-3"><span className={`text-xs ${a.paid?"text-[var(--color-accent-deep)]":"text-red-400"}`}>{a.paid?"✓ 完了":"未決済"}</span></td>
                        <td className="px-5 py-3">
                          <div className="flex gap-1.5">
                            <button className="font-display text-[10px] px-2 py-1 rounded border border-[var(--color-line)] hover:border-[var(--color-accent)] transition">詳細</button>
                            <button className="font-display text-[10px] px-2 py-1 rounded border border-red-400/30 text-red-400 hover:bg-red-400/8 transition">取消</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Lottery */}
          {selectedId && selected && rightPanel === "lottery" && (
            <div className="px-8 py-6">
              <div className="mb-5">
                <button onClick={() => setRightPanel("detail")} className="font-display text-[10px] text-[var(--color-mute)] hover:text-[var(--color-ink)] mb-1">← 戻る</button>
                <h2 className="font-display text-xl">{selected.title} — 抽選管理</h2>
                <div className="num text-sm text-[var(--color-accent-deep)]">{selected.date}</div>
              </div>

              {/* Controls */}
              <div className="card p-5 mb-5">
                <div className="font-display text-[10px] text-[var(--color-accent-deep)] mb-3">抽選設定</div>
                <div className="flex items-center gap-6 mb-4">
                  <div>
                    <label className="font-display text-xs text-[var(--color-mute)] block mb-1">男性 当選数</label>
                    <div className="flex items-center gap-2">
                      <button onClick={() => setPickM(Math.max(0,pickM-1))} className="w-8 h-8 rounded-full border border-[var(--color-line)] font-display text-sm flex items-center justify-center hover:border-[var(--color-accent)] transition">−</button>
                      <span className="num text-xl w-8 text-center">{pickM}</span>
                      <button onClick={() => setPickM(pickM+1)} className="w-8 h-8 rounded-full border border-[var(--color-line)] font-display text-sm flex items-center justify-center hover:border-[var(--color-accent)] transition">＋</button>
                    </div>
                  </div>
                  <div>
                    <label className="font-display text-xs text-[var(--color-mute)] block mb-1">女性 当選数</label>
                    <div className="flex items-center gap-2">
                      <button onClick={() => setPickF(Math.max(0,pickF-1))} className="w-8 h-8 rounded-full border border-[var(--color-line)] font-display text-sm flex items-center justify-center hover:border-[var(--color-accent)] transition">−</button>
                      <span className="num text-xl w-8 text-center">{pickF}</span>
                      <button onClick={() => setPickF(pickF+1)} className="w-8 h-8 rounded-full border border-[var(--color-line)] font-display text-sm flex items-center justify-center hover:border-[var(--color-accent)] transition">＋</button>
                    </div>
                  </div>
                  <div className="flex-1 flex justify-end">
                    <button onClick={runLottery} className="btn-primary text-sm !py-2.5">ランダム抽選</button>
                  </div>
                </div>
                {lotteryDone && (
                  <div className="px-4 py-3 rounded-xl bg-green-500/10 border border-green-500/30 font-display text-xs text-green-400">
                    ✓ 抽選が完了しました — 当選: {lotteryList.filter(a=>a.selected).length}名 / 落選: {lotteryList.filter(a=>!a.selected).length}名
                  </div>
                )}
              </div>

              {/* Applicant table with checkboxes */}
              <div className="card overflow-hidden">
                <div className="px-5 py-3 border-b border-[var(--color-line)] flex items-center justify-between">
                  <span className="font-display text-[10px] text-[var(--color-mute)]">申込者一覧 ({lotteryList.length}名)</span>
                  {lotteryDone && <span className="font-display text-[10px] text-[var(--color-accent-deep)]">当選: {lotteryList.filter(a=>a.selected).length}名</span>}
                </div>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="font-display text-[9px] text-[var(--color-mute)] text-left border-b border-[var(--color-line)]">
                      <th className="px-4 py-3">
                        <input type="checkbox" checked={allChecked} onChange={e => toggleAllCheck(e.target.checked)} className="accent-[var(--color-accent)]" />
                      </th>
                      <th className="px-4 py-3">会員番号</th>
                      <th className="px-4 py-3">氏名</th>
                      <th className="px-4 py-3">性別</th>
                      <th className="px-4 py-3 text-center">当選回数</th>
                      <th className="px-4 py-3 text-center">エンゲージ</th>
                      {lotteryDone && <th className="px-4 py-3 text-center">結果</th>}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--color-line)]">
                    {lotteryList.map(a => (
                      <tr key={a.no} className={`transition ${lotteryDone?(a.selected?"bg-[var(--color-accent)]/5":"opacity-50"):"hover:bg-[var(--color-bg-soft)]"}`}>
                        <td className="px-4 py-3">
                          <input type="checkbox" checked={a.checked} onChange={() => toggleCheck(a.no)} className="accent-[var(--color-accent)]" />
                        </td>
                        <td className="px-4 py-3 num text-xs">{a.no}</td>
                        <td className="px-4 py-3 font-display text-sm">{a.name}</td>
                        <td className="px-4 py-3 font-display text-xs">{a.gender}</td>
                        <td className="px-4 py-3 text-center num text-sm">{a.wins}回</td>
                        <td className="px-4 py-3 text-center">
                          <span className={`font-display text-[9px] px-2 py-0.5 rounded-full border ${engageColors[a.engage]}`}>{a.engage}</span>
                        </td>
                        {lotteryDone && (
                          <td className="px-4 py-3 text-center">
                            {a.selected
                              ? <span className="tag tag-accent text-[9px]">当選</span>
                              : <span className="font-display text-[9px] text-[var(--color-mute)]">落選</span>
                            }
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="px-5 py-4 border-t border-[var(--color-line)] flex items-center justify-between">
                  <span className="font-display text-[10px] text-[var(--color-mute)]">
                    {lotteryList.filter(a=>a.checked).length}名 選択中
                  </span>
                  <button onClick={() => setNotifyDone(true)} className="btn-primary text-xs">当選者に通知を送る</button>
                </div>
              </div>
            </div>
          )}

          {/* Edit panel */}
          {selectedId && selected && rightPanel === "edit" && (
            <div className="px-8 py-6 max-w-[640px]">
              <button onClick={() => setRightPanel("detail")} className="font-display text-[10px] text-[var(--color-mute)] hover:text-[var(--color-ink)] mb-4">← 戻る</button>
              <h2 className="font-display text-xl mb-5">編集: {selected.title}</h2>
              <div className="space-y-4">
                {[{l:"イベント名",v:selected.title},{l:"開催日時",v:selected.date},{l:"会場",v:selected.venue},{l:"定員（男性）",v:String(selected.capM)},{l:"定員（女性）",v:String(selected.capF)},{l:"参加費（男性）",v:selected.feeM},{l:"参加費（女性）",v:selected.feeF}].map(f=>(
                  <div key={f.l}>
                    <label className="font-display text-xs text-[var(--color-mute)] block mb-1.5">{f.l}</label>
                    <input defaultValue={f.v} className="w-full bg-[var(--color-bg)] border border-[var(--color-line)] rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[var(--color-accent)]/50" />
                  </div>
                ))}
                <div>
                  <label className="font-display text-xs text-[var(--color-mute)] block mb-1.5">募集タイプ</label>
                  <select defaultValue={selected.type} className="w-full bg-[var(--color-bg)] border border-[var(--color-line)] rounded-xl px-4 py-2.5 text-sm outline-none">
                    <option>先着</option><option>抽選</option>
                  </select>
                </div>
                <div>
                  <label className="font-display text-xs text-[var(--color-mute)] block mb-1.5">イベント説明</label>
                  <textarea defaultValue={selected.description} rows={4} className="w-full bg-[var(--color-bg)] border border-[var(--color-line)] rounded-xl px-4 py-2.5 text-sm outline-none resize-none" />
                </div>
                <ImageUpload hint="推奨: 16:9 / JPG・PNG / 最大5MB" />
                <div className="flex gap-3 pt-2">
                  <button className="flex-1 btn-primary justify-center text-sm">保存する</button>
                  <button onClick={() => setRightPanel("detail")} className="flex-1 btn-outline justify-center text-sm">キャンセル</button>
                </div>
              </div>
            </div>
          )}

          {/* Create panel */}
          {rightPanel === "create" && (
            <div className="px-8 py-6 max-w-[640px]">
              {draftSaved && (
                <div className="mb-4 px-4 py-3 rounded-xl bg-[var(--color-accent)]/10 border border-[var(--color-accent)]/30 font-display text-xs text-[var(--color-accent-deep)] flex items-center justify-between">
                  下書きとして保存しました<button onClick={() => setDraftSaved(false)} className="text-[var(--color-mute)]">✕</button>
                </div>
              )}
              <h2 className="font-display text-xl mb-5">イベント作成</h2>
              <div className="space-y-4">
                {[{l:"イベント名",t:"text",ph:"COMMONS MUSIC BAR"},{l:"開催日時",t:"text",ph:"2026.08.15 19:00〜22:00"},{l:"会場",t:"text",ph:"会場名・最寄り駅"},{l:"定員（男性）",t:"number",ph:"25"},{l:"定員（女性）",t:"number",ph:"25"},{l:"参加費（男性）",t:"text",ph:"¥7,000"},{l:"参加費（女性）",t:"text",ph:"¥6,000"}].map(f=>(
                  <div key={f.l}>
                    <label className="font-display text-xs text-[var(--color-mute)] block mb-1.5">{f.l}</label>
                    <input type={f.t} placeholder={f.ph} className="w-full bg-[var(--color-bg)] border border-[var(--color-line)] rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[var(--color-accent)]/50 placeholder-[var(--color-mute)]" />
                  </div>
                ))}
                <div>
                  <label className="font-display text-xs text-[var(--color-mute)] block mb-1.5">募集タイプ</label>
                  <select className="w-full bg-[var(--color-bg)] border border-[var(--color-line)] rounded-xl px-4 py-2.5 text-sm outline-none">
                    <option>先着</option><option>抽選</option>
                  </select>
                </div>
                <div>
                  <label className="font-display text-xs text-[var(--color-mute)] block mb-1.5">イベント説明</label>
                  <textarea rows={4} placeholder="イベントの詳細説明..." className="w-full bg-[var(--color-bg)] border border-[var(--color-line)] rounded-xl px-4 py-2.5 text-sm outline-none resize-none placeholder-[var(--color-mute)]" />
                </div>
                <ImageUpload hint="推奨: 16:9 / JPG・PNG / 最大5MB" />
                <TargetCondition label="申込対象（対象を限定する場合）" />
                <div className="flex items-center gap-3">
                  <button onClick={handleCountCheck} disabled={counting}
                    className="font-display text-xs px-4 py-2 rounded-full border border-[var(--color-accent)]/50 text-[var(--color-accent-deep)] hover:bg-[var(--color-accent)]/8 transition disabled:opacity-50">
                    {counting?"集計中...":"人数確認"}
                  </button>
                  {countResult!==null && <div className="font-display text-sm text-[var(--color-accent-deep)]">対象: 約 <span className="num text-lg">{countResult}</span> 名</div>}
                </div>
              </div>
              <div className="flex gap-2 mt-6">
                <button onClick={() => setShowPreview(true)} className="btn-outline !py-2 text-xs flex-none">プレビュー</button>
                <button onClick={() => setDraftSaved(true)} className="btn-outline !py-2 text-xs flex-none">下書き保存</button>
                <button className="btn-primary !py-2 text-xs flex-1 justify-center">作成する</button>
                <button onClick={() => setSelectedId(null)} className="btn-outline !py-2 text-xs flex-none">キャンセル</button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Preview modal */}
      {showPreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" onClick={() => setShowPreview(false)}>
          <div className="bg-[var(--color-bg-soft)] rounded-2xl p-8 w-[480px]" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-display text-xl">プレビュー</h2>
              <button onClick={() => setShowPreview(false)} className="text-[var(--color-mute)]">✕</button>
            </div>
            <div className="card p-5">
              <div className="w-full h-36 bg-[var(--color-accent)]/10 rounded-xl mb-4 flex items-center justify-center"><span className="font-display text-xs text-[var(--color-mute)]">イベント画像</span></div>
              <div className="tag text-[9px] mb-2">先着</div>
              <h3 className="font-display text-xl mb-1">COMMONS MUSIC BAR</h3>
              <div className="num text-lg text-[var(--color-accent-deep)] mb-1">2026.08.15</div>
              <div className="font-display text-xs text-[var(--color-mute)]">SOUND BAR HOWL</div>
            </div>
            <button onClick={() => setShowPreview(false)} className="mt-4 w-full btn-outline justify-center text-sm">閉じる</button>
          </div>
        </div>
      )}

      {/* Notify done popup */}
      {notifyDone && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" onClick={() => setNotifyDone(false)}>
          <div className="bg-[var(--color-bg-soft)] rounded-2xl p-8 w-[380px] text-center" onClick={e => e.stopPropagation()}>
            <div className="w-14 h-14 rounded-full bg-green-500/15 flex items-center justify-center mx-auto mb-4">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-400"><polyline points="20 6 9 17 4 12"/></svg>
            </div>
            <h3 className="font-display text-xl mb-2">通知が完了しました</h3>
            <p className="font-display text-sm text-[var(--color-mute)] mb-6">当選者 {lotteryList.filter(a=>a.selected).length}名に通知を送信しました</p>
            <button onClick={() => setNotifyDone(false)} className="w-full btn-primary justify-center text-sm">閉じる</button>
          </div>
        </div>
      )}
    </div>
  );
}
