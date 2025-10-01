"use client"

import { TourGuides } from "@/components/modules/tourguides/tour-guides"
import { HeroSection } from "./hero-section"
import { HowItWorks } from "./how-it-works"
import WhyChooseUs from "./why-choose-us"

export default function HomePage(){
    return (
        <>
        <HeroSection />
        <TourGuides />
        <HowItWorks />
        <WhyChooseUs />
        </>
    )
}