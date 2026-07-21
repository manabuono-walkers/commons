"use client";
import BottomNav from "@/components/BottomNav";
import AppHeader from "@/components/AppHeader";

const sections = [
  {
    step: "01",
    title: "プロフィールを設定する",
    body: "マイページ → プロフィールを編集から、名前・アイコン・自己紹介を設定してください。他のメンバーへの第一印象になります。",
    icon: "👤",
  },
  {
    step: "02",
    title: "アカウント認証を完了させる",
    body: "LINEの審査フォームから送信された情報をもとに、スタッフが手動で認証を行います。認証完了まで1〜3営業日かかる場合があります。",
    icon: "✅",
  },
  {
    step: "03",
    title: "イベントに参加する",
    body: "イベント一覧からお好みのイベントを選び、男性・女性それぞれの参加ボタンからお支払い手続きを行ってください。募集締め切り前にお申し込みください。",
    icon: "🎉",
  },
  {
    step: "04",
    title: "クラブ（部活）に参加する",
    body: "クラブ一覧から興味のあるクラブを見つけ参加しましょう。クラブ内チャットで仲間と交流したり、クラブ独自のイベントに参加することができます。",
    icon: "🏛️",
  },
  {
    step: "05",
    title: "タイムラインに投稿する",
    body: "タイムラインは全会員が閲覧できるオープンな場所です。イベントの感想・おすすめのお店・日常のひとことなど自由に投稿してください。",
    icon: "📝",
  },
  {
    step: "06",
    title: "提携店舗を活用する",
    body: "マップタブでは提携店舗の一覧とマップを確認できます。来店時に会員証を提示するか、クーポンを使用することで特典が受けられます。",
    icon: "🗺️",
  },
  {
    step: "07",
    title: "ポイントを貯める",
    body: "イベント参加・月額会費の支払いなどでポイント（XP）が貯まります。XPが一定量に達するとランクがアップし、より多くの特典が受けられるようになります。",
    icon: "⭐",
  },
  {
    step: "08",
    title: "ランクアップを目指す",
    body: "STANDARD → BRONZE → SILVER → GOLD → PLATINUMの5段階。ランクが上がるほど限定イベントへの優先招待や特別クーポンなどの特典が充実します。",
    icon: "🏆",
  },
];

const faqs = [
  { q: "退会したい場合はどうすればよいですか？", a: "マイページ下部の「退会」メニューから手続きが行えます。退会後は再入会に審査が必要となります。" },
  { q: "支払い方法の変更はできますか？", a: "マイページ → 支払い状況 → 支払い方法の変更から更新できます。" },
  { q: "イベントをキャンセルしたい場合は？", a: "参加申込後のキャンセルは、お問い合わせよりご連絡ください。キャンセルポリシーは各イベントの参加規約をご確認ください。" },
  { q: "クーポンの使い方を教えてください。", a: "マイページ → クーポンから確認できます。クーポン詳細画面で右にスワイプすると使用できます。" },
];

export default function GuidePage() {
  return (
    <div className="flex justify-center bg-[var(--color-bg)] min-h-screen">
      <div className="w-full max-w-[430px] pb-24">
        <AppHeader backHref="/mypage" />
        <div className="px-5 pt-6 pb-6 border-b border-[var(--color-line)]">
          <p className="font-display text-[10px] tracking-[0.2em] text-[var(--color-accent-deep)] mb-1">How to use</p>
          <h1 className="font-display text-2xl">使い方ガイド</h1>
          <p className="font-display text-xs text-[var(--color-mute)] mt-2">COMMONSをもっと楽しむための基本ガイドです。</p>
        </div>

        <div className="px-5 pt-6 space-y-5">
          {sections.map((s) => (
            <div key={s.step} className="card p-5">
              <div className="flex items-start gap-4">
                <div className="flex-none">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-xl"
                    style={{ background: "var(--color-bg-soft)", border: "1px solid var(--color-line)" }}>
                    {s.icon}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2 mb-1.5">
                    <span className="num text-[10px] text-[var(--color-accent-deep)]">STEP {s.step}</span>
                  </div>
                  <h3 className="font-display text-base leading-snug mb-2">{s.title}</h3>
                  <p className="text-xs text-[var(--color-mute)] leading-relaxed">{s.body}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="px-5 pt-8 pb-4">
          <h2 className="font-display text-base mb-4">よくある質問</h2>
          <div className="space-y-3">
            {faqs.map((f, i) => (
              <div key={i} className="card p-5">
                <p className="font-display text-sm mb-2 text-[var(--color-accent-deep)]">Q. {f.q}</p>
                <p className="text-xs text-[var(--color-mute)] leading-relaxed">A. {f.a}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="px-5 pt-4 pb-4">
          <div className="card p-5 text-center">
            <p className="font-display text-sm mb-1">お困りのことはありませんか？</p>
            <p className="font-display text-xs text-[var(--color-mute)] mb-4">ご不明な点はお気軽にお問い合わせください。</p>
            <a
              href="/contact"
              className="inline-block font-display text-sm px-6 py-3 rounded-full border border-[var(--color-accent)]/50 text-[var(--color-accent-deep)] hover:bg-[var(--color-accent)]/10 transition"
            >
              お問い合わせ
            </a>
          </div>
        </div>

        <BottomNav />
      </div>
    </div>
  );
}
