"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"
import Link from "next/link"

interface Activity {
  ID: string
  活動類別: string
  活動類型: string
  活動主題: string
  活動名稱: string
  活動時間範圍: string
  活動地點: string
  帶領者: string
  協助者: string
  參與者程度: string
  參與人數: string
  活動目的: string
  活動器材: string
  活動內容: string
  注意事項: string
  參與成員: string
}

export default function ActivityDetailPage() {
  const params = useParams()
  const [activity, setActivity] = useState<Activity | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchActivity()
  }, [params.id])

  const fetchActivity = async () => {
    try {
      setLoading(true)
      console.log('正在獲取活動資料，ID:', params.id)
      
      const response = await fetch('/api/activities')
      
      if (!response.ok) {
        throw new Error('無法獲取活動資料')
      }

      const data = await response.json()
      console.log('獲取到的所有活動資料:', data)
      console.log('正在尋找 ID 為', params.id, '的活動')
      
      // 檢查每個活動的 ID
      data.forEach((a: Activity, index: number) => {
        console.log(`活動 ${index} 的 ID:`, a.ID, '型別:', typeof a.ID)
      })

      const foundActivity = data.find((a: Activity) => {
        console.log('比對 ID:', a.ID, '與', params.id)
        return String(a.ID) === String(params.id)
      })
      
      if (!foundActivity) {
        console.error('找不到 ID 為', params.id, '的活動')
        throw new Error('找不到指定的活動')
      }

      console.log('找到活動:', foundActivity)
      setActivity(foundActivity)
    } catch (error) {
      console.error('獲取活動資料時發生錯誤:', error)
      toast.error('無法載入活動資料，請稍後再試')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="p-6 space-y-6 ml-48">
        <div className="flex justify-center items-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
        </div>
      </div>
    )
  }

  if (!activity) {
    return (
      <div className="p-6 space-y-6 ml-48">
        <Card>
          <CardHeader>
            <CardTitle>找不到活動</CardTitle>
            <CardDescription>無法找到指定的活動資料</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href="/record/history">返回活動列表</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6 ml-48">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>{activity.活動名稱}</CardTitle>
              <CardDescription>
                {activity.活動時間範圍} | {activity.活動地點}
              </CardDescription>
            </div>
            <Button asChild variant="outline">
              <Link href="/record/history">返回列表</Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">基本資訊</h3>
                <div className="space-y-2">
                  <p className="text-sm"><span className="text-muted-foreground">活動類別：</span>{activity.活動類別}</p>
                  <p className="text-sm"><span className="text-muted-foreground">活動類型：</span>{activity.活動類型}</p>
                  <p className="text-sm"><span className="text-muted-foreground">活動主題：</span>{activity.活動主題}</p>
                  <p className="text-sm"><span className="text-muted-foreground">帶領者：</span>{activity.帶領者}</p>
                  <p className="text-sm"><span className="text-muted-foreground">協助者：</span>{activity.協助者}</p>
                  <p className="text-sm"><span className="text-muted-foreground">參與者程度：</span>{activity.參與者程度}</p>
                  <p className="text-sm"><span className="text-muted-foreground">參與人數：</span>{activity.參與人數}</p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">活動內容</h3>
                <div className="space-y-2">
                  <p className="text-sm"><span className="text-muted-foreground">活動目的：</span>{activity.活動目的}</p>
                  <p className="text-sm"><span className="text-muted-foreground">活動器材：</span>{activity.活動器材}</p>
                  <p className="text-sm"><span className="text-muted-foreground">活動內容：</span>{activity.活動內容}</p>
                  <p className="text-sm"><span className="text-muted-foreground">注意事項：</span>{activity.注意事項}</p>
                  <p className="text-sm"><span className="text-muted-foreground">參與成員：</span>{activity.參與成員}</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
