"use client";
import { useSyncExternalStore, useCallback } from "react";
import { usePathname } from "next/navigation";

type Theme = "navy" | "ivory";
const STORAGE_KEY = "commons-theme";
const EVENT = "commons-theme-change";

function subscribe(onChange: () => void) {
  window.addEventListener(EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

function getSnapshot(): Theme {
  return document.documentElement.dataset.theme === "ivory" ? "ivory" : "navy";
}

function getServerSnapshot(): Theme {
  return "navy";
}

/**
 * ネイビー／アイボリーの配色を切り替える比較用トグル。
 * ベースカラー検討のための一時的なUIで、決定後は削除する想定。
 */
export default function ThemeToggle() {
  const pathname = usePathname();
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const setTheme = useCallback((next: Theme) => {
    if (next === "ivory") {
      document.documentElement.dataset.theme = "ivory";
    } else {
      delete document.documentElement.dataset.theme;
    }
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* localStorage が使えない環境では永続化しない */
    }
    window.dispatchEvent(new Event(EVENT));
  }, []);

  // 管理画面では表示しない（ユーザー画面の配色検討用のため）
  if (pathname?.startsWith("/admin")) return null;

  return (
    <div className="fixed bottom-[92px] left-3 z-[1400] flex items-center gap-1 rounded-full border border-[var(--color-line)] bg-[var(--color-bg-soft)]/95 p-1 shadow-lg backdrop-blur-sm">
      <span className="pl-2 pr-1 font-display text-[9px] tracking-wider text-[var(--color-mute)]">
        配色
      </span>
      {([
        ["navy", "ネイビー"],
        ["ivory", "アイボリー"],
      ] as const).map(([value, label]) => (
        <button
          key={value}
          type="button"
          onClick={() => setTheme(value)}
          className={`rounded-full px-2.5 py-1 font-display text-[10px] transition ${
            theme === value
              ? "bg-[var(--color-accent)] text-[var(--color-on-accent)]"
              : "text-[var(--color-mute)] hover:text-[var(--color-ink)]"
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
