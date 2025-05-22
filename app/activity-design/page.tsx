"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Check, ChevronsUpDown, Loader2, Search, Wand2, X } from "lucide-react"
import { toast } from "sonner"
import { ActivityFormData, ActivityResponse } from "@/lib/types/activity"
import { generateActivity } from "@/lib/api/activity"
import { fetchElderData } from "@/lib/api/google-sheets"
import { cn } from "@/lib/utils"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"

export default function ActivityDesignPage() {
  const [isGenerating, setIsGenerating] = useState(false)
  const [formData, setFormData] = useState<ActivityFormData>({
    goal: "",
    participants: [],
    duration: "",
    preferences: ""
  })
  const [generatedActivity, setGeneratedActivity] = useState<ActivityResponse | null>(null)
  const [elders, setElders] = useState<{
    id: string;
    name: string;
    age?: number;
    gender?: string;
    adlScore?: number;
    cdrScore?: number;
    healthTraining?: string;
  }[]>([])
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    loadElderData()
  }, [])

  const loadElderData = async () => {
    try {
      setLoading(true)
      const response = await fetchElderData()
      
      if (!Array.isArray(response.elders) || response.elders.length < 2) {
        throw new Error('資料格式不正確')
      }

      // 第一列是欄位名稱
      const columnHeaders = Object.keys(response.elders[0])
      const nameIndex = columnHeaders.findIndex(header => header.toLowerCase().includes('姓名'))
      const ageIndex = columnHeaders.findIndex(header => header.toLowerCase().includes('年齡'))
      const genderIndex = columnHeaders.findIndex(header => header.toLowerCase().includes('性別'))
      const adlIndex = columnHeaders.findIndex(header => header.toLowerCase().includes('adl'))
      const cdrIndex = columnHeaders.findIndex(header => header.toLowerCase().includes('cdr'))
      const healthIndex = columnHeaders.findIndex(header => header.toLowerCase().includes('健康訓練'))
      
      if (nameIndex === -1) {
        throw new Error('找不到姓名欄位')
      }

      const formattedElders = response.elders.slice(1).map((row, index) => ({
        id: `elder-${index}`,
        name: row[nameIndex] || `長輩 ${Object.values(response.elders[index])[nameIndex]}`,
        age: ageIndex !== -1 ? Number(row[ageIndex]) : undefined,
        gender: genderIndex !== -1 ? row[genderIndex] : undefined,
        adlScore: adlIndex !== -1 ? Number(row[adlIndex]) : undefined,
        cdrScore: cdrIndex !== -1 ? Number(row[cdrIndex]) : undefined,
        healthTraining: healthIndex !== -1 ? row[healthIndex] : undefined
      }))

      setElders(formattedElders)
    } catch (err) {
      console.error("載入資料時發生錯誤:", err)
      toast.error("無法載入長者資料，請稍後再試")
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: keyof ActivityFormData, value: string | string[]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleGenerate = async () => {
    try {
      setIsGenerating(true)
      
      // 獲取已選擇長輩的詳細資訊
      const selectedEldersInfo = formData.participants.map(name => {
        const elder = elders.find(e => e.name === name)
        if (!elder) return name

        const info = [`姓名：${elder.name}`]
        if (elder.age) info.push(`年齡：${elder.age}歲`)
        if (elder.gender) info.push(`性別：${elder.gender}`)
        if (elder.adlScore) info.push(`ADL評分：${elder.adlScore}`)
        if (elder.cdrScore) info.push(`CDR評分：${elder.cdrScore}`)
        if (elder.healthTraining) info.push(`健康訓練：${elder.healthTraining}`)
        
        return info.join('，')
      })

      const result = await generateActivity({
        ...formData,
        participants: selectedEldersInfo.join('\n')
      })
      
      setGeneratedActivity(result)
      toast.success("活動設計生成成功！")
      
      // 等待 DOM 更新後滾動到活動設計部分
      setTimeout(() => {
        const activityCard = document.getElementById('generated-activity')
        if (activityCard) {
          activityCard.scrollIntoView({ behavior: 'smooth' })
        }
      }, 100)
    } catch (error) {
      console.error("生成活動時發生錯誤:", error)
      toast.error(error instanceof Error ? error.message : "活動生成失敗，請稍後再試")
    } finally {
      setIsGenerating(false)
    }
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
                <Select
                  value={formData.goal}
                  onValueChange={(value) => handleInputChange("goal", value)}
                >
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
                <Label>參與對象</Label>
                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={open}
                      className="w-full justify-between"
                    >
                      {formData.participants.length > 0
                        ? `${formData.participants.length} 位長輩已選擇`
                        : "選擇參與長輩"}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0">
                    <Command>
                      <CommandInput placeholder="搜尋長輩名字..." />
                      <CommandEmpty>找不到符合的長輩</CommandEmpty>
                      <CommandGroup className="max-h-64 overflow-auto">
                        {elders.map((elder) => (
                          <CommandItem
                            key={elder.id}
                            onSelect={() => {
                              const newParticipants = formData.participants.includes(elder.name)
                                ? formData.participants.filter(name => name !== elder.name)
                                : [...formData.participants, elder.name]
                              handleInputChange("participants", newParticipants)
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                formData.participants.includes(elder.name) ? "opacity-100" : "opacity-0"
                              )}
                            />
                            {elder.name}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </Command>
                  </PopoverContent>
                </Popover>
                {formData.participants.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.participants.map((name) => (
                      <Badge
                        key={name}
                        variant="secondary"
                        className="flex items-center gap-1"
                      >
                        {name}
                        <button
                          className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              handleInputChange(
                                "participants",
                                formData.participants.filter((n) => n !== name)
                              )
                            }
                          }}
                          onMouseDown={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                          }}
                          onClick={() => {
                            handleInputChange(
                              "participants",
                              formData.participants.filter((n) => n !== name)
                            )
                          }}
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="duration">活動時長</Label>
                <Select
                  value={formData.duration}
                  onValueChange={(value) => handleInputChange("duration", value)}
                >
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
                <Textarea
                  id="preferences"
                  placeholder="請描述任何特殊需求、偏好或限制條件"
                  rows={3}
                  value={formData.preferences}
                  onChange={(e) => handleInputChange("preferences", e.target.value)}
                />
              </div>

              <Button
                className="w-full"
                onClick={handleGenerate}
                disabled={isGenerating || !formData.goal || formData.participants.length === 0 || !formData.duration}
              >
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
            <Card id="generated-activity">
              <CardHeader>
                <CardTitle>{generatedActivity.name}</CardTitle>
                <CardDescription>AI 生成的活動設計</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">參與對象</h3>
                  <ul className="list-disc pl-5 text-sm space-y-1">
                    {generatedActivity.participants.map((participant, i) => (
                      <li key={i}>{participant}</li>
                    ))}
                  </ul>
                </div>

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
                <Button variant="outline" onClick={() => setGeneratedActivity(null)}>重新生成</Button>
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
