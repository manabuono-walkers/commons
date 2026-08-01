// クラブ参加メンバーの共有データ
// クラブ詳細（参加前カード／メンバータブ）と メンバー一覧ページ の両方から参照する

export interface ClubMember {
  name: string;
  avatar: string;
  join: string;
}

/** 名簿を規定人数まで埋めるための氏名プール（モック用のダミー） */
const FILLER_NAMES = [
  "佐々木 亮", "松本 理沙", "井上 拓真", "木村 彩香", "林 悠斗",
  "斎藤 千夏", "清水 健太", "山口 美穂", "森 大地", "池田 奈々",
  "橋本 翔", "石川 綾乃", "前田 和樹", "藤田 真央", "岡田 隼人",
  "後藤 咲希", "長谷川 涼", "村上 春香", "近藤 直樹", "坂本 楓",
  "遠藤 圭介", "青木 心美", "福田 陽介", "西村 結衣", "太田 涼太",
  "藤井 香織", "岡本 悠真", "中川 詩織", "原田 大輔", "小川 千尋",
  "竹内 諒", "金子 明日香", "和田 亮介", "中山 桃子", "石田 竜也",
];

/** 加入年月を決定的に散らす（Math.random は使わない） */
function fillerJoin(index: number): string {
  const months = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"];
  const year = 2025 + Math.floor(index / 12) % 2;
  return `${year}.${months[index % 12]}`;
}

/** 実名で用意したメンバーに、規定人数までダミーを補って完全な名簿を作る */
function buildRoster(seed: ClubMember[], total: number, offset: number): ClubMember[] {
  const roster = [...seed];
  let i = 0;
  while (roster.length < total) {
    const name = FILLER_NAMES[(offset + i) % FILLER_NAMES.length];
    roster.push({ name, avatar: name.charAt(0), join: fillerJoin(offset + i) });
    i += 1;
  }
  return roster.slice(0, total);
}

const WINE_SEED: ClubMember[] = [
  { name: "田中 康介", avatar: "/images/tanaka.png", join: "2025.04" },
  { name: "山本 彩花", avatar: "/images/yamamoto.png", join: "2025.06" },
  { name: "伊藤 健", avatar: "/images/ito.png", join: "2026.05" },
  { name: "青山 陸", avatar: "/images/icon.png", join: "2025.11" },
  { name: "中村 優一", avatar: "中", join: "2025.08" },
  { name: "鈴木 花", avatar: "鈴", join: "2026.01" },
  { name: "渡辺 直人", avatar: "渡", join: "2026.03" },
  { name: "小林 さくら", avatar: "小", join: "2026.06" },
];

const COFFEE_SEED: ClubMember[] = [
  { name: "佐藤 美咲", avatar: "佐", join: "2025.05" },
  { name: "高橋 大輔", avatar: "高", join: "2025.09" },
  { name: "田中 康介", avatar: "/images/tanaka.png", join: "2026.02" },
  { name: "青山 陸", avatar: "/images/icon.png", join: "2026.04" },
];

const TRAVEL_SEED: ClubMember[] = [
  { name: "加藤 恵子", avatar: "加", join: "2025.03" },
  { name: "田中 康介", avatar: "/images/tanaka.png", join: "2025.07" },
  { name: "伊藤 健", avatar: "/images/ito.png", join: "2026.01" },
  { name: "山本 彩花", avatar: "/images/yamamoto.png", join: "2026.04" },
  { name: "青山 陸", avatar: "/images/icon.png", join: "2026.06" },
];

/** クラブごとの完全なメンバー名簿（人数はクラブ詳細の members と一致） */
export const clubRosters: Record<string, ClubMember[]> = {
  wine: buildRoster(WINE_SEED, 38, 0),
  coffee: buildRoster(COFFEE_SEED, 24, 11),
  travel: buildRoster(TRAVEL_SEED, 29, 23),
};

export const clubDisplayNames: Record<string, string> = {
  wine: "ワイン部",
  coffee: "コーヒー部",
  travel: "旅部",
};

export function getRoster(clubId: string): ClubMember[] {
  return clubRosters[clubId] ?? clubRosters.wine;
}

export function getClubName(clubId: string): string {
  return clubDisplayNames[clubId] ?? "クラブ";
}
