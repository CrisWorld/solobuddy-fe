import { Sparkles, Search, MessageCircle, MapPin } from "lucide-react"

const steps = [
  {
    icon: Search,
    title: "Search & Discover",
    description:
      "Browse through our curated list of AI-powered tour guides and find the perfect match for your solo adventure.",
  },
  {
    icon: MessageCircle,
    title: "Chat with AI",
    description:
      "Get personalized recommendations and instant answers to your travel questions from our intelligent chatbot.",
  },
  {
    icon: MapPin,
    title: "Book Your Guide",
    description: "Select your preferred tour guide and customize your itinerary based on your interests and budget.",
  },
  {
    icon: Sparkles,
    title: "Explore & Enjoy",
    description: "Embark on your solo journey with confidence, knowing you have expert local guidance and AI support.",
  },
]

export function HowItWorks() {
  return (
    <section className="py-16 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">How It Works</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Your solo travel adventure is just four simple steps away. Let our AI-powered platform guide you to
            unforgettable experiences.
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
