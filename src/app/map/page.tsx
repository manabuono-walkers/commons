"use client";

import { useEffect, useRef, useState } from "react";
import "leaflet/dist/leaflet.css";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

type Shop = {
  id: number;
  name: string;
  cat: string;
  area: string;
  address: string;
  perk: string;
  lat: number;
  lng: number;
};

const shops: Shop[] = [
  { id: 1, name: "La Cave 麻布十番", cat: "ワイン", area: "麻布十番", address: "東京都港区麻布十番2-x-x", perk: "会員はグラスワイン1杯サービス", lat: 35.6556, lng: 139.7363 },
  { id: 2, name: "COMMONS BASE 代官山", cat: "カフェ", area: "代官山", address: "東京都渋谷区代官山町x-x", perk: "コーヒー10%OFF・ラウンジ利用可", lat: 35.6485, lng: 139.7030 },
  { id: 3, name: "The Library 渋谷", cat: "バー", area: "渋谷", address: "東京都渋谷区宇田川町x-x", perk: "チャージ無料", lat: 35.6595, lng: 139.6987 },
  { id: 4, name: "Cask 西麻布", cat: "バー", area: "西麻布", address: "東京都港区西麻布3-x-x", perk: "限定ボトルの先行案内", lat: 35.6587, lng: 139.7250 },
  { id: 5, name: "Atelier Nakameguro", cat: "アート", area: "中目黒", address: "東京都目黒区上目黒x-x", perk: "企画展の招待枠", lat: 35.6440, lng: 139.6990 },
  { id: 6, name: "OSAKA SALON 北浜", cat: "ワイン", area: "大阪・北浜", address: "大阪府大阪市中央区北浜x-x", perk: "会員価格でのテイスティング", lat: 34.6915, lng: 135.5060 },
];

const cats = ["すべて", "ワイン", "カフェ", "バー", "アート"];

export default function MapPage() {
  const [active, setActive] = useState("すべて");
  const [selected, setSelected] = useState<number | null>(null);
  const [ready, setReady] = useState(false);
  const filtered = active === "すべて" ? shops : shops.filter((s) => s.cat === active);

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

  // 初期化（Leaflet は window 依存のため動的 import）
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const L = (await import("leaflet")).default;
      if (cancelled || !mapEl.current || mapRef.current) return;
      LRef.current = L;
      const map = L.map(mapEl.current, {
        center: [35.652, 139.715],
        zoom: 13,
        scrollWheelZoom: false,
        attributionControl: true,
      });
      L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
        attribution: "&copy; OpenStreetMap contributors &copy; CARTO",
        subdomains: "abcd",
        maxZoom: 19,
      }).addTo(map);
      layerRef.current = L.layerGroup().addTo(map);
      mapRef.current = map;
      setReady(true);
      // コンテナのサイズ確定後に確実に再計測（初回ブランク防止）
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
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // マーカー再構築（フィルタ／選択変更時）
  useEffect(() => {
    const L = LRef.current;
    const layer = layerRef.current;
    if (!L || !layer) return;
    layer.clearLayers();
    markersRef.current = {};
    filtered.forEach((s) => {
      const isSel = selected === s.id;
      const size = isSel ? 22 : 16;
      const icon = L.divIcon({
        className: "",
        html: `<span style="display:block;width:${size}px;height:${size}px;transform:rotate(45deg);border-radius:3px;background:${isSel ? "#CBAE74" : "#B8985A"};border:1.5px solid #E7D4A6;box-shadow:0 0 ${isSel ? 14 : 8}px rgba(184,152,90,.7)"></span>`,
        iconSize: [size, size],
        iconAnchor: [size / 2, size / 2],
      });
      const m = L.marker([s.lat, s.lng], { icon }).addTo(layer);
      m.on("click", () => setSelected(s.id));
      markersRef.current[s.id] = m;
    });
  }, [active, selected, ready]); // eslint-disable-line react-hooks/exhaustive-deps

  // 選択時に地図を移動
  useEffect(() => {
    const map = mapRef.current;
    if (!map || selected == null) return;
    const s = shops.find((x) => x.id === selected);
    if (s) map.flyTo([s.lat, s.lng], 15, { duration: 0.8 });
  }, [selected]);

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-[1400px] px-6 pt-16 pb-24 md:px-10">
        <section className="grid grid-cols-1 gap-10 md:grid-cols-[1fr_auto] md:items-end">
          <div>
            <div className="animate-fade-up font-display text-xs text-[var(--color-accent-deep)]">
              店舗マップ／提携店舗
            </div>
            <h1 className="mt-4 animate-fade-up delay-1 font-display text-[clamp(2rem,4vw,3.5rem)] leading-[1.2]">
              会員のための、街の拠点。
            </h1>
            <p className="mt-4 animate-fade-up delay-2 max-w-xl text-sm text-[var(--color-mute)] leading-relaxed">
              提携店舗をアプリ内マップにピン表示。会員特典を確認し、その場で来店予約へ。位置情報はアプリ内で完結し、外部URLには遷移しません。
            </p>
          </div>
          <div className="animate-fade-up delay-2 text-right">
            <div className="num text-4xl">{shops.length}</div>
            <div className="font-display text-xs text-[var(--color-mute)]">提携店舗</div>
          </div>
        </section>

        <div className="border-t border-[var(--color-line)] my-12" />

        {/* Filter */}
        <section className="flex flex-wrap items-center gap-3">
          {cats.map((c) => (
            <button
              key={c}
              onClick={() => { setActive(c); setSelected(null); }}
              className={`font-display text-sm border px-4 py-2 rounded-full transition ${
                active === c
                  ? "bg-[var(--color-accent)] text-[#0B0F16] border-[var(--color-accent)]"
                  : "border-[var(--color-line)] text-[var(--color-mute)] hover:border-[var(--color-accent)]"
              }`}
            >
              {c}
            </button>
          ))}
          <span className="ml-auto font-display text-xs text-[var(--color-mute)]">{filtered.length}件</span>
        </section>

        <section className="mt-10 grid grid-cols-1 gap-px overflow-hidden border border-[var(--color-line)] bg-[var(--color-line)] lg:grid-cols-[1.4fr_1fr]">
          {/* Real map */}
          <div className="relative bg-[var(--color-bg-soft)] min-h-[420px] md:min-h-[560px]">
            <div ref={mapEl} className="absolute inset-0 h-full w-full" style={{ background: "#0B0F16" }} />

            {/* selected callout */}
            {selected && (() => {
              const s = shops.find((x) => x.id === selected)!;
              return (
                <div className="pointer-events-auto absolute bottom-4 left-4 right-4 z-[500] border border-[var(--color-line)] bg-[var(--color-bg)]/95 p-5 backdrop-blur animate-fade-up md:right-auto md:w-80">
                  <div className="flex items-baseline justify-between">
                    <span className="tag tag-accent">{s.cat}</span>
                    <span className="font-display text-xs text-[var(--color-mute)]">{s.area}</span>
                  </div>
                  <h3 className="mt-3 font-display text-xl">{s.name}</h3>
                  <p className="mt-1 text-xs text-[var(--color-mute)]">{s.address}</p>
                  <p className="mt-3 text-sm">{s.perk}</p>
                  <button className="btn-primary !py-2 mt-4 text-xs">来店予約する</button>
                </div>
              );
            })()}
          </div>

          {/* Shop list */}
          <div className="bg-[var(--color-bg)]">
            <ul className="divide-y divide-[var(--color-line)]">
              {filtered.map((s) => (
                <li key={s.id}>
                  <button
                    onClick={() => setSelected(s.id)}
                    className={`block w-full px-7 py-6 text-left transition-colors hover:bg-[var(--color-bg-soft)] ${
                      selected === s.id ? "bg-[var(--color-bg-soft)]" : ""
                    }`}
                  >
                    <div className="flex items-baseline justify-between">
                      <span className="font-display text-lg">{s.name}</span>
                      <span className="tag tag-accent">{s.cat}</span>
                    </div>
                    <div className="mt-1 font-display text-xs text-[var(--color-mute)]">{s.area}</div>
                    <p className="mt-3 text-sm text-[var(--color-mute)] leading-relaxed">{s.perk}</p>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {filtered.length === 0 && (
          <div className="mt-16 text-center text-sm text-[var(--color-mute)]">該当の店舗がありません。</div>
        )}
      </main>
      <SiteFooter />
    </>
  );
}
