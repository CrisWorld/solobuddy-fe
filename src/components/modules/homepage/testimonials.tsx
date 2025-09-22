import { Star, Quote } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

const testimonials = [
  {
    name: "Sarah Johnson",
    location: "New York, USA",
    rating: 5,
    text: "SoloBuddy made my solo trip to Vietnam absolutely incredible! The AI recommendations were spot-on, and my tour guide was knowledgeable and friendly.",
    image: "/happy-female-traveler-headshot.jpg",
  },
  {
    name: "Marcus Chen",
    location: "Toronto, Canada",
    rating: 5,
    text: "As a first-time solo traveler, I was nervous about exploring alone. SoloBuddy gave me the confidence and support I needed for an amazing adventure.",
    image: "/smiling-male-traveler-headshot.jpg",
  },
  {
    name: "Emma Rodriguez",
    location: "Madrid, Spain",
    rating: 5,
    text: "The personalized itinerary and local insights from my guide made all the difference. I discovered hidden gems I never would have found on my own!",
    image: "/happy-female-traveler-with-backpack-headshot.jpg",
  },
]

export function Testimonials() {
  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">They Love SoloBuddy</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Don't just take our word for it. Here's what our solo travelers have to say about their experiences with
            SoloBuddy.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="relative overflow-hidden hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="absolute top-4 right-4 text-primary opacity-20">
                  <Quote className="w-8 h-8" />
                </div>

                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>

                <p className="text-muted-foreground leading-relaxed mb-6">"{testimonial.text}"</p>

                <div className="flex items-center gap-3">
                  <img
                    src={testimonial.image || "/placeholder.svg"}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="font-semibold text-foreground">{testimonial.name}</h4>
                    <p className="text-sm text-muted-foreground">{testimonial.location}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
