"use client"

import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export function BackButton() {
  return (
    <Button variant="outline" size="icon" asChild>
      <Link href="/life-story">
        <ArrowLeft className="h-4 w-4" />
      </Link>
    </Button>
  )
} 