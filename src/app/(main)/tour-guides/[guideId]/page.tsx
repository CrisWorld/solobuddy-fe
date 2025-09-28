import { TourGuideDetailPage } from "@/components/modules/chat/TourGuideDetailPage";

interface PageProps {
    params: { guideId: string }
}

export default function GuideDetailPage({ params }: PageProps) {
  return <TourGuideDetailPage guideId={params.guideId} />
}