import ClubDetailClient from "./ClubDetailClient";

export default async function ClubDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ClubDetailClient id={id} />;
}
