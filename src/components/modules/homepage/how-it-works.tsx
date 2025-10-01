import { Sparkles, Search, MessageCircle, MapPin } from "lucide-react"

const steps = [
  {
    icon: Search,
    title: "Tìm kiếm & Khám phá",
    description:
      "Duyệt qua danh sách hướng dẫn viên du lịch được AI gợi ý và tìm người đồng hành phù hợp cho chuyến đi một mình của bạn.",
  },
  {
    icon: MessageCircle,
    title: "Trò chuyện với AI",
    description:
      "Nhận gợi ý cá nhân hóa và câu trả lời tức thì cho mọi thắc mắc du lịch từ chatbot thông minh.",
  },
  {
    icon: MapPin,
    title: "Đặt hướng dẫn viên",
    description: "Chọn hướng dẫn viên yêu thích và tùy chỉnh lịch trình dựa trên sở thích cũng như ngân sách của bạn.",
  },
  {
    icon: Sparkles,
    title: "Khám phá & Tận hưởng",
    description: "Bắt đầu hành trình một mình với sự tự tin, vì bạn luôn có sự hỗ trợ từ chuyên gia địa phương và AI.",
  },
]

export function HowItWorks() {
  return (
    <section className="py-16 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">Cách Hoạt Động</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Chỉ với 4 bước đơn giản, bạn đã sẵn sàng cho chuyến phiêu lưu solo. Hãy để nền tảng AI của chúng tôi dẫn lối
            đến những trải nghiệm khó quên.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="text-center">
              <div className="relative mb-6">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <step.icon className="w-8 h-8 text-primary-foreground" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-foreground text-background rounded-full flex items-center justify-center text-sm font-bold">
                  {index + 1}
                </div>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">{step.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
