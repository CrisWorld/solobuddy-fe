import { TourGuideDetailPage } from "@/components/modules/chat/TourGuideDetailPage";

export default function GuideDetailPage({ params }: { params: string }) {
  return <TourGuideDetailPage guideId={Number(params)} />
}