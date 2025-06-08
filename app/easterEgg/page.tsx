"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function EasterEggPage() {
  return (
    <div className="p-6 space-y-6 ml-48">
      <Card>
        <CardHeader>
          <CardTitle>復活節彩蛋</CardTitle>
          <CardDescription>恭喜你發現了這個隱藏頁面！</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            這是一個隱藏的頁面，只有知道正確路徑的人才能找到它。
            希望這個小驚喜能帶給你一些樂趣！
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

