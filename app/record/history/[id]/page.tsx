import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronLeft } from "lucide-react"

export default function ActivityDetailPage({ params }: { params: { id: string } }) {
  // 這裡可以根據 id 獲取活動詳情
  const activity = {
    id: params.id,
    name: "團體歌唱活動",
    type: "社交活動",
    date: "2024/05/20",
    time: "14:00-15:30",
    location: "活動中心大廳",
    participants: 18,
    description:
      "透��團體歌唱，增進長輩之間的互動與交流，同時訓練記憶力與表達能力。活動中選用長輩熟悉的歌曲，並搭配簡單的肢體動作，讓長輩在輕鬆愉快的氛圍中參與。",
    observation:
      "大部分長輩積極參與，特別是在唱到熟悉的老歌時，反應熱烈。有幾位平時較為安靜的長輩也主動要求點歌，顯示出活動對促進社交互動的正面效果。部分行動不便的長輩雖無法做出較大的肢體動作，但仍跟著節奏擺動，整體參與度高。",
    score: 4.9,
    feedback: [
      { name: "王奶奶", comment: "很喜歡唱歌，希望下次能再多唱幾首" },
      { name: "李爺爺", comment: "歌曲選得很好，都是我年輕時聽的" },
      { name: "張奶奶", comment: "氣氛很好，大家一起唱很開心" },
    ],
  }

  return (
    <div className="p-6 space-y-6 ml-48">
      <div className="flex items-center space-x-2">
        <Button variant="outline" size="icon" asChild>
          <Link href="/record">
            <ChevronLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">活動詳情</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{activity.name}</CardTitle>
          <CardDescription>
            {activity.date} {activity.time} | {activity.location}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">活動類型</h3>
              <p>{activity.type}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">參與人數</h3>
              <p>{activity.participants} 人</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">活動評分</h3>
              <p className="text-green-600 font-medium">{activity.score}/5</p>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-2">活動描述</h3>
            <p className="text-sm">{activity.description}</p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-2">觀察與記錄</h3>
            <p className="text-sm">{activity.observation}</p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-2">長輩回饋</h3>
            <div className="space-y-2">
              {activity.feedback.map((item, i) => (
                <div key={i} className="bg-muted p-3 rounded-md">
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm">{item.comment}</p>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end space-x-2">
        <Button variant="outline">列印報告</Button>
        <Button variant="outline">編輯紀錄</Button>
      </div>
    </div>
  )
}
