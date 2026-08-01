"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import BottomNav from "@/components/BottomNav";

const WITHDRAW_REASONS = [
  "イベントに参加できなくなった",
  "費用に見合わないと感じた",
  "期待していたコンテンツと違った",
  "他のコミュニティに移ることにした",
  "一時的に休止したい",
  "その他",
];

// 一番利用したコンテンツ
const MOST_USED_CONTENTS = [
  "イベント",
  "クラブ活動",
  "提携店舗クーポン",
  "コミュニティ（投稿・チャット）",
  "ポイント特典",
  "抽選",
  "特にない",
];

// COMMONS満足度（5段階）
const SATISFACTION_LEVELS = [
  { value: 1, label: "とても不満" },
  { value: 2, label: "不満" },
  { value: 3, label: "どちらでもない" },
  { value: 4, label: "満足" },
  { value: 5, label: "とても満足" },
];

// 契約状況（※仮のデータ。マイページ・お支払い方法の表示と揃えています）
const MEMBERSHIP = {
  plan: "年間プラン",
  fee: "¥6,000 / 年（¥500/月）",
  validThrough: "2027年6月30日",
  remaining: "残り11ヶ月",
  nextBilling: "2027年7月1日",
};

// 退会の注意事項
const WITHDRAW_NOTES = [
  "サブスクリプションの解約手続きが完了した時点でCOMMONSを退会となり、すべてのサービスをご利用いただけなくなります。",
  "月の途中で退会された場合でも、月額プランは1ヶ月分、年間プランは1年間分の利用料金が発生します。日割りまたは月割りでの返金はいたしかねますので、あらかじめご了承ください。",
  "退会日から起算して1年間は、COMMONSへ再入会いただけません。",
  "再入会を希望される場合は、初回入会時よりも厳格な基準で審査を行います。",
  "退会後は、すでに参加費をお支払いいただいているイベントにもご参加いただけなくなりますので、ご注意ください。",
];

function RadioList({ options, value, onSelect }: { options: string[]; value: string | null; onSelect: (v: string | null) => void }) {
  return (
    <div className="space-y-2">
      {options.map(o => (
        <button
          key={o}
          onClick={() => onSelect(value === o ? null : o)}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border transition text-left"
          style={{
            borderColor: value === o ? "var(--color-accent)" : "var(--color-line)",
            background: value === o ? "rgba(184,152,90,0.08)" : "transparent",
          }}
        >
          <div className="w-4 h-4 rounded-full border-2 flex-none flex items-center justify-center"
            style={{ borderColor: value === o ? "var(--color-accent-deep)" : "var(--color-line)" }}>
            {value === o && <div className="w-2 h-2 rounded-full" style={{ background: "var(--color-accent-deep)" }} />}
          </div>
          <span className="font-display text-sm">{o}</span>
        </button>
      ))}
    </div>
  );
}

export default function SettingsPage() {
  const router = useRouter();
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [withdrawStep, setWithdrawStep] = useState<"info" | "reason" | "done">("info");
  const [reason, setReason] = useState<string | null>(null);
  const [mostUsed, setMostUsed] = useState<string | null>(null);
  const [satisfaction, setSatisfaction] = useState<number | null>(null);
  const [note, setNote] = useState("");

  function openWithdraw() {
    setWithdrawStep("info");
    setShowWithdraw(true);
  }

  function closeWithdraw() {
    setShowWithdraw(false);
    setWithdrawStep("info");
    setReason(null);
    setMostUsed(null);
    setSatisfaction(null);
    setNote("");
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

        <main className="px-5 pt-6 pb-10">
          <h1 className="font-display text-xl font-semibold mb-5">各種設定</h1>

          <div className="space-y-px bg-[var(--color-line)] rounded-2xl overflow-hidden border border-[var(--color-line)]">
            <Link href="/history" className="w-full flex items-center gap-4 px-5 py-4 bg-[var(--color-bg)] hover:bg-[var(--color-bg-soft)] transition">
              <span className="font-display text-sm flex-1">参加履歴・ポイント履歴</span>
              <span className="text-[var(--color-mute)]">›</span>
            </Link>
            <Link href="/mypage/muted" className="w-full flex items-center gap-4 px-5 py-4 bg-[var(--color-bg)] hover:bg-[var(--color-bg-soft)] transition">
              <span className="font-display text-sm flex-1">ミュートリスト</span>
              <span className="text-[var(--color-mute)]">›</span>
            </Link>
            <Link href="/feedback" className="w-full flex items-center gap-4 px-5 py-4 bg-[var(--color-bg)] hover:bg-[var(--color-bg-soft)] transition">
              <span className="font-display text-sm flex-1">意見箱</span>
              <span className="text-[var(--color-mute)]">›</span>
            </Link>
            <Link href="/notification-settings" className="w-full flex items-center gap-4 px-5 py-4 bg-[var(--color-bg)] hover:bg-[var(--color-bg-soft)] transition">
              <span className="font-display text-sm flex-1">通知設定</span>
              <span className="text-[var(--color-mute)]">›</span>
            </Link>
            <Link href="/mypage/password-change" className="w-full flex items-center gap-4 px-5 py-4 bg-[var(--color-bg)] hover:bg-[var(--color-bg-soft)] transition">
              <span className="font-display text-sm flex-1">パスワード変更</span>
              <span className="text-[var(--color-mute)]">›</span>
            </Link>
            <Link href="/payment-method" className="w-full flex items-center gap-4 px-5 py-4 bg-[var(--color-bg)] hover:bg-[var(--color-bg-soft)] transition">
              <span className="font-display text-sm flex-1">お支払い方法の変更</span>
              <span className="text-[var(--color-mute)]">›</span>
            </Link>
            <Link href="/mypage/suspend" className="w-full flex items-center gap-4 px-5 py-4 bg-[var(--color-bg)] hover:bg-[var(--color-bg-soft)] transition">
              <span className="font-display text-sm flex-1">休会する</span>
              <span className="text-[var(--color-mute)]">›</span>
            </Link>
            <button
              onClick={openWithdraw}
              className="w-full flex items-center gap-4 px-5 py-4 bg-[var(--color-bg)] hover:bg-[var(--color-bg-soft)] transition text-left"
            >
              <span className="font-display text-sm flex-1">退会する</span>
              <span className="text-[var(--color-mute)]">›</span>
            </button>
          </div>
        </main>

        {/* ① 残りの有効会員期間・退会の注意事項 */}
        {showWithdraw && withdrawStep === "info" && (
          <div className="fixed inset-0 z-[60] flex items-end justify-center bg-black/60 backdrop-blur-sm" onClick={closeWithdraw}>
            <div className="w-full max-w-[430px] bg-[var(--color-bg-soft)] rounded-t-3xl p-6 pb-28 max-h-[85vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
              <div className="w-10 h-1 bg-[var(--color-line)] rounded-full mx-auto mb-6" />
              <h2 className="font-display text-xl font-semibold">退会手続き</h2>

              <div className="mt-4 card p-4">
                <p className="font-display text-xs text-[var(--color-accent-deep)] mb-3">残りの有効会員期間</p>
                <div className="flex items-baseline justify-between">
                  <span className="font-display text-sm text-[var(--color-mute)]">{MEMBERSHIP.validThrough} まで</span>
                  <span className="font-display text-sm">{MEMBERSHIP.remaining}</span>
                </div>
                <div className="mt-3 space-y-1.5 border-t border-[var(--color-line)] pt-3">
                  {[
                    { l: "ご契約プラン", v: MEMBERSHIP.plan },
                    { l: "利用料金", v: MEMBERSHIP.fee },
                    { l: "次回請求日", v: MEMBERSHIP.nextBilling },
                  ].map(r => (
                    <div key={r.l} className="flex items-center justify-between font-display text-xs">
                      <span className="text-[var(--color-mute)]">{r.l}</span>
                      <span>{r.v}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 card p-4">
                <p className="font-display text-xs text-[var(--color-accent-deep)] mb-3">退会の注意事項</p>
                <ul className="space-y-2">
                  {WITHDRAW_NOTES.map(n => (
                    <li key={n} className="flex gap-1 text-xs text-[var(--color-mute)] leading-relaxed">
                      <span className="flex-none">・</span><span>{n}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-6 space-y-3">
                <button onClick={closeWithdraw} className="w-full btn-primary justify-center py-3.5 text-sm">退会をやめる</button>
                <Link
                  href="/mypage/suspend"
                  onClick={closeWithdraw}
                  className="w-full py-3.5 rounded-full font-display text-sm border border-[var(--color-line)] flex items-center justify-center hover:border-[var(--color-ink)] transition"
                >
                  休会する
                </Link>
                <button
                  onClick={() => setWithdrawStep("reason")}
                  className="w-full py-3.5 rounded-full font-display text-sm border border-[var(--color-line)] text-[var(--color-mute)] hover:text-[var(--color-ink)] hover:border-[var(--color-ink)] transition"
                >
                  退会する
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ② 退会理由の入力 */}
        {showWithdraw && withdrawStep === "reason" && (
          <div className="fixed inset-0 z-[60] flex items-end justify-center bg-black/60 backdrop-blur-sm" onClick={closeWithdraw}>
            <div className="w-full max-w-[430px] bg-[var(--color-bg-soft)] rounded-t-3xl p-6 pb-28 max-h-[85vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
              <div className="w-10 h-1 bg-[var(--color-line)] rounded-full mx-auto mb-6" />
              <h2 className="font-display text-xl font-semibold">退会理由をお聞かせください</h2>
              <p className="mt-2 text-xs text-[var(--color-mute)] leading-relaxed">
                今後のサービス改善に活用させていただきます。
              </p>

              <div className="mt-5">
                <p className="font-display text-xs text-[var(--color-accent-deep)] mb-3">退会理由</p>
                <RadioList options={WITHDRAW_REASONS} value={reason} onSelect={setReason} />
              </div>

              <div className="mt-6">
                <p className="font-display text-xs text-[var(--color-accent-deep)] mb-3">一番利用したコンテンツ</p>
                <RadioList options={MOST_USED_CONTENTS} value={mostUsed} onSelect={setMostUsed} />
              </div>

              <div className="mt-6">
                <p className="font-display text-xs text-[var(--color-accent-deep)] mb-3">COMMONS満足度</p>
                <div className="flex gap-1.5">
                  {SATISFACTION_LEVELS.map(s => (
                    <button
                      key={s.value}
                      onClick={() => setSatisfaction(prev => prev === s.value ? null : s.value)}
                      className="flex-1 py-2.5 rounded-xl border transition"
                      style={{
                        borderColor: satisfaction === s.value ? "var(--color-accent)" : "var(--color-line)",
                        background: satisfaction === s.value ? "rgba(184,152,90,0.08)" : "transparent",
                      }}
                    >
                      <span className="num text-sm">{s.value}</span>
                    </button>
                  ))}
                </div>
                <div className="mt-2 flex items-center justify-between font-display text-[10px] text-[var(--color-mute)]">
                  <span>{SATISFACTION_LEVELS[0].label}</span>
                  <span>{SATISFACTION_LEVELS[SATISFACTION_LEVELS.length - 1].label}</span>
                </div>
                {satisfaction !== null && (
                  <p className="mt-2 font-display text-xs text-[var(--color-accent-deep)] text-center">
                    {SATISFACTION_LEVELS.find(s => s.value === satisfaction)?.label}
                  </p>
                )}
              </div>

              <div className="mt-6">
                <p className="font-display text-xs text-[var(--color-accent-deep)] mb-3">備考欄（自由記述）</p>
                <textarea
                  className="input-field min-h-[96px] resize-none text-sm w-full"
                  placeholder="ご意見・ご要望があればお聞かせください…"
                  value={note}
                  onChange={e => setNote(e.target.value)}
                />
              </div>

              <div className="mt-6 space-y-3">
                <button
                  onClick={() => setWithdrawStep("done")}
                  className="w-full py-3.5 rounded-full font-display text-sm border border-[var(--color-line)] text-[var(--color-mute)] hover:text-[var(--color-ink)] hover:border-[var(--color-ink)] transition"
                >
                  退会する
                </button>
                <button onClick={() => setWithdrawStep("info")} className="w-full py-2 font-display text-xs text-[var(--color-mute)] hover:text-[var(--color-ink)] transition">戻る</button>
              </div>
            </div>
          </div>
        )}

        {/* ③ 退会完了 */}
        {showWithdraw && withdrawStep === "done" && (
          <div className="fixed inset-0 z-[60] flex justify-center bg-[var(--color-bg)] overflow-y-auto">
            <div className="w-full max-w-[430px] flex flex-col items-center justify-center px-8 py-16 text-center">
              <div className="font-display text-4xl mb-4">🕯️</div>
              <p className="font-display text-[10px] tracking-[0.2em] text-[var(--color-accent-deep)] mb-3">THANK YOU</p>
              <h1 className="font-display text-2xl mb-4">退会手続きが完了しました</h1>
              <p className="text-sm text-[var(--color-mute)] leading-relaxed">
                サブスクリプションの解約手続きが完了し、<br />
                COMMONSを退会いただきました。<br />
                これまでのご利用、誠にありがとうございました。
              </p>

              <div className="card p-4 mt-8 w-full text-left">
                <p className="font-display text-xs text-[var(--color-accent-deep)] mb-2">ご確認ください</p>
                <ul className="space-y-2">
                  {[
                    "すべてのサービス・イベントへのご参加はご利用いただけなくなります。",
                    "退会日から起算して1年間は、COMMONSへ再入会いただけません。",
                    "再入会を希望される場合は、初回入会時よりも厳格な基準で審査を行います。",
                  ].map(n => (
                    <li key={n} className="flex gap-1 text-xs text-[var(--color-mute)] leading-relaxed">
                      <span className="flex-none">・</span><span>{n}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <Link href="/login" className="btn-primary justify-center py-3.5 text-sm mt-8 w-full">
                ログイン画面へ
              </Link>
            </div>
          </div>
        )}

        <BottomNav />
      </div>
    </div>
  );
}
