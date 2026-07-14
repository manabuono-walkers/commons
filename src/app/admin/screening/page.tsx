"use client";
import { useState } from "react";

type AppStatus = "approved" | "rejected" | "pending";

interface Application {
  id: string; name: string; kana: string; age: number; gender: string;
  job: string; industry: string; company: string; title: string;
  area: string; pref: string; region: string;
  income: string; referee: string; applied: string; docs: boolean;
  interests: string[];
  insta: string; entryReasons: string[]; howFound: string;
  selfIntro: string; lifestyle: string; desired: string;
}

const initialApplications: Application[] = [
  { id:"A-0871", name:"松本 弦", kana:"マツモト ゲン", age:28, gender:"男性", job:"ITエンジニア", industry:"IT・ソフトウェア", company:"株式会社テックA", title:"エンジニア", area:"東京都渋谷区", pref:"東京", region:"東京", income:"800〜1000万", referee:"田中 康介（#0880）", applied:"2026.07.01", docs:true, interests:["ワイン","写真"], insta:"gen_matsumoto", entryReasons:["趣味や興味が合う人との交流","新しい体験・イベントを楽しみたい"], howFound:"COMMONS Instagram", selfIntro:"エンジニアとして都内のスタートアップに勤務しています。週末はワインと写真が趣味で、気の合う仲間と過ごしたいです。", lifestyle:"エンジニア仲間以外の交流機会が少なく、多様なバックグラウンドを持つ人と話す場所が欲しいと感じています。", desired:"ワインや写真を通じて、異業種・異世代の友人を作り、充実した週末を過ごしたいと思っています。" },
  { id:"A-0867", name:"藤井 結菜", kana:"フジイ ユイナ", age:31, gender:"女性", job:"マーケター", industry:"広告・マーケティング", company:"株式会社○○アド", title:"シニアマーケター", area:"東京都港区", pref:"東京", region:"東京", income:"600〜800万", referee:"なし", applied:"2026.07.03", docs:true, interests:["アート","コーヒー"], insta:"yuina_fujii", entryReasons:["趣味や興味が合う人との交流","職場・既存コミュニティ以外の居場所づくり"], howFound:"COMMONS TikTok", selfIntro:"マーケターとして広告代理店に勤務しています。グルメとアートのイベントが大好きで、仕事以外での充実した交流を求めています。", lifestyle:"仕事で忙しい日々の中で、職場以外のリフレッシュできるコミュニティが欲しいと感じています。", desired:"アートやコーヒーを通じた感性豊かな仲間と出会い、週末を豊かに過ごしたいです。" },
  { id:"A-0868", name:"橋本 涼", kana:"ハシモト リョウ", age:25, gender:"男性", job:"デザイナー", industry:"デザイン・クリエイティブ", company:"フリーランス", title:"", area:"神奈川県横浜市", pref:"神奈川", region:"東京", income:"400〜600万", referee:"山本 彩花（#0885）", applied:"2026.07.05", docs:false, interests:["アート","写真"], insta:"ryo_hshmt", entryReasons:["異性・同性問わず新しい友人づくり","趣味や興味が合う人との交流"], howFound:"COMMONS Instagram", selfIntro:"フリーランスのデザイナーです。アートや写真が好きで、クリエイティブなコミュニティを長年探していました。", lifestyle:"フリーランスゆえに孤独を感じることがあり、同じクリエイティブ系の仲間と交流したいです。", desired:"アートや写真を通じて刺激し合えるクリエイター仲間と、定期的に交流できる場所を作りたいです。" },
];

const rejectedHistory: (Application & { rejectedAt: string; reason: string })[] = [
  { id:"A-0755", name:"村上 一浩", kana:"ムラカミ カズヒロ", age:22, gender:"男性", job:"学生", industry:"学生", company:"", title:"", area:"東京都八王子市", pref:"東京", region:"東京", income:"400万未満", referee:"なし", applied:"2025.12.10", docs:false, interests:[], insta:"kazuhiro_m", entryReasons:["異性・同性問わず新しい友人づくり"], howFound:"COMMONS Instagram", selfIntro:"友達が多い場所が好きで気軽に参加したいです。", lifestyle:"友達が少ない。", desired:"たくさんの人と仲良くなりたい。", rejectedAt:"2025.12.15", reason:"在籍コミュニティとの価値観ミスマッチ" },
  { id:"A-0801", name:"石田 明", kana:"イシダ アキラ", age:35, gender:"男性", job:"会社員", industry:"製造業", company:"△△製造", title:"", area:"埼玉県さいたま市", pref:"埼玉", region:"東京", income:"400〜600万", referee:"なし", applied:"2026.02.20", docs:true, interests:["コーヒー"], insta:"akira_ishida", entryReasons:["異性・同性問わず新しい友人づくり"], howFound:"COMMONS X", selfIntro:"近所だから入ってみたい。特にこれといった趣味はないですが交流を楽しみたいです。", lifestyle:"近所で気軽に行ける場所を探していた。", desired:"近くに友人を作りたい。", rejectedAt:"2026.02.26", reason:"申請動機が不十分" },
];

type Tab = "list" | "rejected";

export default function ScreeningPage() {
  const [tab, setTab] = useState<Tab>("list");
  const [apps] = useState<Application[]>(initialApplications);
  const [done, setDone] = useState<Record<string, AppStatus>>({});
  const [selected, setSelected] = useState<string>(apps[0].id);
  const [rejectedSelected, setRejectedSelected] = useState<string | null>(null);
  const [pastCheckResult, setPastCheckResult] = useState<Record<string, boolean | null>>({});
  const [rejectModal, setRejectModal] = useState<string | null>(null);
  const [rejectComment, setRejectComment] = useState("");

  function approve(id: string) { setDone(prev => ({ ...prev, [id]: "approved" })); }
  function reject(id: string) { setDone(prev => ({ ...prev, [id]: "rejected" })); }
  function confirmReject() {
    if (!rejectModal) return;
    reject(rejectModal);
    setRejectModal(null);
    setRejectComment("");
  }
  function checkPastRejection(app: Application) {
    const matched = rejectedHistory.some(r => r.name === app.name || r.kana === app.kana);
    setPastCheckResult(prev => ({ ...prev, [app.id]: matched }));
  }
  function downloadCSV() {
    const header = ["申込ID","氏名","フリガナ","性別","年齢","職業","エリア","申込日","否決日","理由"];
    const rows = rejectedHistory.map(r => [r.id,r.name,r.kana,r.gender,r.age,r.job,r.area,r.applied,r.rejectedAt,r.reason]);
    const csv = [header,...rows].map(row=>row.join(",")).join("\n");
    const blob = new Blob(["﻿"+csv],{type:"text/csv;charset=utf-8;"});
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href=url; a.download="rejected_history.csv"; a.click();
    URL.revokeObjectURL(url);
  }

  const detail = apps.find(a => a.id === selected);
  const rejDetail = rejectedHistory.find(r => r.id === rejectedSelected);

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <div className="px-8 py-6 border-b border-[var(--color-line)] flex items-center justify-between flex-none">
        <div>
          <div className="font-display text-[10px] tracking-[0.12em] text-[var(--color-accent-deep)]">SCREENING</div>
          <h1 className="font-display text-2xl mt-0.5">審査管理</h1>
        </div>
        {tab === "rejected" && (
          <button onClick={downloadCSV} className="btn-outline !py-2 text-xs">CSV出力</button>
        )}
      </div>

      {/* Inline tabs */}
      <div className="px-8 border-b border-[var(--color-line)] flex gap-6 flex-none">
        {([["list","申込一覧"],["rejected","否決履歴"]] as const).map(([k,l])=>(
          <button key={k} onClick={()=>setTab(k)}
            className={`font-display text-sm py-4 border-b-2 transition ${tab===k?"border-[var(--color-accent)] text-[var(--color-accent-deep)]":"border-transparent text-[var(--color-mute)]"}`}>
            {l}
          </button>
        ))}
      </div>

      {tab === "list" && (
        <div className="flex flex-1 overflow-hidden">
          <div className="w-[260px] border-r border-[var(--color-line)] overflow-y-auto flex-none">
            {apps.map(a => (
              <button key={a.id} onClick={() => setSelected(a.id)}
                className={`w-full text-left px-5 py-4 border-b border-[var(--color-line)] transition ${selected===a.id?"bg-[var(--color-accent)]/8":"hover:bg-[var(--color-bg-soft)]"}`}>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-display text-sm">{a.name}</span>
                  {done[a.id] ? (
                    <span className={`tag text-[9px] ${done[a.id]==="approved"?"tag-accent":""}`}>{done[a.id]==="approved"?"承認済":"否決済"}</span>
                  ) : (
                    <span className="tag text-[9px]">審査中</span>
                  )}
                </div>
                <div className="font-display text-[10px] text-[var(--color-mute)]">{a.id} · {a.applied}</div>
                <div className="font-display text-[10px] text-[var(--color-mute)] mt-0.5">{a.job} · {a.area}</div>
              </button>
            ))}
          </div>

          {detail && (
            <div className="flex-1 overflow-y-auto px-8 py-6">
              <div className="max-w-[760px]">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <div className="num text-xs text-[var(--color-mute)] mb-1">{detail.id}</div>
                    <h2 className="font-display text-2xl">{detail.name}</h2>
                    <div className="font-display text-xs text-[var(--color-mute)] mt-1">{detail.kana} · {detail.applied} 申込</div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    {!done[detail.id] ? (
                      <div className="flex gap-2">
                        <button onClick={() => setRejectModal(detail.id)} className="btn-outline !py-2 text-xs border-red-400/40 text-red-400 hover:bg-red-400/8">否決</button>
                        <button onClick={() => approve(detail.id)} className="btn-primary !py-2 text-xs">承認</button>
                      </div>
                    ) : (
                      <span className={`tag ${done[detail.id]==="approved"?"tag-accent":""}`}>{done[detail.id]==="approved"?"✓ 承認済み":"✗ 否決済み"}</span>
                    )}
                    <button onClick={() => checkPastRejection(detail)}
                      className="font-display text-[11px] px-3 py-1.5 rounded-full border border-[var(--color-accent)]/40 text-[var(--color-accent-deep)] hover:bg-[var(--color-accent)]/8 transition">
                      過去否決チェック
                    </button>
                    {pastCheckResult[detail.id] !== undefined && (
                      <div className={`font-display text-xs px-3 py-1.5 rounded-full ${pastCheckResult[detail.id]?"bg-red-400/10 text-red-400 border border-red-400/30":"bg-green-500/10 text-green-400 border border-green-500/30"}`}>
                        {pastCheckResult[detail.id]?"⚠ 過去に否決歴あり":"✓ 否決歴なし"}
                      </div>
                    )}
                    {done[detail.id]==="rejected" && (
                      <button className="font-display text-[11px] px-3 py-1.5 rounded-full border border-red-400/40 text-red-400 hover:bg-red-400/8 transition">CCキャンセル</button>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 mb-5">
                  {[
                    {l:"年齢",v:`${detail.age}歳`},{l:"性別",v:detail.gender},{l:"申込地域",v:detail.region},
                    {l:"都道府県",v:detail.pref},{l:"職業",v:detail.job},{l:"業種",v:detail.industry},
                    {l:"勤務先",v:detail.company||"—"},{l:"役職・肩書き",v:detail.title||"—"},{l:"年収",v:detail.income},
                    {l:"Instagram ID",v:"@"+detail.insta},{l:"紹介者",v:detail.referee},{l:"知ったきっかけ",v:detail.howFound},
                  ].map(r=>(
                    <div key={r.l} className="card p-4">
                      <div className="font-display text-[10px] text-[var(--color-mute)] mb-1">{r.l}</div>
                      <div className="text-sm break-all">{r.v}</div>
                    </div>
                  ))}
                </div>
                <div className="card p-5 mb-4">
                  <div className="font-display text-[10px] text-[var(--color-accent-deep)] mb-2">入会の理由</div>
                  <div className="flex flex-wrap gap-1.5">{detail.entryReasons.map(r=><span key={r} className="tag text-[9px]">{r}</span>)}</div>
                </div>
                {detail.interests.length>0&&(
                  <div className="card p-5 mb-4">
                    <div className="font-display text-[10px] text-[var(--color-accent-deep)] mb-2">興味カテゴリ</div>
                    <div className="flex flex-wrap gap-1.5">{detail.interests.map(i=><span key={i} className="tag text-[9px]">{i}</span>)}</div>
                  </div>
                )}
                <div className="card p-5 mb-4">
                  <div className="font-display text-[10px] text-[var(--color-accent-deep)] mb-2">自己紹介</div>
                  <p className="text-sm leading-relaxed text-[var(--color-mute)]">{detail.selfIntro}</p>
                </div>
                <div className="card p-5 mb-4">
                  <div className="font-display text-[10px] text-[var(--color-accent-deep)] mb-2">ライフスタイル・人間関係で感じる物足りなさ</div>
                  <p className="text-sm leading-relaxed text-[var(--color-mute)]">{detail.lifestyle}</p>
                </div>
                <div className="card p-5 mb-4">
                  <div className="font-display text-[10px] text-[var(--color-accent-deep)] mb-2">実現したいつながり・日常</div>
                  <p className="text-sm leading-relaxed text-[var(--color-mute)]">{detail.desired}</p>
                </div>
                <div className="card p-5">
                  <div className="font-display text-[10px] text-[var(--color-accent-deep)] mb-3">本人確認書類</div>
                  {detail.docs ? (
                    <div className="flex items-center gap-3">
                      <div className="w-24 h-16 rounded-lg bg-[var(--color-line)] flex items-center justify-center text-xs text-[var(--color-mute)]">身分証 表</div>
                      <div className="w-24 h-16 rounded-lg bg-[var(--color-line)] flex items-center justify-center text-xs text-[var(--color-mute)]">身分証 裏</div>
                      <div className="font-display text-xs text-[var(--color-accent-deep)]">✓ アップロード済み</div>
                    </div>
                  ) : (
                    <div className="font-display text-xs text-red-400">⚠ 書類未提出</div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {tab === "rejected" && (
        <div className="flex flex-1 overflow-hidden">
          <div className="w-[260px] border-r border-[var(--color-line)] overflow-y-auto flex-none">
            {rejectedHistory.map(r => (
              <button key={r.id} onClick={() => setRejectedSelected(r.id)}
                className={`w-full text-left px-5 py-4 border-b border-[var(--color-line)] transition ${rejectedSelected===r.id?"bg-red-400/8":"hover:bg-[var(--color-bg-soft)]"}`}>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-display text-sm">{r.name}</span>
                  <span className="tag text-[9px] border-red-400/30 text-red-400">否決済</span>
                </div>
                <div className="font-display text-[10px] text-[var(--color-mute)]">{r.id} · 否決 {r.rejectedAt}</div>
                <div className="font-display text-[10px] text-[var(--color-mute)] mt-0.5">{r.reason}</div>
              </button>
            ))}
          </div>
          {rejDetail ? (
            <div className="flex-1 overflow-y-auto px-8 py-6">
              <div className="max-w-[720px]">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <div className="num text-xs text-[var(--color-mute)] mb-1">{rejDetail.id}</div>
                    <h2 className="font-display text-2xl">{rejDetail.name}</h2>
                    <div className="font-display text-xs text-[var(--color-mute)] mt-1">{rejDetail.kana}</div>
                  </div>
                  <button className="font-display text-xs px-4 py-2 rounded-full border border-red-400/40 text-red-400 hover:bg-red-400/8 transition">CCキャンセル</button>
                </div>
                <div className="card p-5 mb-4 border-red-400/20">
                  <div className="font-display text-[10px] text-red-400 mb-1">否決理由</div>
                  <div className="text-sm">{rejDetail.reason}</div>
                  <div className="font-display text-[10px] text-[var(--color-mute)] mt-2">否決日: {rejDetail.rejectedAt}</div>
                </div>
                <div className="grid grid-cols-3 gap-3 mb-4">
                  {[
                    {l:"年齢",v:`${rejDetail.age}歳`},{l:"性別",v:rejDetail.gender},{l:"都道府県",v:rejDetail.pref},
                    {l:"職業",v:rejDetail.job},{l:"業種",v:rejDetail.industry},{l:"勤務先",v:rejDetail.company||"—"},
                    {l:"年収",v:rejDetail.income},{l:"申込日",v:rejDetail.applied},{l:"紹介者",v:rejDetail.referee},
                    {l:"Instagram ID",v:"@"+rejDetail.insta},{l:"知ったきっかけ",v:rejDetail.howFound},
                  ].map(r=>(
                    <div key={r.l} className="card p-4">
                      <div className="font-display text-[10px] text-[var(--color-mute)] mb-1">{r.l}</div>
                      <div className="text-sm break-all">{r.v}</div>
                    </div>
                  ))}
                </div>
                <div className="card p-5 mb-4">
                  <div className="font-display text-[10px] text-[var(--color-accent-deep)] mb-2">入会の理由</div>
                  <div className="flex flex-wrap gap-1.5">{rejDetail.entryReasons.map(r=><span key={r} className="tag text-[9px]">{r}</span>)}</div>
                </div>
                <div className="card p-5 mb-4">
                  <div className="font-display text-[10px] text-[var(--color-accent-deep)] mb-2">自己紹介</div>
                  <p className="text-sm leading-relaxed text-[var(--color-mute)]">{rejDetail.selfIntro}</p>
                </div>
                <div className="card p-5 mb-4">
                  <div className="font-display text-[10px] text-[var(--color-accent-deep)] mb-2">物足りなさ</div>
                  <p className="text-sm leading-relaxed text-[var(--color-mute)]">{rejDetail.lifestyle}</p>
                </div>
                <div className="card p-5">
                  <div className="font-display text-[10px] text-[var(--color-accent-deep)] mb-2">実現したいつながり</div>
                  <p className="text-sm leading-relaxed text-[var(--color-mute)]">{rejDetail.desired}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center text-[var(--color-mute)] font-display text-sm">左から対象者を選択してください</div>
          )}
        </div>
      )}

      {rejectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" onClick={()=>{setRejectModal(null);setRejectComment("");}}>
          <div className="bg-[var(--color-bg-soft)] rounded-2xl p-8 w-[480px]" onClick={e=>e.stopPropagation()}>
            <h2 className="font-display text-xl mb-2">否決コメント</h2>
            <p className="font-display text-xs text-[var(--color-mute)] mb-5">否決理由を入力してください。否決履歴に記録されます。</p>
            <textarea value={rejectComment} onChange={e=>setRejectComment(e.target.value)} rows={4} placeholder="例: 在籍コミュニティとの価値観ミスマッチ" className="w-full bg-[var(--color-bg)] border border-[var(--color-line)] rounded-xl px-4 py-3 text-sm outline-none focus:border-[var(--color-accent)]/50 placeholder-[var(--color-mute)] resize-none" />
            <div className="flex gap-3 mt-5">
              <button onClick={confirmReject} className="flex-1 btn-primary justify-center text-sm !bg-red-500 !from-red-500 !to-red-600">否決を確定する</button>
              <button onClick={()=>{setRejectModal(null);setRejectComment("");}} className="flex-1 btn-outline justify-center text-sm">キャンセル</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
