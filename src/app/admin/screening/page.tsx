"use client";
import { useState } from "react";

type AppStatus = "approved" | "rejected" | "pending";

interface Application {
  id: string; name: string; kana: string; dob: string; gender: string;
  email: string; tel: string;
  job: string; industry: string; company: string; title: string;
  area: string; pref: string; region: string;
  income: string; referee: string; applied: string; docs: boolean;
  interests: string[];
  insta: string; entryReasons: string[]; howFound: string;
  selfIntro: string; lifestyle: string; desired: string;
}

const initialApplications: Application[] = [
  { id:"A-0871", name:"松本 弦", kana:"マツモト ゲン", dob:"1998.03.14", gender:"男性", email:"gen.matsumoto@example.com", tel:"09011112222", job:"ITエンジニア", industry:"IT・ソフトウェア", company:"株式会社テックA", title:"エンジニア", area:"東京都渋谷区", pref:"東京都", region:"東京", income:"700万円〜900万円", referee:"田中 康介（#0880）", applied:"2026.07.01 14:32", docs:true, interests:["ワイン","写真"], insta:"gen_matsumoto", entryReasons:["趣味や興味が合う人との交流","新しい体験・イベントを楽しみたい"], howFound:"COMMONS Instagram", selfIntro:"エンジニアとして都内のスタートアップに勤務しています。週末はワインと写真が趣味で、気の合う仲間と過ごしたいです。", lifestyle:"エンジニア仲間以外の交流機会が少なく、多様なバックグラウンドを持つ人と話す場所が欲しいと感じています。", desired:"ワインや写真を通じて、異業種・異世代の友人を作り、充実した週末を過ごしたいと思っています。" },
  { id:"A-0867", name:"藤井 結菜", kana:"フジイ ユイナ", dob:"1994.11.02", gender:"女性", email:"yuina.fujii@example.com", tel:"09022223333", job:"会社員（総合職）", industry:"広告・マーケティング", company:"株式会社○○アド", title:"シニアマーケター", area:"東京都港区", pref:"東京都", region:"東京", income:"500万円〜700万円", referee:"なし", applied:"2026.07.03 09:18", docs:true, interests:["アート","コーヒー"], insta:"yuina_fujii", entryReasons:["趣味や興味が合う人との交流","職場・既存コミュニティ以外の居場所づくり"], howFound:"COMMONS TikTok", selfIntro:"マーケターとして広告代理店に勤務しています。グルメとアートのイベントが大好きで、仕事以外での充実した交流を求めています。", lifestyle:"仕事で忙しい日々の中で、職場以外のリフレッシュできるコミュニティが欲しいと感じています。", desired:"アートやコーヒーを通じた感性豊かな仲間と出会い、週末を豊かに過ごしたいです。" },
  { id:"A-0868", name:"橋本 涼", kana:"ハシモト リョウ", dob:"2001.05.20", gender:"男性", email:"ryo.hashimoto@example.com", tel:"09033334444", job:"自営業", industry:"デザイン・クリエイティブ", company:"フリーランス", title:"", area:"神奈川県横浜市", pref:"神奈川県", region:"東京", income:"300万円〜500万円", referee:"山本 彩花（#0885）", applied:"2026.07.05 21:47", docs:false, interests:["アート","写真"], insta:"ryo_hshmt", entryReasons:["異性・同性問わず新しい友人づくり","趣味や興味が合う人との交流"], howFound:"COMMONS Instagram", selfIntro:"フリーランスのデザイナーです。アートや写真が好きで、クリエイティブなコミュニティを長年探していました。", lifestyle:"フリーランスゆえに孤独を感じることがあり、同じクリエイティブ系の仲間と交流したいです。", desired:"アートや写真を通じて刺激し合えるクリエイター仲間と、定期的に交流できる場所を作りたいです。" },
  // 再入会判定の検証用：退会済み会員（村瀬 史奈 #0873）と誕生日・氏名・電話番号が一致する再申込
  { id:"A-0902", name:"村瀬 史奈", kana:"ムラセ フミナ", dob:"1998.09.02", gender:"女性", email:"fumina.murase@example.com", tel:"09099998888", job:"自営業", industry:"デザイン・クリエイティブ", company:"", title:"", area:"大阪府大阪市", pref:"大阪府", region:"大阪", income:"500万円〜700万円", referee:"森田 桂（#0851）", applied:"2026.07.10 11:05", docs:true, interests:["アート","コーヒー"], insta:"fumina_mrsw2", entryReasons:["趣味や興味が合う人との交流"], howFound:"COMMONS Instagram", selfIntro:"以前会員だったのですが再度申し込みたいと思い応募しました。", lifestyle:"クリエイター仲間との交流をまた再開したいです。", desired:"アートやデザインが好きな仲間と再び交流したいです。" },
];

// 退会済み会員データ（再入会判定の照合用・admin/membersの退会済みレコードと連動想定）
const withdrawnMembers = [
  { name:"村瀬 史奈", kana:"ムラセ フミナ", dob:"1998.09.02", tel:"09099998888", memberNo:"0873", withdrawnDate:"2026.03.20", reason:"料金が高いと感じた。他のコミュニティと掛け持ちが難しくなった。" },
];

const rejectedHistory: (Application & { rejectedAt: string; reason: string })[] = [
  { id:"A-0755", name:"村上 一浩", kana:"ムラカミ カズヒロ", dob:"2003.08.30", gender:"男性", email:"kazuhiro.murakami@example.com", tel:"09044445555", job:"学生", industry:"学生", company:"", title:"", area:"東京都八王子市", pref:"東京都", region:"東京", income:"〜300万円", referee:"なし", applied:"2025.12.10 16:20", docs:false, interests:[], insta:"kazuhiro_m", entryReasons:["異性・同性問わず新しい友人づくり"], howFound:"COMMONS Instagram", selfIntro:"友達が多い場所が好きで気軽に参加したいです。", lifestyle:"友達が少ない。", desired:"たくさんの人と仲良くなりたい。", rejectedAt:"2025.12.15", reason:"在籍コミュニティとの価値観ミスマッチ" },
  { id:"A-0801", name:"石田 明", kana:"イシダ アキラ", dob:"1990.02.11", gender:"男性", email:"akira.ishida@example.com", tel:"09055556666", job:"会社員（一般職）", industry:"製造業", company:"△△製造", title:"", area:"埼玉県さいたま市", pref:"埼玉県", region:"東京", income:"300万円〜500万円", referee:"なし", applied:"2026.02.20 10:03", docs:true, interests:["コーヒー"], insta:"akira_ishida", entryReasons:["異性・同性問わず新しい友人づくり"], howFound:"COMMONS X", selfIntro:"近所だから入ってみたい。特にこれといった趣味はないですが交流を楽しみたいです。", lifestyle:"近所で気軽に行ける場所を探していた。", desired:"近くに友人を作りたい。", rejectedAt:"2026.02.26", reason:"申請動機が不十分" },
];

type Tab = "list" | "rejected" | "settings";
type Rating = "circle" | "triangle" | "cross";

interface GenderScores { circle: number; triangle: number; cross: number; }
interface ScoreCriterion { id: string; name: string; male: GenderScores; female: GenderScores; }

const DEFAULT_SCORE_SETTINGS: ScoreCriterion[] = [
  { id: "face", name: "顔写真の印象", male: { circle: 10, triangle: 5, cross: 0 }, female: { circle: 10, triangle: 5, cross: 0 } },
  { id: "insta", name: "Instagram", male: { circle: 10, triangle: 5, cross: 0 }, female: { circle: 10, triangle: 5, cross: 0 } },
  { id: "writing", name: "文章の質・誠実さ", male: { circle: 10, triangle: 5, cross: 0 }, female: { circle: 10, triangle: 5, cross: 0 } },
  { id: "job", name: "職業", male: { circle: 10, triangle: 5, cross: 0 }, female: { circle: 10, triangle: 5, cross: 0 } },
  { id: "income", name: "年収", male: { circle: 10, triangle: 5, cross: 0 }, female: { circle: 10, triangle: 5, cross: 0 } },
  { id: "age", name: "年齢", male: { circle: 10, triangle: 5, cross: 0 }, female: { circle: 10, triangle: 5, cross: 0 } },
];

const MANUAL_CRITERIA = ["face", "insta", "writing"] as const;
const FIXED_CRITERIA_IDS = [...MANUAL_CRITERIA, "job", "income", "age"];

// 誕生日（YYYY.MM.DD）から満年齢を計算
function calcAge(dob: string): number {
  const [y, m, d] = dob.split(".").map(Number);
  const today = new Date();
  let age = today.getFullYear() - y;
  if (today.getMonth() + 1 < m || (today.getMonth() + 1 === m && today.getDate() < d)) age--;
  return age;
}

// 退会後1年以内の再入会は要注意（申込日と退会日の差分で判定）
function isWithinOneYear(withdrawnDate: string, appliedDate: string): boolean {
  const w = new Date(withdrawnDate.replace(/\./g, "-"));
  const a = new Date(appliedDate.slice(0, 10).replace(/\./g, "-"));
  const diffDays = (a.getTime() - w.getTime()) / 86400000;
  return diffDays < 365;
}

// 職業・年収・年齢の〇△✖判定（点数は審査スコア設定タブで管理）
function jobRating(job: string): Rating {
  if (/経営者|役員|医師|医療|弁護士|士業/.test(job)) return "circle";
  if (/自営業|会社員|エンジニア|マーケター|デザイナー|コンサル/.test(job)) return "triangle";
  return "cross";
}
function incomeRating(income: string): Rating {
  const m = income.match(/(\d+)万円/);
  const n = m ? Number(m[1]) : 0;
  if (n >= 700) return "circle";
  if (n >= 400) return "triangle";
  return "cross";
}
const RATING_SYMBOL: Record<Rating, string> = { circle: "〇", triangle: "△", cross: "✖" };

function ageRating(age: number): Rating {
  if (age >= 25 && age <= 40) return "circle";
  if ((age >= 20 && age < 25) || (age > 40 && age <= 50)) return "triangle";
  return "cross";
}

// 誕生日・氏名・電話番号のうち2つ以上一致した過去否決／退会履歴をサジェスト
function findPastHistory(app: Application) {
  const rejections = rejectedHistory.filter(r => {
    const matches = [r.dob === app.dob, r.name === app.name, r.tel === app.tel].filter(Boolean).length;
    return matches >= 2;
  });
  const withdrawal = withdrawnMembers.find(w => {
    const matches = [w.dob === app.dob, w.name === app.name, w.tel === app.tel].filter(Boolean).length;
    return matches >= 2;
  }) ?? null;
  return { rejections, withdrawal };
}

export default function ScreeningPage() {
  const [tab, setTab] = useState<Tab>("list");
  const [apps] = useState<Application[]>(initialApplications);
  const [done, setDone] = useState<Record<string, AppStatus>>({});
  const [selected, setSelected] = useState<string>(apps[0].id);
  const [rejectedSelected, setRejectedSelected] = useState<string | null>(null);
  const [rejectModal, setRejectModal] = useState<string | null>(null);
  const [rejectComment, setRejectComment] = useState("");
  const [scores, setScores] = useState<Record<string, Partial<Record<typeof MANUAL_CRITERIA[number], Rating>>>>({});
  const [totals, setTotals] = useState<Record<string, number>>({});
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());
  const [scoreSettings, setScoreSettings] = useState<ScoreCriterion[]>(DEFAULT_SCORE_SETTINGS);
  const [settingsSaved, setSettingsSaved] = useState(false);

  function saveScore(id: string) {
    setSavedIds(prev => new Set([...prev, id]));
  }

  function pointsFor(criterionId: string, rating: Rating, gender: string): number {
    const c = scoreSettings.find(c => c.id === criterionId);
    if (!c) return 0;
    const group = gender === "女性" ? c.female : c.male;
    return group[rating];
  }
  function updateCriterionName(id: string, value: string) {
    setScoreSettings(prev => prev.map(c => c.id === id ? { ...c, name: value } : c));
  }
  function updateCriterionScore(id: string, genderKey: "male" | "female", field: Rating, value: string) {
    setScoreSettings(prev => prev.map(c => c.id === id
      ? { ...c, [genderKey]: { ...c[genderKey], [field]: Number(value) || 0 } }
      : c));
  }
  function addCriterion() {
    setScoreSettings(prev => [...prev, {
      id: `custom-${Date.now()}`, name: "",
      male: { circle: 0, triangle: 0, cross: 0 },
      female: { circle: 0, triangle: 0, cross: 0 },
    }]);
  }
  function removeCriterion(id: string) {
    setScoreSettings(prev => prev.filter(c => c.id !== id));
  }
  function saveSettings() {
    setSettingsSaved(true);
    setTimeout(() => setSettingsSaved(false), 2000);
  }

  function updateScore(id: string, field: typeof MANUAL_CRITERIA[number], value: Rating) {
    setScores(prev => {
      const current = prev[id] ?? {};
      return { ...prev, [id]: { ...current, [field]: value } };
    });
  }
  function calcTotal(app: Application) {
    const s = scores[app.id] ?? {};
    const manualTotal = MANUAL_CRITERIA.reduce((sum, field) => {
      const rating = s[field];
      return sum + (rating ? pointsFor(field, rating, app.gender) : 0);
    }, 0);
    const total = manualTotal
      + pointsFor("job", jobRating(app.job), app.gender) + pointsFor("income", incomeRating(app.income), app.gender) + pointsFor("age", ageRating(calcAge(app.dob)), app.gender);
    setTotals(prev => ({ ...prev, [app.id]: total }));
  }

  function approve(id: string) { setDone(prev => ({ ...prev, [id]: "approved" })); }
  function reject(id: string) { setDone(prev => ({ ...prev, [id]: "rejected" })); }
  function confirmReject() {
    if (!rejectModal) return;
    reject(rejectModal);
    setRejectModal(null);
    setRejectComment("");
  }
  function downloadCSV() {
    const header = ["申込ID","氏名","フリガナ","性別","年齢","職業","エリア","申込日","否決日","理由"];
    const rows = rejectedHistory.map(r => [r.id,r.name,r.kana,r.gender,calcAge(r.dob),r.job,r.area,r.applied,r.rejectedAt,r.reason]);
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
        {([["list","申込一覧"],["rejected","否決履歴"],["settings","審査スコア設定"]] as const).map(([k,l])=>(
          <button key={k} onClick={()=>setTab(k)}
            className={`font-display text-sm py-4 border-b-2 transition ${tab===k?"border-[var(--color-accent)] text-[var(--color-accent-deep)]":"border-transparent text-[var(--color-mute)]"}`}>
            {l}
          </button>
        ))}
      </div>

      {tab === "list" && (
        <div className="flex flex-1 overflow-hidden">
          <div className="w-[260px] border-r border-[var(--color-line)] overflow-y-auto flex-none">
            {apps.map(a => {
              const hasHistory = (() => {
                const h = findPastHistory(a);
                return h.rejections.length > 0 || !!h.withdrawal;
              })();
              return (
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
                  {hasHistory && (
                    <div className="font-display text-[9px] text-red-400 mt-1">⚠ 過去履歴あり</div>
                  )}
                </button>
              );
            })}
          </div>

          {detail && (() => {
            const history = findPastHistory(detail);
            const reentryFlag = history.withdrawal ? isWithinOneYear(history.withdrawal.withdrawnDate, detail.applied) : false;
            const hasHistory = history.rejections.length > 0 || !!history.withdrawal;
            return (
              <div className="flex-1 overflow-y-auto px-8 py-6">
                <div className="max-w-[760px]">
                  {/* 否決・承認（最上部） */}
                  <div className="flex items-center justify-end mb-5">
                    {!done[detail.id] ? (
                      <div className="flex gap-2">
                        <button onClick={() => setRejectModal(detail.id)} className="btn-outline !py-2 text-xs border-red-400/40 text-red-400 hover:bg-red-400/8">否決</button>
                        <button onClick={() => !reentryFlag && approve(detail.id)} disabled={reentryFlag}
                          title={reentryFlag ? "退会後1年以内のため承認できません" : undefined}
                          className="btn-primary !py-2 text-xs disabled:opacity-40 disabled:cursor-not-allowed">
                          承認{reentryFlag ? "不可" : ""}
                        </button>
                      </div>
                    ) : (
                      <span className={`tag ${done[detail.id]==="approved"?"tag-accent":""}`}>{done[detail.id]==="approved"?"✓ 承認済み":"✗ 否決済み"}</span>
                    )}
                  </div>

                  {/* 過去審査履歴・再入会判定（自動表示・最上部） */}
                  <div className={`card p-4 mb-5 ${hasHistory ? "border-red-400/30" : "border-green-500/30"}`}>
                    <div className={`font-display text-[10px] mb-2 ${hasHistory ? "text-red-400" : "text-green-500"}`}>
                      {hasHistory ? "⚠ 過去審査履歴・再入会判定" : "✓ 過去審査履歴・再入会判定：該当なし"}
                    </div>
                    {!hasHistory && (
                      <div className="text-sm text-[var(--color-mute)]">誕生日・氏名・電話番号のいずれも過去の否決履歴・退会履歴と一致しませんでした。</div>
                    )}
                    {history.withdrawal && (
                      <div className={`mt-1 pt-3 ${history.rejections.length ? "border-t border-[var(--color-line)]" : ""}`}>
                        <div className={`text-sm ${reentryFlag ? "text-red-400" : ""}`}>
                          {reentryFlag ? "退会後1年以内のため再入会不可" : "再入会申込（退会後1年以上経過・承認可）"}
                        </div>
                        <div className="text-sm mt-1">会員番号 #{history.withdrawal.memberNo} として在籍 → {history.withdrawal.withdrawnDate} 退会</div>
                        <div className="font-display text-xs text-[var(--color-mute)] mt-1.5">退会理由: {history.withdrawal.reason}</div>
                      </div>
                    )}
                    {history.rejections.map(rej => (
                      <div key={rej.id} className="mt-3 pt-3 border-t border-[var(--color-line)]">
                        <div className="font-display text-[10px] text-red-400 mb-1">過去の否決履歴（{rej.id}）</div>
                        <div className="text-sm">{rej.reason}</div>
                        <div className="font-display text-xs text-[var(--color-mute)] mt-1.5">申込 {rej.applied} → 否決 {rej.rejectedAt}</div>
                      </div>
                    ))}
                  </div>

                  {/* 審査スコア */}
                  <div className="card p-5 mb-5">
                    <div className="font-display text-[10px] text-[var(--color-accent-deep)] mb-3">審査スコア</div>
                    <div className="grid grid-cols-2 gap-3 mb-3">
                      {([
                        { key: "face" as const, l: "顔写真の印象" },
                        { key: "insta" as const, l: "Instagram" },
                        { key: "writing" as const, l: "文章の質・誠実さ" },
                      ]).map(f => (
                        <div key={f.key}>
                          <label className="font-display text-[10px] text-[var(--color-mute)] block mb-1">{f.l}（手入力）</label>
                          <select value={scores[detail.id]?.[f.key] ?? ""} onChange={e => updateScore(detail.id, f.key, e.target.value as Rating)}
                            className="w-full bg-[var(--color-bg)] border border-[var(--color-line)] rounded-lg px-3 py-2 text-sm outline-none focus:border-[var(--color-accent)]/50">
                            <option value="" disabled>選択してください</option>
                            {(["circle","triangle","cross"] as const).map(rating => (
                              <option key={rating} value={rating}>{RATING_SYMBOL[rating]}</option>
                            ))}
                          </select>
                        </div>
                      ))}
                      {[
                        { l: "職業（自動）", v: RATING_SYMBOL[jobRating(detail.job)] },
                        { l: "年収（自動）", v: RATING_SYMBOL[incomeRating(detail.income)] },
                        { l: "年齢（自動）", v: RATING_SYMBOL[ageRating(calcAge(detail.dob))] },
                      ].map(r => (
                        <div key={r.l}>
                          <label className="font-display text-[10px] text-[var(--color-mute)] block mb-1">{r.l}</label>
                          <div className="w-full bg-[var(--color-bg-soft)] border border-[var(--color-line)] rounded-lg px-3 py-2 text-sm text-center">{r.v}</div>
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center justify-between pt-3 border-t border-[var(--color-line)]">
                      <div>
                        <div className="font-display text-[10px] text-[var(--color-mute)] mb-1">合計点数</div>
                        <div className="num text-2xl text-[var(--color-accent-deep)]">{totals[detail.id] ?? "—"}{totals[detail.id] !== undefined && "点"}</div>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => calcTotal(detail)} className="btn-outline !py-2 text-xs">計算する</button>
                        <button onClick={() => saveScore(detail.id)} className="btn-primary !py-2 text-xs">保存</button>
                      </div>
                    </div>
                    {savedIds.has(detail.id) && (
                      <div className="font-display text-[10px] text-[var(--color-accent-deep)] mt-2">✓ 保存しました</div>
                    )}
                  </div>

                  <div className="mb-6">
                    <div className="num text-xs text-[var(--color-mute)] mb-1">{detail.id}</div>
                    <h2 className="font-display text-2xl">{detail.name}</h2>
                    <div className="font-display text-xs text-[var(--color-mute)] mt-1">{detail.kana} · {detail.applied} 申込</div>
                  </div>

                  <div className="grid grid-cols-3 gap-3 mb-5">
                    {[
                      {l:"申込地域",v:detail.region},{l:"年齢",v:`${calcAge(detail.dob)}歳`},{l:"生年月日",v:detail.dob},
                      {l:"性別",v:detail.gender},{l:"メールアドレス",v:detail.email},{l:"電話番号",v:detail.tel},
                      {l:"Instagram ID",v:"@"+detail.insta},{l:"都道府県",v:detail.pref},{l:"職業",v:detail.job},
                      {l:"具体的な業種",v:detail.industry},{l:"勤務先",v:detail.company||"—"},{l:"役職・肩書き",v:detail.title||"—"},
                      {l:"年収",v:detail.income},{l:"知ったきっかけ",v:detail.howFound},{l:"紹介者",v:detail.referee},
                    ].map(r=>(
                      <div key={r.l} className="card p-4">
                        <div className="font-display text-[10px] text-[var(--color-mute)] mb-1">{r.l}</div>
                        <div className="text-sm break-all">{r.v}</div>
                      </div>
                    ))}
                  </div>
                  <div className="card p-5 mb-4">
                    <div className="font-display text-[10px] text-[var(--color-accent-deep)] mb-2">ご入会の理由</div>
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
                    <div className="font-display text-[10px] text-[var(--color-accent-deep)] mb-3">身分証明書・顔写真</div>
                    {detail.docs ? (
                      <div className="flex items-center gap-3">
                        <div className="w-24 h-16 rounded-lg bg-[var(--color-line)] flex items-center justify-center text-xs text-[var(--color-mute)]">身分証明書</div>
                        <div className="w-24 h-16 rounded-lg bg-[var(--color-line)] flex items-center justify-center text-xs text-[var(--color-mute)]">顔写真</div>
                        <div className="font-display text-xs text-[var(--color-accent-deep)]">✓ アップロード済み</div>
                      </div>
                    ) : (
                      <div className="font-display text-xs text-red-400">⚠ 書類未提出</div>
                    )}
                  </div>
                </div>
              </div>
            );
          })()}
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
                </div>
                <div className="card p-5 mb-4 border-red-400/20">
                  <div className="font-display text-[10px] text-red-400 mb-1">否決理由</div>
                  <div className="text-sm">{rejDetail.reason}</div>
                  <div className="font-display text-[10px] text-[var(--color-mute)] mt-2">否決日: {rejDetail.rejectedAt}</div>
                </div>

                {/* 審査スコア（否決済みのため非活性） */}
                <div className="card p-5 mb-4 opacity-60">
                  <div className="font-display text-[10px] text-[var(--color-mute)] mb-3">審査スコア</div>
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    {([
                      { l: "顔写真の印象（手入力）" },
                      { l: "Instagram（手入力）" },
                      { l: "文章の質・誠実さ（手入力）" },
                    ]).map(f => (
                      <div key={f.l}>
                        <label className="font-display text-[10px] text-[var(--color-mute)] block mb-1">{f.l}</label>
                        <div className="flex gap-1.5">
                          {(["circle","triangle","cross"] as const).map(rating => (
                            <button key={rating} type="button" disabled
                              className="flex-1 py-2 rounded-lg border border-[var(--color-line)] bg-[var(--color-bg-soft)] text-sm text-[var(--color-mute)] cursor-not-allowed">
                              {RATING_SYMBOL[rating]}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                    {[
                      { l: "職業（自動）", v: RATING_SYMBOL[jobRating(rejDetail.job)] },
                      { l: "年収（自動）", v: RATING_SYMBOL[incomeRating(rejDetail.income)] },
                      { l: "年齢（自動）", v: RATING_SYMBOL[ageRating(calcAge(rejDetail.dob))] },
                    ].map(r => (
                      <div key={r.l}>
                        <label className="font-display text-[10px] text-[var(--color-mute)] block mb-1">{r.l}</label>
                        <div className="w-full bg-[var(--color-bg-soft)] border border-[var(--color-line)] rounded-lg px-3 py-2 text-sm text-center">{r.v}</div>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-[var(--color-line)]">
                    <div>
                      <div className="font-display text-[10px] text-[var(--color-mute)] mb-1">合計点数</div>
                      <div className="num text-2xl text-[var(--color-mute)]">—</div>
                    </div>
                    <button disabled className="btn-outline !py-2 text-xs opacity-40 cursor-not-allowed">計算する</button>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 mb-4">
                  {[
                    {l:"年齢",v:`${calcAge(rejDetail.dob)}歳`},{l:"生年月日",v:rejDetail.dob},{l:"性別",v:rejDetail.gender},
                    {l:"メールアドレス",v:rejDetail.email},{l:"電話番号",v:rejDetail.tel},{l:"都道府県",v:rejDetail.pref},
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
                  <div className="font-display text-[10px] text-[var(--color-accent-deep)] mb-2">ご入会の理由</div>
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

      {tab === "settings" && (
        <div className="flex-1 overflow-y-auto px-8 py-6">
          <div className="max-w-[880px]">
            <div className="mb-5">
              <h2 className="font-display text-lg mb-1">審査スコア設定</h2>
              <p className="font-display text-xs text-[var(--color-mute)]">各項目の判定（〇・△・✖）ごとに配点を設定します。職業・年収・年齢は申込内容から自動判定され、この配点が申込詳細の審査スコアに反映されます。</p>
            </div>
            <div className="card overflow-hidden mb-4">
              <table className="w-full text-sm table-fixed">
                <thead>
                  <tr className="font-display text-[10px] text-[var(--color-mute)] text-left border-b border-[var(--color-line)]">
                    <th className="px-3 py-2 w-[26%]" rowSpan={2}>項目名</th>
                    <th className="px-2 py-2 text-center border-l border-[var(--color-line)]" colSpan={3}>男性</th>
                    <th className="px-2 py-2 text-center border-l border-[var(--color-line)]" colSpan={3}>女性</th>
                    <th className="px-3 py-2 w-16" rowSpan={2}></th>
                  </tr>
                  <tr className="font-display text-[9px] text-[var(--color-mute)] text-center border-b border-[var(--color-line)]">
                    <th className="px-1 py-2 border-l border-[var(--color-line)]">〇</th>
                    <th className="px-1 py-2">△</th>
                    <th className="px-1 py-2">✖</th>
                    <th className="px-1 py-2 border-l border-[var(--color-line)]">〇</th>
                    <th className="px-1 py-2">△</th>
                    <th className="px-1 py-2">✖</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--color-line)]">
                  {scoreSettings.map(c => (
                    <tr key={c.id}>
                      <td className="px-3 py-3">
                        <input value={c.name} onChange={e => updateCriterionName(c.id, e.target.value)}
                          placeholder="項目名を入力" disabled={FIXED_CRITERIA_IDS.includes(c.id)}
                          className="w-full bg-[var(--color-bg)] border border-[var(--color-line)] rounded-lg px-2 py-1.5 text-sm outline-none focus:border-[var(--color-accent)]/50 placeholder-[var(--color-mute)] disabled:opacity-70 disabled:cursor-not-allowed" />
                      </td>
                      {(["circle","triangle","cross"] as const).map((field,i) => (
                        <td key={`male-${field}`} className={`px-1 py-3 ${i===0?"border-l border-[var(--color-line)]":""}`}>
                          <input type="number" value={c.male[field]} onChange={e => updateCriterionScore(c.id, "male", field, e.target.value)}
                            className="w-full max-w-14 mx-auto block bg-[var(--color-bg)] border border-[var(--color-line)] rounded-lg px-1 py-1.5 text-sm text-center outline-none focus:border-[var(--color-accent)]/50" />
                        </td>
                      ))}
                      {(["circle","triangle","cross"] as const).map((field,i) => (
                        <td key={`female-${field}`} className={`px-1 py-3 ${i===0?"border-l border-[var(--color-line)]":""}`}>
                          <input type="number" value={c.female[field]} onChange={e => updateCriterionScore(c.id, "female", field, e.target.value)}
                            className="w-full max-w-14 mx-auto block bg-[var(--color-bg)] border border-[var(--color-line)] rounded-lg px-1 py-1.5 text-sm text-center outline-none focus:border-[var(--color-accent)]/50" />
                        </td>
                      ))}
                      <td className="px-3 py-3 text-right">
                        {!["job","income","age"].includes(c.id) && (
                          <button onClick={() => removeCriterion(c.id)} className="font-display text-[10px] px-2 py-1 rounded border border-red-400/30 text-red-400 hover:bg-red-400/8 transition whitespace-nowrap">削除</button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex items-center justify-between">
              <button onClick={addCriterion} className="btn-outline !py-2 text-xs">＋ 項目を追加する</button>
              <div className="flex items-center gap-3">
                {settingsSaved && <span className="font-display text-[10px] text-[var(--color-accent-deep)]">✓ 保存しました</span>}
                <button onClick={saveSettings} className="btn-primary !py-2 text-xs">設定を保存する</button>
              </div>
            </div>
          </div>
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
