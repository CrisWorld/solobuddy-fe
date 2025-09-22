"use client"

import Link from "next/link"
import Image from "next/image"
import { cn } from "@/lib/utils"

export function Logo({ className, textClass }: { className?: string; textClass?: string }) {
  return (
    <Link href="/home" className={cn("flex items-center gap-2", className)}>
      <Image
        src="/images/coconut-logo.png"
        alt="SoloBuddy"
        width={40}
        height={40}
        className="rounded-full"
      />
      <span className={cn("text-xl font-bold", textClass)}>SoloBuddy</span>
    </Link>
  )
}
