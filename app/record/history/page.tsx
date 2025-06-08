"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ChevronLeft, Search, Loader2 } from "lucide-react"
import { toast } from "sonner"

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

export default function ActivityHistoryPage() {
  const [activities, setActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchActivities()
  }, [])

  const fetchActivities = async () => {
    try {
      setLoading(true)
      // console.log('開始獲取活動資料...')
      
      const response = await fetch('/api/activities')
      // console.log('API 回應狀態:', response.status, response.statusText)
      
      if (!response.ok) {
        throw new Error('無法獲取活動資料')
      }

      const data = await response.json()
      // console.log('獲取到的活動資料:', JSON.stringify(data, null, 2))
      
      // 檢查資料格式
      if (!Array.isArray(data)) {
        console.error('資料格式錯誤，預期為陣列:', data)
        throw new Error('資料格式錯誤')
      }

      // 檢查並過濾無效的活動資料
      const validActivities = data.filter((activity, index) => {
        const isValid = activity && typeof activity === 'object'
        if (!isValid) {
          console.warn(`活動 ${index} 資料無效:`, activity)
        }
        return isValid
      })

      // console.log('有效的活動資料:', validActivities)
      setActivities(validActivities)
    } catch (error) {
      console.error('獲取活動資料時發生錯誤:', error)
      toast.error('無法載入活動資料，請稍後再試')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (timeRange: string | undefined) => {
    if (!timeRange) return '未設定日期'
    const parts = timeRange.split(' ')
    return parts[0] || '未設定日期'
  }

  const generateKey = (activity: Activity, index: number) => {
    // 使用索引作為備用 key
    const baseKey = `activity-${index}`
    
    // 嘗試使用活動資料生成 key
    if (activity.ID) return `id-${activity.ID}`
    if (activity.活動名稱 && activity.活動時間範圍) {
      return `name-${activity.活動名稱}-${activity.活動時間範圍}`
    }
    
    return baseKey
  }

  return (
    <div className="p-6 space-y-6 ml-48 min-h-screen bg-cover bg-center bg-no-repeat" style={{ backgroundImage: 'url(/images/background.jpg)' }}>
      <div className="flex items-center space-x-2">
        <Button variant="outline" size="icon" asChild>
          <Link href="/record">
            <ChevronLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">查看先前活動</h1>
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input type="search" placeholder="搜尋活動紀錄..." className="pl-8" />
        </div>
        <Button variant="outline">篩選</Button>
      </div>

      <Card className="bg-white/180 backdrop-blur-[2px]">
        <CardHeader>
          <CardTitle>活動紀錄列表</CardTitle>
          <CardDescription>所有已記錄的活動</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
            </div>
          ) : activities.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              目前沒有活動紀錄
            </div>
          ) : (
            <div className="space-y-4">
              {activities.map((activity, index) => (
                <div key={generateKey(activity, index)} className="flex items-center justify-between border-b pb-4">
                  <div>
                    <p className="font-medium">{activity.活動名稱 || '未命名活動'}</p>
                    <p className="text-sm text-muted-foreground">
                      日期：{formatDate(activity.活動時間範圍)} | 參與人數：{activity.參與人數 || '0'}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/record/history/${activity.ID || index}`}>查看詳情</Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
