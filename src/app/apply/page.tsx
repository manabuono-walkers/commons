"use client";

import { useState } from "react";
import Link from "next/link";
import SiteFooter from "@/components/SiteFooter";

const steps = [
  { n: "01", t: "基本情報" },
  { n: "02", t: "プロフィール" },
  { n: "03", t: "申請動機" },
  { n: "04", t: "本人確認" },
  { n: "05", t: "確認・送信" },
];

export default function ApplyPage() {
  const [step, setStep] = useState(0);
  const [agreed, setAgreed] = useState(true);
  const [submitted, setSubmitted] = useState(false);

  const goToStep = (next: number) => {
    setStep(next);
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleSubmit = () => {
    if (!agreed) return;
    setSubmitted(true);
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  if (submitted) {
    return (
      <>
        <main>
          <section className="border-b border-[var(--color-line)] bg-[var(--color-ink)] text-[var(--color-bg)]">
            <div className="mx-auto max-w-[1400px] px-6 py-16 md:px-10 md:py-24">
              <Link href="/" className="font-display text-2xl tracking-[0.18em]">COMMONS</Link>
              <div className="mt-12">
                <div className="animate-fade-up font-display text-xs text-[var(--color-accent)]">
                  お申込ありがとうございます
                </div>
                <h1 className="mt-4 animate-fade-up delay-1 font-display text-[clamp(2rem,4vw,3.5rem)] leading-[1.2]">
                  審査結果をお待ちください
                </h1>
              </div>
            </div>
          </section>

          <section className="mx-auto max-w-[1400px] px-6 py-16 md:px-10">
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-[2fr_1fr]">
              <div className="space-y-10 animate-fade-up">
                <div className="card p-8 md:p-10">
                  <div className="flex items-start gap-5">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[var(--color-accent-deep)] text-[var(--color-bg)]">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6" aria-hidden="true">
                        <path d="M20 6 9 17l-5-5" />
                      </svg>
                    </div>
                    <div>
                      <div className="font-display text-xs text-[var(--color-accent-deep)]">申込受付完了</div>
                      <div className="mt-2 font-display text-2xl md:text-3xl">お申込を受け付けました</div>
                      <p className="mt-4 text-sm text-[var(--color-mute)] leading-relaxed">
                        ご記入いただいた内容は運営チームに送信されました。ただいま審査を行っております。
                      </p>
                      <div className="mt-5 flex items-center gap-3">
                        <span className="tag tag-ink">審査中</span>
                        <span className="text-xs text-[var(--color-mute)]">現在のステータス</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="card p-8 md:p-10">
                  <div className="font-display text-xs text-[var(--color-accent-deep)]">審査の流れ</div>
                  <ol className="mt-6 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-[var(--color-line)] bg-[var(--color-line)] md:grid-cols-3">
                    {[
                      { n: "01", t: "申込受付", d: "完了", state: "done" },
                      { n: "02", t: "審査中", d: "運営チームが確認しています", state: "current" },
                      { n: "03", t: "審査結果のご連絡", d: "メール / LINE でお知らせ", state: "todo" },
                    ].map((s) => (
                      <li
                        key={s.n}
                        className={`flex flex-col gap-2 px-6 py-6 ${s.state === "current" ? "bg-[var(--color-bg-soft)]" : "bg-[var(--color-bg)]"}`}
                      >
                        <span className={`num text-sm ${s.state === "done" ? "text-[var(--color-accent-deep)]" : s.state === "current" ? "text-[var(--color-ink)]" : "text-[var(--color-mute)]"}`}>{s.n}</span>
                        <span className={`font-display text-base ${s.state === "todo" ? "text-[var(--color-mute)]" : "text-[var(--color-ink)]"}`}>{s.t}</span>
                        <span className="text-xs text-[var(--color-mute)] leading-relaxed">{s.d}</span>
                      </li>
                    ))}
                  </ol>
                </div>

                <div className="card p-8 md:p-10">
                  <div className="font-display text-xs text-[var(--color-accent-deep)]">審査結果のご連絡</div>
                  <div className="mt-4 font-display text-2xl">原則7日以内にご連絡します</div>
                  <ul className="mt-5 space-y-3 text-sm text-[var(--color-mute)] leading-relaxed">
                    <li>・ご登録のメールアドレス（riku@example.com）宛にご連絡します</li>
                    <li>・LINE 連携済みの場合は LINE でも通知が届きます</li>
                    <li>・承認後、初回会費（月額 ¥500）のお支払いに進みます</li>
                    <li>・追加確認が必要な場合、運営からご連絡することがあります</li>
                  </ul>
                </div>

                <div className="border-t border-[var(--color-line)] pt-8">
                  <Link href="/" className="btn-primary inline-block">
                    ホームへ戻る
                  </Link>
                </div>
              </div>

              <aside className="space-y-8">
                <div className="card p-8">
                  <div className="font-display text-xs text-[var(--color-accent-deep)]">受付番号</div>
                  <div className="mt-4 num text-4xl">No.0612-0841</div>
                  <div className="mt-3 text-xs text-[var(--color-mute)] leading-relaxed">
                    お問い合わせの際は、こちらの受付番号をお伝えください。
                  </div>
                </div>
                <div className="card p-8">
                  <div className="font-display text-xs text-[var(--color-accent-deep)]">月額会費</div>
                  <div className="mt-4 font-display text-2xl">会費のご案内</div>
                  <div className="mt-4 flex items-baseline gap-2">
                    <span className="num text-5xl">¥500</span>
                    <span className="text-xs text-[var(--color-mute)]">／ 月</span>
                  </div>
                  <div className="mt-3 text-xs text-[var(--color-mute)] leading-relaxed">
                    年額一括は ¥5,000（2ヶ月分お得）。お支払いは Stripe による安全な決済です。
                  </div>
                </div>
              </aside>
            </div>
          </section>
        </main>
        <SiteFooter />
      </>
    );
  }

  return (
    <>
      <main>
        <section className="border-b border-[var(--color-line)] bg-[var(--color-ink)] text-[var(--color-bg)]">
          <div className="mx-auto max-w-[1400px] px-6 py-16 md:px-10 md:py-24">
            <Link href="/" className="font-display text-2xl tracking-[0.18em]">COMMONS</Link>
            <div className="mt-12 grid grid-cols-1 gap-10 md:grid-cols-[1fr_auto] md:items-end">
              <div>
                <div className="animate-fade-up font-display text-xs text-[var(--color-accent)]">
                  入会申込／審査制
                </div>
                <h1 className="mt-4 animate-fade-up delay-1 font-display text-[clamp(2rem,4vw,3.5rem)] leading-[1.2]">
                  入会のお申込み
                </h1>
                <p className="mt-4 max-w-xl animate-fade-up delay-2 text-[var(--color-bg-soft)]/80">
                  COMMONS は完全審査制です。お申込内容を運営チームで拝見し、原則7日以内にご連絡を差し上げます。
                </p>
              </div>
              <div className="animate-fade-in delay-3 text-right">
                <div className="font-display text-xs text-[var(--color-accent)]">ステップ</div>
                <div className="mt-2 num text-5xl">{String(step + 1).padStart(2, "0")} <span className="text-[var(--color-bg-soft)]/40">/ 05</span></div>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-[1400px] px-6 py-16 md:px-10">
          {/* Step indicator */}
          <ol className="grid grid-cols-5 gap-px overflow-hidden border border-[var(--color-line)] bg-[var(--color-line)] rounded-2xl">
            {steps.map((s, i) => {
              const done = i < step;
              const current = i === step;
              return (
                <li key={s.n} className={`flex flex-col gap-2 bg-[var(--color-bg)] px-4 py-5 text-center md:px-6 md:text-left ${current ? "bg-[var(--color-bg-soft)]" : ""}`}>
                  <span className={`num text-sm ${done ? "text-[var(--color-accent-deep)]" : current ? "text-[var(--color-ink)]" : "text-[var(--color-mute)]"}`}>{s.n}</span>
                  <span className={`font-display text-sm md:text-base ${current ? "text-[var(--color-ink)]" : "text-[var(--color-mute)]"}`}>{s.t}</span>
                </li>
              );
            })}
          </ol>

          {/* Form area */}
          <div className="mt-12 grid grid-cols-1 gap-12 lg:grid-cols-[2fr_1fr]">
            <form className="space-y-10">
              {step === 0 && (
                <div className="space-y-10 animate-fade-up">
                  <h2 className="font-display text-3xl">基本情報</h2>
                  <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                    <div><label className="input-label">お名前（漢字）</label><input className="input-field" defaultValue="青山 陸" /></div>
                    <div><label className="input-label">フリガナ</label><input className="input-field" defaultValue="アオヤマ リク" /></div>
                    <div><label className="input-label">生年月日</label><input className="input-field" defaultValue="1989 / 04 / 12" /></div>
                    <div><label className="input-label">性別</label><input className="input-field" defaultValue="男性" /></div>
                    <div><label className="input-label">メールアドレス</label><input className="input-field" defaultValue="riku@example.com" /></div>
                    <div><label className="input-label">電話番号</label><input className="input-field" defaultValue="080-XXXX-XXXX" /></div>
                  </div>
                </div>
              )}

              {step === 1 && (
                <div className="space-y-10 animate-fade-up">
                  <h2 className="font-display text-3xl">プロフィール</h2>
                  <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                    <div><label className="input-label">ご職業</label><input className="input-field" defaultValue="戦略コンサルタント" /></div>
                    <div><label className="input-label">所属（任意）</label><input className="input-field" defaultValue="" /></div>
                    <div><label className="input-label">居住エリア</label><input className="input-field" defaultValue="東京 / 港区" /></div>
                    <div><label className="input-label">ご紹介者</label><input className="input-field" defaultValue="No.0612 / 中島誉 様" /></div>
                  </div>
                  <div>
                    <label className="input-label">興味のあるカテゴリ（複数選択可）</label>
                    <div className="mt-3 flex flex-wrap gap-3">
                      {["ワイン", "日本酒", "ウイスキー", "コーヒー", "アート", "写真", "音楽", "アウトドア"].map((c) => (
                        <span key={c} className={`tag ${["ワイン", "コーヒー", "アート"].includes(c) ? "tag-ink" : ""}`}>{c}</span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-10 animate-fade-up">
                  <h2 className="font-display text-3xl">申請動機</h2>
                  <div>
                    <label className="input-label">COMMONS を知ったきっかけ</label>
                    <textarea className="input-field min-h-[120px] resize-none" defaultValue="既存会員（中島様）からのご紹介。Instagramで取り上げられていた『ワインサロン』の雰囲気に惹かれ、応募を決めました。" />
                  </div>
                  <div>
                    <label className="input-label">入会後にチャレンジしたいこと</label>
                    <textarea className="input-field min-h-[160px] resize-none" defaultValue="仕事とは別の場所で、長く付き合える趣味の仲間を作りたい。月1〜2回、ワインかコーヒーのイベントに継続して通えればと思っています。" />
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-10 animate-fade-up">
                  <h2 className="font-display text-3xl">本人確認</h2>
                  <p className="text-sm text-[var(--color-mute)] leading-relaxed">
                    審査の信頼性確保のため、本人確認書類（運転免許証 / マイナンバーカード / パスポート）の画像をご提出ください。
                  </p>
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    {[
                      { t: "本人確認書類（表面）", st: "アップロード済", file: "menkyo_omote.jpg" },
                      { t: "本人確認書類（裏面）", st: "アップロード済", file: "menkyo_ura.jpg" },
                      { t: "セルフィー（顔写真）", st: "未提出", file: "" },
                      { t: "（任意）名刺", st: "未提出", file: "" },
                    ].map((u) => (
                      <div key={u.t} className="card p-6">
                        <div className="font-display text-xs text-[var(--color-mute)]">{u.t}</div>
                        <div className="mt-3 flex items-end justify-between">
                          <span className={`font-display text-lg ${u.st === "アップロード済" ? "text-[var(--color-accent-deep)]" : ""}`}>{u.st}</span>
                          <button className="link-underline font-display text-xs">{u.st === "未提出" ? "アップロード" : "差し替え"}</button>
                        </div>
                        {u.file && <div className="mt-1 text-xs text-[var(--color-mute)] font-display">{u.file}</div>}
                      </div>
                    ))}
                  </div>
                  <div className="border-t border-[var(--color-line)] pt-6 text-xs text-[var(--color-mute)] leading-relaxed">
                    ※ 将来的に eKYC（TRUSTDOCK / LIQUID eKYC）連携を導入することで、自動本人確認に切替可能です（オプション）。
                  </div>
                </div>
              )}

              {step === 4 && (
                <div className="space-y-10 animate-fade-up">
                  <h2 className="font-display text-3xl">入力内容のご確認</h2>
                  <div className="card p-8">
                    <div className="font-display text-xs text-[var(--color-accent-deep)]">お申込内容</div>
                    <dl className="mt-4 space-y-3 text-sm">
                      <div className="flex justify-between border-b border-[var(--color-line)] pb-3"><dt className="text-[var(--color-mute)]">お名前</dt><dd>青山 陸</dd></div>
                      <div className="flex justify-between border-b border-[var(--color-line)] pb-3"><dt className="text-[var(--color-mute)]">職業</dt><dd>戦略コンサルタント</dd></div>
                      <div className="flex justify-between border-b border-[var(--color-line)] pb-3"><dt className="text-[var(--color-mute)]">居住エリア</dt><dd>東京 / 港区</dd></div>
                      <div className="flex justify-between border-b border-[var(--color-line)] pb-3"><dt className="text-[var(--color-mute)]">ご紹介者</dt><dd>No.0612 / 中島誉 様</dd></div>
                      <div className="flex justify-between"><dt className="text-[var(--color-mute)]">本人確認</dt><dd>3 / 3 完了</dd></div>
                    </dl>
                  </div>
                  <label className="flex items-start gap-3 text-sm">
                    <input
                      type="checkbox"
                      className="mt-1 accent-[var(--color-accent-deep)]"
                      checked={agreed}
                      onChange={(e) => setAgreed(e.target.checked)}
                    />
                    <span>COMMONS 会員規約・プライバシーポリシーに同意します。</span>
                  </label>
                </div>
              )}

            </form>

            {/* Aside — 最初のステップでのみ表示 */}
            {step === 0 && (
              <aside className="space-y-8">
                <div className="card p-8">
                  <div className="font-display text-xs text-[var(--color-accent-deep)]">審査について</div>
                  <div className="mt-4 font-display text-2xl">審査の流れ</div>
                  <ul className="mt-5 space-y-3 text-sm text-[var(--color-mute)] leading-relaxed">
                    <li>・原則7日以内に運営からご連絡</li>
                    <li>・既存会員からの推薦があると審査が円滑</li>
                    <li>・東京 / 大阪のいずれかから所属支部を選択</li>
                    <li>・承認後、初回会費のお支払いに進みます</li>
                  </ul>
                </div>
                <div className="card p-8">
                  <div className="font-display text-xs text-[var(--color-accent-deep)]">月額会費</div>
                  <div className="mt-4 font-display text-2xl">会費のご案内</div>
                  <div className="mt-4 flex items-baseline gap-2">
                    <span className="num text-5xl">¥500</span>
                    <span className="text-xs text-[var(--color-mute)]">／ 月</span>
                  </div>
                  <div className="mt-3 text-xs text-[var(--color-mute)] leading-relaxed">
                    年額一括は ¥5,000（2ヶ月分お得）。お支払いは Stripe による安全な決済です。
                  </div>
                </div>
              </aside>
            )}
          </div>

          {/* Step navigation — 案内カードより下、ページ最下部に配置 */}
          <div className="mt-12 flex items-center justify-between gap-4 border-t border-[var(--color-line)] pt-8">
            <button
              type="button"
              onClick={() => goToStep(Math.max(0, step - 1))}
              disabled={step === 0}
              className="font-display text-sm link-underline disabled:opacity-30"
            >
              ← 前のステップへ
            </button>
            {step < steps.length - 1 ? (
              <button type="button" onClick={() => goToStep(step + 1)} className="btn-primary">
                次のステップへ →
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={!agreed}
                className="btn-primary disabled:cursor-not-allowed disabled:opacity-40"
              >
                審査を申し込む
              </button>
            )}
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
