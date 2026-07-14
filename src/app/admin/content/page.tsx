"use client";
import { useState } from "react";
import ImageUpload from "@/components/ImageUpload";

interface Campaign { id: number; title: string; desc: string; }
interface Report { id: number; title: string; published: string; views: number; body: string; }

const initialCampaigns: Campaign[] = [
  { id:1, title:"夏の紹介キャンペーン", desc:"友人・知人を紹介するとポイントが2倍になるキャンペーンです。紹介された方が入会した場合、紹介者にも特典ポイントが付与されます。" },
  { id:2, title:"初回入会特典", desc:"初めてCOMMONSに入会した方を対象に、入会月の月会費を無料にする特典です。" },
];
const initialReports: Report[] = [
  { id:1, title:"6月イベントレポート｜Wine Salon", published:"2026.07.02", views:284, body:"6月のWine Salonは東京・六本木のLa Caveにて開催。合計28名が参加し、ソムリエによる解説のもと厳選ワインを楽しみました。参加者アンケートでは満足度4.9/5という高評価を頂きました。" },
  { id:2, title:"COMMONS Coffee Cupping #6 活動報告", published:"2026.06.30", views:147, body:"6月の Coffee Cupping は三軒茶屋Coffee Commonsにて開催。エチオピア・コロンビア・ゲイシャの3種を比較テイスティング。次回は7月20日開催予定です。" },
];

function Field({label,children}:{label:string;children:React.ReactNode}){return(<div><label className="font-display text-xs text-[var(--color-mute)] block mb-1.5">{label}</label>{children}</div>);}
function Inp({...p}:React.InputHTMLAttributes<HTMLInputElement>){return <input {...p} className="w-full bg-[var(--color-bg)] border border-[var(--color-line)] rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[var(--color-accent)]/50 placeholder-[var(--color-mute)]" />;}
function Txt({...p}:React.TextareaHTMLAttributes<HTMLTextAreaElement>){return <textarea {...p} className="w-full bg-[var(--color-bg)] border border-[var(--color-line)] rounded-xl px-4 py-2.5 text-sm outline-none resize-none placeholder-[var(--color-mute)]" />;}

type Tab = "campaigns" | "reports";
type RightMode = "none" | "detail" | "edit" | "create";

export default function ContentPage() {
  const [tab, setTab] = useState<Tab>("campaigns");
  const [campaigns, setCampaigns] = useState<Campaign[]>(initialCampaigns);
  const [reports, setReports] = useState<Report[]>(initialReports);
  const [rightMode, setRightMode] = useState<RightMode>("none");
  const [selectedCampaignId, setSelectedCampaignId] = useState<number|null>(null);
  const [selectedReportId, setSelectedReportId] = useState<number|null>(null);
  const [draftMsg, setDraftMsg] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [cTitle, setCTitle] = useState("");
  const [cDesc, setCDesc] = useState("");
  const [rTitle, setRTitle] = useState("");
  const [rBody, setRBody] = useState("");

  const selCampaign = campaigns.find(c => c.id === selectedCampaignId);
  const selReport = reports.find(r => r.id === selectedReportId);

  function selectCampaign(c: Campaign) {
    setSelectedCampaignId(c.id); setSelectedReportId(null); setRightMode("detail");
  }
  function selectReport(r: Report) {
    setSelectedReportId(r.id); setSelectedCampaignId(null); setRightMode("detail");
  }
  function openEditCampaign(c: Campaign) {
    setCTitle(c.title); setCDesc(c.desc); setRightMode("edit");
  }
  function openEditReport(r: Report) {
    setRTitle(r.title); setRBody(r.body); setRightMode("edit");
  }
  function openCreate() {
    setSelectedCampaignId(null); setSelectedReportId(null);
    setCTitle(""); setCDesc(""); setRTitle(""); setRBody("");
    setRightMode("create"); setDraftMsg(false);
  }
  function closePanel() { setRightMode("none"); setSelectedCampaignId(null); setSelectedReportId(null); }

  function deleteCampaign(id: number) {
    if (!confirm("このキャンペーンを削除しますか？")) return;
    setCampaigns(prev => prev.filter(c => c.id !== id));
    if (selectedCampaignId === id) closePanel();
  }
  function deleteReport(id: number) {
    if (!confirm("この活動レポートを削除しますか？")) return;
    setReports(prev => prev.filter(r => r.id !== id));
    if (selectedReportId === id) closePanel();
  }

  const panelOpen = rightMode !== "none";

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <div className="px-6 py-6 border-b border-[var(--color-line)] flex items-center justify-between flex-none">
        <div>
          <div className="font-display text-[10px] tracking-[0.12em] text-[var(--color-accent-deep)]">CONTENT</div>
          <h1 className="font-display text-2xl mt-0.5">コンテンツ管理</h1>
        </div>
        <button onClick={openCreate} className="btn-primary !py-2 text-xs">
          ＋ {tab === "campaigns" ? "キャンペーン作成" : "活動レポート作成"}
        </button>
      </div>

      {draftMsg && (
        <div className="px-6 py-2 bg-[var(--color-accent)]/10 text-[var(--color-accent-deep)] font-display text-xs border-b border-[var(--color-accent)]/20 flex items-center justify-between flex-none">
          下書きとして保存しました<button onClick={() => setDraftMsg(false)} className="text-[var(--color-mute)]">✕</button>
        </div>
      )}

      <div className="px-6 border-b border-[var(--color-line)] flex gap-6 flex-none">
        {([["campaigns","キャンペーン"],["reports","活動レポート"]] as const).map(([key,label])=>(
          <button key={key} onClick={() => { setTab(key); closePanel(); }}
            className={`font-display text-sm py-4 border-b-2 transition ${tab===key?"border-[var(--color-accent)] text-[var(--color-accent-deep)]":"border-transparent text-[var(--color-mute)]"}`}>{label}</button>
        ))}
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left: list */}
        <div className="w-[320px] border-r border-[var(--color-line)] overflow-y-auto flex-none">
          {tab === "campaigns" && campaigns.map(c => (
            <div key={c.id} onClick={() => selectCampaign(c)}
              className={`px-6 py-4 cursor-pointer transition hover:bg-[var(--color-bg-soft)] border-b border-[var(--color-line)] border-l-2 ${selectedCampaignId===c.id?"bg-[var(--color-accent)]/8 border-l-[var(--color-accent)]":"border-l-transparent"}`}>
              <div className="font-display text-sm truncate">{c.title}</div>
              <div className="num text-[10px] text-[var(--color-mute)] mt-0.5">2026.07.01</div>
            </div>
          ))}
          {tab === "reports" && reports.map(r => (
            <div key={r.id} onClick={() => selectReport(r)}
              className={`px-6 py-4 cursor-pointer transition hover:bg-[var(--color-bg-soft)] border-b border-[var(--color-line)] border-l-2 ${selectedReportId===r.id?"bg-[var(--color-accent)]/8 border-l-[var(--color-accent)]":"border-l-transparent"}`}>
              <div className="font-display text-sm mb-1 truncate">{r.title}</div>
              <div className="num text-[10px] text-[var(--color-mute)]">{r.published} · {r.views} views</div>
            </div>
          ))}
        </div>

        {/* Right panel */}
        {!panelOpen && (
          <div className="flex-1 flex items-center justify-center bg-[var(--color-bg-soft)]">
            <span className="font-display text-sm text-[var(--color-mute)]">コンテンツを選択してください</span>
          </div>
        )}

        {panelOpen && (
          <div className="flex-1 overflow-y-auto bg-[var(--color-bg-soft)]">
            <div className="px-8 py-6 max-w-[560px]">

              {/* Detail: campaign */}
              {rightMode === "detail" && tab === "campaigns" && selCampaign && (
                <>
                  <div className="flex items-start justify-between mb-5">
                    <div>
                      <div className="tag tag-accent text-[9px] mb-2">キャンペーン</div>
                      <h2 className="font-display text-xl">{selCampaign.title}</h2>
                    </div>
                    <div className="flex gap-2 flex-none">
                      <button onClick={() => openEditCampaign(selCampaign)} className="btn-outline !py-1.5 text-xs">編集</button>
                      <button onClick={() => deleteCampaign(selCampaign.id)} className="font-display text-xs px-3 py-1.5 rounded-full border border-red-400/30 text-red-400 hover:bg-red-400/8 transition">削除</button>
                      <button onClick={closePanel} className="text-[var(--color-mute)] hover:text-[var(--color-ink)] px-1">✕</button>
                    </div>
                  </div>
                  <div className="w-full h-44 rounded-xl bg-gradient-to-br from-[var(--color-accent)]/20 to-[var(--color-bg)] mb-5 flex items-center justify-center">
                    <span className="font-display text-xs text-[var(--color-mute)]">バナー画像</span>
                  </div>
                  <p className="font-display text-sm text-[var(--color-mute)] leading-relaxed">{selCampaign.desc}</p>
                </>
              )}

              {/* Detail: report */}
              {rightMode === "detail" && tab === "reports" && selReport && (
                <>
                  <div className="flex items-start justify-between mb-5">
                    <div>
                      <div className="tag text-[9px] mb-2">活動レポート</div>
                      <h2 className="font-display text-xl">{selReport.title}</h2>
                      <div className="num text-sm text-[var(--color-mute)] mt-1">{selReport.published} · {selReport.views} views</div>
                    </div>
                    <div className="flex gap-2 flex-none">
                      <button onClick={() => openEditReport(selReport)} className="btn-outline !py-1.5 text-xs">編集</button>
                      <button onClick={() => deleteReport(selReport.id)} className="font-display text-xs px-3 py-1.5 rounded-full border border-red-400/30 text-red-400 hover:bg-red-400/8 transition">削除</button>
                      <button onClick={closePanel} className="text-[var(--color-mute)] hover:text-[var(--color-ink)] px-1">✕</button>
                    </div>
                  </div>
                  <div className="w-full h-44 rounded-xl bg-gradient-to-br from-[var(--color-accent)]/10 to-[var(--color-bg)] mb-5 flex items-center justify-center">
                    <span className="font-display text-xs text-[var(--color-mute)]">カバー画像</span>
                  </div>
                  <p className="font-display text-sm text-[var(--color-mute)] leading-relaxed whitespace-pre-line">{selReport.body}</p>
                </>
              )}

              {/* Edit: campaign */}
              {rightMode === "edit" && tab === "campaigns" && selCampaign && (
                <>
                  <div className="flex items-center justify-between mb-5">
                    <div>
                      <button onClick={() => setRightMode("detail")} className="font-display text-[10px] text-[var(--color-mute)] hover:text-[var(--color-ink)] block mb-1">← 詳細に戻る</button>
                      <h2 className="font-display text-xl">キャンペーン編集</h2>
                    </div>
                    <button onClick={closePanel} className="text-[var(--color-mute)] hover:text-[var(--color-ink)]">✕</button>
                  </div>
                  <div className="space-y-4">
                    <ImageUpload label="キャンペーンバナー画像" hint="推奨: 16:9 / JPG・PNG / 最大5MB" />
                    <Field label="キャンペーン名"><Inp value={cTitle} onChange={e=>setCTitle(e.target.value)} placeholder="例: 夏の紹介キャンペーン" /></Field>
                    <Field label="詳細説明"><Txt rows={5} value={cDesc} onChange={e=>setCDesc(e.target.value)} placeholder="キャンペーンの詳細を入力..." /></Field>
                    <div className="flex gap-2 pt-2">
                      <button onClick={() => setShowPreview(true)} className="btn-outline !py-2 text-xs">プレビュー</button>
                      <button onClick={() => { setDraftMsg(true); setRightMode("detail"); }} className="btn-outline !py-2 text-xs">下書き保存</button>
                      <button onClick={() => {
                        setCampaigns(prev => prev.map(c => c.id===selCampaign.id?{...c,title:cTitle,desc:cDesc}:c));
                        setRightMode("detail");
                      }} className="btn-primary !py-2 text-xs flex-1 justify-center">公開する</button>
                      <button onClick={() => setRightMode("detail")} className="btn-outline !py-2 text-xs">キャンセル</button>
                    </div>
                  </div>
                </>
              )}

              {/* Edit: report */}
              {rightMode === "edit" && tab === "reports" && selReport && (
                <>
                  <div className="flex items-center justify-between mb-5">
                    <div>
                      <button onClick={() => setRightMode("detail")} className="font-display text-[10px] text-[var(--color-mute)] hover:text-[var(--color-ink)] block mb-1">← 詳細に戻る</button>
                      <h2 className="font-display text-xl">活動レポート編集</h2>
                    </div>
                    <button onClick={closePanel} className="text-[var(--color-mute)] hover:text-[var(--color-ink)]">✕</button>
                  </div>
                  <div className="space-y-4">
                    <ImageUpload label="レポートカバー画像" hint="推奨: 16:9 / JPG・PNG / 最大5MB" />
                    <Field label="タイトル"><Inp value={rTitle} onChange={e=>setRTitle(e.target.value)} placeholder="例: 6月イベントレポート｜Wine Salon" /></Field>
                    <Field label="本文"><Txt rows={8} value={rBody} onChange={e=>setRBody(e.target.value)} placeholder="レポート本文を入力..." /></Field>
                    <div className="flex gap-2 pt-2">
                      <button onClick={() => setShowPreview(true)} className="btn-outline !py-2 text-xs">プレビュー</button>
                      <button onClick={() => { setDraftMsg(true); setRightMode("detail"); }} className="btn-outline !py-2 text-xs">下書き保存</button>
                      <button onClick={() => {
                        setReports(prev => prev.map(r => r.id===selReport.id?{...r,title:rTitle,body:rBody}:r));
                        setRightMode("detail");
                      }} className="btn-primary !py-2 text-xs flex-1 justify-center">公開する</button>
                      <button onClick={() => setRightMode("detail")} className="btn-outline !py-2 text-xs">キャンセル</button>
                    </div>
                  </div>
                </>
              )}

              {/* Create */}
              {rightMode === "create" && (
                <>
                  <div className="flex items-center justify-between mb-5">
                    <h2 className="font-display text-xl">{tab==="campaigns"?"キャンペーン作成":"活動レポート作成"}</h2>
                    <button onClick={closePanel} className="text-[var(--color-mute)] hover:text-[var(--color-ink)]">✕</button>
                  </div>
                  {tab === "campaigns" ? (
                    <div className="space-y-4">
                      <ImageUpload label="キャンペーンバナー画像" hint="推奨: 16:9 / JPG・PNG / 最大5MB" />
                      <Field label="キャンペーン名"><Inp value={cTitle} onChange={e=>setCTitle(e.target.value)} placeholder="例: 夏の紹介キャンペーン" /></Field>
                      <Field label="詳細説明"><Txt rows={5} value={cDesc} onChange={e=>setCDesc(e.target.value)} placeholder="キャンペーンの詳細を入力..." /></Field>
                      <div className="flex gap-2 pt-2">
                        <button onClick={() => setShowPreview(true)} className="btn-outline !py-2 text-xs">プレビュー</button>
                        <button onClick={() => setDraftMsg(true)} className="btn-outline !py-2 text-xs">下書き保存</button>
                        <button onClick={() => {
                          if(cTitle) setCampaigns(prev=>[...prev,{id:Date.now(),title:cTitle,desc:cDesc}]);
                          closePanel();
                        }} className="btn-primary !py-2 text-xs flex-1 justify-center">公開する</button>
                        <button onClick={closePanel} className="btn-outline !py-2 text-xs">キャンセル</button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <ImageUpload label="レポートカバー画像" hint="推奨: 16:9 / JPG・PNG / 最大5MB" />
                      <Field label="タイトル"><Inp value={rTitle} onChange={e=>setRTitle(e.target.value)} placeholder="例: 6月イベントレポート｜Wine Salon" /></Field>
                      <Field label="本文"><Txt rows={8} value={rBody} onChange={e=>setRBody(e.target.value)} placeholder="レポート本文を入力..." /></Field>
                      <div className="flex gap-2 pt-2">
                        <button onClick={() => setShowPreview(true)} className="btn-outline !py-2 text-xs">プレビュー</button>
                        <button onClick={() => setDraftMsg(true)} className="btn-outline !py-2 text-xs">下書き保存</button>
                        <button onClick={() => {
                          if(rTitle) setReports(prev=>[...prev,{id:Date.now(),title:rTitle,published:"2026.07.12",views:0,body:rBody}]);
                          closePanel();
                        }} className="btn-primary !py-2 text-xs flex-1 justify-center">公開する</button>
                        <button onClick={closePanel} className="btn-outline !py-2 text-xs">キャンセル</button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Preview modal */}
      {showPreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" onClick={() => setShowPreview(false)}>
          <div className="bg-[var(--color-bg-soft)] rounded-2xl p-8 w-[480px] max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-display text-xl">プレビュー</h2>
              <button onClick={() => setShowPreview(false)} className="text-[var(--color-mute)]">✕</button>
            </div>
            <div className="card p-5">
              <div className="w-full h-36 bg-gradient-to-br from-[var(--color-accent)]/20 to-[var(--color-bg)] rounded-xl mb-4 flex items-center justify-center">
                <span className="font-display text-xs text-[var(--color-mute)]">{tab==="campaigns"?"キャンペーンバナー":"カバー画像"}</span>
              </div>
              <div className="tag tag-accent text-[9px] mb-2">{tab==="campaigns"?"キャンペーン":"活動レポート"}</div>
              <h3 className="font-display text-lg mb-2">{(tab==="campaigns"?cTitle:rTitle)||"（タイトル未入力）"}</h3>
              <p className="text-xs text-[var(--color-mute)] leading-relaxed">{(tab==="campaigns"?cDesc:rBody)||"（本文未入力）"}</p>
            </div>
            <button onClick={() => setShowPreview(false)} className="mt-4 w-full btn-outline justify-center text-sm">閉じる</button>
          </div>
        </div>
      )}
    </div>
  );
}
