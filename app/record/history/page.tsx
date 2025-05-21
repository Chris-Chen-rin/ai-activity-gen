import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ChevronLeft, Search } from "lucide-react"

export default function ActivityHistoryPage() {
  return (
    <div className="p-6 space-y-6">
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

      <Card>
        <CardHeader>
          <CardTitle>活動紀錄列表</CardTitle>
          <CardDescription>所有已記錄的活動</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { name: "團體歌唱活動", date: "2024/05/20", participants: 18, status: "已評分" },
              { name: "懷舊電影欣賞", date: "2024/05/18", participants: 22, status: "已評分" },
              { name: "園藝治療工作坊", date: "2024/05/15", participants: 15, status: "已評分" },
              { name: "健康講座", date: "2024/05/12", participants: 25, status: "已評分" },
              { name: "手工藝製作", date: "2024/05/08", participants: 12, status: "已評分" },
              { name: "太極拳教學", date: "2024/05/05", participants: 20, status: "已評分" },
              { name: "生命故事分享會", date: "2024/05/01", participants: 15, status: "已評分" },
              { name: "音樂治療", date: "2024/04/28", participants: 18, status: "已評分" },
            ].map((activity, i) => (
              <div key={i} className="flex items-center justify-between border-b pb-4">
                <div>
                  <p className="font-medium">{activity.name}</p>
                  <p className="text-sm text-muted-foreground">
                    日期：{activity.date} | 參與人數：{activity.participants}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-green-500">{activity.status}</span>
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/record/history/${i}`}>查看詳情</Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
