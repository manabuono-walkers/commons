"use client";
import Link from "next/link";
import BottomNav from "@/components/BottomNav";

export default function Campaign1Page() {
  return (
    <div className="flex justify-center bg-[var(--color-bg)] min-h-screen">
      <div className="w-full max-w-[430px] pb-24">

        {/* Header */}
        <header className="sticky top-0 z-40 bg-[var(--color-bg)]/95 backdrop-blur-md border-b border-[var(--color-line)] px-5 py-3 flex items-center justify-between">
          <Link href="/home" className="font-display text-sm text-[var(--color-mute)] hover:text-[var(--color-ink)] transition">← 戻る</Link>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/logo.png" alt="COMMONS" style={{ height: 24, width: "auto", objectFit: "contain" }} />
          <span className="w-12" />
        </header>

        {/* Hero image */}
        <div className="relative h-[280px] overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/campaign1.jpeg" alt="友達紹介キャンペーン" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(11,15,22,1) 0%, rgba(11,15,22,0.2) 60%, transparent 100%)" }} />
          <div className="absolute bottom-0 left-0 right-0 px-5 pb-6">
            <p className="font-display text-[10px] tracking-[0.2em] text-[var(--color-accent-deep)] mb-2">CAMPAIGN</p>
            <h1 className="font-display text-3xl leading-tight text-white">友達紹介<br />キャンペーン</h1>
          </div>
        </div>

        {/* Meta info */}
        <div className="px-5 py-5 border-b border-[var(--color-line)]">
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "特典", value: "500pt プレゼント" },
              { label: "期間", value: "7月31日まで" },
              { label: "対象", value: "全会員" },
            ].map(item => (
              <div key={item.label} className="text-center">
                <div className="font-display text-[10px] text-[var(--color-mute)] mb-1">{item.label}</div>
                <div className="font-display text-xs text-[var(--color-ink-soft)]">{item.value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Body */}
        <div className="px-5 py-7 space-y-6">

          <section>
            <h2 className="font-display text-xs text-[var(--color-accent-deep)] tracking-[0.1em] mb-4">キャンペーン概要</h2>
            <div className="space-y-4 text-sm text-[var(--color-ink-soft)] leading-[1.9]">
              <p>
                COMMONSでは、会員の皆様に感謝を込めて<strong className="text-[var(--color-ink)] font-normal">「友達紹介キャンペーン」</strong>を実施中です。
              </p>
              <p>
                大切なご友人やご家族をCOMMONSにご紹介いただくと、紹介者・被紹介者の双方に<strong className="text-[var(--color-ink)] font-normal">500ポイント</strong>をプレゼントいたします。
              </p>
              <p>
                貯まったポイントは、イベント参加費の割引や提携店舗でのご利用にお使いいただけます。ぜひこの機会に、COMMONSの魅力をお伝えください。
              </p>
            </div>
          </section>

          <div className="h-px bg-[var(--color-line)]" />

          <section>
            <h2 className="font-display text-xs text-[var(--color-accent-deep)] tracking-[0.1em] mb-4">参加方法</h2>
            <div className="space-y-3">
              {[
                { step: "01", text: "マイページの「友達を紹介する」から紹介用URLを取得" },
                { step: "02", text: "ご友人にURLをシェア。URLから新規登録が完了" },
                { step: "03", text: "登録完了後、紹介者・被紹介者双方に500ptを付与" },
              ].map(s => (
                <div key={s.step} className="flex gap-4 items-start">
                  <div className="flex-none num text-sm" style={{ color: "var(--color-accent-deep)" }}>{s.step}</div>
                  <p className="text-sm text-[var(--color-ink-soft)] leading-relaxed">{s.text}</p>
                </div>
              ))}
            </div>
          </section>

          <div className="h-px bg-[var(--color-line)]" />

          <section>
            <h2 className="font-display text-xs text-[var(--color-accent-deep)] tracking-[0.1em] mb-4">注意事項</h2>
            <div className="card p-4 space-y-2 text-xs text-[var(--color-mute)] leading-relaxed">
              <p>· 紹介特典は被紹介者の入会完了後に付与されます</p>
              <p>· ポイントの有効期限は付与日から180日間です</p>
              <p>· 一人につき複数回の紹介が可能です</p>
              <p>· キャンペーン期間：2026年7月31日まで</p>
            </div>
          </section>

          <div className="pt-2">
            <Link
              href="/mypage"
              className="block w-full py-4 rounded-full font-display text-sm text-center transition-all hover:opacity-90 active:scale-95"
              style={{ background: "linear-gradient(135deg, #CBAE74, #B8985A)", color: "#0B0F16" }}
            >
              マイページへ
            </Link>
          </div>
        </div>

        <BottomNav />
      </div>
    </div>
  );
}
