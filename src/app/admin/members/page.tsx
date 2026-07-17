"use client";
import { useState } from "react";
import Link from "next/link";

const JOBS = ["会社員","経営者・役員","フリーランス","医師・医療従事者","弁護士・士業","クリエイター","ITエンジニア","マーケター","戦略コンサルタント","デザイナー","学生","その他"];

type EngageLevel = "高" | "中" | "低";

interface Member {
  no:string; name:string; kana:string; branch:string; rank:string; vip:boolean;
  status:string; pay:string; joined:string; approvedDate:string; email:string; tel:string; insta:string;
  univaPayId:string; pt:number; job:string; industry:string; company:string; title:string;
  pref:string; income:string; age:number; dob:string; gender:string; region:string;
  events:number; lotteryWins:number; referee:string; clubs:string[]; interests:string[];
  entryReasons:string[]; howFound:string; selfIntro:string; lifestyle:string; desired:string;
  lastActivity:string; couponUses:number; referralCount:number;
  eventHistory:{ title:string; date:string }[];
  couponHistory:{ name:string; store:string; date:string }[];
  withdrawReason?: string;
}

function calcEngage(m: Member): EngageLevel {
  const daysSince = Math.floor((new Date("2026-07-12").getTime() - new Date(m.lastActivity.replace(/\./g,"-")).getTime()) / 86400000);
  if (daysSince > 90) return "低";
  if (m.events >= 8) return "高";
  if (m.events >= 3) return "中";
  return "低";
}

function calcMonths(joined: string): number {
  const [y,mo] = joined.split(".").map(Number);
  return (2026 - y) * 12 + (7 - mo);
}

const allMembers: Member[] = [
  { no:"0824", name:"青山 陸", kana:"アオヤマ リク", branch:"東京", rank:"GOLD", vip:false, status:"在籍中", pay:"支払済", joined:"2025.06.04", approvedDate:"2025.06.01", email:"aoyama@example.com", tel:"08012345678", insta:"aoyama_riku", univaPayId:"UP-0824-A1B2", pt:1240, job:"戦略コンサルタント", industry:"コンサルティング", company:"○○コンサルティング", title:"シニアマネージャー", pref:"東京", income:"1500〜2000万", age:36, dob:"1989/12/05", gender:"男性", region:"東京", events:7, lotteryWins:2, referee:"中島 誉（#0830）", clubs:["ワインクラブ","アート部"], interests:["ワイン","アート"], entryReasons:["ビジネスやキャリアに関するつながり","趣味や興味が合う人との交流"], howFound:"COMMONS Instagram", selfIntro:"コンサルタントとして活動中。休日はワインと美術館巡りを楽しんでいます。", lifestyle:"仕事仲間以外の交友が少なく、趣味の話ができる場所を探していました。", desired:"ワインや文化的な趣味を共有できる仲間を作り、充実した週末を過ごしたい。", lastActivity:"2026.07.08", couponUses:4, referralCount:1, eventHistory:[{title:"COMMONS MUSIC BAR",date:"2026.07.08"},{title:"Coffee Cupping #6",date:"2026.06.20"},{title:"Wine Salon",date:"2026.05.15"},{title:"フォトウォーク",date:"2026.04.10"},{title:"Coffee Cupping #5",date:"2026.03.22"}], couponHistory:[{name:"ドリンク1杯無料",store:"SOUND BAR HOWL",date:"2026.07.08"},{name:"ドリップコーヒー無料",store:"Coffee Commons",date:"2026.06.20"},{name:"ワイン10%OFF",store:"La Cave",date:"2026.05.15"},{name:"ドリンク1杯無料",store:"SOUND BAR HOWL",date:"2026.04.10"}] },
  { no:"0827", name:"佐藤 美咲", kana:"サトウ ミサキ", branch:"東京", rank:"PLATINUM", vip:true, status:"在籍中", pay:"支払済", joined:"2025.05.27", approvedDate:"2025.05.24", email:"sato@example.com", tel:"09023456789", insta:"misaki_commons", univaPayId:"UP-0827-C3D4", pt:3870, job:"マーケター", industry:"広告・マーケティング", company:"株式会社△△", title:"マネージャー", pref:"東京", income:"800〜1000万", age:31, dob:"1994/03/18", gender:"女性", region:"東京", events:18, lotteryWins:5, referee:"なし", clubs:["コーヒークラブ","フォトウォーク部"], interests:["コーヒー","写真"], entryReasons:["趣味や興味が合う人との交流","新しい体験・イベントを楽しみたい"], howFound:"COMMONS Instagram", selfIntro:"マーケターとして活動。コーヒーと写真が趣味です。", lifestyle:"会社以外のコミュニティがなく、同じ趣味を持つ仲間を探していました。", desired:"コーヒーや写真の仲間を作り、一緒にイベントを楽しみたい。", lastActivity:"2026.07.10", couponUses:12, referralCount:2, eventHistory:[{title:"Coffee Cupping #7",date:"2026.07.10"},{title:"COMMONS MUSIC BAR",date:"2026.07.01"},{title:"Wine Salon",date:"2026.06.15"},{title:"フォトウォーク",date:"2026.06.05"},{title:"Coffee Cupping #6",date:"2026.05.20"}], couponHistory:[{name:"ドリップコーヒー無料",store:"Coffee Commons",date:"2026.07.10"},{name:"ドリンク1杯無料",store:"SOUND BAR HOWL",date:"2026.07.01"},{name:"ワイン10%OFF",store:"La Cave",date:"2026.06.15"},{name:"ドリップコーヒー無料",store:"Coffee Commons",date:"2026.06.05"},{name:"ドリンク1杯無料",store:"SOUND BAR HOWL",date:"2026.05.20"}] },
  { no:"0830", name:"中島 誉", kana:"ナカジマ ホマレ", branch:"大阪", rank:"GOLD", vip:false, status:"在籍中", pay:"支払済", joined:"2025.05.18", approvedDate:"2025.05.15", email:"nakajima@example.com", tel:"08034567890", insta:"homare_nkjm", univaPayId:"UP-0830-E5F6", pt:980, job:"経営者・役員", industry:"製造業", company:"□□製造", title:"代表取締役", pref:"大阪", income:"2000万以上", age:44, dob:"1981/07/22", gender:"男性", region:"大阪", events:9, lotteryWins:1, referee:"なし", clubs:["ワインクラブ","ジャズ部"], interests:["ワイン","音楽"], entryReasons:["ビジネスやキャリアに関するつながり"], howFound:"COMMONS X", selfIntro:"製造業の経営者。ビジネス外の交流を大切にしています。", lifestyle:"経営者同士以外の交流機会が少なく感じていました。", desired:"ワインやジャズを通じた豊かな人間関係を築きたい。", lastActivity:"2026.07.02", couponUses:6, referralCount:1, eventHistory:[{title:"Wine Salon",date:"2026.07.02"},{title:"ジャズ鑑賞会",date:"2026.06.10"},{title:"Coffee Cupping #6",date:"2026.05.18"},{title:"Wine Salon #5",date:"2026.04.20"},{title:"COMMONS MUSIC BAR",date:"2026.03.15"}], couponHistory:[{name:"ワイン10%OFF",store:"La Cave",date:"2026.07.02"},{name:"ドリンク1杯無料",store:"SOUND BAR HOWL",date:"2026.06.10"},{name:"ドリップコーヒー無料",store:"Coffee Commons",date:"2026.05.18"},{name:"ワイン10%OFF",store:"La Cave",date:"2026.04.20"}] },
  { no:"0843", name:"山本 直", kana:"ヤマモト ナオ", branch:"東京", rank:"SILVER", vip:false, status:"在籍中", pay:"遅延", joined:"2025.07.12", approvedDate:"2025.07.10", email:"yamamoto@example.com", tel:"07045678901", insta:"nao_ymt", univaPayId:"UP-0843-G7H8", pt:450, job:"会社員", industry:"金融", company:"○○銀行", title:"", pref:"東京", income:"400〜600万", age:29, dob:"1996/11/08", gender:"男性", region:"東京", events:3, lotteryWins:0, referee:"なし", clubs:[], interests:["アウトドア"], entryReasons:["異性・同性問わず新しい友人づくり"], howFound:"COMMONS Instagram", selfIntro:"銀行員。週末はアウトドアを楽しんでいます。", lifestyle:"休日に楽しめる場所を探していました。", desired:"アウトドアが好きな仲間を作りたい。", lastActivity:"2026.04.15", couponUses:1, referralCount:0, eventHistory:[{title:"フォトウォーク",date:"2026.04.15"},{title:"Coffee Cupping #5",date:"2026.02.10"},{title:"COMMONS MUSIC BAR",date:"2025.12.20"}], couponHistory:[{name:"ドリップコーヒー無料",store:"Coffee Commons",date:"2026.02.10"}] },
  { no:"0851", name:"森田 桂", kana:"モリタ ケイ", branch:"大阪", rank:"GOLD", vip:false, status:"在籍中", pay:"支払済", joined:"2025.08.02", approvedDate:"2025.07.30", email:"morita@example.com", tel:"08056789012", insta:"kei_morita", univaPayId:"UP-0851-I9J0", pt:2100, job:"医師・医療従事者", industry:"医療・福祉", company:"△△病院", title:"医師", pref:"大阪", income:"1500〜2000万", age:38, dob:"1987/02/14", gender:"男性", region:"大阪", events:14, lotteryWins:3, referee:"中島 誉（#0830）", clubs:["ワインクラブ"], interests:["ワイン","日本酒"], entryReasons:["職場・既存コミュニティ以外の居場所づくり"], howFound:"COMMONS TikTok", selfIntro:"医師として勤務。オフの時間はワインや日本酒を楽しんでいます。", lifestyle:"職場以外のリラックスできる場所を探していました。", desired:"お酒を共通の趣味とする仲間と定期的に交流したい。", lastActivity:"2026.07.07", couponUses:9, referralCount:1, eventHistory:[{title:"Wine Salon",date:"2026.07.07"},{title:"Coffee Cupping #7",date:"2026.07.04"},{title:"COMMONS MUSIC BAR",date:"2026.06.18"},{title:"Wine Salon #5",date:"2026.05.30"},{title:"ジャズ鑑賞会",date:"2026.05.10"}], couponHistory:[{name:"ワイン10%OFF",store:"La Cave",date:"2026.07.07"},{name:"ドリップコーヒー無料",store:"Coffee Commons",date:"2026.07.04"},{name:"ドリンク1杯無料",store:"SOUND BAR HOWL",date:"2026.06.18"},{name:"ワイン10%OFF",store:"La Cave",date:"2026.05.30"},{name:"ドリップコーヒー無料",store:"Coffee Commons",date:"2026.05.10"}] },
  { no:"0873", name:"村瀬 史奈", kana:"ムラセ フミナ", branch:"大阪", rank:"BRONZE", vip:false, status:"退会済", pay:"支払済", joined:"2026.01.04", approvedDate:"2026.01.02", email:"murase@example.com", tel:"09067890123", insta:"fumina_mrsw", univaPayId:"UP-0873-K1L2", pt:120, job:"フリーランス", industry:"デザイン・クリエイティブ", company:"", title:"", pref:"大阪", income:"600〜800万", age:27, dob:"1998/09/30", gender:"女性", region:"大阪", events:2, lotteryWins:0, referee:"森田 桂（#0851）", clubs:["アート部","コーヒークラブ"], interests:["アート","コーヒー"], entryReasons:["趣味や興味が合う人との交流","新しい体験・イベントを楽しみたい"], howFound:"COMMONS Instagram", selfIntro:"フリーランスデザイナー。アートとコーヒーが好きです。", lifestyle:"クリエイター仲間との交流が少なく感じていました。", desired:"アートやデザインが好きな仲間と刺激し合いたい。", lastActivity:"2026.03.20", couponUses:1, referralCount:0, eventHistory:[{title:"アートギャラリー巡り",date:"2026.03.20"},{title:"Coffee Cupping #5",date:"2026.02.14"}], couponHistory:[{name:"ドリップコーヒー無料",store:"Coffee Commons",date:"2026.02.14"}], withdrawReason:"料金が高いと感じた。他のコミュニティと掛け持ちが難しくなった。" },
  { no:"0880", name:"田中 康介", kana:"タナカ コウスケ", branch:"東京", rank:"GOLD", vip:false, status:"在籍中", pay:"支払済", joined:"2026.02.14", approvedDate:"2026.02.11", email:"tanaka@example.com", tel:"08078901234", insta:"kousuke_tnk", univaPayId:"UP-0880-M3N4", pt:1680, job:"ITエンジニア", industry:"IT・ソフトウェア", company:"株式会社□□", title:"テックリード", pref:"東京", income:"800〜1000万", age:33, dob:"1992/06/01", gender:"男性", region:"東京", events:11, lotteryWins:4, referee:"佐藤 美咲（#0827）", clubs:["コーヒークラブ","フォトウォーク部"], interests:["コーヒー","写真"], entryReasons:["趣味や興味が合う人との交流"], howFound:"COMMONS YouTube", selfIntro:"エンジニア。コーヒーと写真が趣味で、週末は街歩きをしています。", lifestyle:"IT業界以外の人との交流機会を増やしたかった。", desired:"趣味を通じて多様なバックグラウンドの人と出会いたい。", lastActivity:"2026.07.08", couponUses:8, referralCount:0, eventHistory:[{title:"Coffee Cupping #7",date:"2026.07.08"},{title:"フォトウォーク",date:"2026.07.01"},{title:"COMMONS MUSIC BAR",date:"2026.06.12"},{title:"Coffee Cupping #6",date:"2026.05.25"},{title:"フォトウォーク #4",date:"2026.05.05"}], couponHistory:[{name:"ドリップコーヒー無料",store:"Coffee Commons",date:"2026.07.08"},{name:"ドリンク1杯無料",store:"SOUND BAR HOWL",date:"2026.07.01"},{name:"ドリップコーヒー無料",store:"Coffee Commons",date:"2026.06.12"},{name:"ドリンク1杯無料",store:"SOUND BAR HOWL",date:"2026.05.25"},{name:"ドリップコーヒー無料",store:"Coffee Commons",date:"2026.05.05"}] },
  { no:"0885", name:"山本 彩花", kana:"ヤマモト アヤカ", branch:"東京", rank:"PLATINUM", vip:true, status:"在籍中", pay:"支払済", joined:"2025.03.01", approvedDate:"2025.02.26", email:"yamamoto2@example.com", tel:"07089012345", insta:"ayaka_commons", univaPayId:"UP-0885-O5P6", pt:4200, job:"弁護士・士業", industry:"法律・法務", company:"○○法律事務所", title:"弁護士", pref:"東京", income:"1500〜2000万", age:35, dob:"1990/04/20", gender:"女性", region:"東京", events:24, lotteryWins:6, referee:"なし", clubs:["ワインクラブ","アート部","ジャズ部"], interests:["ワイン","アート","音楽"], entryReasons:["ビジネスやキャリアに関するつながり","職場・既存コミュニティ以外の居場所づくり"], howFound:"COMMONS Threads", selfIntro:"弁護士。多様な文化・芸術に興味があります。", lifestyle:"仕事一辺倒の生活から脱却したかった。", desired:"質の高い出会いを通じて、豊かな私生活を実現したい。", lastActivity:"2026.07.11", couponUses:15, referralCount:3, eventHistory:[{title:"Wine Salon",date:"2026.07.11"},{title:"Coffee Cupping #7",date:"2026.07.05"},{title:"アートギャラリー巡り",date:"2026.06.28"},{title:"COMMONS MUSIC BAR",date:"2026.06.15"},{title:"ジャズ鑑賞会",date:"2026.06.02"}], couponHistory:[{name:"ワイン10%OFF",store:"La Cave",date:"2026.07.11"},{name:"ドリップコーヒー無料",store:"Coffee Commons",date:"2026.07.05"},{name:"ドリンク1杯無料",store:"SOUND BAR HOWL",date:"2026.06.28"},{name:"ワイン10%OFF",store:"La Cave",date:"2026.06.15"},{name:"ドリンク1杯無料",store:"SOUND BAR HOWL",date:"2026.06.02"}] },
  { no:"0891", name:"伊藤 健", kana:"イトウ ケン", branch:"大阪", rank:"SILVER", vip:false, status:"在籍中", pay:"遅延", joined:"2025.09.20", approvedDate:"2025.09.17", email:"ito@example.com", tel:"09090123456", insta:"ken_ito", univaPayId:"UP-0891-Q7R8", pt:340, job:"会社員", industry:"商社", company:"△△商事", title:"", pref:"大阪", income:"400〜600万", age:31, dob:"1994/08/11", gender:"男性", region:"大阪", events:4, lotteryWins:1, referee:"なし", clubs:[], interests:["ウイスキー"], entryReasons:["異性・同性問わず新しい友人づくり"], howFound:"COMMONS Instagram", selfIntro:"商社勤務。ウイスキーバー巡りが趣味です。", lifestyle:"趣味の場での出会いが少なく感じていました。", desired:"ウイスキーや飲食を通じた気の合う仲間を作りたい。", lastActivity:"2026.05.10", couponUses:2, referralCount:0, eventHistory:[{title:"COMMONS MUSIC BAR",date:"2026.05.10"},{title:"Wine Salon",date:"2026.03.15"},{title:"Coffee Cupping #5",date:"2026.02.20"},{title:"COMMONS MUSIC BAR #2",date:"2026.01.10"}], couponHistory:[{name:"ドリンク1杯無料",store:"SOUND BAR HOWL",date:"2026.05.10"},{name:"ドリップコーヒー無料",store:"Coffee Commons",date:"2026.02.20"}] },
  { no:"0898", name:"中村 優一", kana:"ナカムラ ユウイチ", branch:"東京", rank:"GOLD", vip:false, status:"在籍中", pay:"支払済", joined:"2025.11.05", approvedDate:"2025.11.02", email:"nakamura@example.com", tel:"08001234567", insta:"yuichi_nkm", univaPayId:"UP-0898-S9T0", pt:1890, job:"経営者・役員", industry:"不動産", company:"□□不動産", title:"代表取締役", pref:"東京", income:"2000万以上", age:46, dob:"1979/01/25", gender:"男性", region:"東京", events:8, lotteryWins:2, referee:"田中 康介（#0880）", clubs:["ワインクラブ"], interests:["ワイン","アウトドア"], entryReasons:["ビジネスやキャリアに関するつながり"], howFound:"COMMONS X", selfIntro:"不動産会社経営者。ゴルフとワインが趣味。", lifestyle:"経営仲間以外の多様な人とつながりたかった。", desired:"ビジネス以外の繋がりを大切にした豊かな人生を送りたい。", lastActivity:"2026.06.28", couponUses:5, referralCount:1, eventHistory:[{title:"Wine Salon",date:"2026.06.28"},{title:"COMMONS MUSIC BAR",date:"2026.06.05"},{title:"Coffee Cupping #6",date:"2026.05.18"},{title:"Wine Salon #4",date:"2026.04.22"},{title:"フォトウォーク",date:"2026.03.30"}], couponHistory:[{name:"ワイン10%OFF",store:"La Cave",date:"2026.06.28"},{name:"ドリンク1杯無料",store:"SOUND BAR HOWL",date:"2026.06.05"},{name:"ドリップコーヒー無料",store:"Coffee Commons",date:"2026.05.18"},{name:"ワイン10%OFF",store:"La Cave",date:"2026.04.22"},{name:"ドリップコーヒー無料",store:"Coffee Commons",date:"2026.03.30"}] },
];

const engageBadge: Record<EngageLevel, string> = {
  "高": "bg-green-500/15 text-green-400 border-green-500/30",
  "中": "bg-[var(--color-accent)]/15 text-[var(--color-accent-deep)] border-[var(--color-accent)]/30",
  "低": "bg-red-400/10 text-red-400 border-red-400/20",
};

type SortKey = "no"|"name"|"joined"|"approvedDate"|"events"|"pt"|"lastActivity";
type DetailTab = "basic"|"profile"|"docs"|"activity";

export default function MembersPage() {
  const [search, setSearch] = useState("");
  const [showFilter, setShowFilter] = useState(false);
  const [selected, setSelected] = useState<string|null>(null);
  const [sortKey, setSortKey] = useState<SortKey>("no");
  const [detailTab, setDetailTab] = useState<DetailTab>("basic");

  const [fBranch,setFBranch]=useState(""); const [fRank,setFRank]=useState("");
  const [fStatus,setFStatus]=useState(""); const [fPay,setFPay]=useState("");
  const [fJoinFrom,setFJoinFrom]=useState(""); const [fJoinTo,setFJoinTo]=useState("");
  const [fApproveFrom,setFApproveFrom]=useState(""); const [fApproveTo,setFApproveTo]=useState("");
  const [fIncome,setFIncome]=useState(""); const [fPref,setFPref]=useState("");
  const [fJob,setFJob]=useState(""); const [fVip,setFVip]=useState(false); const [fEngage,setFEngage]=useState("");

  const filtered = allMembers.filter(m=>{
    if(search && !m.name.includes(search) && !m.no.includes(search) && !m.kana.includes(search)) return false;
    if(fBranch && m.branch!==fBranch) return false;
    if(fRank && m.rank!==fRank) return false;
    if(fStatus && m.status!==fStatus) return false;
    if(fPay && m.pay!==fPay) return false;
    if(fJoinFrom && m.joined<fJoinFrom.replace(/-/g,".")) return false;
    if(fJoinTo && m.joined>fJoinTo.replace(/-/g,".")) return false;
    if(fApproveFrom && m.approvedDate<fApproveFrom.replace(/-/g,".")) return false;
    if(fApproveTo && m.approvedDate>fApproveTo.replace(/-/g,".")) return false;
    if(fIncome && m.income!==fIncome) return false;
    if(fPref && m.pref!==fPref) return false;
    if(fJob && m.job!==fJob) return false;
    if(fVip && !m.vip) return false;
    if(fEngage && calcEngage(m)!==fEngage) return false;
    return true;
  });

  const sorted=[...filtered].sort((a,b)=>{
    if(sortKey==="no") return a.no.localeCompare(b.no);
    if(sortKey==="name") return a.name.localeCompare(b.name);
    if(sortKey==="joined") return a.joined.localeCompare(b.joined);
    if(sortKey==="approvedDate") return a.approvedDate.localeCompare(b.approvedDate);
    if(sortKey==="events") return b.events-a.events;
    if(sortKey==="pt") return b.pt-a.pt;
    if(sortKey==="lastActivity") return b.lastActivity.localeCompare(a.lastActivity);
    return 0;
  });

  const detail=selected?allMembers.find(m=>m.no===selected):null;
  function clearFilters(){setFBranch("");setFRank("");setFStatus("");setFPay("");setFJoinFrom("");setFJoinTo("");setFApproveFrom("");setFApproveTo("");setFIncome("");setFPref("");setFJob("");setFVip(false);setFEngage("");}
  const activeFilterCount=[fBranch,fRank,fStatus,fPay,fJoinFrom,fJoinTo,fApproveFrom,fApproveTo,fIncome,fPref,fJob,fEngage].filter(Boolean).length+(fVip?1:0);

  return (
    <div className="flex h-screen overflow-hidden">
      <div className={`flex-1 flex flex-col overflow-hidden ${detail?"max-w-[calc(100%-420px)]":""}`}>
        <div className="px-8 py-6 border-b border-[var(--color-line)] flex items-center justify-between flex-none">
          <div>
            <div className="font-display text-[10px] tracking-[0.12em] text-[var(--color-accent-deep)]">MEMBER</div>
            <h1 className="font-display text-2xl mt-0.5">会員管理</h1>
          </div>
          <div className="flex items-center gap-3">
            <button className="btn-outline !py-2 text-xs">CSV出力</button>
            <Link href="/admin/members/add" className="btn-primary !py-2 text-xs">＋ 会員追加</Link>
          </div>
        </div>

        <div className="px-8 py-3 border-b border-[var(--color-line)] flex items-center gap-3 flex-none flex-wrap">
          <button onClick={()=>setShowFilter(!showFilter)}
            className={`flex items-center gap-1.5 font-display text-xs px-4 py-2 rounded-full border transition ${showFilter||activeFilterCount>0?"bg-[var(--color-accent)]/15 border-[var(--color-accent)] text-[var(--color-accent-deep)]":"border-[var(--color-line)] text-[var(--color-mute)]"}`}>
            絞り込み {activeFilterCount>0&&<span className="w-4 h-4 rounded-full bg-[var(--color-accent)] text-[var(--color-bg)] text-[9px] flex items-center justify-center">{activeFilterCount}</span>}
          </button>
          {activeFilterCount>0&&<button onClick={clearFilters} className="font-display text-xs text-[var(--color-mute)] hover:text-red-400">クリア</button>}
          <div className="flex gap-1.5 ml-2">
            {["高","中","低"].map(e=>(
              <button key={e} onClick={()=>setFEngage(fEngage===e?"":e)}
                className={`font-display text-[10px] px-3 py-1.5 rounded-full border transition ${fEngage===e?engageBadge[e as EngageLevel]:"border-[var(--color-line)] text-[var(--color-mute)]"}`}>
                エンゲージ{e}
              </button>
            ))}
          </div>
          <div className="ml-auto flex items-center gap-2">
            <span className="font-display text-xs text-[var(--color-mute)]">並び替え:</span>
            <select value={sortKey} onChange={e=>setSortKey(e.target.value as SortKey)} className="bg-transparent border border-[var(--color-line)] rounded-full px-3 py-1.5 text-xs font-display outline-none">
              <option value="no">会員番号</option><option value="name">氏名</option>
              <option value="joined">入会日</option><option value="approvedDate">承認日</option>
              <option value="events">参加回数</option><option value="point">ポイント</option>
              <option value="lastActivity">最終活動日</option>
            </select>
          </div>
        </div>

        {showFilter&&(
          <div className="px-8 py-4 border-b border-[var(--color-line)] bg-[var(--color-bg-soft)] flex-none">
            <div className="grid grid-cols-4 gap-4 max-w-[900px]">
              {/* Search in filter */}
              <div className="col-span-4">
                <label className="font-display text-[10px] text-[var(--color-mute)] block mb-1">番号・氏名・フリガナで検索</label>
                <input className="w-full bg-[var(--color-bg)] border border-[var(--color-line)] rounded-lg px-3 py-1.5 text-xs outline-none focus:border-[var(--color-accent)]/50 placeholder-[var(--color-mute)]"
                  placeholder="番号・氏名・フリガナ" value={search} onChange={e=>setSearch(e.target.value)} />
              </div>
              {[
                {l:"支部",v:fBranch,set:setFBranch,opts:["","東京","大阪"]},
                {l:"ランク",v:fRank,set:setFRank,opts:["","BRONZE","SILVER","GOLD","PLATINUM"]},
                {l:"ステータス",v:fStatus,set:setFStatus,opts:["","在籍中","退会済"]},
                {l:"支払い",v:fPay,set:setFPay,opts:["","支払済","遅延"]},
                {l:"年収",v:fIncome,set:setFIncome,opts:["","400万未満","400〜600万","600〜800万","800〜1000万","1000〜1500万","1500〜2000万","2000万以上"]},
                {l:"都道府県",v:fPref,set:setFPref,opts:["","東京","大阪","神奈川","愛知","福岡","その他"]},
                {l:"職業",v:fJob,set:setFJob,opts:["",...JOBS]},
              ].map(f=>(
                <div key={f.l}>
                  <label className="font-display text-[10px] text-[var(--color-mute)] block mb-1">{f.l}</label>
                  <select value={f.v} onChange={e=>f.set(e.target.value)} className="w-full bg-[var(--color-bg)] border border-[var(--color-line)] rounded-lg px-3 py-1.5 text-xs font-display outline-none">
                    {f.opts.map(o=><option key={o} value={o}>{o||"すべて"}</option>)}
                  </select>
                </div>
              ))}
              <div className="col-span-2">
                <label className="font-display text-[10px] text-[var(--color-mute)] block mb-1">入会日（から）</label>
                <input type="date" value={fJoinFrom} onChange={e=>setFJoinFrom(e.target.value)} className="w-full bg-[var(--color-bg)] border border-[var(--color-line)] rounded-lg px-3 py-1.5 text-xs outline-none" />
              </div>
              <div className="col-span-2">
                <label className="font-display text-[10px] text-[var(--color-mute)] block mb-1">入会日（まで）</label>
                <input type="date" value={fJoinTo} onChange={e=>setFJoinTo(e.target.value)} className="w-full bg-[var(--color-bg)] border border-[var(--color-line)] rounded-lg px-3 py-1.5 text-xs outline-none" />
              </div>
              <div className="col-span-2">
                <label className="font-display text-[10px] text-[var(--color-mute)] block mb-1">承認日（から）</label>
                <input type="date" value={fApproveFrom} onChange={e=>setFApproveFrom(e.target.value)} className="w-full bg-[var(--color-bg)] border border-[var(--color-line)] rounded-lg px-3 py-1.5 text-xs outline-none" />
              </div>
              <div className="col-span-2">
                <label className="font-display text-[10px] text-[var(--color-mute)] block mb-1">承認日（まで）</label>
                <input type="date" value={fApproveTo} onChange={e=>setFApproveTo(e.target.value)} className="w-full bg-[var(--color-bg)] border border-[var(--color-line)] rounded-lg px-3 py-1.5 text-xs outline-none" />
              </div>
              <div className="col-span-4 flex items-center gap-2 pt-1">
                <input type="checkbox" id="vip-only" checked={fVip} onChange={e=>setFVip(e.target.checked)} className="accent-[var(--color-accent)]" />
                <label htmlFor="vip-only" className="font-display text-xs cursor-pointer">VIP会員のみ表示</label>
              </div>
            </div>
          </div>
        )}

        <div className="flex-1 overflow-auto px-8 py-4">
          <table className="w-full text-sm min-w-[1100px]">
            <thead>
              <tr className="font-display text-[10px] text-[var(--color-mute)] text-left border-b border-[var(--color-line)]">
                <th className="pb-3 pr-3">会員番号</th><th className="pb-3 pr-3">氏名</th>
                <th className="pb-3 pr-3">エンゲージ</th>
                <th className="pb-3 pr-3">支部</th>
                <th className="pb-3 pr-3">ランク</th><th className="pb-3 pr-3">支払い</th>
                <th className="pb-3 pr-3">入会日</th>
                <th className="pb-3 pr-3">承認日</th>
                <th className="pb-3 pr-3">最終活動日</th>
                <th className="pb-3 pr-3">参加クラブ</th>
                <th className="pb-3 pr-3 text-center">参加</th>
                <th className="pb-3 pr-3 text-center">クーポン使用</th>
                <th className="pb-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-line)]">
              {sorted.map(m=>{
                const engage = calcEngage(m);
                return (
                  <tr key={m.no} onClick={()=>{ setSelected(selected===m.no?null:m.no); setDetailTab("basic"); }}
                    className={`cursor-pointer transition ${selected===m.no?"bg-[var(--color-accent)]/8":"hover:bg-[var(--color-bg-soft)]"}`}>
                    <td className="py-3 pr-3">
                      <div className="num text-xs">{m.no}</div>
                      <div className="font-display text-[10px] text-[var(--color-accent-deep)] mt-0.5">U-{m.no}</div>
                    </td>
                    <td className="py-3 pr-3">
                      <div className="font-display flex items-center gap-1.5">
                        {m.name}{m.vip&&<span className="tag tag-accent text-[8px] !py-0">VIP</span>}
                      </div>
                    </td>
                    <td className="py-3 pr-3">
                      <span className={`font-display text-[9px] px-2 py-0.5 rounded-full border ${engageBadge[engage]}`}>{engage}</span>
                    </td>
                    <td className="py-3 pr-3 text-xs">{m.branch}</td>
                    <td className="py-3 pr-3"><span className="tag tag-accent text-[9px]">{m.rank}</span></td>
                    <td className="py-3 pr-3"><span className={`text-xs ${m.pay==="遅延"?"text-red-400 font-medium":"text-[var(--color-mute)]"}`}>{m.pay}</span></td>
                    <td className="py-3 pr-3 num text-xs text-[var(--color-mute)]">{m.joined}</td>
                    <td className="py-3 pr-3 num text-xs text-[var(--color-mute)]">{m.approvedDate}</td>
                    <td className="py-3 pr-3 num text-xs text-[var(--color-mute)]">{m.lastActivity}</td>
                    <td className="py-3 pr-3 text-xs text-[var(--color-mute)]">{m.clubs.length>0?m.clubs.join("、"):"—"}</td>
                    <td className="py-3 pr-3 num text-xs text-center">{m.events}</td>
                    <td className="py-3 pr-3 num text-xs text-center">{m.couponUses}</td>
                    <td className="py-3"><button className="font-display text-xs text-[var(--color-accent-deep)] hover:underline">詳細</button></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <div className="mt-4 flex items-center justify-between font-display text-xs text-[var(--color-mute)]">
            <span>全1,412件中 {sorted.length}件表示</span>
            <div className="flex items-center gap-3">
              <button className="hover:text-[var(--color-ink)]">‹ 前へ</button>
              <span className="num">1 / 118</span>
              <button className="hover:text-[var(--color-ink)]">次へ ›</button>
            </div>
          </div>
        </div>
      </div>

      {detail&&(()=>{
        const engage = calcEngage(detail);
        const months = calcMonths(detail.joined);
        return (
          <div className="w-[420px] border-l border-[var(--color-line)] flex flex-col overflow-hidden bg-[var(--color-bg-soft)] flex-none">
            <div className="px-6 py-4 border-b border-[var(--color-line)] flex items-center justify-between">
              <h2 className="font-display text-base">会員詳細</h2>
              <button onClick={()=>setSelected(null)} className="text-[var(--color-mute)] hover:text-[var(--color-ink)]">✕</button>
            </div>
            <div className="flex border-b border-[var(--color-line)] overflow-x-auto">
              {([["basic","基本情報"],["profile","申込情報"],["docs","書類・決済"],["activity","行動サマリー"]] as const).map(([k,l])=>(
                <button key={k} onClick={()=>setDetailTab(k)}
                  className={`flex-none font-display text-xs py-3 px-4 border-b-2 transition whitespace-nowrap ${detailTab===k?"border-[var(--color-accent)] text-[var(--color-accent-deep)]":"border-transparent text-[var(--color-mute)]"}`}>
                  {l}
                </button>
              ))}
            </div>
            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-3">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-[var(--color-accent)]/15 flex items-center justify-center font-display text-lg text-[var(--color-accent-deep)]">{detail.name[0]}</div>
                <div>
                  <div className="font-display text-lg flex items-center gap-1.5">
                    {detail.name}{detail.vip&&<span className="tag tag-accent text-[8px] !py-0">VIP</span>}
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="num text-xs text-[var(--color-mute)]">#{detail.no}</span>
                    <span className={`font-display text-[9px] px-2 py-0.5 rounded-full border ${engageBadge[engage]}`}>エンゲージ{engage}</span>
                  </div>
                </div>
              </div>

              {detailTab==="basic"&&(
                <>
                  {[
                    {l:"ユーザーID",v:`U-${detail.no}`},
                    {l:"メール",v:detail.email},{l:"電話番号",v:detail.tel},
                    {l:"Instagram",v:"@"+detail.insta},
                    {l:"支部",v:detail.branch},
                    {l:"ランク",v:detail.rank},{l:"ステータス",v:detail.status},
                    {l:"支払い状況",v:detail.pay},{l:"入会日",v:detail.joined},
                    {l:"承認日",v:detail.approvedDate},
                    {l:"生年月日",v:detail.dob},{l:"年齢",v:`${detail.age}歳`},
                    {l:"性別",v:detail.gender},{l:"都道府県",v:detail.pref},
                    {l:"申込地域",v:detail.region},
                    {l:"参加回数",v:`${detail.events}回`},
                    {l:"抽選当選回数",v:`${detail.lotteryWins}回`},
                    {l:"保有ポイント",v:`${detail.pt.toLocaleString()} pt`},
                    {l:"最終活動日",v:detail.lastActivity},
                  ].map(r=>(
                    <div key={r.l} className="flex items-start justify-between border-b border-[var(--color-line)] pb-2">
                      <span className="font-display text-xs text-[var(--color-mute)] flex-none w-28">{r.l}</span>
                      <span className="text-xs text-right break-all">{r.v}</span>
                    </div>
                  ))}
                  <div>
                    <div className="font-display text-xs text-[var(--color-mute)] mb-1.5">参加クラブ</div>
                    <div className="text-xs">{detail.clubs.length>0?detail.clubs.join("、"):"未参加"}</div>
                  </div>
                  <div>
                    <div className="font-display text-xs text-[var(--color-mute)] mb-1.5">興味カテゴリ</div>
                    <div className="flex flex-wrap gap-1">{detail.interests.map(i=><span key={i} className="tag text-[9px]">{i}</span>)}</div>
                  </div>
                  {detail.withdrawReason && (
                    <div className="rounded-xl border border-red-400/20 bg-red-400/5 p-4">
                      <div className="font-display text-[10px] text-red-400 mb-2">退会理由</div>
                      <p className="text-xs text-[var(--color-ink)] leading-relaxed">{detail.withdrawReason}</p>
                    </div>
                  )}
                </>
              )}

              {detailTab==="profile"&&(
                <>
                  {[
                    {l:"職業",v:detail.job},{l:"具体的な業種",v:detail.industry},
                    {l:"勤務先",v:detail.company||"—"},{l:"役職・肩書き",v:detail.title||"—"},
                    {l:"年収",v:detail.income},{l:"紹介者",v:detail.referee},
                    {l:"知ったきっかけ",v:detail.howFound},
                  ].map(r=>(
                    <div key={r.l} className="flex items-start justify-between border-b border-[var(--color-line)] pb-2">
                      <span className="font-display text-xs text-[var(--color-mute)] flex-none w-28">{r.l}</span>
                      <span className="text-xs text-right">{r.v}</span>
                    </div>
                  ))}
                  <div>
                    <div className="font-display text-xs text-[var(--color-mute)] mb-1">入会の理由</div>
                    <div className="flex flex-wrap gap-1">{detail.entryReasons.map(r=><span key={r} className="tag text-[9px]">{r}</span>)}</div>
                  </div>
                  <div><div className="font-display text-xs text-[var(--color-accent-deep)] mb-1">自己紹介</div><p className="text-xs text-[var(--color-mute)] leading-relaxed">{detail.selfIntro}</p></div>
                  <div><div className="font-display text-xs text-[var(--color-accent-deep)] mb-1">物足りなさ</div><p className="text-xs text-[var(--color-mute)] leading-relaxed">{detail.lifestyle}</p></div>
                  <div><div className="font-display text-xs text-[var(--color-accent-deep)] mb-1">実現したいつながり・日常</div><p className="text-xs text-[var(--color-mute)] leading-relaxed">{detail.desired}</p></div>
                </>
              )}

              {detailTab==="docs"&&(
                <>
                  <div className="rounded-xl border border-[var(--color-line)] p-4 space-y-3">
                    <div className="font-display text-xs text-[var(--color-accent-deep)] mb-2">審査書類</div>
                    <div className="flex items-center justify-between">
                      <span className="font-display text-xs">身分証明書</span>
                      <div className="w-24 h-16 rounded-lg bg-[var(--color-line)] flex items-center justify-center text-xs text-[var(--color-mute)]">確認済</div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-display text-xs">顔写真</span>
                      <div className="w-24 h-16 rounded-lg bg-[var(--color-line)] flex items-center justify-center text-xs text-[var(--color-mute)]">確認済</div>
                    </div>
                  </div>
                  <div className="border-b border-[var(--color-line)] pb-2 flex items-start justify-between">
                    <span className="font-display text-xs text-[var(--color-mute)] w-28">UnivaPayID</span>
                    <span className="num text-xs">{detail.univaPayId}</span>
                  </div>
                </>
              )}

              {detailTab==="activity"&&(
                <>
                  <div className="grid grid-cols-2 gap-2 mb-2">
                    {[
                      {l:"イベント参加（累計）",v:`${detail.events}回`},
                      {l:"クーポン使用（累計）",v:`${detail.couponUses}回`},
                      {l:"紹介実績",v:`${detail.referralCount}名`},
                      {l:"継続月数",v:`${months}ヶ月`},
                    ].map(k=>(
                      <div key={k.l} className="card p-3">
                        <div className="font-display text-[9px] text-[var(--color-mute)] mb-1">{k.l}</div>
                        <div className="num text-xl">{k.v}</div>
                      </div>
                    ))}
                  </div>

                  <div className="card p-4">
                    <div className="font-display text-[10px] text-[var(--color-accent-deep)] mb-3">直近3ヶ月のアクティビティ</div>
                    <div className="grid grid-cols-3 gap-2">
                      {["5月","6月","7月"].map((mo, i) => {
                        const count = [
                          detail.eventHistory.filter(e => e.date.startsWith("2026.05")).length,
                          detail.eventHistory.filter(e => e.date.startsWith("2026.06")).length,
                          detail.eventHistory.filter(e => e.date.startsWith("2026.07")).length,
                        ][i];
                        return (
                          <div key={mo} className="text-center">
                            <div className="font-display text-[9px] text-[var(--color-mute)] mb-1">{mo}</div>
                            <div className="num text-lg">{count}</div>
                            <div className="font-display text-[9px] text-[var(--color-mute)]">回参加</div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="card p-4 flex items-center justify-between">
                    <div>
                      <div className="font-display text-[9px] text-[var(--color-mute)] mb-1">最終活動日</div>
                      <div className="num text-sm">{detail.lastActivity}</div>
                    </div>
                    <div className={`font-display text-xs px-3 py-1.5 rounded-full border ${engageBadge[engage]}`}>
                      エンゲージ {engage}
                    </div>
                  </div>

                  <div>
                    <div className="font-display text-[10px] text-[var(--color-accent-deep)] mb-2">参加イベント履歴（直近5件）</div>
                    {detail.eventHistory.length > 0 ? (
                      <div className="space-y-1.5">
                        {detail.eventHistory.map((e,i)=>(
                          <div key={i} className="flex items-center justify-between px-3 py-2 rounded-lg bg-[var(--color-bg)] border border-[var(--color-line)]">
                            <span className="font-display text-xs">{e.title}</span>
                            <span className="num text-[10px] text-[var(--color-mute)]">{e.date}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-xs text-[var(--color-mute)] text-center py-3">参加履歴なし</div>
                    )}
                  </div>

                  <div>
                    <div className="font-display text-[10px] text-[var(--color-accent-deep)] mb-2">クーポン使用履歴（直近5件）</div>
                    {detail.couponHistory.length > 0 ? (
                      <div className="space-y-1.5">
                        {detail.couponHistory.map((c,i)=>(
                          <div key={i} className="flex items-center justify-between px-3 py-2 rounded-lg bg-[var(--color-bg)] border border-[var(--color-line)]">
                            <div>
                              <div className="font-display text-xs">{c.name}</div>
                              <div className="font-display text-[9px] text-[var(--color-mute)]">{c.store}</div>
                            </div>
                            <span className="num text-[10px] text-[var(--color-mute)]">{c.date}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-xs text-[var(--color-mute)] text-center py-3">使用履歴なし</div>
                    )}
                  </div>
                </>
              )}

              <div className="space-y-2 pt-2">
                <button className="w-full btn-primary justify-center text-xs">ポイント手動付与</button>
                {detail.pay==="遅延"&&(
                  <button className="w-full py-2.5 rounded-full font-display text-xs border border-red-400/40 text-red-400 hover:bg-red-400/8 transition">決済催促メール送信</button>
                )}
                <button className="w-full py-2.5 rounded-full font-display text-xs border border-[var(--color-line)] text-[var(--color-mute)] hover:border-red-400/50 hover:text-red-400 transition">強制退会</button>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
