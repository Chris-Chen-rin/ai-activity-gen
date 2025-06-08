"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Check, ChevronsUpDown, Loader2, Wand2, X, FileText } from "lucide-react"
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
  const [selectedDependencyLevel, setSelectedDependencyLevel] = useState<"moderate" | "severe" | "verySevere" | "cognitive" | null>(null)

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

      // 輸出原始資料
      // console.log('Google Sheets 原始資料:', response.elders);

      // 第一列是欄位名稱
      const columnHeaders = Object.keys(response.elders[0])
      // console.log('欄位名稱:', columnHeaders);

      const nameIndex = columnHeaders.findIndex(header => header.toLowerCase().includes('姓名'))
      const ageIndex = columnHeaders.findIndex(header => header.toLowerCase().includes('年齡'))
      const genderIndex = columnHeaders.findIndex(header => header.toLowerCase().includes('性別'))
      const adlIndex = columnHeaders.findIndex(header => 
        header.toLowerCase().includes('adl') || 
        header.toLowerCase().includes('依賴') || 
        header.toLowerCase().includes('分數')
      )
      const cdrIndex = columnHeaders.findIndex(header => header.toLowerCase().includes('cdr'))
      const healthIndex = columnHeaders.findIndex(header => 
        header.toLowerCase().includes('健康訓練') || 
        header.toLowerCase().includes('訓練類型')
      )
      
      {/* 
      console.log('欄位索引:', {
        nameIndex,
        ageIndex,
        genderIndex,
        adlIndex,
        cdrIndex,
        healthIndex
      }); */}

      if (nameIndex === -1) {
        throw new Error('找不到姓名欄位')
      }

      const formattedElders = response.elders.map((row, index) => {
        return {
          id: `elder-${index}`,
          name: row['姓名'] || `長輩 ${index + 1}`,
          age: row['年齡'] ? Number(row['年齡'].split('-')[0]) : undefined,
          gender: row['性別'],
          adlScore: (() => {
            const score = row['ADL評分(失能)'];
            if (typeof score === 'string') {
              // 處理 "65分以上" 的情況
              if (score.includes('以上')) {
                const match = score.match(/(\d+)/);
                return match ? Number(match[1]) : undefined;
              }
              // 處理 "35-60分" 的情況
              if (score.includes('-')) {
                const match = score.match(/(\d+)/);
                return match ? Number(match[1]) : undefined;
              }
              // 處理 "30分以下" 的情況
              if (score.includes('以下')) {
                const match = score.match(/(\d+)/);
                return match ? Number(match[1]) : undefined;
              }
              // 處理純數字的情況
              const match = score.match(/(\d+)/);
              return match ? Number(match[1]) : undefined;
            }
            return Number(score);
          })(),
          cdrScore: row['CDR評分(失智)'] ? Number(row['CDR評分(失智)'].match(/(\d+\.?\d*)/)?.[1]) : undefined,
          healthTraining: row['健康訓練']
        }
      })

      // console.log('處理後的長輩資料:', formattedElders);
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

      // 如果有前一個活動設計，在偏好中加入要求
      let preferences = formData.preferences
      if (generatedActivity) {
        preferences = preferences 
          ? `${preferences}\n\n需要和前一個設計不同，避免重複的活動內容和流程。`
          : "需要和前一個設計不同，避免重複的活動內容和流程。"
      }

      const result = await generateActivity({
        ...formData,
        participants: selectedEldersInfo.join('\n'),
        preferences: preferences
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
      </div>

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
                <SelectItem value="training">身體訓練</SelectItem>
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
                  disabled={!formData.goal}
                >
                  {formData.participants.length > 0
                    ? `${formData.participants.length} 位長輩已選擇`
                    : !formData.goal 
                      ? "請先選擇活動目標"
                      : "選擇參與長輩"}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              {!formData.goal && (
                <div className="text-sm text-red-500 mt-1">
                  請先選擇活動目標，才能選擇參與長輩
                </div>
              )}
              <PopoverContent className="w-full p-0" side="top" align="center" sideOffset={-300}>
                <Command>
                {formData.goal === "training" ? (
                    // 身體訓練時的注意事項
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-md m-2">
                      <h4 className="font-medium text-blue-800 mb-1">注意：身體訓練活動</h4>
                      <ul className="text-sm text-blue-700 space-y-1">
                        {/* <li>• 確保活動強度適合參與者的健康狀況</li> */}
                        {/* <li>• 提供適當的熱身和緩和運動</li> */}
                        {/* <li>• 注意安全措施和防護</li> */}
                        {/* <li>• 可能需要專業人員指導</li> */}
                      </ul>
                    </div>
                  ) : (
                    // 其他活動目標時的注意事項
                    <>
                      {selectedDependencyLevel === 'severe' && (
                        <div className="p-3 bg-orange-50 border border-orange-200 rounded-md m-2">
                          <h4 className="font-medium text-orange-800 mb-1">注意：重度依賴長輩</h4>
                          <ul className="text-sm text-orange-700 space-y-1">
                            <li>• 確保活動強度適中</li>
                            <li>• 提供適當的輔助</li>
                            <li>• 注意安全措施</li>
                          </ul>
                        </div>
                      )}
                      {selectedDependencyLevel === 'verySevere' && (
                        <div className="p-3 bg-red-50 border border-red-200 rounded-md m-2">
                          <h4 className="font-medium text-red-800 mb-1">警告：極重度依賴長輩</h4>
                          <ul className="text-sm text-red-700 space-y-1">
                            <li>• 需要一對一照護</li>
                            <li>• 活動強度必須非常輕微</li>
                            <li>• 確保環境安全</li>
                            <li>• 可能需要專業人員協助</li>
                          </ul>
                        </div>
                      )}
                    </>
                  )}
                  <div className="flex gap-2 p-2 border-b">
                    {formData.goal === "training" ? (
                      // 身體訓練時顯示健康訓練分類
                      <>
                        <Button
                          variant={selectedDependencyLevel === 'moderate' ? "default" : "outline"}
                          size="sm"
                          className={cn(
                            "flex-1",
                            selectedDependencyLevel === 'moderate' && "bg-purple-500 hover:bg-purple-600"
                          )}
                          onClick={() => {
                            if (selectedDependencyLevel === 'moderate') {
                              handleInputChange("participants", [])
                              setSelectedDependencyLevel(null)
                            } else {
                              const upperElders = elders
                                .filter(elder => elder.healthTraining === '上肢復健')
                                .map(elder => elder.name)
                              handleInputChange("participants", upperElders)
                              setSelectedDependencyLevel('moderate')
                            }
                          }}
                        >
                          {selectedDependencyLevel === 'moderate' ? '取消選擇上肢復健' : '選擇所有上肢復健'}
                        </Button>
                        <Button
                          variant={selectedDependencyLevel === 'severe' ? "default" : "outline"}
                          size="sm"
                          className={cn(
                            "flex-1",
                            selectedDependencyLevel === 'severe' && "bg-blue-500 hover:bg-blue-600"
                          )}
                          onClick={() => {
                            if (selectedDependencyLevel === 'severe') {
                              handleInputChange("participants", [])
                              setSelectedDependencyLevel(null)
                            } else {
                              const lowerElders = elders
                                .filter(elder => elder.healthTraining === '下肢復健')
                                .map(elder => elder.name)
                              handleInputChange("participants", lowerElders)
                              setSelectedDependencyLevel('severe')
                            }
                          }}
                        >
                          {selectedDependencyLevel === 'severe' ? '取消選擇下肢復健' : '選擇所有下肢復健'}
                        </Button>
                        <Button
                          variant={selectedDependencyLevel === 'verySevere' ? "default" : "outline"}
                          size="sm"
                          className={cn(
                            "flex-1",
                            selectedDependencyLevel === 'verySevere' && "bg-amber-500 hover:bg-amber-600"
                          )}
                          onClick={() => {
                            if (selectedDependencyLevel === 'verySevere') {
                              handleInputChange("participants", [])
                              setSelectedDependencyLevel(null)
                            } else {
                              const swallowingElders = elders
                                .filter(elder => elder.healthTraining === '吞嚥訓練')
                                .map(elder => elder.name)
                              handleInputChange("participants", swallowingElders)
                              setSelectedDependencyLevel('verySevere')
                            }
                          }}
                        >
                          {selectedDependencyLevel === 'verySevere' ? '取消選擇吞嚥訓練' : '選擇所有吞嚥訓練'}
                        </Button>
                        <Button
                          variant={selectedDependencyLevel === 'cognitive' ? "default" : "outline"}
                          size="sm"
                          className={cn(
                            "flex-1",
                            selectedDependencyLevel === 'cognitive' && "bg-lime-500 hover:bg-lime-600"
                          )}
                          onClick={() => {
                            if (selectedDependencyLevel === 'cognitive') {
                              handleInputChange("participants", [])
                              setSelectedDependencyLevel(null)
                            } else {
                              const cognitiveElders = elders
                                .filter(elder => elder.healthTraining === '認知訓練')
                                .map(elder => elder.name)
                              handleInputChange("participants", cognitiveElders)
                              setSelectedDependencyLevel('cognitive')
                            }
                          }}
                        >
                          {selectedDependencyLevel === 'cognitive' ? '取消選擇認知訓練' : '選擇所有認知訓練'}
                        </Button>
                      </>
                    ) : (
                      // 其他活動目標時顯示依賴程度分類
                      <>
                        <Button
                          variant={selectedDependencyLevel === 'moderate' ? "default" : "outline"}
                          size="sm"
                          className={cn(
                            "flex-1",
                            selectedDependencyLevel === 'moderate' && "bg-green-500 hover:bg-green-600"
                          )}
                          onClick={() => {
                            if (selectedDependencyLevel === 'moderate') {
                              handleInputChange("participants", [])
                              setSelectedDependencyLevel(null)
                            } else {
                              const moderateElders = elders
                                .filter(elder => elder.adlScore !== undefined && elder.adlScore >= 65)
                                .map(elder => elder.name)
                              handleInputChange("participants", moderateElders)
                              setSelectedDependencyLevel('moderate')
                            }
                          }}
                        >
                          {selectedDependencyLevel === 'moderate' ? '取消選擇中度依賴' : '選擇所有中度依賴'}
                        </Button>
                        <Button
                          variant={selectedDependencyLevel === 'severe' ? "default" : "outline"}
                          size="sm"
                          className={cn(
                            "flex-1",
                            selectedDependencyLevel === 'severe' && "bg-orange-500 hover:bg-orange-600"
                          )}
                          onClick={() => {
                            if (selectedDependencyLevel === 'severe') {
                              handleInputChange("participants", [])
                              setSelectedDependencyLevel(null)
                            } else {
                              const severeElders = elders
                                .filter(elder => elder.adlScore !== undefined && elder.adlScore > 30 && elder.adlScore <= 60)
                                .map(elder => elder.name)
                              handleInputChange("participants", severeElders)
                              setSelectedDependencyLevel('severe')
                            }
                          }}
                        >
                          {selectedDependencyLevel === 'severe' ? '取消選擇重度依賴' : '選擇所有重度依賴'}
                        </Button>
                        <Button
                          variant={selectedDependencyLevel === 'verySevere' ? "default" : "outline"}
                          size="sm"
                          className={cn(
                            "flex-1",
                            selectedDependencyLevel === 'verySevere' && "bg-red-500 hover:bg-red-600"
                          )}
                          onClick={() => {
                            if (selectedDependencyLevel === 'verySevere') {
                              handleInputChange("participants", [])
                              setSelectedDependencyLevel(null)
                            } else {
                              const verySevereElders = elders
                                .filter(elder => elder.adlScore !== undefined && elder.adlScore <= 30)
                                .map(elder => elder.name)
                              handleInputChange("participants", verySevereElders)
                              setSelectedDependencyLevel('verySevere')
                            }
                          }}
                        >
                          {selectedDependencyLevel === 'verySevere' ? '取消選擇極重度依賴' : '選擇所有極重度依賴'}
                        </Button>
                      </>
                    )}
                  </div>
                  
                  <CommandInput placeholder="搜尋長輩名字..." />
                  <CommandEmpty>找不到符合的長輩</CommandEmpty>
                  <CommandGroup className="max-h-[370px] overflow-auto">
                    {elders.map((elder) => (
                      <CommandItem
                        key={elder.id}
                        onSelect={() => {
                          const newParticipants = formData.participants.includes(elder.name)
                            ? formData.participants.filter(name => name !== elder.name)
                            : [...formData.participants, elder.name]
                          handleInputChange("participants", newParticipants)
                        }}
                        className={cn(
                          "flex items-center",
                          formData.goal === "training" ? (
                            elder.healthTraining && {
                              "bg-purple-100/50 hover:bg-purple-100": elder.healthTraining === '上肢復健',
                              "bg-blue-100/50 hover:bg-blue-100": elder.healthTraining === '下肢復健',
                              "bg-amber-100/50 hover:bg-amber-100": elder.healthTraining === '吞嚥訓練',
                              "bg-lime-100/50 hover:bg-lime-100": elder.healthTraining === '認知訓練',
                              "bg-slate-300/50 hover:bg-slate-300": elder.healthTraining === '無',
                            }
                          ) : (
                            elder.adlScore !== undefined && {
                              "bg-red-100/50 hover:bg-red-100": elder.adlScore <= 30,
                              "bg-orange-100/50 hover:bg-orange-100": elder.adlScore > 30 && elder.adlScore <= 60,
                              "bg-green-100/50 hover:bg-green-100": elder.adlScore >= 65,
                            }
                          )
                        )}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            formData.participants.includes(elder.name) ? "opacity-100" : "opacity-0"
                          )}
                        />
                        <div className="flex flex-col">
                          <span>{elder.name}</span>
                          {formData.goal === "training" ? (
                            elder.healthTraining && (
                              <span className="text-xs text-muted-foreground">
                                健康訓練：{elder.healthTraining}
                              </span>
                            )
                          ) : (
                            elder.adlScore !== undefined && (
                              <span className="text-xs text-muted-foreground">
                                ADL: {elder.adlScore <= 30 ? "極重度依賴" : elder.adlScore <= 60 ? "重度依賴" : "中度依賴"}
                              </span>
                            )
                          )}
                        </div>
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
              <h3 className="text-sm font-medium text-muted-foreground mb-2">活動類別</h3>
              <p className="text-sm">{generatedActivity.category}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">活動類型</h3>
              <p className="text-sm">{generatedActivity.type}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">活動主題</h3>
              <p className="text-sm">{generatedActivity.theme}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">活動時間範圍</h3>
              <p className="text-sm">{generatedActivity.timeRange}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">活動地點</h3>
              <p className="text-sm">{generatedActivity.location}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">參與者程度</h3>
              <p className="text-sm">{generatedActivity.participantLevel}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">參與人數</h3>
              <p className="text-sm">{generatedActivity.participantCount} 人</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">活動目的</h3>
              <ul className="list-disc pl-5 text-sm space-y-1">
                {generatedActivity.objectives.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">活動器材</h3>
              <ul className="list-disc pl-5 text-sm space-y-1">
                {generatedActivity.materials.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">活動內容</h3>
              <ol className="list-decimal pl-5 text-sm space-y-1">
                {generatedActivity.content.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ol>
            </div>

            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">注意事項</h3>
              <ul className="list-disc pl-5 text-sm space-y-1">
                {generatedActivity.precautions.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">參與成員</h3>
              <ul className="list-disc pl-5 text-sm space-y-1">
                {generatedActivity.participants.map((participant, i) => (
                  <li key={i}>{participant}</li>
                ))}
              </ul>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                onClick={() => {
                  setGeneratedActivity(null)
                  setFormData({
                    goal: "",
                    participants: [],
                    duration: "",
                    preferences: ""
                  })
                  const formTop = document.querySelector('.space-y-6')
                  if (formTop) {
                    formTop.scrollIntoView({ behavior: 'smooth' })
                  }
                }}
              >
                清空
              </Button>
              <Button 
                variant="outline"
                onClick={() => {
                  handleGenerate()
                }}
                disabled={isGenerating}
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    生成中...
                  </>
                ) : (
                  "重新設計"
                )}
              </Button>
            </div>
            {generatedActivity && (
              <Button
                variant="default"
                className="flex items-center gap-2"
                onClick={() => {
                  // 將活動資料傳遞到紀錄頁面
                  const activityData = {
                    ...generatedActivity,
                    date: new Date().toISOString(),
                    status: 'pending' // 待評分狀態
                  }
                  // 儲存到 localStorage
                  localStorage.setItem('currentActivity', JSON.stringify(activityData))
                  // 導航到紀錄頁面
                  window.location.href = '/record/new'
                }}
              >
                <FileText className="h-4 w-4" />
                紀錄
              </Button>
            )}
          </CardFooter>
        </Card>
      )}
    </div>
  )
}
