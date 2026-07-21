"use client";

import { useEffect, useRef, useState } from "react";
import "leaflet/dist/leaflet.css";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

// ============ Types ============
type Scene = "デート" | "接待・ビジネス" | "女子会" | "二軒目" | "記念日" | "お一人様";
type TimeSlot = "ランチ" | "ディナー" | "深夜";

type Shop = {
  id: number;
  name: string;
  cat: string;
  area: string;
  station: string;
  address: string;
  perk: string;
  lat: number;
  lng: number;
  scenes: Scene[];
  times: TimeSlot[];
  features: string[];
  openHour: number;
  closeHour: number;
};

// ============ Data ============
const shops: Shop[] = [
  {
    id: 1, name: "La Cave 麻布十番", cat: "ワインバー", area: "麻布十番", station: "麻布十番駅",
    address: "東京都港区麻布十番2-3-1", perk: "会員はグラスワイン1杯サービス",
    lat: 35.6556, lng: 139.7363,
    scenes: ["デート", "記念日", "接待・ビジネス"], times: ["ディナー", "深夜"],
    features: ["個室あり", "カウンター"], openHour: 18, closeHour: 26,
  },
  {
    id: 2, name: "COMMONS BASE 代官山", cat: "カフェ", area: "代官山", station: "代官山駅",
    address: "東京都渋谷区代官山町11-1", perk: "コーヒー10%OFF・ラウンジ利用可",
    lat: 35.6485, lng: 139.7030,
    scenes: ["お一人様", "女子会", "デート"], times: ["ランチ", "ディナー"],
    features: ["テラス席", "Wi-Fi"], openHour: 9, closeHour: 21,
  },
  {
    id: 3, name: "The Library 渋谷", cat: "バー", area: "渋谷", station: "渋谷駅",
    address: "東京都渋谷区宇田川町16-8", perk: "チャージ無料",
    lat: 35.6595, lng: 139.6987,
    scenes: ["二軒目", "お一人様", "女子会"], times: ["ディナー", "深夜"],
    features: ["カウンター"], openHour: 18, closeHour: 27,
  },
  {
    id: 4, name: "Cask 西麻布", cat: "バー", area: "西麻布", station: "広尾駅",
    address: "東京都港区西麻布3-21-5", perk: "限定ボトルの先行案内",
    lat: 35.6587, lng: 139.7250,
    scenes: ["デート", "二軒目", "接待・ビジネス"], times: ["ディナー", "深夜"],
    features: ["個室あり", "カウンター"], openHour: 19, closeHour: 27,
  },
  {
    id: 5, name: "Atelier Nakameguro", cat: "アート", area: "中目黒", station: "中目黒駅",
    address: "東京都目黒区上目黒2-9-10", perk: "企画展の招待枠",
    lat: 35.6440, lng: 139.6990,
    scenes: ["デート", "女子会", "記念日"], times: ["ランチ", "ディナー"],
    features: ["テラス席"], openHour: 11, closeHour: 20,
  },
  {
    id: 6, name: "OSAKA SALON 北浜", cat: "ワインバー", area: "大阪・北浜", station: "北浜駅",
    address: "大阪府大阪市中央区北浜1-8-16", perk: "会員価格でのテイスティング",
    lat: 34.6915, lng: 135.5060,
    scenes: ["接待・ビジネス", "記念日", "デート"], times: ["ディナー"],
    features: ["個室あり"], openHour: 17, closeHour: 24,
  },
  {
    id: 7, name: "Bistro Blanc 広尾", cat: "レストラン", area: "広尾", station: "広尾駅",
    address: "東京都港区南麻布5-2-1", perk: "デザートプレートサービス",
    lat: 35.6520, lng: 139.7210,
    scenes: ["デート", "記念日", "女子会"], times: ["ランチ", "ディナー"],
    features: ["個室あり", "テラス席"], openHour: 11, closeHour: 23,
  },
  {
    id: 8, name: "Coffee Roasters 目黒", cat: "カフェ", area: "目黒", station: "目黒駅",
    address: "東京都目黒区目黒1-4-10", perk: "スペシャルティコーヒー豆10%OFF",
    lat: 35.6340, lng: 139.7160,
    scenes: ["お一人様", "デート"], times: ["ランチ"],
    features: ["カウンター", "Wi-Fi"], openHour: 8, closeHour: 18,
  },
  {
    id: 9, name: "Craft Sake Bar 六本木", cat: "バー", area: "六本木", station: "六本木駅",
    address: "東京都港区六本木6-10-1", perk: "利き酒セット1,000円OFF",
    lat: 35.6626, lng: 139.7323,
    scenes: ["接待・ビジネス", "二軒目", "デート"], times: ["ディナー", "深夜"],
    features: ["カウンター", "個室あり"], openHour: 17, closeHour: 26,
  },
  {
    id: 10, name: "Salon de Gourmet 銀座", cat: "レストラン", area: "銀座", station: "銀座駅",
    address: "東京都中央区銀座5-9-1", perk: "会員専用個室の優先予約",
    lat: 35.6717, lng: 139.7648,
    scenes: ["接待・ビジネス", "記念日", "デート"], times: ["ランチ", "ディナー"],
    features: ["個室あり"], openHour: 11, closeHour: 23,
  },
];

const GENRES = ["すべて", "ワインバー", "バー", "カフェ", "レストラン", "アート"];
const SCENES: Scene[] = ["デート", "接待・ビジネス", "女子会", "二軒目", "記念日", "お一人様"];
const TIMES: TimeSlot[] = ["ランチ", "ディナー", "深夜"];
const AREAS = ["すべて", "麻布十番", "代官山", "渋谷", "西麻布", "中目黒", "広尾", "六本木", "銀座", "目黒", "大阪・北浜"];

// ============ Component ============
export default function MapPage() {
  const [query, setQuery] = useState("");
  const [genre, setGenre] = useState("すべて");
  const [scene, setScene] = useState<Scene | "">("");
  const [time, setTime] = useState<TimeSlot | "">("");
  const [area, setArea] = useState("すべて");
  const [selected, setSelected] = useState<number | null>(null);
  const [ready, setReady] = useState(false);
  const [viewMode, setViewMode] = useState<"map" | "list">("map");

  const mapEl = useRef<HTMLDivElement | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mapRef = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const LRef = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const layerRef = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const markersRef = useRef<Record<number, any>>({});
  const roRef = useRef<ResizeObserver | null>(null);

  const filtered = shops.filter(s => {
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      if (!s.name.toLowerCase().includes(q) && !s.area.toLowerCase().includes(q) && !s.station.toLowerCase().includes(q) && !s.address.toLowerCase().includes(q)) return false;
    }
    if (genre !== "すべて" && s.cat !== genre) return false;
    if (scene && !s.scenes.includes(scene)) return false;
    if (time && !s.times.includes(time)) return false;
    if (area !== "すべて" && s.area !== area) return false;
    return true;
  });

  const hasFilter = query.trim() || genre !== "すべて" || scene || time || area !== "すべて";

  function resetAll() {
    setQuery(""); setGenre("すべて"); setScene(""); setTime(""); setArea("すべて"); setSelected(null);
  }

  // Leaflet 初期化
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const L = (await import("leaflet")).default;
      if (cancelled || !mapEl.current || mapRef.current) return;
      LRef.current = L;
      const map = L.map(mapEl.current, { center: [35.652, 139.715], zoom: 13, scrollWheelZoom: false });
      L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
        attribution: "&copy; OpenStreetMap contributors &copy; CARTO",
        subdomains: "abcd", maxZoom: 19,
      }).addTo(map);
      layerRef.current = L.layerGroup().addTo(map);
      mapRef.current = map;
      setReady(true);
      requestAnimationFrame(() => map.invalidateSize());
      setTimeout(() => map.invalidateSize(), 300);
      setTimeout(() => map.invalidateSize(), 900);
      if (typeof ResizeObserver !== "undefined" && mapEl.current) {
        roRef.current = new ResizeObserver(() => map.invalidateSize());
        roRef.current.observe(mapEl.current);
      }
    })();
    return () => {
      cancelled = true;
      if (roRef.current) { roRef.current.disconnect(); roRef.current = null; }
      if (mapRef.current) { mapRef.current.remove(); mapRef.current = null; }
    };
  }, []);

  // マーカー再構築
  useEffect(() => {
    const L = LRef.current;
    const layer = layerRef.current;
    if (!L || !layer) return;
    layer.clearLayers();
    markersRef.current = {};
    filtered.forEach(s => {
      const isSel = selected === s.id;
      const size = isSel ? 24 : 16;
      const icon = L.divIcon({
        className: "",
        html: `<span style="display:block;width:${size}px;height:${size}px;transform:rotate(45deg);border-radius:3px;background:${isSel ? "#CBAE74" : "#B8985A"};border:1.5px solid #E7D4A6;box-shadow:0 0 ${isSel ? 16 : 8}px rgba(184,152,90,.7)"></span>`,
        iconSize: [size, size], iconAnchor: [size / 2, size / 2],
      });
      const m = L.marker([s.lat, s.lng], { icon }).addTo(layer);
      m.on("click", () => setSelected(s.id));
      markersRef.current[s.id] = m;
    });
  }, [genre, scene, time, area, query, selected, ready]); // eslint-disable-line react-hooks/exhaustive-deps

  // 選択時に地図移動
  useEffect(() => {
    const map = mapRef.current;
    if (!map || selected == null) return;
    const s = shops.find(x => x.id === selected);
    if (s) map.flyTo([s.lat, s.lng], 15, { duration: 0.8 });
  }, [selected]);

  const selectedShop = selected ? shops.find(x => x.id === selected) : null;

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-[1400px] px-6 pt-16 pb-24 md:px-10">

        {/* Hero */}
        <section className="grid grid-cols-1 gap-10 md:grid-cols-[1fr_auto] md:items-end">
          <div>
            <div className="font-display text-xs text-[var(--color-accent-deep)]">店舗マップ／提携店舗</div>
            <h1 className="mt-4 font-display text-[clamp(2rem,4vw,3.5rem)] leading-[1.2]">会員のための、街の拠点。</h1>
            <p className="mt-4 max-w-xl text-sm text-[var(--color-mute)] leading-relaxed">
              エリア・ジャンル・利用シーン・時間帯で絞り込んで、今夜のお店をすぐ見つけよう。
            </p>
          </div>
          <div className="text-right">
            <div className="num text-4xl">{shops.length}</div>
            <div className="font-display text-xs text-[var(--color-mute)]">提携店舗</div>
          </div>
        </section>

        <div className="border-t border-[var(--color-line)] my-10" />

        {/* ===== Search Panel ===== */}
        <section className="space-y-5 mb-8">

          {/* ① テキスト検索 */}
          <div className="relative">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none text-[var(--color-mute)]"
              width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input
              type="text"
              placeholder="エリア・駅名・店名で検索…"
              value={query}
              onChange={e => { setQuery(e.target.value); setSelected(null); }}
              className="w-full bg-[var(--color-bg-soft)] border border-[var(--color-line)] rounded-full pl-11 pr-10 py-3 text-sm outline-none focus:border-[var(--color-accent)]/60 placeholder-[var(--color-mute)] transition font-display"
            />
            {query && (
              <button onClick={() => setQuery("")} className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--color-mute)] hover:text-[var(--color-ink)]">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            )}
          </div>

          {/* ② ジャンル */}
          <div>
            <div className="font-display text-[10px] text-[var(--color-mute)] mb-2 tracking-widest">GENRE ／ ジャンル</div>
            <div className="flex flex-wrap gap-2">
              {GENRES.map(g => (
                <button key={g} onClick={() => { setGenre(g); setSelected(null); }}
                  className="font-display text-xs border px-3.5 py-1.5 rounded-full transition"
                  style={genre === g
                    ? { background: "var(--color-accent)", color: "#0B0F16", borderColor: "var(--color-accent)" }
                    : { borderColor: "var(--color-line)", color: "var(--color-mute)" }}>
                  {g}
                </button>
              ))}
            </div>
          </div>

          {/* ③ 利用シーン */}
          <div>
            <div className="font-display text-[10px] text-[var(--color-mute)] mb-2 tracking-widest">SCENE ／ 利用シーン</div>
            <div className="flex flex-wrap gap-2">
              {SCENES.map(sc => (
                <button key={sc} onClick={() => { setScene(scene === sc ? "" : sc); setSelected(null); }}
                  className="font-display text-xs border px-3.5 py-1.5 rounded-full transition"
                  style={scene === sc
                    ? { background: "rgba(184,152,90,0.15)", color: "var(--color-accent-deep)", borderColor: "var(--color-accent)" }
                    : { borderColor: "var(--color-line)", color: "var(--color-mute)" }}>
                  {sc === "デート" ? "💑 " : sc === "接待・ビジネス" ? "💼 " : sc === "女子会" ? "👗 " : sc === "二軒目" ? "🍸 " : sc === "記念日" ? "🥂 " : "🪑 "}{sc}
                </button>
              ))}
            </div>
          </div>

          {/* ④ 時間帯 + エリア (横並び) */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <div className="font-display text-[10px] text-[var(--color-mute)] mb-2 tracking-widest">TIME ／ 時間帯</div>
              <div className="flex gap-2">
                {TIMES.map(t => (
                  <button key={t} onClick={() => { setTime(time === t ? "" : t); setSelected(null); }}
                    className="font-display text-xs border px-3.5 py-1.5 rounded-full transition flex-1 text-center"
                    style={time === t
                      ? { background: "rgba(184,152,90,0.15)", color: "var(--color-accent-deep)", borderColor: "var(--color-accent)" }
                      : { borderColor: "var(--color-line)", color: "var(--color-mute)" }}>
                    {t === "ランチ" ? "☀️ " : t === "ディナー" ? "🌙 " : "🌃 "}{t}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <div className="font-display text-[10px] text-[var(--color-mute)] mb-2 tracking-widest">AREA ／ エリア</div>
              <select
                value={area}
                onChange={e => { setArea(e.target.value); setSelected(null); }}
                className="w-full bg-[var(--color-bg-soft)] border border-[var(--color-line)] rounded-full px-4 py-2 text-sm text-[var(--color-ink)] outline-none focus:border-[var(--color-accent)]/60 font-display transition"
              >
                {AREAS.map(a => <option key={a} value={a}>{a}</option>)}
              </select>
            </div>
          </div>

          {/* 検索結果カウンター + リセット */}
          <div className="flex items-center justify-between pt-1">
            <span className="font-display text-sm">
              <span className="num text-[var(--color-accent-deep)]">{filtered.length}</span>
              <span className="text-[var(--color-mute)] ml-1.5">件のお店が見つかりました</span>
            </span>
            {hasFilter && (
              <button onClick={resetAll}
                className="font-display text-xs text-[var(--color-mute)] hover:text-[var(--color-accent-deep)] transition flex items-center gap-1.5">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
                絞り込みをリセット
              </button>
            )}
          </div>
        </section>

        {/* Mobile view toggle */}
        <div className="flex gap-2 mb-4 md:hidden">
          {(["map", "list"] as const).map(v => (
            <button key={v} onClick={() => setViewMode(v)}
              className="flex-1 py-2.5 font-display text-sm rounded-full border transition"
              style={viewMode === v
                ? { background: "var(--color-accent)", color: "#0B0F16", borderColor: "var(--color-accent)" }
                : { borderColor: "var(--color-line)", color: "var(--color-mute)" }}>
              {v === "map" ? "🗺 マップ" : "📋 リスト"}
            </button>
          ))}
        </div>

        {/* ===== Map + List ===== */}
        <section className="grid grid-cols-1 gap-px overflow-hidden border border-[var(--color-line)] bg-[var(--color-line)] lg:grid-cols-[1.4fr_1fr]">

          {/* Map */}
          <div className={`relative bg-[var(--color-bg-soft)] min-h-[420px] md:min-h-[600px] ${viewMode === "list" ? "hidden md:block" : ""}`}>
            <div ref={mapEl} className="absolute inset-0 h-full w-full" style={{ background: "#0B0F16" }} />

            {/* Selected callout */}
            {selectedShop && (
              <div className="pointer-events-auto absolute bottom-4 left-4 right-4 z-[500] border border-[var(--color-line)] bg-[var(--color-bg)]/95 p-5 backdrop-blur rounded-2xl md:right-auto md:w-80">
                <div className="flex items-baseline justify-between mb-2">
                  <span className="tag tag-accent text-[10px]">{selectedShop.cat}</span>
                  <span className="font-display text-xs text-[var(--color-mute)]">{selectedShop.area}</span>
                </div>
                <h3 className="font-display text-xl mb-1">{selectedShop.name}</h3>
                <p className="text-xs text-[var(--color-mute)] mb-3">{selectedShop.address}</p>
                {/* Features */}
                <div className="flex gap-1.5 flex-wrap mb-3">
                  {selectedShop.scenes.slice(0,2).map(sc => (
                    <span key={sc} className="font-display text-[10px] px-2 py-0.5 rounded-full border border-[var(--color-line)] text-[var(--color-mute)]">{sc}</span>
                  ))}
                  {selectedShop.features.map(f => (
                    <span key={f} className="font-display text-[10px] px-2 py-0.5 rounded-full border border-[var(--color-line)] text-[var(--color-mute)]">{f}</span>
                  ))}
                </div>
                <div className="bg-[var(--color-bg-soft)] rounded-xl px-4 py-3 mb-4 border border-[var(--color-line)]">
                  <div className="font-display text-[10px] text-[var(--color-accent-deep)] mb-0.5">会員特典</div>
                  <p className="text-sm">{selectedShop.perk}</p>
                </div>
                <button className="btn-primary !py-2 text-xs w-full justify-center">来店予約する</button>
              </div>
            )}
          </div>

          {/* Shop list */}
          <div className={`bg-[var(--color-bg)] overflow-y-auto max-h-[600px] ${viewMode === "map" ? "hidden md:block" : ""}`}>
            {filtered.length === 0 ? (
              <div className="flex items-center justify-center h-48 text-sm text-[var(--color-mute)] font-display">
                条件に合うお店が見つかりません
              </div>
            ) : (
              <ul className="divide-y divide-[var(--color-line)]">
                {filtered.map(s => (
                  <li key={s.id}>
                    <button onClick={() => { setSelected(s.id); setViewMode("map"); }}
                      className={`block w-full px-6 py-5 text-left transition-colors hover:bg-[var(--color-bg-soft)] ${selected === s.id ? "bg-[var(--color-bg-soft)] border-l-2 border-[var(--color-accent)]" : ""}`}>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <span className="font-display text-base">{s.name}</span>
                        <span className="tag tag-accent text-[10px] flex-none">{s.cat}</span>
                      </div>
                      <div className="font-display text-xs text-[var(--color-mute)] mb-2">{s.area} · {s.station}</div>
                      {/* Scene badges */}
                      <div className="flex gap-1 flex-wrap mb-2.5">
                        {s.scenes.map(sc => (
                          <span key={sc} className="font-display text-[10px] px-2 py-0.5 rounded-full border border-[var(--color-line)] text-[var(--color-mute)]">{sc}</span>
                        ))}
                      </div>
                      {/* Perk */}
                      <div className="text-xs text-[var(--color-mute)] flex items-start gap-1.5">
                        <span className="text-[var(--color-accent-deep)] mt-0.5 flex-none">
                          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                          </svg>
                        </span>
                        <span>{s.perk}</span>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>

      </main>
      <SiteFooter />
    </>
  );
}
