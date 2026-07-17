"use client";
import { useState, useEffect, useRef, Suspense } from "react";
import BottomNav from "@/components/BottomNav";
import AppHeader from "@/components/AppHeader";
import "leaflet/dist/leaflet.css";

type Store = {
  id: number;
  name: string;
  area: string;
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
};

const stores: Store[] = [
  {
    id: 1, name: "La Cave", area: "麻布十番", cat: "ワインバー",
    image: "/images/bar.png",
    address: "港区麻布十番2-5-6 B1F", hours: "18:00〜25:00（日曜定休）",
    benefit: "ワイン1杯無料", benefitDetail: "ご来店時に会員証を提示で、グラスワイン1杯をサービス",
    discount: "10%OFF",
    intro: "ブルゴーニュを中心に厳選した自然派ワインが揃う隠れ家バー。COMMONSのワインサロンも定期開催しており、会員同士の語らいの場として最適です。",
    active: true, isPartner: true, lat: 35.6556, lng: 139.7363,
    googleMapsUrl: "https://maps.google.com/?q=港区麻布十番2-5-6",
  },
  {
    id: 2, name: "Coffee Commons", area: "代官山", cat: "コーヒー",
    image: "/images/cafe.png",
    address: "渋谷区猿楽町17-8", hours: "08:00〜20:00（無休）",
    benefit: "コーヒー1杯無料", benefitDetail: "毎月1回、任意のドリンク1杯無料",
    discount: "10%OFF",
    intro: "スペシャルティコーヒーに特化したCOMMONSオフィシャルカフェ。朝活・仕事利用はもちろん、週末のコーヒーイベント会場としても定番です。",
    active: true, isPartner: true, lat: 35.6485, lng: 139.7030,
    googleMapsUrl: "https://maps.google.com/?q=渋谷区猿楽町17-8",
  },
  {
    id: 3, name: "Gallery AXIS", area: "六本木", cat: "アートギャラリー",
    image: "/images/gallery.png",
    address: "港区六本木5-17-1", hours: "11:00〜20:00（月曜定休）",
    benefit: "入場料無料", benefitDetail: "企画展・常設展ともに入場無料",
    discount: "—",
    intro: "国内外のアーティストによる企画展を月替わりで開催。COMMONSのアートギャラリー巡りイベントのメイン会場として、感度の高い会員に人気のスポットです。",
    active: true, isPartner: true, lat: 35.6618, lng: 139.7310,
    googleMapsUrl: "https://maps.google.com/?q=港区六本木5-17-1",
  },
  {
    id: 4, name: "Cask", area: "西麻布", cat: "ウイスキーバー",
    image: "/images/wine.png",
    address: "港区西麻布2-12-4", hours: "19:00〜27:00（日月定休）",
    benefit: "ウイスキー1杯無料", benefitDetail: "スタンダードクラスのウイスキー1杯をサービス",
    discount: "15%OFF",
    intro: "スコッチからジャパニーズまで500本以上のウイスキーを擁するバー。落ち着いた大人の空間で、ゆったりとした時間を楽しめます。",
    active: false, isPartner: true, lat: 35.6587, lng: 139.7250,
    googleMapsUrl: "https://maps.google.com/?q=港区西麻布2-12-4",
  },
  {
    id: 5, name: "The Library", area: "渋谷", cat: "バー",
    image: "/images/wisky.png",
    address: "渋谷区道玄坂1-22-7 2F", hours: "17:00〜26:00（月曜定休）",
    benefit: "入店料無料", benefitDetail: "通常¥1,500の入店料が無料",
    discount: "飲み物20%OFF",
    intro: "本棚に囲まれた読書バーをコンセプトにした渋谷の隠れ家。静かな会話と良質なカクテルが楽しめ、会員同士の少人数での集まりにも最適です。",
    active: true, isPartner: true, lat: 35.6595, lng: 139.6987,
    googleMapsUrl: "https://maps.google.com/?q=渋谷区道玄坂1-22-7",
  },
];

const cats  = ["すべて", "ワインバー", "コーヒー", "アートギャラリー", "ウイスキーバー", "バー"];
const areas = ["すべて", "麻布十番", "代官山", "六本木", "西麻布", "渋谷"];

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
    <div className="relative" style={{ height: 380 }}>
      <div ref={mapEl} style={{ height: 380, width: "100%" }} />

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

// ---- Main ----
function StoresContent() {
  const [tab,         setTab]         = useState<"map" | "list">("map");
  const [filterCat,   setFilterCat]   = useState("すべて");
  const [filterArea,  setFilterArea]  = useState("すべて");
  const [partnerOnly, setPartnerOnly] = useState(false);

  const filtered = stores.filter(s => {
    if (partnerOnly && !s.isPartner) return false;
    if (filterCat  !== "すべて" && s.cat  !== filterCat)  return false;
    if (filterArea !== "すべて" && s.area !== filterArea) return false;
    return true;
  });

  return (
    <div className="flex justify-center bg-[var(--color-bg)] min-h-screen">
      <div className="w-full max-w-[430px] pb-24">
        <AppHeader />

        {/* マップビュー / リストビュー タブ */}
        <div className="flex border-b border-[var(--color-line)]">
          {(["map", "list"] as const).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 py-3.5 font-display text-xs tracking-[0.06em] transition border-b-2 ${tab === t ? "text-[var(--color-accent-deep)]" : "text-[var(--color-mute)] border-transparent"}`}
              style={tab === t ? { borderBottomColor: "var(--color-accent-deep)" } : {}}
            >
              {t === "map" ? "マップビュー" : "リストビュー"}
            </button>
          ))}
        </div>

        {/* 提携店舗のみ チェックボックス（絞り込み外・独立） */}
        <div className="px-5 pt-3 pb-0 flex items-center gap-2">
          <input
            type="checkbox"
            id="partner-only"
            checked={partnerOnly}
            onChange={e => setPartnerOnly(e.target.checked)}
            className="w-4 h-4 accent-[var(--color-accent)] cursor-pointer"
          />
          <label htmlFor="partner-only" className="font-display text-xs cursor-pointer select-none">
            提携店舗のみ表示
          </label>
        </div>

        {/* 絞り込み: ジャンル・エリア */}
        <div className="px-5 pt-3 space-y-2">
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
            {cats.map(c => (
              <button
                key={c}
                onClick={() => setFilterCat(c)}
                className={`flex-none font-display text-[10px] px-3 py-1.5 rounded-full border transition ${filterCat === c ? "bg-[var(--color-accent)]/15 border-[var(--color-accent)] text-[var(--color-accent-deep)]" : "border-[var(--color-line)] text-[var(--color-mute)]"}`}
              >
                {c}
              </button>
            ))}
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
            {areas.map(a => (
              <button
                key={a}
                onClick={() => setFilterArea(a)}
                className={`flex-none font-display text-[10px] px-3 py-1.5 rounded-full border transition ${filterArea === a ? "bg-[var(--color-accent)]/15 border-[var(--color-accent)] text-[var(--color-accent-deep)]" : "border-[var(--color-line)] text-[var(--color-mute)]"}`}
              >
                {a}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-2 px-5 font-display text-[10px] text-[var(--color-mute)]">{filtered.length}件</div>

        {tab === "map"  && <MapView  stores={filtered} />}
        {tab === "list" && <ListView stores={filtered} />}

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
