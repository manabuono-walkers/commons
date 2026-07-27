"use client";
import { useState, useEffect, useRef, Suspense } from "react";
import BottomNav from "@/components/BottomNav";
import AppHeader from "@/components/AppHeader";
import "leaflet/dist/leaflet.css";

type Scene = "デート" | "接待・ビジネス" | "女子会" | "二軒目" | "記念日" | "お一人様";
type TimeSlot = "ランチ" | "ディナー" | "深夜";

type Store = {
  id: number;
  name: string;
  area: string;
  station: string;
  cat: string;
  image: string;
  address: string;
  hours: string;
  benefit: string;
  benefitDetail: string;
  discount: string;
  intro: string;
  active: boolean;
  isPartner: boolean;
  lat: number;
  lng: number;
  googleMapsUrl: string;
  scenes: Scene[];
  times: TimeSlot[];
};

const stores: Store[] = [
  {
    id: 1, name: "La Cave", area: "麻布十番", station: "麻布十番駅", cat: "ワインバー",
    image: "/images/bar.png",
    address: "港区麻布十番2-5-6 B1F", hours: "18:00〜25:00（日曜定休）",
    benefit: "ワイン1杯無料", benefitDetail: "ご来店時に会員証を提示で、グラスワイン1杯をサービス",
    discount: "10%OFF",
    intro: "ブルゴーニュを中心に厳選した自然派ワインが揃う隠れ家バー。COMMONSのワインサロンも定期開催しており、会員同士の語らいの場として最適です。",
    active: true, isPartner: true, lat: 35.6556, lng: 139.7363,
    googleMapsUrl: "https://maps.google.com/?q=港区麻布十番2-5-6",
    scenes: ["デート", "記念日", "接待・ビジネス"], times: ["ディナー", "深夜"],
  },
  {
    id: 2, name: "Coffee Commons", area: "代官山", station: "代官山駅", cat: "コーヒー",
    image: "/images/cafe.png",
    address: "渋谷区猿楽町17-8", hours: "08:00〜20:00（無休）",
    benefit: "コーヒー1杯無料", benefitDetail: "毎月1回、任意のドリンク1杯無料",
    discount: "10%OFF",
    intro: "スペシャルティコーヒーに特化したCOMMONSオフィシャルカフェ。朝活・仕事利用はもちろん、週末のコーヒーイベント会場としても定番です。",
    active: true, isPartner: true, lat: 35.6485, lng: 139.7030,
    googleMapsUrl: "https://maps.google.com/?q=渋谷区猿楽町17-8",
    scenes: ["お一人様", "女子会", "デート"], times: ["ランチ"],
  },
  {
    id: 3, name: "Gallery AXIS", area: "六本木", station: "六本木駅", cat: "アートギャラリー",
    image: "/images/gallery.png",
    address: "港区六本木5-17-1", hours: "11:00〜20:00（月曜定休）",
    benefit: "入場料無料", benefitDetail: "企画展・常設展ともに入場無料",
    discount: "—",
    intro: "国内外のアーティストによる企画展を月替わりで開催。COMMONSのアートギャラリー巡りイベントのメイン会場として、感度の高い会員に人気のスポットです。",
    active: true, isPartner: true, lat: 35.6618, lng: 139.7310,
    googleMapsUrl: "https://maps.google.com/?q=港区六本木5-17-1",
    scenes: ["デート", "女子会", "記念日"], times: ["ランチ", "ディナー"],
  },
  {
    id: 4, name: "Cask", area: "西麻布", station: "広尾駅", cat: "バー",
    image: "/images/wine.png",
    address: "港区西麻布2-12-4", hours: "19:00〜27:00（日月定休）",
    benefit: "ウイスキー1杯無料", benefitDetail: "スタンダードクラスのウイスキー1杯をサービス",
    discount: "15%OFF",
    intro: "スコッチからジャパニーズまで500本以上のウイスキーを擁するバー。落ち着いた大人の空間で、ゆったりとした時間を楽しめます。",
    active: false, isPartner: true, lat: 35.6587, lng: 139.7250,
    googleMapsUrl: "https://maps.google.com/?q=港区西麻布2-12-4",
    scenes: ["接待・ビジネス", "二軒目", "デート"], times: ["ディナー", "深夜"],
  },
  {
    id: 5, name: "The Library", area: "渋谷", station: "渋谷駅", cat: "バー",
    image: "/images/wisky.png",
    address: "渋谷区道玄坂1-22-7 2F", hours: "17:00〜26:00（月曜定休）",
    benefit: "入店料無料", benefitDetail: "通常¥1,500の入店料が無料",
    discount: "飲み物20%OFF",
    intro: "本棚に囲まれた読書バーをコンセプトにした渋谷の隠れ家。静かな会話と良質なカクテルが楽しめ、会員同士の少人数での集まりにも最適です。",
    active: true, isPartner: true, lat: 35.6595, lng: 139.6987,
    googleMapsUrl: "https://maps.google.com/?q=渋谷区道玄坂1-22-7",
    scenes: ["二軒目", "お一人様", "女子会"], times: ["ディナー", "深夜"],
  },
];

interface ChatMessage {
  role: "user" | "ai";
  text: string;
  storeIds?: number[];
}

const AI_SUGGESTIONS = ["デート向けのお店は？", "接待で使えるお店ある？", "麻布十番で二軒目の候補は？", "一人でも入りやすいお店は？"];

function matchStores(query: string): Store[] {
  const q = query.toLowerCase();
  const matched = stores.filter(s => {
    if (!s.active) return false;
    if (SCENES.some(sc => q.includes(sc.toLowerCase()) && s.scenes.includes(sc))) return true;
    if (GENRES.some(g => g !== "すべて" && q.includes(g.toLowerCase()) && s.cat === g)) return true;
    if (AREAS.some(a => a !== "すべて" && q.includes(a.toLowerCase()) && s.area === a)) return true;
    if (TIMES.some(t => q.includes(t.toLowerCase()) && s.times.includes(t))) return true;
    return s.name.toLowerCase().includes(q) || s.intro.includes(query);
  });
  if (matched.length > 0) return matched.slice(0, 3);
  return stores.filter(s => s.active && s.isPartner).slice(0, 3);
}

function buildAiReply(query: string, matches: Store[]): string {
  if (matches.length === 0) return "ご希望に近いお店が見つかりませんでした。エリアやシーンを変えてもう一度聞いてみてください。";
  return `「${query}」ですね。会員の皆さんに人気のこちらのお店はいかがでしょうか。`;
}

const GENRES = ["すべて", "ワインバー", "バー", "コーヒー", "アートギャラリー"];
const SCENES: Scene[] = ["デート", "接待・ビジネス", "女子会", "二軒目", "記念日", "お一人様"];
const TIMES: TimeSlot[] = ["ランチ", "ディナー", "深夜"];
const AREAS = ["すべて", "麻布十番", "代官山", "六本木", "西麻布", "渋谷"];

const SCENE_EMOJI: Record<Scene, string> = {
  "デート": "💑", "接待・ビジネス": "💼", "女子会": "👗",
  "二軒目": "🍸", "記念日": "🥂", "お一人様": "🪑",
};
const TIME_EMOJI: Record<TimeSlot, string> = { "ランチ": "☀️", "ディナー": "🌙", "深夜": "🌃" };

// ---- Map View (Leaflet tiles + React pins) ----
function MapView({ stores }: { stores: Store[] }) {
  const mapEl  = useRef<HTMLDivElement | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mapRef = useRef<any>(null);
  const [selected, setSelected] = useState<Store | null>(null);
  const [pinPositions, setPinPositions] = useState<{ id: number; x: number; y: number }[]>([]);

  function updatePins() {
    const map = mapRef.current;
    if (!map) return;
    setPinPositions(stores.map(s => {
      const pt = map.latLngToContainerPoint([s.lat, s.lng]);
      return { id: s.id, x: pt.x, y: pt.y };
    }));
  }

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const L = (await import("leaflet")).default;
      if (cancelled || !mapEl.current || mapRef.current) return;

      const map = L.map(mapEl.current, {
        center: [35.658, 139.715],
        zoom: 13,
        scrollWheelZoom: false,
        attributionControl: false,
        zoomControl: false,
      });

      L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
        subdomains: "abcd", maxZoom: 19,
      }).addTo(map);

      mapRef.current = map;

      map.on("moveend zoomend load", () => {
        if (!cancelled) updatePins();
      });

      map.whenReady(() => {
        if (!cancelled) updatePins();
      });
    })();
    return () => { cancelled = true; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Recalculate pin positions when stores change
  useEffect(() => { updatePins(); }, [stores]); // eslint-disable-line react-hooks/exhaustive-deps

  const storeMap = Object.fromEntries(stores.map(s => [s.id, s]));

  return (
    <div className="relative" style={{ height: 480 }}>
      <div ref={mapEl} style={{ height: 480, width: "100%" }} />

      {/* React-rendered pins — fully outside Leaflet's event system */}
      {pinPositions.map(p => {
        const s = storeMap[p.id];
        if (!s) return null;
        const isSelected = selected?.id === s.id;
        return (
          <button
            key={s.id}
            onClick={() => setSelected(isSelected ? null : s)}
            style={{
              position: "absolute",
              left: p.x - 16,
              top: p.y - 32,
              width: 32,
              height: 32,
              zIndex: 1000,
              background: "none",
              border: "none",
              padding: 0,
              cursor: "pointer",
            }}
          >
            <div style={{
              width: 32, height: 32,
              borderRadius: "50% 50% 50% 0",
              transform: "rotate(-45deg)",
              background: s.isPartner ? (isSelected ? "#CBAE74" : "#B8985A") : "#4a5568",
              border: `2px solid ${s.active ? "#CBAE74" : "#6b7280"}`,
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: isSelected ? "0 0 0 3px rgba(203,174,116,0.4), 0 2px 8px rgba(0,0,0,0.6)" : "0 2px 8px rgba(0,0,0,0.5)",
              transition: "all 0.15s",
            }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: s.active ? "#0B0F16" : "#2d3748", transform: "rotate(45deg)" }} />
            </div>
          </button>
        );
      })}

      {selected && (
        <div
          className="absolute bottom-0 left-0 right-0 bg-[var(--color-bg-soft)] border-t border-[var(--color-line)] rounded-t-2xl p-5 space-y-3"
          style={{ zIndex: 1001 }}
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="font-display text-base">{selected.name}</div>
              <div className="font-display text-[10px] text-[var(--color-mute)] mt-0.5">{selected.cat} · {selected.area}{!selected.active && " · 一時休業"}</div>
            </div>
            <button onClick={() => setSelected(null)} className="text-[var(--color-mute)] text-lg leading-none mt-0.5">✕</button>
          </div>
          <p className="text-xs text-[var(--color-mute)] leading-relaxed">{selected.intro}</p>
          <div className="space-y-1.5 text-xs">
            <div className="flex gap-2"><span className="text-[var(--color-mute)] w-14 flex-none">住所</span><span>{selected.address}</span></div>
            <div className="flex gap-2"><span className="text-[var(--color-mute)] w-14 flex-none">営業時間</span><span>{selected.hours}</span></div>
          </div>
          <div className="p-3 rounded-xl bg-[var(--color-bg)] border border-[var(--color-accent)]/30">
            <div className="font-display text-[10px] text-[var(--color-accent-deep)] mb-1">会員特典</div>
            <div className="text-sm font-bold">{selected.benefitDetail}</div>
            {selected.discount !== "—" && <div className="text-[10px] text-[var(--color-mute)] mt-1">その他: {selected.discount}</div>}
          </div>
          <a
            href={selected.googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-3 rounded-xl border border-[var(--color-accent)]/50 font-display text-sm text-[var(--color-accent-deep)] hover:bg-[var(--color-accent)]/10 transition"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2C8.686 2 6 4.686 6 8c0 4.5 6 12 6 12s6-7.5 6-12c0-3.314-2.686-6-6-6z"/><circle cx="12" cy="8" r="2"/>
            </svg>
            Googleマップで経路を見る
          </a>
        </div>
      )}
    </div>
  );
}

// ---- List View ----
function ListView({ stores }: { stores: Store[] }) {
  const [selected, setSelected] = useState<number | null>(null);
  return (
    <div className="px-5 pt-5 space-y-3">
      {stores.map(s => (
        <button
          key={s.id}
          onClick={() => setSelected(s.id === selected ? null : s.id)}
          className={`w-full text-left card overflow-hidden transition-all ${selected === s.id ? "border-[var(--color-accent)]" : ""}`}
        >
          <div className="h-[110px] bg-cover bg-center relative" style={{ backgroundImage: `url(${s.image})` }}>
            <div className="absolute inset-0 bg-black/45" />
            <div className="absolute bottom-3 left-4">
              <div className="font-display text-base text-white">{s.name}</div>
              <div className="font-display text-[10px] text-white/70 mt-0.5">{s.cat} · {s.area}{!s.active && " · 一時休業"}</div>
            </div>
            <div className="absolute top-3 right-3">
              <span className="font-display text-[10px] border border-[var(--color-accent)]/70 text-[var(--color-accent-deep)] bg-black/40 backdrop-blur-sm px-2.5 py-1 rounded-full">{s.benefit}</span>
            </div>
          </div>

          {selected === s.id && (
            <div className="p-4 space-y-2.5 text-xs border-t border-[var(--color-line)]">
              <p className="text-[var(--color-mute)] leading-relaxed">{s.intro}</p>
              <div className="flex gap-2"><span className="text-[var(--color-mute)] w-16 flex-none">住所</span><span>{s.address}</span></div>
              <div className="flex gap-2"><span className="text-[var(--color-mute)] w-16 flex-none">営業時間</span><span>{s.hours}</span></div>
              <div className="mt-1 p-3 rounded-xl bg-[var(--color-bg)] border border-[var(--color-accent)]/30">
                <div className="font-display text-[10px] text-[var(--color-accent-deep)] mb-1">会員特典</div>
                <div className="font-bold">{selected === s.id ? s.benefitDetail : ""}</div>
                {s.discount !== "—" && <div className="text-[var(--color-mute)] mt-1">その他: {s.discount}</div>}
              </div>
              <div className="rounded-xl overflow-hidden border border-[var(--color-line)]" style={{ height: 120 }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/images/Googlemap.png" alt="MAP" className="w-full h-full object-cover" />
              </div>
              <a
                href={s.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={e => e.stopPropagation()}
                className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl border border-[var(--color-accent)]/50 font-display text-xs text-[var(--color-accent-deep)] hover:bg-[var(--color-accent)]/10 transition"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2C8.686 2 6 4.686 6 8c0 4.5 6 12 6 12s6-7.5 6-12c0-3.314-2.686-6-6-6z"/><circle cx="12" cy="8" r="2"/>
                </svg>
                Googleマップで経路を見る
              </a>
            </div>
          )}
        </button>
      ))}
    </div>
  );
}

// ---- AI相談チャット ----
function AiStoreCard({ store }: { store: Store }) {
  return (
    <div className="flex gap-3 p-2.5 rounded-xl bg-[var(--color-bg)] border border-[var(--color-line)]">
      <div className="w-14 h-14 rounded-lg bg-cover bg-center flex-none" style={{ backgroundImage: `url(${store.image})` }} />
      <div className="min-w-0 flex-1">
        <div className="font-display text-xs truncate">{store.name}</div>
        <div className="font-display text-[9px] text-[var(--color-mute)] mt-0.5">{store.cat} · {store.area}</div>
        <div className="font-display text-[9px] text-[var(--color-accent-deep)] mt-1">{store.benefit}</div>
      </div>
      <a href={store.googleMapsUrl} target="_blank" rel="noopener noreferrer"
        className="flex-none self-center font-display text-[10px] px-2.5 py-1.5 rounded-full border border-[var(--color-accent)]/50 text-[var(--color-accent-deep)] hover:bg-[var(--color-accent)]/10 transition whitespace-nowrap">
        見る
      </a>
    </div>
  );
}

function AiConcierge({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: "ai", text: "こんにちは！シーンやエリア、気分を教えていただければ、COMMONS提携店舗の中からぴったりのお店をご提案します。" },
  ]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, thinking]);

  function send(text: string) {
    const query = text.trim();
    if (!query || thinking) return;
    setMessages(prev => [...prev, { role: "user", text: query }]);
    setInput("");
    setThinking(true);
    setTimeout(() => {
      const matches = matchStores(query);
      setMessages(prev => [...prev, { role: "ai", text: buildAiReply(query, matches), storeIds: matches.map(s => s.id) }]);
      setThinking(false);
    }, 900);
  }

  const storeMap = Object.fromEntries(stores.map(s => [s.id, s]));

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[1300] flex items-end justify-center" style={{ backgroundColor: "rgba(0,0,0,0.6)" }} onClick={onClose}>
      <div
        className="w-full max-w-[430px] bg-[var(--color-bg-soft)] rounded-t-2xl flex flex-col"
        style={{ height: "min(82vh, 82dvh)" }}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--color-line)] flex-none">
          <div className="flex items-center gap-2">
            <span className="text-lg">✨</span>
            <div>
              <div className="font-display text-sm">AIコンシェルジュ</div>
              <div className="font-display text-[9px] text-[var(--color-mute)]">提携店舗からおすすめを提案します</div>
            </div>
          </div>
          <button onClick={onClose} className="text-[var(--color-mute)] text-lg leading-none">✕</button>
        </div>

        <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-[var(--color-bg-soft)]">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[85%] space-y-2 ${m.role === "user" ? "" : ""}`}>
                <div className={
                  m.role === "user"
                    ? "font-display text-xs px-4 py-2.5 rounded-2xl rounded-br-sm bg-[var(--color-accent)] text-[#0B0F16]"
                    : "text-xs leading-relaxed px-4 py-2.5 rounded-2xl rounded-bl-sm bg-[var(--color-bg)] border border-[var(--color-line)]"
                }>
                  {m.text}
                </div>
                {m.storeIds && m.storeIds.length > 0 && (
                  <div className="space-y-2">
                    {m.storeIds.map(id => storeMap[id] && <AiStoreCard key={id} store={storeMap[id]} />)}
                  </div>
                )}
              </div>
            </div>
          ))}
          {thinking && (
            <div className="flex justify-start">
              <div className="text-xs px-4 py-2.5 rounded-2xl rounded-bl-sm bg-[var(--color-bg)] border border-[var(--color-line)] text-[var(--color-mute)]">
                考え中…
              </div>
            </div>
          )}
        </div>

        {messages.length <= 1 && (
          <div className="px-4 pb-2 flex gap-2 overflow-x-auto flex-none" style={{ scrollbarWidth: "none" }}>
            {AI_SUGGESTIONS.map(s => (
              <button key={s} onClick={() => send(s)}
                className="flex-none font-display text-[10px] px-3 py-1.5 rounded-full border border-[var(--color-line)] text-[var(--color-mute)] hover:border-[var(--color-accent)]/50 transition whitespace-nowrap">
                {s}
              </button>
            ))}
          </div>
        )}

        <div className="flex items-center gap-2 px-4 py-3 border-t border-[var(--color-line)] flex-none">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter") send(input); }}
            placeholder="例：デートで使える落ち着いたお店"
            className="flex-1 bg-[var(--color-bg)] border border-[var(--color-line)] rounded-full px-4 py-2.5 text-sm outline-none focus:border-[var(--color-accent)]/60 placeholder-[var(--color-mute)] font-display"
          />
          <button onClick={() => send(input)} disabled={!input.trim() || thinking}
            className="flex-none w-10 h-10 rounded-full bg-[var(--color-accent)] text-[#0B0F16] flex items-center justify-center disabled:opacity-40 transition">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

// ---- Main ----
function StoresContent() {
  const [tab,    setTab]    = useState<"map" | "list">("map");
  const [query,  setQuery]  = useState("");
  const [genre,  setGenre]  = useState("すべて");
  const [scene,  setScene]  = useState<Scene | "">("");
  const [time,   setTime]   = useState<TimeSlot | "">("");
  const [area,   setArea]   = useState("すべて");
  const [partnerOnly, setPartnerOnly] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [aiOpen, setAiOpen] = useState(false);

  const hasFilter = genre !== "すべて" || scene !== "" || time !== "" || area !== "すべて" || partnerOnly;

  const filtered = stores.filter(s => {
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      if (!s.name.toLowerCase().includes(q) && !s.area.toLowerCase().includes(q) && !s.station.toLowerCase().includes(q)) return false;
    }
    if (genre !== "すべて" && s.cat !== genre) return false;
    if (scene && !s.scenes.includes(scene)) return false;
    if (time  && !s.times.includes(time))   return false;
    if (area  !== "すべて" && s.area !== area) return false;
    if (partnerOnly && !s.isPartner) return false;
    return true;
  });

  const chip = (active: boolean) =>
    active
      ? "font-display text-[11px] px-3.5 py-2 rounded-full border transition flex-none bg-[var(--color-accent)] border-[var(--color-accent)] text-[#0B0F16]"
      : "font-display text-[11px] px-3.5 py-2 rounded-full border transition flex-none border-[var(--color-line)] text-[var(--color-mute)]";

  return (
    <div className="flex justify-center bg-[var(--color-bg)] min-h-screen">
      <div className="w-full max-w-[430px] pb-24">
        <AppHeader />

        {/* ===== 検索パネル ===== */}
        <div className="px-4 pt-4 pb-3 space-y-4 border-b border-[var(--color-line)]">

          {/* テキスト検索 */}
          <div className="relative">
            <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-[var(--color-mute)]"
              width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input
              type="text"
              placeholder="エリア・駅名・店名で検索…"
              value={query}
              onChange={e => setQuery(e.target.value)}
              className="w-full bg-[var(--color-bg-soft)] border border-[var(--color-line)] rounded-full pl-9 pr-8 py-2.5 text-sm outline-none focus:border-[var(--color-accent)]/60 placeholder-[var(--color-mute)] transition font-display"
            />
            {query && (
              <button onClick={() => setQuery("")} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--color-mute)]">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            )}
          </div>

          {/* 絞り込みトグル + AI相談 */}
          <div className="flex items-center justify-between gap-2">
            <button
              onClick={() => setShowFilters(v => !v)}
              className="flex items-center gap-2 font-display text-[11px] border px-3.5 py-2 rounded-full transition"
              style={showFilters
                ? { background: "rgba(184,152,90,0.12)", color: "var(--color-accent-deep)", borderColor: "var(--color-accent)" }
                : { borderColor: "var(--color-line)", color: "var(--color-mute)" }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
              </svg>
              絞り込み条件{hasFilter ? "（適用中）" : ""}
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                style={{ transform: showFilters ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>
            <button
              onClick={() => setAiOpen(true)}
              className="flex-none font-display text-[11px] px-3.5 py-2 rounded-full text-white transition hover:brightness-110"
              style={{ background: "linear-gradient(135deg, #a855f7, #7c3aed)", boxShadow: "0 4px 20px rgba(168,85,247,0.35)" }}
            >
              AIに相談する
            </button>
          </div>

          {showFilters && (<>
          {/* GENRE */}
          <div>
            <div className="font-display text-[9px] text-[var(--color-mute)] mb-1.5 tracking-widest">GENRE ／ ジャンル</div>
            <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
              {GENRES.map(g => (
                <button key={g} onClick={() => setGenre(g)} className={chip(genre === g)}>{g}</button>
              ))}
            </div>
          </div>

          {/* SCENE */}
          <div>
            <div className="font-display text-[9px] text-[var(--color-mute)] mb-1.5 tracking-widest">SCENE ／ 利用シーン</div>
            <div className="flex gap-2 flex-wrap">
              {SCENES.map(sc => (
                <button key={sc} onClick={() => setScene(scene === sc ? "" : sc)}
                  className={scene === sc
                    ? "font-display text-[11px] px-3.5 py-2 rounded-full border transition flex-none bg-[rgba(184,152,90,0.15)] border-[var(--color-accent)] text-[var(--color-accent-deep)]"
                    : "font-display text-[11px] px-3.5 py-2 rounded-full border transition flex-none border-[var(--color-line)] text-[var(--color-mute)]"}>
                  {SCENE_EMOJI[sc]} {sc}
                </button>
              ))}
            </div>
          </div>

          {/* TIME */}
          <div>
            <div className="font-display text-[9px] text-[var(--color-mute)] mb-1.5 tracking-widest">TIME ／ 時間帯</div>
            <div className="flex gap-2">
              {TIMES.map(t => (
                <button key={t} onClick={() => setTime(time === t ? "" : t)}
                  className={time === t
                    ? "font-display text-[11px] px-4 py-2 rounded-full border transition flex-none bg-[var(--color-accent)] border-[var(--color-accent)] text-[#0B0F16]"
                    : "font-display text-[11px] px-4 py-2 rounded-full border transition flex-none border-[var(--color-line)] text-[var(--color-mute)]"}>
                  {TIME_EMOJI[t]} {t}
                </button>
              ))}
            </div>
          </div>

          {/* AREA */}
          <div>
            <div className="font-display text-[9px] text-[var(--color-mute)] mb-1.5 tracking-widest">AREA ／ エリア</div>
            <select
              value={area}
              onChange={e => setArea(e.target.value)}
              className="w-full bg-[var(--color-bg-soft)] border border-[var(--color-line)] rounded-full px-4 py-2.5 text-sm text-[var(--color-ink)] outline-none focus:border-[var(--color-accent)]/60 font-display transition"
            >
              {AREAS.map(a => <option key={a} value={a}>{a}</option>)}
            </select>
          </div>

          {/* PARTNER ONLY */}
          <label className="flex items-center gap-2.5 cursor-pointer">
            <input type="checkbox" checked={partnerOnly} onChange={e => setPartnerOnly(e.target.checked)} className="accent-[var(--color-accent)]" />
            <span className="font-display text-xs text-[var(--color-mute)]">提携店舗のみ表示</span>
          </label>
          </>)}
        </div>

        {/* タブ + 件数 */}
        <div className="flex items-center border-b border-[var(--color-line)]">
          {(["map", "list"] as const).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 py-3 font-display text-xs tracking-[0.06em] transition border-b-2 ${tab === t ? "text-[var(--color-accent-deep)]" : "text-[var(--color-mute)] border-transparent"}`}
              style={tab === t ? { borderBottomColor: "var(--color-accent-deep)" } : {}}
            >
              {t === "map" ? "マップ" : "リスト"}
            </button>
          ))}
          <div className="px-4 font-display text-[10px] text-[var(--color-mute)] whitespace-nowrap">{filtered.length}件</div>
        </div>

        {tab === "map"  && <MapView  stores={filtered} />}
        {tab === "list" && <ListView stores={filtered} />}

        <AiConcierge open={aiOpen} onClose={() => setAiOpen(false)} />

        <BottomNav />
      </div>
    </div>
  );
}

export default function StoresPage() {
  return (
    <Suspense>
      <StoresContent />
    </Suspense>
  );
}
