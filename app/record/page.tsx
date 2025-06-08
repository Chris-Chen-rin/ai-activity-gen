"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardTitle, CardHeader, CardContent } from "@/components/ui/card"
import { ClipboardList, History } from "lucide-react"

export default function RecordPage() {
  return (
    <div className="p-6 space-y-6 ml-48 min-h-screen bg-cover bg-center bg-no-repeat" style={{ backgroundImage: 'url(/images/background.jpg)' }}>
      <Card className="bg-white/180 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>活動紀錄</CardTitle>
          <CardDescription>查看和管理活動紀錄</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">紀錄與評分</h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="flex flex-col items-center text-center p-6 bg-white/180 backdrop-blur-sm">
              <ClipboardList className="h-16 w-16 mb-4 text-primary" />
              <CardTitle className="text-xl mb-2">記錄新的活動</CardTitle>
              <CardDescription className="mb-6">記錄新舉辦的活動內容、參與者及評分</CardDescription>
              <Button size="lg" className="mt-auto" asChild>
                <Link href="/record/new">開始記錄</Link>
              </Button>
            </Card>

            <Card className="flex flex-col items-center text-center p-6 bg-white/180 backdrop-blur-sm">
              <History className="h-16 w-16 mb-4 text-primary" />
              <CardTitle className="text-xl mb-2">查看先前活動</CardTitle>
              <CardDescription className="mb-6">瀏覽和搜尋所有已記錄的活動歷史</CardDescription>
              <Button size="lg" className="mt-auto" asChild>
                <Link href="/record/history">查看歷史</Link>
              </Button>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
