export default function SiteFooter() {
  return (
    <footer className="mt-32 border-t border-[var(--color-line)] bg-[var(--color-bg-soft)]/60">
      <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-12 px-6 py-16 md:grid-cols-3 md:px-10">
        <div>
          <div className="font-display text-3xl tracking-[0.18em]">COMMONS</div>
          <p className="mt-4 max-w-xs font-display text-xs leading-relaxed text-[var(--color-mute)]">
            完全審査制。共通の趣味でつながる、大人のためのサードプレイス。
          </p>
        </div>
        <div>
          <div className="font-display text-xs text-[var(--color-mute)]">会員向けメニュー</div>
          <ul className="mt-5 space-y-3 text-sm">
            <li>マイページ</li>
            <li>イベント</li>
            <li>部活</li>
            <li>クーポン</li>
          </ul>
        </div>
        <div>
          <div className="font-display text-xs text-[var(--color-mute)]">お問い合わせ</div>
          <ul className="mt-5 space-y-3 text-sm">
            <li>新規入会のお申込み</li>
            <li>運営からのお知らせ</li>
            <li>規約・プライバシーポリシー</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-[var(--color-line)] px-6 py-6 md:px-10">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between text-xs text-[var(--color-mute)] font-display">
          <span>© 2026 株式会社ONE LIKE</span>
          <span>モックアップ制作：Walkers</span>
        </div>
      </div>
    </footer>
  );
}
