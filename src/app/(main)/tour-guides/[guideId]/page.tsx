import { TourGuideDetailPage } from "@/components/modules/chat/TourGuideDetailPage";

interface PageProps {
  params: Promise<{ guideId: string }>
}

export default async function GuideDetailPage({ params }: PageProps) {
  const { guideId } = await params

  return <TourGuideDetailPage guideId={guideId} />
}
