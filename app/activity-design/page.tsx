"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, Search, Wand2 } from "lucide-react"

export default function ActivityDesignPage() {
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedActivity, setGeneratedActivity] = useState<null | {
    name: string
    description: string
    objectives: string[]
    materials: string[]
    procedure: string[]
    adaptations: string[]
  }>(null)

  const handleGenerate = () => {
    setIsGenerating(true)
    // 模擬 AI 生成過程
    setTimeout(() => {
      setGeneratedActivity({
        name: "懷舊音樂與故事分享",
        description: "透過播放長輩年輕時期的流行音樂，引導長輩分享與音樂相關的生命故事和回憶，促進社交互動和認知刺激。",
        objectives: [
          "促進長輩之間的社交互動和溝通",
          "刺激長期記憶和回憶能力",
          "提升情緒健康和生活滿意度",
          "創造表達自我的機會",
        ],
        materials: [
          "播放設備（音響或平板電腦）",
          "1950-1970年代的音樂播放清單",
          "相關時代的照片或物品",
          "舒適的座位安排",
          "簡單的節奏樂器（可選）",
        ],
        procedure: [
          "活動前準備：根據長輩的年齡和背景，選擇適合的音樂曲目。",
          "開場（10分鐘）：介紹活動目的和流程，進行簡單的暖身活動。",
          "音樂欣賞（15分鐘）：播放2-3首精選歌曲，每首播放後暫停討論。",
          "故事分享（30分鐘）：邀請長輩分享與音樂相關的記憶和故事。",
          "互動討論（15分鐘）：引導長輩討論當時的社會背景、流行文化等。",
          "結束活動（10分鐘）：總結分享內容，感謝參與，預告下次活動。",
        ],
        adaptations: [
          "聽力障礙：提供歌詞列印版，使用更大音量或耳機",
          "認知障礙：簡化問題，使用更多視覺提示",
          "行動不便：確保座位舒適，活動中加入簡單的坐姿肢體動作",
          "情緒低落：選擇更輕快正面的音樂，增加個別關注",
        ],
      })
      setIsGenerating(false)
    }, 3000)
  }

  return (
    <div className="p-6 space-y-6 ml-48">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">設計活動</h1>
        <div className="flex space-x-2">
          <Button variant="outline">儲存活動</Button>
        </div>
      </div>

      <Tabs defaultValue="ai-design">
        <TabsList>
          <TabsTrigger value="ai-design">AI 輔助設計</TabsTrigger>
          <TabsTrigger value="manual-design">手動設計</TabsTrigger>
          <TabsTrigger value="templates">活動範本</TabsTrigger>
        </TabsList>

        <TabsContent value="ai-design" className="mt-4 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>AI 輔助活動設計</CardTitle>
              <CardDescription>提供活動需求，AI 將協助生成適合的活動設計</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="activity-goal">活動目標</Label>
                <Select>
                  <SelectTrigger id="activity-goal">
                    <SelectValue placeholder="選擇主要活動目標" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cognitive">認知刺激</SelectItem>
                    <SelectItem value="physical">身體活動</SelectItem>
                    <SelectItem value="social">社交互動</SelectItem>
                    <SelectItem value="emotional">情緒支持</SelectItem>
                    <SelectItem value="creative">創意表達</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="participants">參與對象</Label>
                <Select>
                  <SelectTrigger id="participants">
                    <SelectValue placeholder="選擇參與長輩類型" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">所有長輩</SelectItem>
                    <SelectItem value="mild">輕度失能長輩</SelectItem>
                    <SelectItem value="moderate">中度失能長輩</SelectItem>
                    <SelectItem value="severe">重度失能長輩</SelectItem>
                    <SelectItem value="dementia">失智症長輩</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="duration">活動時長</Label>
                <Select>
                  <SelectTrigger id="duration">
                    <SelectValue placeholder="選擇活動時長" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30">30 分鐘</SelectItem>
                    <SelectItem value="45">45 分鐘</SelectItem>
                    <SelectItem value="60">60 分鐘</SelectItem>
                    <SelectItem value="90">90 分鐘</SelectItem>
                    <SelectItem value="120">120 分鐘</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="preferences">特殊需求或偏好</Label>
                <Textarea id="preferences" placeholder="請描述任何特殊需求、偏好或限制條件" rows={3} />
              </div>

              <Button className="w-full" onClick={handleGenerate} disabled={isGenerating}>
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    生成中...
                  </>
                ) : (
                  <>
                    <Wand2 className="mr-2 h-4 w-4" />
                    生成活動設計
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {generatedActivity && (
            <Card>
              <CardHeader>
                <CardTitle>{generatedActivity.name}</CardTitle>
                <CardDescription>AI 生成的活動設計</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">活動描述</h3>
                  <p className="text-sm">{generatedActivity.description}</p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">活動目標</h3>
                  <ul className="list-disc pl-5 text-sm space-y-1">
                    {generatedActivity.objectives.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">所需材料</h3>
                  <ul className="list-disc pl-5 text-sm space-y-1">
                    {generatedActivity.materials.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">活動流程</h3>
                  <ol className="list-decimal pl-5 text-sm space-y-1">
                    {generatedActivity.procedure.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ol>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">特殊需求調整</h3>
                  <ul className="list-disc pl-5 text-sm space-y-1">
                    {generatedActivity.adaptations.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline">重新生成</Button>
                <Button>使用此設計</Button>
              </CardFooter>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="manual-design" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>手動設計活動</CardTitle>
              <CardDescription>自行設計活動內容與流程</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="activity-name">活動名稱</Label>
                <Input id="activity-name" placeholder="請輸入活動名稱" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="activity-type">活動類型</Label>
                  <Select>
                    <SelectTrigger id="activity-type">
                      <SelectValue placeholder="選擇活動類型" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="physical">體能活動</SelectItem>
                      <SelectItem value="cognitive">認知活動</SelectItem>
                      <SelectItem value="social">社交活動</SelectItem>
                      <SelectItem value="creative">創意活動</SelectItem>
                      <SelectItem value="other">其他</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="activity-duration">活動時長</Label>
                  <Select>
                    <SelectTrigger id="activity-duration">
                      <SelectValue placeholder="選擇活動時長" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="30">30 分鐘</SelectItem>
                      <SelectItem value="45">45 分鐘</SelectItem>
                      <SelectItem value="60">60 分鐘</SelectItem>
                      <SelectItem value="90">90 分鐘</SelectItem>
                      <SelectItem value="120">120 分鐘</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="activity-description">活動描述</Label>
                <Textarea id="activity-description" placeholder="請描述活動內容與目的" rows={3} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="activity-objectives">活動目標</Label>
                <Textarea id="activity-objectives" placeholder="請列出活動的主要目標，每行一個" rows={3} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="activity-materials">所需材料</Label>
                <Textarea id="activity-materials" placeholder="請列出所需材料，每行一個" rows={3} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="activity-procedure">活動流程</Label>
                <Textarea id="activity-procedure" placeholder="請詳細描述活動流程，可分步驟說明" rows={5} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="activity-adaptations">特殊需求調整</Label>
                <Textarea id="activity-adaptations" placeholder="請說明針對不同需求的長輩，如何調整活動" rows={3} />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">儲存草稿</Button>
              <Button>儲存活動</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>活動範本</CardTitle>
              <CardDescription>選擇預設範本快速建立活動</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input type="search" placeholder="搜尋活動範本..." className="pl-8" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { name: "懷舊音樂欣賞", type: "認知活動", duration: "60 分鐘" },
                  { name: "團體體操", type: "體能活動", duration: "45 分鐘" },
                  { name: "園藝治療", type: "創意活動", duration: "90 分鐘" },
                  { name: "桌遊互動", type: "社交活動", duration: "60 分鐘" },
                  { name: "生命回顧", type: "情緒支持", duration: "90 分鐘" },
                  { name: "手工藝製作", type: "創意活動", duration: "120 分鐘" },
                ].map((template, i) => (
                  <div key={i} className="border rounded-md p-4">
                    <h3 className="font-medium">{template.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      類型：{template.type} | 時長：{template.duration}
                    </p>
                    <Button variant="outline" size="sm" className="mt-2">
                      使用範本
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
