"use client";
import { createContext, useContext, useCallback, useSyncExternalStore } from "react";

export const AREAS = ["すべて", "東京", "大阪", "福岡"] as const;
export type AdminArea = (typeof AREAS)[number];

const STORAGE_KEY = "commons_admin_area";

interface AdminAreaContextValue {
  area: AdminArea;
  setArea: (area: AdminArea) => void;
}

const AdminAreaContext = createContext<AdminAreaContextValue | null>(null);

const listeners = new Set<() => void>();

function subscribe(onStoreChange: () => void) {
  listeners.add(onStoreChange);
  return () => listeners.delete(onStoreChange);
}

function getSnapshot(): AdminArea {
  const saved = window.localStorage.getItem(STORAGE_KEY);
  return saved && (AREAS as readonly string[]).includes(saved) ? (saved as AdminArea) : "すべて";
}

// サーバーレンダー時は常に「すべて」を返し、hydrationの不一致を防ぐ
function getServerSnapshot(): AdminArea {
  return "すべて";
}

export function AdminAreaProvider({ children }: { children: React.ReactNode }) {
  const area = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const setArea = useCallback((next: AdminArea) => {
    window.localStorage.setItem(STORAGE_KEY, next);
    listeners.forEach(l => l());
  }, []);

  return (
    <AdminAreaContext.Provider value={{ area, setArea }}>
      {children}
    </AdminAreaContext.Provider>
  );
}

export function useAdminArea(): AdminAreaContextValue {
  const ctx = useContext(AdminAreaContext);
  if (!ctx) throw new Error("useAdminArea must be used within AdminAreaProvider");
  return ctx;
}
