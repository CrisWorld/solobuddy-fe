"use client"

import { TourGuides } from "@/components/modules/tourguides/tour-guides"
import { HeroSection } from "./hero-section"
import { HowItWorks } from "./how-it-works"
import { Testimonials } from "./testimonials"

export default function HomePage(){
    return (
        <>
        <HeroSection />
        <TourGuides />
        <HowItWorks />
        <Testimonials />
        </>
    )
}