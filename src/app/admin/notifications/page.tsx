"use client";
import { useState } from "react";
import TargetCondition from "@/components/TargetCondition";

interface NotifHistory {
  id: number; title: string; segment: string; sent: string;
  opens: string; clicks: string; body: string; channels: string[];
}

const history: NotifHistory[] = [
  { id:1, title:"7月イベント募集開始のお知らせ", segment:"全会員", sent:"2026.07.01 10:00", opens:"87%", clicks:"42%", channels:["アプリ内通知"], body:"7月のイベント募集が開始されました！\n\nCoffee Cupping #7、COMMONS WINE SALON など今月も充実のラインナップをご用意しています。\n\n参加ご希望の方はアプリのイベント一覧からお申し込みください。" },
  { id:2, title:"新クラブ「ジャズ部」が誕生しました", segment:"東京会員", sent:"2026.06.28 12:00", opens:"74%", clicks:"31%", channels:["アプリ内通知","メール"], body:"COMMONS に新しいクラブ「ジャズ部」が誕生しました！\n\nジャズを愛するメンバーが集まり、名盤の紹介や生演奏鑑賞ツアーなどを計画しています。\n\n興味のある方はぜひクラブ一覧からご参加ください。" },
  { id:3, title:"Coffee Cupping #7 抽選結果のお知らせ", segment:"申込者のみ", sent:"2026.06.25 18:00", opens:"96%", clicks:"88%", channels:["メール"], body:"Coffee Cupping #7 の抽選結果をお知らせします。\n\n【当選の方へ】\nおめでとうございます！参加確定の手続きを7月2日までにお済ませください。\n\n【落選の方へ】\n今回はご縁がありませんでしたが、次回のイベントにぜひご参加ください。" },
  { id:4, title:"月次メンバーズレポート（6月）", segment:"全会員", sent:"2026.06.30 09:00", opens:"62%", clicks:"18%", channels:["アプリ内通知","メール"], body:"6月の活動まとめをお届けします。\n\n・開催イベント: 17件\n・新規参加クラブ: 3件\n・新規入会: 51名\n\n7月も充実したイベントをご用意しております。引き続きよろしくお願いいたします。" },
];

const scheduledItems: NotifHistory[] = [
  { id:101, title:"8月イベント募集開始のお知らせ（予約）", segment:"全会員", sent:"2026.08.01 10:00（予定）", opens:"—", clicks:"—", channels:["アプリ内通知","メール"], body:"8月のイベント情報をお届けする予定の通知です。" },
];

type Tab = "app" | "email" | "scheduled";

function NotifList({ items, selectedId, onSelect, onDelete }: { items: NotifHistory[]; selectedId: number|null; onSelect: (id:number)=>void; onDelete: (id:number)=>void }) {
  return (
    <div className="divide-y divide-[var(--color-line)]">
      {items.length === 0 && (
        <div className="px-6 py-12 text-center text-[var(--color-mute)] font-display text-sm">該当する通知がありません</div>
      )}
      {items.map(h => (
        <div key={h.id} onClick={() => onSelect(h.id)}
          className={`px-6 py-4 cursor-pointer transition hover:bg-[var(--color-bg-soft)] border-b border-[var(--color-line)] border-l-2 ${selectedId===h.id?"bg-[var(--color-accent)]/8 border-l-[var(--color-accent)]":"border-l-transparent"}`}>
          <div className="flex items-start justify-between gap-3 mb-1.5">
            <span className="font-display text-sm flex-1 leading-snug">{h.title}</span>
            <span className="tag text-[9px] flex-none">{h.segment}</span>
          </div>
          <div className="num text-xs text-[var(--color-mute)] mb-2">{h.sent}</div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-14 h-1.5 rounded-full bg-[var(--color-line)] overflow-hidden"><div className="h-full bg-[var(--color-accent)] rounded-full" style={{width:h.opens==="—"?"0%":h.opens}} /></div>
              <span className="num text-[10px]">開封 {h.opens}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-14 h-1.5 rounded-full bg-[var(--color-line)] overflow-hidden"><div className="h-full bg-[var(--color-accent-deep)] rounded-full" style={{width:h.clicks==="—"?"0%":h.clicks}} /></div>
              <span className="num text-[10px]">クリック {h.clicks}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function NotificationsPage() {
  const [tab, setTab] = useState<Tab>("app");
  const [notifications, setNotifications] = useState<NotifHistory[]>(history);
  const [scheduled, setScheduled] = useState<NotifHistory[]>(scheduledItems);
  const [selectedId, setSelectedId] = useState<number|null>(null);
  const [showCompose, setShowCompose] = useState(false);

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [scheduleTime, setScheduleTime] = useState("");
  const [countResult, setCountResult] = useState<number|null>(null);
  const [counting, setCounting] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [draftSaved, setDraftSaved] = useState(false);

  function deleteNotif(id: number) {
    if (!confirm("この配信履歴を削除しますか？")) return;
    setNotifications(prev => prev.filter(h => h.id !== id));
    setScheduled(prev => prev.filter(h => h.id !== id));
    if (selectedId === id) setSelectedId(null);
  }

  function handleCountCheck() {
    setCounting(true); setCountResult(null);
    setTimeout(() => { setCounting(false); setCountResult(Math.floor(Math.random() * 400 + 120)); }, 900);
  }

  const appItems = notifications.filter(h => h.channels.includes("アプリ内通知"));
  const emailItems = notifications.filter(h => h.channels.includes("メール"));
  const currentList = tab === "app" ? appItems : tab === "email" ? emailItems : scheduled;
  const detail = [...notifications, ...scheduled].find(h => h.id === selectedId);

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <div className="px-8 py-6 border-b border-[var(--color-line)] flex items-center justify-between flex-none">
        <div>
          <div className="font-display text-[10px] tracking-[0.12em] text-[var(--color-accent-deep)]">NOTIFICATION</div>
          <h1 className="font-display text-2xl mt-0.5">通知・配信管理</h1>
        </div>
        <button onClick={() => setShowCompose(true)} className="btn-primary !py-2 text-xs">＋ 通知作成</button>
      </div>

      {/* Inline tabs */}
      <div className="px-8 border-b border-[var(--color-line)] flex gap-6 flex-none">
        {([
          ["app", "アプリ通知済み"],
          ["email", "メール通知済み"],
          ["scheduled", "予約送信"],
        ] as const).map(([k,l]) => (
          <button key={k} onClick={() => { setTab(k); setSelectedId(null); }}
            className={`font-display text-sm py-4 border-b-2 transition ${tab===k?"border-[var(--color-accent)] text-[var(--color-accent-deep)]":"border-transparent text-[var(--color-mute)]"}`}>
            {l}
          </button>
        ))}
      </div>

      <div className="flex flex-1 overflow-hidden">
        <div className="w-[320px] border-r border-[var(--color-line)] overflow-y-auto flex-none">
          <NotifList items={currentList} selectedId={selectedId} onSelect={setSelectedId} onDelete={deleteNotif} />
        </div>

        {!detail && (
          <div className="flex-1 flex items-center justify-center bg-[var(--color-bg-soft)]">
            <span className="font-display text-sm text-[var(--color-mute)]">通知を選択してください</span>
          </div>
        )}

        {detail && (
          <div className="flex-1 overflow-y-auto px-8 py-6">
            <div className="max-w-[620px]">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="font-display text-xl mb-1">{detail.title}</h2>
                  <div className="flex items-center gap-3">
                    <span className="tag text-[9px]">{detail.segment}</span>
                    <span className="num text-xs text-[var(--color-mute)]">{detail.sent}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {tab === "scheduled" && (
                    <button onClick={() => setShowCompose(true)} className="btn-outline !py-1.5 text-xs">編集</button>
                  )}
                  <button onClick={() => deleteNotif(detail.id)} className="font-display text-xs px-3 py-1.5 rounded-full border border-red-400/30 text-red-400 hover:bg-red-400/8 transition">削除</button>
                  <button onClick={() => setSelectedId(null)} className="text-[var(--color-mute)] hover:text-[var(--color-ink)] ml-1">✕</button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-6">
                {[{l:"開封率",v:detail.opens},{l:"クリック率",v:detail.clicks}].map(s=>(
                  <div key={s.l} className="card p-5">
                    <div className="font-display text-[10px] text-[var(--color-mute)] mb-2">{s.l}</div>
                    <div className="num text-3xl mb-3">{s.v}</div>
                    <div className="w-full h-2 rounded-full bg-[var(--color-line)] overflow-hidden">
                      <div className="h-full bg-[var(--color-accent)] rounded-full" style={{width:s.v==="—"?"0%":s.v}} />
                    </div>
                  </div>
                ))}
              </div>
              <div className="card p-5 mb-4">
                <div className="font-display text-[10px] text-[var(--color-accent-deep)] mb-2">配信チャンネル</div>
                <div className="flex flex-wrap gap-1.5">{detail.channels.map(c=><span key={c} className="tag tag-accent text-[9px]">{c}</span>)}</div>
              </div>
              <div className="card p-5">
                <div className="font-display text-[10px] text-[var(--color-accent-deep)] mb-3">配信内容</div>
                <div className="text-sm leading-relaxed text-[var(--color-mute)] whitespace-pre-line bg-[var(--color-bg)] rounded-lg p-4">{detail.body}</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Compose modal */}
      {showCompose && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" onClick={() => setShowCompose(false)}>
          <div className="bg-[var(--color-bg-soft)] rounded-2xl p-8 w-[560px] max-h-[88vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-xl">通知作成</h2>
              <button onClick={() => setShowCompose(false)} className="text-[var(--color-mute)]">✕</button>
            </div>
            {draftSaved && (
              <div className="mb-4 px-4 py-3 rounded-xl bg-[var(--color-accent)]/10 border border-[var(--color-accent)]/30 font-display text-xs text-[var(--color-accent-deep)] flex items-center justify-between">
                下書きとして保存しました<button onClick={() => setDraftSaved(false)} className="text-[var(--color-mute)]">✕</button>
              </div>
            )}
            <div className="space-y-5">
              <div>
                <TargetCondition label="配信対象" />
                <div className="mt-3 flex items-center gap-3">
                  <button onClick={handleCountCheck} disabled={counting}
                    className="font-display text-xs px-4 py-2 rounded-full border border-[var(--color-accent)]/50 text-[var(--color-accent-deep)] hover:bg-[var(--color-accent)]/8 transition disabled:opacity-50">
                    {counting?"集計中...":"人数確認"}
                  </button>
                  {countResult!==null && (
                    <div className="font-display text-sm text-[var(--color-accent-deep)]">対象: 約 <span className="num text-lg">{countResult}</span> 名</div>
                  )}
                </div>
              </div>
              <div>
                <label className="font-display text-xs text-[var(--color-mute)] block mb-2">タイトル</label>
                <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="通知タイトルを入力" className="w-full bg-[var(--color-bg)] border border-[var(--color-line)] rounded-xl px-4 py-3 text-sm outline-none focus:border-[var(--color-accent)]/50 placeholder-[var(--color-mute)]" />
              </div>
              <div>
                <label className="font-display text-xs text-[var(--color-mute)] block mb-2">本文</label>
                <textarea value={body} onChange={e=>setBody(e.target.value)} rows={5} placeholder="通知本文を入力してください..." className="w-full bg-[var(--color-bg)] border border-[var(--color-line)] rounded-xl px-4 py-3 text-sm outline-none focus:border-[var(--color-accent)]/50 placeholder-[var(--color-mute)] resize-none" />
              </div>
              <div>
                <label className="font-display text-xs text-[var(--color-mute)] block mb-2">配信チャンネル</label>
                <div className="flex gap-4">
                  {["アプリ内通知","メール"].map(ch=>(
                    <label key={ch} className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" defaultChecked className="accent-[var(--color-accent)]" />
                      <span className="font-display text-sm">{ch}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className="font-display text-xs text-[var(--color-mute)] block mb-2">予約送信日時（空白の場合は即時）</label>
                <input type="datetime-local" value={scheduleTime} onChange={e=>setScheduleTime(e.target.value)} className="w-full bg-[var(--color-bg)] border border-[var(--color-line)] rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[var(--color-accent)]/50" />
              </div>
              <div className="flex gap-3 flex-wrap">
                <button onClick={() => setShowPreview(true)} className="btn-outline !py-2.5 text-sm">プレビュー</button>
                <button onClick={() => { setDraftSaved(true); }} className="btn-outline !py-2.5 text-sm">下書き保存</button>
                <button className="btn-primary !py-2.5 text-sm flex-1 justify-center">{scheduleTime?"予約を確定する":"今すぐ送信"}</button>
                <button onClick={() => setShowCompose(false)} className="btn-outline !py-2.5 text-sm">キャンセル</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showPreview && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60" onClick={() => setShowPreview(false)}>
          <div className="bg-[var(--color-bg-soft)] rounded-2xl p-8 w-[420px]" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-xl">プレビュー</h2>
              <button onClick={() => setShowPreview(false)} className="text-[var(--color-mute)]">✕</button>
            </div>
            <div className="bg-[var(--color-bg)] rounded-2xl overflow-hidden border border-[var(--color-line)]">
              <div className="px-4 py-3 border-b border-[var(--color-line)] flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-[var(--color-accent)]/20 flex items-center justify-center text-[10px] text-[var(--color-accent-deep)]">C</div>
                <span className="font-display text-xs">COMMONS</span>
                <span className="font-display text-[10px] text-[var(--color-mute)] ml-auto">たった今</span>
              </div>
              <div className="px-4 py-4">
                <div className="font-display text-sm font-semibold mb-1">{title||"（タイトル未入力）"}</div>
                <div className="text-xs text-[var(--color-mute)] leading-relaxed whitespace-pre-line">{body||"（本文未入力）"}</div>
              </div>
            </div>
            <button onClick={() => setShowPreview(false)} className="mt-4 w-full btn-outline justify-center text-sm">閉じる</button>
          </div>
        </div>
      )}
    </div>
  );
}
