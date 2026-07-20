"use client";
import { useState, useRef, useEffect } from "react";
import BottomNav from "@/components/BottomNav";
import AppHeader from "@/components/AppHeader";
import Link from "next/link";

// ============ Types ============
type TabKey = "intro" | "official" | "all" | "following";
type PostCat = "intro" | "official" | "regular";

const REACTIONS = [
  { emoji: "👍", label: "グッド" },
  { emoji: "♥️", label: "ハート" },
  { emoji: "😊", label: "笑顔" },
  { emoji: "😭", label: "涙" },
  { emoji: "🙌", label: "万歳" },
  { emoji: "🙇‍♀️", label: "土下座" },
] as const;
type RxEmoji = typeof REACTIONS[number]["emoji"];
type RxState = { count: number; mine: boolean };
type RxMap = Record<RxEmoji, RxState>;

function mkRx(init: Partial<Record<string, number>> = {}): RxMap {
  const m = {} as Record<string, RxState>;
  REACTIONS.forEach(r => { m[r.emoji] = { count: (init[r.emoji] ?? 0), mine: false }; });
  return m as RxMap;
}

interface Reply {
  id: number; name: string; handle: string; avatar: string; body: string; time: string;
}

interface Post {
  id: number; cat: PostCat;
  name: string; handle: string; role: string; avatar: string;
  body: string; images: string[];
  time: string; rx: RxMap;
  likes: number; liked: boolean;
  reposts: number; reposted: boolean;
  following: boolean; blocked: boolean; isOwn: boolean;
  bookmarked: boolean; deleted: boolean;
  replies: Reply[];
}

interface DmMember { name: string; avatar: string; handle: string; }

interface DmConv {
  id: number; name: string; handle: string; avatar: string;
  lastMsg: string; time: string; unread: number; isGroup?: boolean;
  members?: DmMember[];
}

interface DmMsg {
  id: number; fromMe: boolean; body: string; time: string; bookmarked: boolean;
  sender?: string; // handle without @, for group chat
}

// ============ Profiles (for DM overlay) ============
interface ProfileData {
  name: string; handle: string; avatar: string;
  rank: string; job: string; location: string; bio: string;
  clubs: { id: string; name: string; icon: string }[];
}
const PROFILES: Record<string, ProfileData> = {
  tanaka_k: { name:"田中 康介", handle:"@tanaka_k", avatar:"/images/tanaka.png", rank:"GOLD", job:"不動産会社 代表", location:"東京", bio:"不動産会社を経営しています。ワインとフォトグラフィーが趣味。Leica M11で街の光と影を追いかけています。ビジネス外の豊かな繋がりを求めてCOMMONSへ。", clubs:[{id:"wine",name:"ワインクラブ",icon:"🍷"},{id:"photo",name:"フォトクラブ",icon:"📷"}] },
  yamamoto_a: { name:"山本 彩花", handle:"@yamamoto_a", avatar:"/images/yamamoto.png", rank:"PLATINUM", job:"フリーランスデザイナー", location:"東京", bio:"UI/UXデザインを中心に活動しています。旅と写真が大好きで、週末はどこかへ出かけています。箱根や軽井沢が特に好き。COMMONSでは素敵な出会いを楽しんでいます。", clubs:[{id:"travel",name:"旅クラブ",icon:"✈️"},{id:"photo",name:"フォトクラブ",icon:"📷"},{id:"wine",name:"ワインクラブ",icon:"🍷"}] },
  ito_k: { name:"伊藤 健", handle:"@ito_k", avatar:"/images/ito.png", rank:"SILVER", job:"ソフトウェアエンジニア", location:"東京", bio:"都内のスタートアップでエンジニアをしています。登山とコーヒーが趣味。百名山制覇を目標に週末は山へ。雲取山から望む富士山が忘れられません。", clubs:[{id:"outdoor",name:"アウトドアクラブ",icon:"🏔"},{id:"coffee",name:"コーヒークラブ",icon:"☕"}] },
};

// ============ Constants ============
const MY_HANDLE = "@aoyama_r";
const MY_NAME = "青山 陸";
const MY_AVATAR = "/images/icon.png";

const TAB_LABELS: Record<TabKey, string> = {
  intro: "自己紹介", official: "運営から", all: "全体", following: "フォロー中",
};
const TAB_UNREAD: Partial<Record<TabKey, number>> = { intro: 2, official: 1 };

// gradient strings for landscape photo placeholders
const GRAD = [
  "linear-gradient(160deg,#FF6B6B,#FFA040 40%,#FFD700 70%,#87CEEB)",
  "linear-gradient(180deg,#87CEEB,#B0E0E6 30%,#2E8B57 65%,#556B2F)",
  "linear-gradient(180deg,#87CEEB 40%,#4169E1 60%,#006994 80%,#004466)",
  "linear-gradient(180deg,#1a1a2e,#16213e 40%,#0f3460 80%,#533483)",
  "linear-gradient(160deg,#FF9A8B,#FF6A88 40%,#FF99AC)",
];
function g(i: number) { return `__g${i}`; }
function isG(s: string) { return s.startsWith("__g"); }
function getG(s: string) { return GRAD[parseInt(s.replace("__g", "")) % GRAD.length]; }

const INIT_POSTS: Post[] = [
  { id:1, cat:"intro", name:"佐藤 美咲", handle:"@sato_m", role:"GOLD", avatar:"/images/yamamoto.png",
    body:"はじめまして！先月入会した佐藤美咲と申します。大阪在住のマーケターです。コーヒーと写真が趣味で、週末はよく街歩きをしています。よろしくお願いします🙏",
    images:[], time:"2日前", rx:mkRx({"👍":18,"♥️":12}), likes:30, liked:false, reposts:5, reposted:false, following:false, blocked:false, isOwn:false, bookmarked:false, deleted:false, replies:[] },
  { id:2, cat:"intro", name:"中村 優一", handle:"@nakamura_y", role:"GOLD", avatar:"中",
    body:"中村優一です。不動産会社を経営しています。ワインとアウトドアが好きです。ビジネス外の繋がりを大切にしたく入会しました。どうぞよろしく！",
    images:[], time:"3日前", rx:mkRx({"👍":24,"♥️":8,"🙌":3}), likes:35, liked:false, reposts:3, reposted:false, following:false, blocked:false, isOwn:false, bookmarked:false, deleted:false, replies:[] },
  { id:3, cat:"intro", name:"鈴木 花", handle:"@suzuki_h", role:"SILVER", avatar:"鈴",
    body:"鈴木花です！都内在住の会社員です。ジャズとワインが大好きで、一人でバー巡りするのが趣味です。気軽に話しかけてください😊",
    images:[], time:"4日前", rx:mkRx({"👍":15,"♥️":20,"😊":8}), likes:43, liked:false, reposts:2, reposted:false, following:false, blocked:false, isOwn:false, bookmarked:false, deleted:false, replies:[] },
  { id:4, cat:"official", name:"COMMONS 運営", handle:"@commons_official", role:"STAFF", avatar:"★",
    body:"【お知らせ】7月のイベントカレンダーを公開しました。ワインサロン・コーヒーカッピング・フォトウォークなど多彩なイベントをご用意しています✨ 詳しくはイベント一覧からご確認ください。",
    images:[], time:"1日前", rx:mkRx({"👍":42,"🙌":15}), likes:57, liked:false, reposts:12, reposted:false, following:true, blocked:false, isOwn:false, bookmarked:false, deleted:false, replies:[] },
  { id:5, cat:"official", name:"COMMONS 運営", handle:"@commons_official", role:"STAFF", avatar:"★",
    body:"【イベントレポート】先週のワインサロンには20名にご参加いただきました！醸造家をゲストにお迎えし、大変ご好評をいただきました🍷 次回は8月15日開催予定です。",
    images:[g(4)], time:"3日前", rx:mkRx({"♥️":31,"😊":8,"🙌":11}), likes:50, liked:false, reposts:8, reposted:false, following:true, blocked:false, isOwn:false, bookmarked:false, deleted:false, replies:[] },
  { id:6, cat:"regular", name:"田中 康介", handle:"@tanaka_k", role:"GOLD", avatar:"/images/tanaka.png",
    body:"谷中散歩で撮った朝の一枚☀️ 路地裏の光と影が格別でした。Leicaとの相性も抜群。こういう静かな時間が週の活力になりますね。",
    images:[g(0),g(1)], time:"1時間前", rx:mkRx({"♥️":27,"😊":9}), likes:36, liked:false, reposts:8, reposted:false, following:true, blocked:false, isOwn:false, bookmarked:false, deleted:false,
    replies:[{id:601,name:"山本 彩花",handle:"@yamamoto_a",avatar:"/images/yamamoto.png",body:"素敵な写真！次のフォトウォークぜひ一緒に🎞",time:"45分前"}] },
  { id:7, cat:"regular", name:"山本 彩花", handle:"@yamamoto_a", role:"PLATINUM", avatar:"/images/yamamoto.png",
    body:"箱根の朝霧♨️ 大涌谷からの眺めは圧巻でした。湖面に映る空、また行きたいな。",
    images:[g(2),g(1),g(0)], time:"昨日", rx:mkRx({"♥️":45,"😊":14,"🙌":6}), likes:65, liked:false, reposts:11, reposted:false, following:true, blocked:false, isOwn:false, bookmarked:true, deleted:false, replies:[] },
  { id:8, cat:"regular", name:"青山 陸", handle:"@aoyama_r", role:"GOLD", avatar:MY_AVATAR,
    body:"昨夜のワインサロン最高でした！ブルゴーニュの飲み比べ、ポマールの余韻がまだ残ってます🍷 次回のシャンパーニュ特集も楽しみ。",
    images:[], time:"昨日", rx:mkRx({"👍":14,"♥️":8}), likes:22, liked:false, reposts:3, reposted:false, following:true, blocked:false, isOwn:true, bookmarked:false, deleted:false,
    replies:[{id:801,name:"田中 康介",handle:"@tanaka_k",avatar:"/images/tanaka.png",body:"シャンパーニュはビンテージものが来るらしいです🥂",time:"昨日"}] },
  { id:9, cat:"regular", name:"伊藤 健", handle:"@ito_k", role:"SILVER", avatar:"/images/ito.png",
    body:"奥多摩ハイキングから帰還🏔 雲取山から望む富士山、最高でした。足腰が痛いけど達成感がやばい…",
    images:[g(1),g(3)], time:"2日前", rx:mkRx({"👍":22,"🙌":18,"😊":7}), likes:47, liked:false, reposts:5, reposted:false, following:false, blocked:false, isOwn:false, bookmarked:false, deleted:false, replies:[] },
  { id:10, cat:"regular", name:"森田 桂", handle:"@morita_k", role:"GOLD", avatar:"森",
    body:"夕暮れ時の東京湾🌉 レインボーブリッジが映える。仕事終わりのこの景色が一日の疲れを癒してくれます。",
    images:[g(3)], time:"3日前", rx:mkRx({"♥️":38,"😊":12}), likes:50, liked:false, reposts:7, reposted:false, following:false, blocked:false, isOwn:false, bookmarked:false, deleted:false, replies:[] },
];

const INIT_DMS: DmConv[] = [
  { id:1, name:"田中 康介", handle:"tanaka_k", avatar:"/images/tanaka.png", lastMsg:"次のワインサロンも一緒に行きましょう！", time:"1時間前", unread:2 },
  { id:2, name:"山本 彩花", handle:"yamamoto_a", avatar:"/images/yamamoto.png", lastMsg:"写真送りますね〜📷", time:"昨日", unread:0 },
  { id:3, name:"伊藤 健", handle:"ito_k", avatar:"/images/ito.png", lastMsg:"了解です！よろしくお願いします", time:"2日前", unread:0 },
  { id:4, name:"ワインクラブグループ", handle:"group_wine", avatar:"🍷", lastMsg:"次回の候補日を教えてください", time:"3日前", unread:5, isGroup:true,
    members:[
      { name:"田中 康介", avatar:"/images/tanaka.png", handle:"@tanaka_k" },
      { name:"山本 彩花", avatar:"/images/yamamoto.png", handle:"@yamamoto_a" },
      { name:"伊藤 健", avatar:"/images/ito.png", handle:"@ito_k" },
      { name:"青山 陸", avatar:"/images/icon.png", handle:"@aoyama_r" },
    ]
  },
];

const INIT_DM_MSGS: Record<number, DmMsg[]> = {
  1:[
    {id:1,fromMe:false,body:"先日のワインサロンはいかがでしたか？楽しめました？",time:"一昨日 18:00",bookmarked:false},
    {id:2,fromMe:true,body:"最高でした！ブルゴーニュの飲み比べが特に印象的で、ポマールの余韻がまだ残ってます笑",time:"一昨日 18:12",bookmarked:false},
    {id:3,fromMe:false,body:"わかります！あのポマール、醸造家が直接持ち込んだやつですからね。希少ですよ。",time:"一昨日 18:20",bookmarked:false},
    {id:4,fromMe:true,body:"そうなんですね！どおりで違うと思いました。田中さんは次回のシャンパーニュ特集も参加されますか？",time:"一昨日 18:25",bookmarked:false},
    {id:5,fromMe:false,body:"もちろんです！ヴィンテージものが来るらしいので楽しみにしてます🥂",time:"一昨日 18:30",bookmarked:false},
    {id:6,fromMe:true,body:"いいですね〜！一緒に行きましょう。",time:"一昨日 18:35",bookmarked:false},
    {id:7,fromMe:false,body:"ところで、谷中の写真みましたよ。Leicaですか？",time:"昨日 10:05",bookmarked:false},
    {id:8,fromMe:true,body:"はい、M11です。路地の光が本当によくて。",time:"昨日 10:18",bookmarked:false},
    {id:9,fromMe:false,body:"羨ましい…。フォトウォークのイベントとか企画してもよさそうですね。",time:"昨日 10:22",bookmarked:false},
    {id:10,fromMe:true,body:"それ面白そう！運営に提案してみますね。",time:"昨日 10:30",bookmarked:false},
    {id:11,fromMe:false,body:"ぜひ！その時は声かけてください。谷中か根津あたりでやりたいな。",time:"昨日 10:35",bookmarked:false},
    {id:12,fromMe:true,body:"了解です！場所の候補いくつか調べてみます。",time:"昨日 11:00",bookmarked:false},
    {id:13,fromMe:false,body:"次のワインサロンも一緒に行きましょう！席の確保もしておきますね。",time:"1時間前",bookmarked:false},
  ],
  2:[{id:1,fromMe:false,body:"フォトウォークの写真、送りますね〜📷",time:"昨日 10:00",bookmarked:false},{id:2,fromMe:true,body:"ありがとうございます！楽しみにしています",time:"昨日 10:15",bookmarked:false},{id:3,fromMe:false,body:"写真送りますね〜📷",time:"昨日 11:00",bookmarked:false}],
  3:[{id:1,fromMe:true,body:"コーヒーカッピング、楽しみですね！",time:"2日前",bookmarked:false},{id:2,fromMe:false,body:"了解です！よろしくお願いします",time:"2日前",bookmarked:false}],
  4:[
    {id:1,fromMe:false,sender:"tanaka_k",body:"みなさん、次回の候補日を教えてください",time:"3日前",bookmarked:false},
    {id:2,fromMe:true,body:"7月下旬なら空いています！",time:"3日前",bookmarked:false},
    {id:3,fromMe:false,sender:"yamamoto_a",body:"私も下旬がいいです🍷",time:"3日前",bookmarked:false},
    {id:4,fromMe:false,sender:"ito_k",body:"自分も下旬であれば大丈夫です！",time:"2日前",bookmarked:false},
    {id:5,fromMe:true,body:"では7月26日（土）はいかがでしょう？",time:"2日前",bookmarked:false},
    {id:6,fromMe:false,sender:"tanaka_k",body:"26日、問題ないです👍",time:"2日前",bookmarked:false},
    {id:7,fromMe:false,sender:"yamamoto_a",body:"OKです！場所はいつものLa Caveで？",time:"昨日",bookmarked:false},
    {id:8,fromMe:true,body:"そうしましょう！19時でどうですか",time:"昨日",bookmarked:false},
    {id:9,fromMe:false,sender:"ito_k",body:"了解です。楽しみにしています🍷",time:"昨日",bookmarked:false},
  ],
};

// ============ Sub-components ============
function Avatar({ src, name, size=10 }: { src:string; name:string; size?:number }) {
  const px = size * 4;
  const base = "rounded-full flex-none border border-[var(--color-line)]";
  if (src.startsWith("/")) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={name} className={`${base} object-cover`} style={{width:px,height:px,minWidth:px}} />;
  }
  return (
    <div className={`${base} flex items-center justify-center bg-[var(--color-ink)] text-[var(--color-bg)] font-display text-sm`}
      style={{width:px,height:px,minWidth:px}}>{src}</div>
  );
}

function PostImages({ images, onView }: { images: string[]; onView: (img: string) => void }) {
  if (!images.length) return null;
  const h = images.length === 1 ? 200 : 140;
  return (
    <div className={`mt-3 grid gap-1 rounded-xl overflow-hidden ${images.length > 1 ? "grid-cols-2" : "grid-cols-1"}`}>
      {images.slice(0,4).map((img,i) =>
        isG(img)
          ? <div key={i} onClick={() => onView(img)} style={{background:getG(img),height:h}} className="cursor-pointer" />
          // eslint-disable-next-line @next/next/no-img-element
          : <img key={i} src={img} alt="" onClick={() => onView(img)} className="w-full object-cover cursor-pointer" style={{height:h}} />
      )}
    </div>
  );
}

// ============ Main Page ============
export default function CommunityPage() {
  const [tab, setTab] = useState<TabKey>("all");
  const [posts, setPosts] = useState<Post[]>(INIT_POSTS);
  const [showDm, setShowDm] = useState(false);
  const [activeDm, setActiveDm] = useState<DmConv|null>(null);
  const [dms, setDms] = useState<DmConv[]>(INIT_DMS);
  const [dmMsgs, setDmMsgs] = useState<Record<number,DmMsg[]>>(INIT_DM_MSGS);
  const [dmInput, setDmInput] = useState("");
  const [openReplies, setOpenReplies] = useState<Set<number>>(new Set());
  const [replyDraft, setReplyDraft] = useState<Record<number,string>>({});
  const [rxPicker, setRxPicker] = useState<number|null>(null);
  const [menuOpen, setMenuOpen] = useState<number|null>(null);
  const [shareSheet, setShareSheet] = useState<Post|null>(null);
  const [showCompose, setShowCompose] = useState(false);
  const [draft, setDraft] = useState("");
  const [draftImages, setDraftImages] = useState<string[]>([]);
  const [photoView, setPhotoView] = useState<string|null>(null);
  const [dmSearch, setDmSearch] = useState("");
  const [profileSheet, setProfileSheet] = useState<DmConv|null>(null);
  const [showMembers, setShowMembers] = useState(false);
  const [showGroupCreate, setShowGroupCreate] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [groupSelected, setGroupSelected] = useState<number[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);
  const msgBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (activeDm) {
      msgBottomRef.current?.scrollIntoView({ behavior: "instant" });
    }
  }, [activeDm]);

  const dmUnread = dms.reduce((s,d) => s + d.unread, 0);

  function getShown(): Post[] {
    const v = posts.filter(p => !p.blocked && !p.deleted);
    if (tab === "intro") return v.filter(p => p.cat === "intro");
    if (tab === "official") return v.filter(p => p.cat === "official");
    if (tab === "following") return v.filter(p => p.following && !p.isOwn);
    return [...v.filter(p => p.isOwn), ...v.filter(p => !p.isOwn)];
  }

  function toggleRx(postId: number, emoji: RxEmoji) {
    setPosts(prev => prev.map(p => {
      if (p.id !== postId) return p;
      const rx = { ...p.rx } as RxMap;
      const cur = rx[emoji];
      // unset any other mine reaction
      (Object.keys(rx) as RxEmoji[]).forEach(e => {
        if (e !== emoji && rx[e].mine) rx[e] = { count: rx[e].count - 1, mine: false };
      });
      rx[emoji] = { count: cur.mine ? cur.count - 1 : cur.count + 1, mine: !cur.mine };
      return { ...p, rx };
    }));
    setRxPicker(null);
  }

  function submitReply(postId: number) {
    const body = (replyDraft[postId] ?? "").trim();
    if (!body) return;
    setPosts(prev => prev.map(p => p.id === postId
      ? { ...p, replies: [...p.replies, { id: Date.now(), name: MY_NAME, handle: MY_HANDLE, avatar: MY_AVATAR, body, time: "たった今" }] }
      : p));
    setReplyDraft(prev => ({ ...prev, [postId]: "" }));
  }

  function submit() {
    if (!draft.trim() && !draftImages.length) return;
    setPosts(prev => [{
      id: Date.now(), cat: "regular" as PostCat, name: MY_NAME, handle: MY_HANDLE, role: "GOLD", avatar: MY_AVATAR,
      body: draft, images: draftImages, time: "たった今",
      rx: mkRx(), likes: 0, liked: false, reposts: 0, reposted: false, following: true, blocked: false, isOwn: true, bookmarked: false, deleted: false, replies: [],
    }, ...prev]);
    setDraft(""); setDraftImages([]); setShowCompose(false);
  }

  function sendDm() {
    if (!dmInput.trim() || !activeDm) return;
    const msg: DmMsg = { id: Date.now(), fromMe: true, body: dmInput.trim(), time: "たった今", bookmarked: false };
    setDmMsgs(prev => ({ ...prev, [activeDm.id]: [...(prev[activeDm.id] ?? []), msg] }));
    setDms(prev => prev.map(d => d.id === activeDm.id ? { ...d, lastMsg: dmInput.trim(), time: "たった今" } : d));
    setDmInput("");
  }

  const shown = getShown();

  // DM icon slot for AppHeader
  const dmIconSlot = (
    <div className="flex items-center gap-2">
      <button
        onClick={() => { setShowDm(v => !v); setActiveDm(null); }}
        className="relative w-8 h-8 flex items-center justify-center text-[var(--color-mute)] hover:text-[var(--color-ink)] transition"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/icondm.png" alt="DM" className="w-5 h-5 object-contain opacity-60 hover:opacity-100 transition" />
        {dmUnread > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full text-[9px] font-display flex items-center justify-center leading-none"
            style={{ background: "var(--color-accent)", color: "#0B0F16" }}>
            {dmUnread}
          </span>
        )}
      </button>
      <a href="/notifications" className="relative w-8 h-8 flex items-center justify-center text-[var(--color-mute)] hover:text-[var(--color-ink)] transition">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
        <span className="absolute top-0 right-0 w-4 h-4 rounded-full text-[9px] font-display flex items-center justify-center leading-none" style={{ background: "var(--color-accent)", color: "#0B0F16" }}>3</span>
      </a>
      <a href="/mypage">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/icon.png" alt="マイページ" className="w-8 h-8 rounded-full object-cover border border-[var(--color-line)]" />
      </a>
    </div>
  );

  return (
    <div className="flex justify-center bg-[var(--color-bg)] min-h-screen"
      onClick={() => { setMenuOpen(null); setRxPicker(null); }}>
      <div className="w-full max-w-[430px] pb-20">
        <AppHeader rightSlot={dmIconSlot} />

        {/* ===== DM View ===== */}
        {showDm && (
          <div>
            {/* DM list or Chat */}
            {!activeDm ? (
              <div>
                {/* Search + Group create */}
                <div className="px-4 pt-3 pb-2 space-y-2">
                  <div className="flex items-center gap-2 bg-[var(--color-bg-soft)] border border-[var(--color-line)] rounded-xl px-3 py-2.5">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--color-mute)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                    </svg>
                    <input
                      className="flex-1 bg-transparent text-sm text-[var(--color-ink)] placeholder-[var(--color-mute)] outline-none font-display"
                      placeholder="名前で検索..."
                      value={dmSearch}
                      onChange={e => setDmSearch(e.target.value)}
                    />
                  </div>
                  <button
                    onClick={() => setShowGroupCreate(true)}
                    className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl border border-[var(--color-accent)]/30 hover:bg-[var(--color-accent)]/6 transition"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent-deep)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                      <circle cx="9" cy="7" r="4"/>
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                      <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                    </svg>
                    <span className="font-display text-sm text-[var(--color-accent-deep)]">グループを作成</span>
                  </button>
                </div>
                {dms.filter(d => !dmSearch || d.name.includes(dmSearch)).map(d => (
                  <button key={d.id}
                    onClick={() => { setActiveDm(d); setDms(prev => prev.map(x => x.id === d.id ? { ...x, unread: 0 } : x)); }}
                    className="w-full flex items-center gap-3 px-4 py-4 border-b border-[var(--color-line)] hover:bg-[var(--color-bg-soft)] transition text-left"
                  >
                    <div className="relative flex-none">
                      <Avatar src={d.avatar} name={d.name} size={11} />
                      {d.unread > 0 && (
                        <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full text-[10px] font-display flex items-center justify-center leading-none"
                          style={{ background: "var(--color-accent)", color: "#0B0F16" }}>{d.unread}</span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline justify-between mb-0.5">
                        <span className={`font-display text-sm ${d.unread > 0 ? "text-[var(--color-ink)]" : "text-[var(--color-ink-soft)]"}`}>{d.name}</span>
                        <span className="font-display text-[10px] text-[var(--color-mute)] flex-none ml-2">{d.time}</span>
                      </div>
                      <p className="text-xs text-[var(--color-mute)] truncate">{d.lastMsg}</p>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div>
                {/* Chat header — sticky below AppHeader */}
                <div className="sticky top-[57px] z-30 bg-[var(--color-bg)]/98 backdrop-blur-md border-b border-[var(--color-line)]">
                  <div className="flex items-center gap-3 px-4 py-3">
                    <button onClick={() => { setActiveDm(null); setShowDm(true); setShowMembers(false); }} className="text-[var(--color-mute)] hover:text-[var(--color-ink)] transition p-1">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="15 18 9 12 15 6" />
                      </svg>
                    </button>
                    <button onClick={() => !activeDm.isGroup && setProfileSheet(activeDm)}>
                      <Avatar src={activeDm.avatar} name={activeDm.name} size={9} />
                    </button>
                    <div className="flex-1 min-w-0">
                      <div className="font-display text-sm">{activeDm.name}</div>
                      {activeDm.isGroup && activeDm.members && (
                        <div className="font-display text-[10px] text-[var(--color-mute)]">{activeDm.members.length}人のメンバー</div>
                      )}
                    </div>
                    {activeDm.isGroup && activeDm.members && (
                      <button
                        onClick={() => setShowMembers(v => !v)}
                        className="flex items-center gap-1 px-2.5 py-1.5 rounded-full border transition"
                        style={{ borderColor: showMembers ? "var(--color-accent)" : "var(--color-line)", color: showMembers ? "var(--color-accent-deep)" : "var(--color-mute)" }}>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                          <circle cx="9" cy="7" r="4"/>
                          <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                          <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                        </svg>
                        <span className="font-display text-[10px]">メンバー</span>
                      </button>
                    )}
                  </div>
                  {/* Group members panel */}
                  {activeDm.isGroup && activeDm.members && showMembers && (
                    <div className="px-4 pb-3 border-t border-[var(--color-line)] pt-3">
                      <div className="font-display text-[10px] text-[var(--color-mute)] mb-2">参加者 {activeDm.members.length}人</div>
                      <div className="space-y-2">
                        {activeDm.members.map((m, i) => {
                          const handleKey = m.handle.replace("@", "");
                          const isMe = m.handle === MY_HANDLE;
                          return (
                            <button key={i}
                              className="flex items-center gap-2.5 w-full text-left hover:opacity-70 transition"
                              onClick={() => { if (!isMe) setProfileSheet({ id: 0, name: m.name, handle: handleKey, avatar: m.avatar, lastMsg: "", time: "", unread: 0 }); }}>
                              <Avatar src={m.avatar} name={m.name} size={8} />
                              <div>
                                <div className="font-display text-xs">{m.name}{isMe && <span className="text-[var(--color-mute)] ml-1">(自分)</span>}</div>
                                <div className="font-display text-[10px] text-[var(--color-mute)]">{m.handle}</div>
                              </div>
                              {!isMe && (
                                <svg className="ml-auto text-[var(--color-mute)]" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <polyline points="9 18 15 12 9 6"/>
                                </svg>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

                {/* Messages */}
                <div className="px-4 py-4 space-y-4 pb-32">
                  {(dmMsgs[activeDm.id] ?? []).map((msg, idx, arr) => {
                    const isGroup = activeDm.isGroup;
                    const senderMember = isGroup && !msg.fromMe && msg.sender
                      ? activeDm.members?.find(m => m.handle.replace("@", "") === msg.sender)
                      : null;
                    const senderAvatar = senderMember?.avatar ?? activeDm.avatar;
                    const senderName = senderMember?.name ?? activeDm.name;
                    const senderHandle = msg.sender ?? activeDm.handle;
                    // show sender name only if different from previous message's sender
                    const prevMsg = idx > 0 ? arr[idx - 1] : null;
                    const showSenderLabel = isGroup && !msg.fromMe && (
                      !prevMsg || prevMsg.fromMe || prevMsg.sender !== msg.sender
                    );
                    return (
                      <div key={msg.id} ref={idx === arr.length - 1 ? msgBottomRef : null}>
                        {showSenderLabel && senderName && (
                          <div className="font-display text-[10px] text-[var(--color-mute)] mb-1 ml-11">{senderName}</div>
                        )}
                        <div className={`flex gap-2.5 items-end ${msg.fromMe ? "flex-row-reverse" : ""}`}>
                          {!msg.fromMe && (
                            <button onClick={() => setProfileSheet({ id: 0, name: senderName, handle: senderHandle, avatar: senderAvatar, lastMsg: "", time: "", unread: 0 })}>
                              <Avatar src={senderAvatar} name={senderName} size={8} />
                            </button>
                          )}
                          <div className="max-w-[240px]">
                            <div className="text-sm px-4 py-2.5 rounded-2xl leading-relaxed"
                              style={msg.fromMe
                                ? { background: "linear-gradient(135deg,#CBAE74,#B8985A)", color: "#0B0F16" }
                                : { background: "var(--color-bg-soft)", color: "var(--color-ink)", border: "1px solid var(--color-line)" }}>
                              {msg.body}
                            </div>
                            <div className={`flex items-center gap-1.5 mt-1 ${msg.fromMe ? "justify-end" : ""}`}>
                              <span className="font-display text-[10px] text-[var(--color-mute)]">{msg.time}</span>
                              <button
                                onClick={() => setDmMsgs(prev => ({
                                  ...prev,
                                  [activeDm.id]: (prev[activeDm.id] ?? []).map(m => m.id === msg.id ? { ...m, bookmarked: !m.bookmarked } : m)
                                }))}
                                className="transition"
                                style={{ color: msg.bookmarked ? "var(--color-accent-deep)" : "var(--color-mute)" }}
                              >
                                <svg width="11" height="11" viewBox="0 0 24 24" fill={msg.bookmarked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                                </svg>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* DM input - fixed */}
                <div className="fixed bottom-[57px] left-0 right-0 z-40 flex justify-center pointer-events-none">
                  <div className="w-full max-w-[430px] pointer-events-auto px-4 py-3 border-t border-[var(--color-line)] bg-[var(--color-bg)] flex gap-2 items-end">
                    <div className="flex-1 bg-[var(--color-bg-soft)] rounded-2xl px-4 py-2.5 border border-[var(--color-line)]">
                      <input className="w-full bg-transparent text-sm outline-none placeholder-[var(--color-mute)]"
                        placeholder="メッセージを入力..." value={dmInput}
                        onChange={e => setDmInput(e.target.value)}
                        onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendDm(); } }} />
                    </div>
                    <button onClick={sendDm} disabled={!dmInput.trim()}
                      className="flex-none w-10 h-10 rounded-full flex items-center justify-center transition disabled:opacity-40"
                      style={{ background: "linear-gradient(135deg,#CBAE74,#B8985A)" }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0B0F16" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ===== Timeline Feed ===== */}
        {!showDm && (
          <>
            {/* Tabs */}
            <div className="flex border-b border-[var(--color-line)] sticky top-[57px] z-30 bg-[var(--color-bg)]/95 backdrop-blur-md">
              {(["intro", "official", "all", "following"] as TabKey[]).map(t => (
                <button key={t} onClick={() => setTab(t)}
                  className={`flex-1 py-3 font-display text-[11px] tracking-wide transition relative ${tab === t ? "border-b-2 text-[var(--color-ink)]" : "text-[var(--color-mute)]"}`}
                  style={tab === t ? { borderBottomColor: "var(--color-accent-deep)" } : {}}>
                  {TAB_LABELS[t]}
                  {TAB_UNREAD[t] !== undefined && tab !== t && (
                    <span className="absolute top-1.5 right-1 w-3.5 h-3.5 rounded-full text-[8px] font-display flex items-center justify-center leading-none"
                      style={{ background: "var(--color-accent)", color: "#0B0F16" }}>{TAB_UNREAD[t]}</span>
                  )}
                </button>
              ))}
            </div>

            {/* Posts */}
            <div>
              {shown.map(p => (
                <div key={p.id} className="px-4 py-4 border-b border-[var(--color-line)] relative">
                  <div className="flex gap-3">
                    <Avatar src={p.avatar} name={p.name} size={10} />
                    <div className="flex-1 min-w-0">

                      {/* Header */}
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-baseline gap-1.5 flex-wrap min-w-0">
                          <span className="font-display text-sm font-semibold">{p.name}</span>
                          <span className="font-display text-[10px] text-[var(--color-mute)]">{p.handle}</span>
                          <span className="font-display text-[10px] text-[var(--color-mute)]">· {p.time}</span>
                          {!p.isOwn && <span className="tag text-[9px] px-2 py-0.5">{p.role}</span>}
                        </div>
                        <div className="flex items-center gap-1.5 flex-none">
                          {p.following && !p.isOwn && (
                            <button onClick={() => setPosts(prev => prev.map(pp => pp.id === p.id ? { ...pp, following: false } : pp))}
                              className="font-display text-[10px] px-2.5 py-1 rounded-full border transition hover:opacity-70"
                              style={{ color: "#67c6e3", borderColor: "rgba(103,198,227,0.4)" }}>
                              フォロー中
                            </button>
                          )}
                          {!p.following && !p.isOwn && (
                            <button onClick={() => setPosts(prev => prev.map(pp => pp.id === p.id ? { ...pp, following: true } : pp))}
                              className="font-display text-[10px] px-2.5 py-1 rounded-full border border-[var(--color-accent)] text-[var(--color-accent-deep)] hover:bg-[var(--color-accent)]/10 transition">
                              フォロー
                            </button>
                          )}
                          {/* ⋮ menu */}
                          <div className="relative">
                            <button onClick={e => { e.stopPropagation(); setMenuOpen(menuOpen === p.id ? null : p.id); setRxPicker(null); }}
                              className="text-[var(--color-mute)] hover:text-[var(--color-ink)] transition w-6 h-6 flex items-center justify-center">
                              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                                <circle cx="12" cy="5" r="1.5" /><circle cx="12" cy="12" r="1.5" /><circle cx="12" cy="19" r="1.5" />
                              </svg>
                            </button>
                            {menuOpen === p.id && (
                              <div className="absolute right-0 top-7 z-50 w-44 bg-[var(--color-bg-soft)] border border-[var(--color-line)] rounded-xl shadow-xl overflow-hidden" onClick={e => e.stopPropagation()}>
                                <button onClick={() => { navigator.clipboard.writeText(p.body).catch(() => {}); setMenuOpen(null); }}
                                  className="w-full text-left px-4 py-3 font-display text-xs hover:bg-[var(--color-line)] transition">
                                  テキストをコピー
                                </button>
                                {p.isOwn && (
                                  <button onClick={() => { setPosts(prev => prev.map(pp => pp.id === p.id ? { ...pp, deleted: true } : pp)); setMenuOpen(null); }}
                                    className="w-full text-left px-4 py-3 font-display text-xs text-red-400 hover:bg-[var(--color-line)] transition">
                                    送信取消
                                  </button>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Body */}
                      <p className="text-sm text-[var(--color-ink-soft)] leading-relaxed mt-1.5">{p.body}</p>

                      {/* Images */}
                      <PostImages images={p.images} onView={setPhotoView} />

                      {/* Action bar */}
                      <div className="flex items-center gap-4 mt-3">
                        {/* Reply */}
                        <button
                          onClick={() => setOpenReplies(prev => { const n = new Set(prev); n.has(p.id) ? n.delete(p.id) : n.add(p.id); return n; })}
                          className="flex items-center gap-1.5 text-xs text-[var(--color-mute)] hover:text-[var(--color-accent-deep)] transition">
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                          </svg>
                          <span className="num">{p.replies.length}</span>
                        </button>

                        {/* Reaction picker */}
                        <div className="relative">
                          <button onClick={e => { e.stopPropagation(); setRxPicker(rxPicker === p.id ? null : p.id); setMenuOpen(null); }}
                            className="flex items-center gap-1 text-xs transition"
                            style={{ color: REACTIONS.some(r => p.rx[r.emoji].mine) ? "var(--color-accent-deep)" : "var(--color-mute)" }}>
                            {(() => {
                              const myRx = REACTIONS.find(r => p.rx[r.emoji].mine);
                              const total = REACTIONS.reduce((s, r) => s + p.rx[r.emoji].count, 0);
                              return myRx
                                ? <><span className="text-base leading-none">{myRx.emoji}</span><span className="num ml-0.5">{total}</span></>
                                : <>
                                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                      <circle cx="12" cy="12" r="10" /><path d="M8 13s1.5 2 4 2 4-2 4-2" />
                                      <line x1="9" y1="9" x2="9.01" y2="9" /><line x1="15" y1="9" x2="15.01" y2="9" />
                                    </svg>
                                    {total > 0 && <span className="num">{total}</span>}
                                  </>;
                            })()}
                          </button>
                          {rxPicker === p.id && (
                            <div className="absolute bottom-8 left-0 z-50 flex gap-0.5 p-1.5 bg-[var(--color-bg-soft)] border border-[var(--color-line)] rounded-2xl shadow-xl" onClick={e => e.stopPropagation()}>
                              {REACTIONS.map(r => (
                                <button key={r.emoji} onClick={() => toggleRx(p.id, r.emoji)}
                                  title={r.label}
                                  className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-[var(--color-line)] transition text-lg"
                                  style={p.rx[r.emoji].mine ? { background: "var(--color-accent)", borderRadius: "50%" } : {}}>
                                  {r.emoji}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Heart like — independent from reactions */}
                        <button
                          onClick={() => setPosts(prev => prev.map(pp => pp.id === p.id ? { ...pp, likes: pp.liked ? pp.likes - 1 : pp.likes + 1, liked: !pp.liked } : pp))}
                          className="flex items-center gap-1 text-xs transition"
                          style={{ color: p.liked ? "#f87171" : "var(--color-mute)" }}>
                          <svg width="15" height="15" viewBox="0 0 24 24" fill={p.liked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                          </svg>
                          {p.isOwn && p.likes > 0 && <span className="num">{p.likes}</span>}
                        </button>

                        {/* Bookmark — direct on action bar */}
                        <button
                          onClick={() => setPosts(prev => prev.map(pp => pp.id === p.id ? { ...pp, bookmarked: !pp.bookmarked } : pp))}
                          className="flex items-center gap-1 text-xs transition"
                          style={{ color: p.bookmarked ? "var(--color-accent-deep)" : "var(--color-mute)" }}>
                          <svg width="15" height="15" viewBox="0 0 24 24" fill={p.bookmarked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                          </svg>
                        </button>

                        {/* Share */}
                        <button onClick={() => setShareSheet(p)} className="ml-auto text-[var(--color-mute)] hover:text-[var(--color-accent-deep)] transition">
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
                            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                          </svg>
                        </button>
                      </div>

                      {/* Reply thread */}
                      {openReplies.has(p.id) && (
                        <div className="mt-3 border-t border-[var(--color-line)] pt-3">
                          <div className="space-y-3 mb-3">
                            {p.replies.map(r => (
                              <div key={r.id} className="flex gap-2.5">
                                <Avatar src={r.avatar} name={r.name} size={8} />
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-baseline gap-1.5 flex-wrap">
                                    <span className="font-display text-xs font-semibold">{r.name}</span>
                                    <span className="font-display text-[10px] text-[var(--color-mute)]">{r.handle} · {r.time}</span>
                                  </div>
                                  <p className="text-xs text-[var(--color-ink-soft)] leading-relaxed mt-0.5">{r.body}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                          <div className="flex gap-2.5 pt-2 border-t border-[var(--color-line)]">
                            <Avatar src={MY_AVATAR} name={MY_NAME} size={8} />
                            <div className="flex-1">
                              <input className="w-full bg-transparent text-xs text-[var(--color-ink)] placeholder-[var(--color-mute)] outline-none"
                                placeholder="返信する..."
                                value={replyDraft[p.id] ?? ""}
                                onChange={e => setReplyDraft(prev => ({ ...prev, [p.id]: e.target.value }))}
                                onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); submitReply(p.id); } }} />
                            </div>
                            <button onClick={() => submitReply(p.id)} disabled={!(replyDraft[p.id] ?? "").trim()}
                              className="font-display text-[10px] px-3 py-1 rounded-full disabled:opacity-40 transition"
                              style={{ background: "var(--color-accent)", color: "#0B0F16" }}>返信</button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {shown.length === 0 && (
                <div className="px-5 py-16 text-center font-display text-sm text-[var(--color-mute)]">投稿がありません</div>
              )}
            </div>

            {/* Floating + button — above マイページ tab */}
            <button onClick={() => setShowCompose(true)}
              className="fixed z-40 w-12 h-12 rounded-full flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-transform"
              style={{ background: "linear-gradient(135deg,#CBAE74,#B8985A)", bottom: "calc(57px + 12px)", right: 12 }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0B0F16" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
              </svg>
            </button>
          </>
        )}

        {/* ===== Compose Modal ===== */}
        {showCompose && (
          <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60" onClick={() => setShowCompose(false)}>
            <div className="w-full max-w-[430px] bg-[var(--color-bg-soft)] rounded-t-3xl px-5 pt-4 pb-24" onClick={e => e.stopPropagation()}>
              <div className="w-10 h-1 bg-[var(--color-line)] rounded-full mx-auto mb-4" />
              <div className="flex gap-3 mb-4">
                <Avatar src={MY_AVATAR} name={MY_NAME} size={10} />
                <div className="flex-1">
                  <textarea
                    className="w-full bg-transparent text-sm text-[var(--color-ink)] placeholder-[var(--color-mute)] outline-none resize-none leading-relaxed"
                    placeholder="いまどうしてる？" rows={4} value={draft}
                    onChange={e => setDraft(e.target.value)} autoFocus />
                  {draftImages.length > 0 && (
                    <div className="flex gap-2 mt-2 flex-wrap">
                      {draftImages.map((img, i) => (
                        <div key={i} className="relative w-20 h-20 rounded-lg overflow-hidden">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={img} alt="" className="w-full h-full object-cover" />
                          <button onClick={() => setDraftImages(prev => prev.filter((_, j) => j !== i))}
                            className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/60 text-white text-[10px] flex items-center justify-center">×</button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center justify-between border-t border-[var(--color-line)] pt-3">
                <button onClick={() => fileRef.current?.click()} disabled={draftImages.length >= 4}
                  className="text-[var(--color-accent-deep)] disabled:opacity-30">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" />
                  </svg>
                </button>
                <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={e => {
                  const files = Array.from(e.target.files ?? []).slice(0, 4 - draftImages.length);
                  files.forEach(f => { const url = URL.createObjectURL(f); setDraftImages(prev => [...prev, url].slice(0, 4)); });
                }} />
                <button onClick={submit} disabled={!draft.trim() && !draftImages.length}
                  className="font-display text-sm px-6 py-2.5 rounded-full transition disabled:opacity-40"
                  style={{ background: "linear-gradient(135deg,#CBAE74,#B8985A)", color: "#0B0F16" }}>
                  投稿する
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ===== Photo Lightbox ===== */}
        {photoView && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
            onClick={() => setPhotoView(null)}>
            <button className="absolute top-4 right-4 text-white/70 hover:text-white transition">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
            <div className="w-full max-w-[430px] px-4" onClick={e => e.stopPropagation()}>
              {isG(photoView)
                ? <div style={{ background: getG(photoView), height: 320, borderRadius: 16 }} />
                // eslint-disable-next-line @next/next/no-img-element
                : <img src={photoView} alt="" className="w-full rounded-2xl" style={{ maxHeight: 480, objectFit: "contain" }} />
              }
            </div>
          </div>
        )}

        {/* ===== Group Create Modal ===== */}
        {showGroupCreate && (
          <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60" onClick={() => setShowGroupCreate(false)}>
            <div className="w-full max-w-[430px] bg-[var(--color-bg-soft)] rounded-t-3xl px-5 pt-4 pb-24" onClick={e => e.stopPropagation()}>
              <div className="w-10 h-1 bg-[var(--color-line)] rounded-full mx-auto mb-4" />
              <h2 className="font-display text-lg mb-4">グループを作成</h2>
              <div className="mb-4">
                <label className="font-display text-xs text-[var(--color-mute)] block mb-2">グループ名</label>
                <input
                  className="w-full bg-[var(--color-bg)] border border-[var(--color-line)] rounded-xl px-4 py-3 text-sm text-[var(--color-ink)] outline-none font-display"
                  placeholder="例：ワインクラブグループ"
                  value={groupName}
                  onChange={e => setGroupName(e.target.value)}
                />
              </div>
              <div className="mb-5">
                <label className="font-display text-xs text-[var(--color-mute)] block mb-2">メンバーを選択</label>
                <div className="space-y-1">
                  {INIT_DMS.filter(d => !d.isGroup).map(d => (
                    <button key={d.id}
                      onClick={() => setGroupSelected(prev => prev.includes(d.id) ? prev.filter(x => x !== d.id) : [...prev, d.id])}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition text-left"
                      style={{ background: groupSelected.includes(d.id) ? "rgba(184,152,90,0.12)" : "var(--color-bg)", border: `1px solid ${groupSelected.includes(d.id) ? "var(--color-accent)" : "var(--color-line)"}` }}>
                      <Avatar src={d.avatar} name={d.name} size={9} />
                      <span className="font-display text-sm flex-1">{d.name}</span>
                      {groupSelected.includes(d.id) && (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent-deep)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12"/>
                        </svg>
                      )}
                    </button>
                  ))}
                </div>
              </div>
              <button
                disabled={!groupName.trim() || groupSelected.length < 2}
                onClick={() => {
                  const newGroup: DmConv = { id: Date.now(), name: groupName.trim(), handle: `group_${Date.now()}`, avatar: "👥", lastMsg: "グループが作成されました", time: "たった今", unread: 0, isGroup: true };
                  setDms(prev => [newGroup, ...prev]);
                  setGroupName(""); setGroupSelected([]); setShowGroupCreate(false);
                }}
                className="w-full py-3.5 rounded-full font-display text-sm transition disabled:opacity-40"
                style={{ background: "linear-gradient(135deg,#CBAE74,#B8985A)", color: "#0B0F16" }}>
                グループを作成する {groupSelected.length > 0 && `(${groupSelected.length}人選択中)`}
              </button>
            </div>
          </div>
        )}

        {/* ===== Share Sheet ===== */}
        {shareSheet && (
          <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60" onClick={() => setShareSheet(null)}>
            <div className="w-full max-w-[430px] bg-[var(--color-bg-soft)] rounded-t-3xl px-5 pt-4 pb-24" onClick={e => e.stopPropagation()}>
              <div className="w-10 h-1 bg-[var(--color-line)] rounded-full mx-auto mb-5" />
              <h2 className="font-display text-lg mb-4">共有</h2>
              <div className="space-y-2">
                {[
                  { label: "リンクをコピー", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" /></svg> },
                  { label: "DM で送る", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></svg> },
                ].map(item => (
                  <button key={item.label} onClick={() => setShareSheet(null)}
                    className="w-full flex items-center gap-4 px-5 py-3.5 rounded-xl bg-[var(--color-bg)] hover:bg-[var(--color-line)] transition text-left">
                    <span className="text-[var(--color-accent-deep)]">{item.icon}</span>
                    <span className="font-display text-sm">{item.label}</span>
                  </button>
                ))}
              </div>
              <button onClick={() => setShareSheet(null)} className="w-full mt-4 py-3.5 rounded-xl font-display text-sm text-[var(--color-mute)] hover:text-[var(--color-ink)] border border-[var(--color-line)] transition">
                キャンセル
              </button>
            </div>
          </div>
        )}

        {/* ===== DM Profile Sheet ===== */}
        {profileSheet && (() => {
          const prof = PROFILES[profileSheet.handle];
          return (
            <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60" onClick={() => setProfileSheet(null)}>
              <div className="w-full max-w-[430px] bg-[var(--color-bg-soft)] rounded-t-3xl pt-4 pb-24 overflow-y-auto max-h-[90vh]" onClick={e => e.stopPropagation()}>
                <div className="w-10 h-1 bg-[var(--color-line)] rounded-full mx-auto mb-4" />
                {prof ? (
                  <div className="px-5 space-y-5">
                    <div className="flex items-start gap-4">
                      <Avatar src={prof.avatar} name={prof.name} size={20} />
                      <div className="flex-1 min-w-0 pt-1">
                        <div className="font-display text-base font-semibold text-[var(--color-ink)]">{prof.name}</div>
                        <div className="font-display text-sm text-[var(--color-mute)] mt-0.5">{prof.handle}</div>
                        <span className="tag text-[9px] px-2 py-0.5 mt-1 inline-block">{prof.rank}</span>
                      </div>
                    </div>
                    <p className="text-sm text-[var(--color-ink-soft)] leading-relaxed">{prof.bio}</p>
                    <div className="flex gap-4">
                      <div className="flex items-center gap-1.5 text-xs text-[var(--color-mute)]">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
                        </svg>
                        <span className="font-display">{prof.job}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-[var(--color-mute)]">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
                        </svg>
                        <span className="font-display">{prof.location}</span>
                      </div>
                    </div>
                    <div>
                      <div className="font-display text-xs text-[var(--color-mute)] mb-3">参加中のクラブ</div>
                      <div className="flex gap-2 flex-wrap">
                        {prof.clubs.map(c => (
                          <Link key={c.id} href={`/clubs/${c.id}`}
                            className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-[var(--color-line)] bg-[var(--color-bg)] hover:border-[var(--color-accent)]/50 transition">
                            <span className="text-base leading-none">{c.icon}</span>
                            <span className="font-display text-xs">{c.name}</span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="px-5 py-8 text-center font-display text-sm text-[var(--color-mute)]">プロフィールが見つかりません</div>
                )}
                <button onClick={() => setProfileSheet(null)}
                  className="mx-5 mt-5 w-[calc(100%-40px)] py-3.5 rounded-full font-display text-sm text-[var(--color-mute)] hover:text-[var(--color-ink)] border border-[var(--color-line)] transition">
                  閉じる
                </button>
              </div>
            </div>
          );
        })()}

        <BottomNav />
      </div>
    </div>
  );
}
