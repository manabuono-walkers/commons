"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import BottomNav from "@/components/BottomNav";

const SUSPEND_REASONS = [
  "長期出張・海外赴任",
  "一時的な遠方居住",
  "病気・けが",
  "妊娠・出産・育児",
  "家族の介護",
  "試験や長期的な繁忙",
  "その他",
];

const DURATIONS = ["1ヶ月", "2ヶ月", "3ヶ月", "4ヶ月", "5ヶ月", "6ヶ月"];

export default function SuspendPage() {
  const router = useRouter();
  const [reason, setReason] = useState<string | null>(null);
  const [detail, setDetail] = useState("");
  const [duration, setDuration] = useState("1ヶ月");
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  function handleSubmit() {
    if (!reason) {
      setError("休会理由を選択してください。");
      return;
    }
    if (!detail.trim()) {
      setError("休会理由の詳細を入力してください。");
      return;
    }
    setError("");
    setDone(true);
  }

  if (done) {
    return (
      <div className="flex justify-center bg-[var(--color-bg)] min-h-screen">
        <div className="w-full max-w-[430px] flex flex-col items-center justify-center px-8 py-20 text-center">
          <div className="w-14 h-14 rounded-full border border-[var(--color-accent)]/50 flex items-center justify-center mx-auto mb-6">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent-deep)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <h1 className="font-display text-2xl mb-2">休会申請を受け付けました</h1>
          <p className="text-sm text-[var(--color-mute)] leading-relaxed mb-8">
            運営による承認をお待ちください。承認され次第、次回決済日から休会が開始されます。
          </p>
          <button onClick={() => router.push("/mypage")} className="btn-primary justify-center">マイページへ戻る</button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center bg-[var(--color-bg)] min-h-screen">
      <div className="w-full max-w-[430px] pb-24">
        <header className="sticky top-0 z-40 bg-[var(--color-bg)]/95 backdrop-blur-md border-b border-[var(--color-line)] px-5 py-3 flex items-center justify-between">
          <button onClick={() => router.back()} className="font-display text-sm text-[var(--color-mute)] hover:text-[var(--color-ink)] transition">← 戻る</button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/logo.png" alt="COMMONS" style={{ height: 24, width: "auto", objectFit: "contain" }} />
          <span className="w-12" />
        </header>

        <main className="px-5 pt-8 space-y-6">
          <div>
            <p className="font-display text-[10px] tracking-[0.2em] text-[var(--color-accent-deep)] mb-1">My Account</p>
            <h1 className="font-display text-2xl">休会申請</h1>
            <p className="mt-2 text-xs text-[var(--color-mute)] leading-relaxed">
              長期出張や療養など、やむを得ない事情で一時的に参加できない場合、退会せずに会員資格を維持できます。申請後は運営の承認をもって休会が確定します。
            </p>
          </div>

          {/* 休会制度の概要 */}
          <div className="card p-5 space-y-1.5">
            <p className="font-display text-xs text-[var(--color-accent-deep)] mb-1">休会制度の概要</p>
            <p className="font-display text-xs text-[var(--color-mute)]">・休会中の月額：¥330（税込）</p>
            <p className="font-display text-xs text-[var(--color-mute)]">・期間：1ヶ月〜最長6ヶ月（申請制・承認制）</p>
            <p className="font-display text-xs text-[var(--color-mute)]">・対象：入会から3ヶ月以上経過した会員</p>
            <p className="font-display text-xs text-[var(--color-mute)]">・利用回数：原則12ヶ月に1回まで</p>
            <p className="font-display text-xs text-[var(--color-mute)]">・申請期限：次回決済日の10日前まで</p>
            <p className="font-display text-xs text-[var(--color-mute)]">・休会中はイベント一覧の閲覧のみ可能です</p>
            <p className="font-display text-xs text-[var(--color-mute)]">・ランクは維持されます（休会中はXPが付与されません）</p>
            <p className="font-display text-xs text-[var(--color-mute)]">・期間終了後は自動的に復帰します（復帰後3ヶ月は再休会不可）</p>
          </div>

          {/* 休会理由 */}
          <div className="card p-5 space-y-4">
            <div>
              <p className="font-display text-xs text-[var(--color-accent-deep)] mb-3">休会理由 *</p>
              <div className="space-y-2">
                {SUSPEND_REASONS.map(r => (
                  <button
                    key={r}
                    onClick={() => setReason(prev => prev === r ? null : r)}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border transition text-left"
                    style={{
                      borderColor: reason === r ? "var(--color-accent)" : "var(--color-line)",
                      background: reason === r ? "rgba(184,152,90,0.08)" : "transparent",
                    }}
                  >
                    <div className="w-4 h-4 rounded-full border-2 flex-none flex items-center justify-center"
                      style={{ borderColor: reason === r ? "var(--color-accent-deep)" : "var(--color-line)" }}>
                      {reason === r && <div className="w-2 h-2 rounded-full" style={{ background: "var(--color-accent-deep)" }} />}
                    </div>
                    <span className="font-display text-sm">{r}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="font-display text-[10px] text-[var(--color-mute)] block mb-1.5">理由の詳細 *</label>
              <textarea
                className="input-field min-h-[80px] resize-none text-sm w-full"
                placeholder="休会理由の詳細をご記入ください…"
                value={detail}
                onChange={e => setDetail(e.target.value)}
              />
            </div>

            <div>
              <label className="font-display text-[10px] text-[var(--color-mute)] block mb-1.5">希望する休会期間</label>
              <select
                className="input-field"
                value={duration}
                onChange={e => setDuration(e.target.value)}
              >
                {DURATIONS.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
              <p className="mt-1.5 text-[10px] text-[var(--color-mute)]">開始日は次回決済日となります（自動設定）。</p>
            </div>
          </div>

          {error && (
            <div className="px-4 py-3 rounded-xl bg-red-400/8 border border-red-400/30 font-display text-xs text-red-400">{error}</div>
          )}

          <div className="space-y-3 pb-4">
            <button
              onClick={handleSubmit}
              className="w-full py-4 rounded-full font-display text-base transition-all hover:opacity-90 active:scale-95"
              style={{ background: "linear-gradient(135deg, #CBAE74, #B8985A)", color: "#0B0F16" }}
            >
              休会を申請する
            </button>
            <button onClick={() => router.back()} className="w-full btn-outline justify-center">
              戻る
            </button>
          </div>
        </main>

        <BottomNav />
      </div>
    </div>
  );
}
