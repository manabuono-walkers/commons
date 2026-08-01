"use client";
import { useCallback, useSyncExternalStore } from "react";

export const PRIME_AREAS = ["東京", "大阪", "福岡"] as const;
export type PrimeArea = (typeof PRIME_AREAS)[number];

interface AreaCapacity { limit: number; current: number; }

// current: モック上の現在PRIME会員数（実データ連携なし）
const DEFAULT_CAPACITY: Record<PrimeArea, AreaCapacity> = {
  "東京": { limit: 50, current: 34 },
  "大阪": { limit: 30, current: 27 },
  "福岡": { limit: 20, current: 20 },
};

const STORAGE_KEY = "commons_admin_prime_capacity_limits";
type Limits = Record<PrimeArea, number>;

function defaultLimits(): Limits {
  return Object.fromEntries(PRIME_AREAS.map(a => [a, DEFAULT_CAPACITY[a].limit])) as Limits;
}

function readLimits(): Limits {
  if (typeof window === "undefined") return defaultLimits();
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return defaultLimits();
  try {
    const parsed = JSON.parse(raw);
    const fallback = defaultLimits();
    return Object.fromEntries(PRIME_AREAS.map(a => [a, Number(parsed[a]) || fallback[a]])) as Limits;
  } catch {
    return defaultLimits();
  }
}

const listeners = new Set<() => void>();
function subscribe(onStoreChange: () => void) {
  listeners.add(onStoreChange);
  return () => listeners.delete(onStoreChange);
}

let cached: Limits | null = null;
function getSnapshot(): Limits {
  const next = readLimits();
  if (!cached || PRIME_AREAS.some(a => cached![a] !== next[a])) cached = next;
  return cached;
}
const SERVER_SNAPSHOT = defaultLimits();
function getServerSnapshot(): Limits {
  return SERVER_SNAPSHOT;
}

export function usePrimeCapacity() {
  const limits = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const setLimit = useCallback((area: PrimeArea, value: number) => {
    const next = { ...readLimits(), [area]: value };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    listeners.forEach(l => l());
  }, []);

  const areas = PRIME_AREAS.map(a => {
    const limit = limits[a];
    const current = DEFAULT_CAPACITY[a].current;
    return { area: a, limit, current, remaining: Math.max(0, limit - current), hasSpace: current < limit };
  });

  const totalCurrent = PRIME_AREAS.reduce((sum, a) => sum + DEFAULT_CAPACITY[a].current, 0);
  const totalLimit = PRIME_AREAS.reduce((sum, a) => sum + limits[a], 0);

  return { areas, setLimit, totalCurrent, totalLimit };
}
