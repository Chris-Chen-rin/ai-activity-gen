"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Loader2 } from "lucide-react"
import Link from "next/link"
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

export default function HomePage() {
  const [activities, setActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)
  const [monthlyStats, setMonthlyStats] = useState({
    totalActivities: 0,
    totalParticipants: 0
  })

  useEffect(() => {
    fetchActivities()
  }, [])

  const fetchActivities = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/activities')
      
      if (!response.ok) {
        throw new Error('無法獲取活動資料')
      }

      const data = await response.json()
      
      // 計算本月統計
      const now = new Date()
      const currentMonth = now.getMonth() + 1 // JavaScript 的月份是 0-11
      const currentYear = now.getFullYear()
      
      const monthlyActivities = data.filter((activity: Activity) => {
        // 從活動時間範圍中提取日期部分（假設格式為 "YYYY/MM/DD"）
        const datePart = activity.活動時間範圍.split(' ')[0]
        // console.log('活動日期:', datePart)
        
        const [year, month] = datePart.split('/').map(Number)
        // console.log('解析後的年月:', year, '年', month, '月')
        
        return year === currentYear && month === currentMonth
      })

      const totalParticipants = monthlyActivities.reduce((sum: number, activity: Activity) => {
        const participants = parseInt(activity.參與人數) || 0
        // console.log('活動參與人數:', activity.活動名稱, participants)
        return sum + participants
      }, 0)

      setMonthlyStats({
        totalActivities: monthlyActivities.length,
        totalParticipants: totalParticipants
      })

      // 只取最近的三個活動
      setActivities(data.slice(0, 3))
    } catch (error) {
      console.error('獲取活動資料時發生錯誤:', error)
      toast.error('無法載入活動資料，請稍後再試')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6 space-y-6 ml-48 min-h-screen bg-cover bg-center bg-no-repeat" style={{ backgroundImage: 'url(/images/background.jpg)' }}>
      <Card className="bg-white/180 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>歡迎使用 AI 活動生成系統</CardTitle>
          <CardDescription>為長輩設計適合的活動</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-white/180 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>本月活動場次</CardTitle>
                <CardDescription>本月的活動舉辦次數</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{monthlyStats.totalActivities}</div>
                <p className="text-sm text-muted-foreground mt-2">場活動</p>
              </CardContent>
            </Card>

            <Card className="bg-white/180 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>本月參與人次</CardTitle>
                <CardDescription>本月的活動參與總人數</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{monthlyStats.totalParticipants}</div>
                <p className="text-sm text-muted-foreground mt-2">人次</p>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-white/180 backdrop-blur-sm">
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>近期活動</CardTitle>
                  <CardDescription>最近舉辦的活動紀錄</CardDescription>
                </div>
                <Button asChild>
                  <Link href="/record/history">查看全部</Link>
                </Button>
              </div>
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
                  {activities.map((activity) => (
                    <div key={activity.ID} className="flex items-center justify-between border-b pb-4">
                      <div>
                        <p className="font-medium">{activity.活動名稱}</p>
                        <p className="text-sm text-muted-foreground">
                          {activity.活動時間範圍} | {activity.活動地點}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/record/history/${activity.ID}`}>查看詳情</Link>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  )
}
