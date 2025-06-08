"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DatePicker } from "@/components/ui/date-picker"
import { ChevronLeft, Check, ChevronsUpDown, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { X } from "lucide-react"
import { fetchElderData } from "@/lib/api/google-sheets"
import { ActivityResponse } from "@/lib/types/activity"
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

interface Elder {
  id: string
  name: string
  age?: number
  gender?: string
  adlScore?: number
  cdrScore?: number
  healthTraining?: string
}

export default function NewRecordPage() {
  const router = useRouter()
  const [date, setDate] = useState<Date>()
  const [open, setOpen] = useState(false)
  const [elders, setElders] = useState<Elder[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    category: '',
    type: '',
    theme: '',
    name: '',
    timeRange: {
      start: '',
      end: ''
    },
    location: '',
    leader: '',
    assistant: '',
    participantLevel: '',
    participantCount: '',
    purpose: '',
    equipment: '',
    content: '',
    notes: '',
    participants: [] as string[]
  })

  useEffect(() => {
    loadElderData()
    loadActivityData()
  }, [])

  const loadActivityData = () => {
    try {
      const savedActivity = localStorage.getItem('currentActivity')
      if (savedActivity) {
        const activityData: ActivityResponse = JSON.parse(savedActivity)
        
        // 從參與者資訊中提取姓名
        const participantNames = activityData.participants.map(participant => {
          // 直接返回參與者名稱，因為在活動設計頁面已經處理過格式
          return participant
        })

        // 轉換活動類別和類型
        const categoryMap: Record<string, 'static' | 'dynamic'> = {
          '靜態': 'static',
          '動態': 'dynamic'
        }
        const typeMap: Record<string, 'individual' | 'group'> = {
          '個人活動': 'individual',
          '團體活動': 'group'
        }

        setFormData(prev => ({
          ...prev,
          category: categoryMap[activityData.category] || activityData.category,
          type: typeMap[activityData.type] || activityData.type,
          theme: activityData.theme,
          name: activityData.name,
          location: activityData.location,
          participantLevel: activityData.participantLevel,
          participantCount: activityData.participantCount.toString(),
          purpose: activityData.objectives.join('\n'),
          equipment: activityData.materials.join('\n'),
          content: activityData.content.join('\n'),
          notes: activityData.precautions.join('\n'),
          participants: participantNames
        }))

        // 清除 localStorage 中的資料
        localStorage.removeItem('currentActivity')
      }
    } catch (error) {
      console.error('載入活動資料失敗:', error)
    }
  }

  const loadElderData = async () => {
    try {
      setLoading(true)
      const response = await fetchElderData()
      
      if (!Array.isArray(response.elders) || response.elders.length < 2) {
        throw new Error('資料格式不正確')
      }

      const columnHeaders = Object.keys(response.elders[0])

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
              if (score.includes('以上')) {
                const match = score.match(/(\d+)/);
                return match ? Number(match[1]) : undefined;
              }
              if (score.includes('-')) {
                const match = score.match(/(\d+)/);
                return match ? Number(match[1]) : undefined;
              }
              if (score.includes('以下')) {
                const match = score.match(/(\d+)/);
                return match ? Number(match[1]) : undefined;
              }
              const match = score.match(/(\d+)/);
              return match ? Number(match[1]) : undefined;
            }
            return Number(score);
          })(),
          cdrScore: row['CDR評分(失智)'] ? Number(row['CDR評分(失智)'].match(/(\d+\.?\d*)/)?.[1]) : undefined,
          healthTraining: row['健康訓練']
        }
      })

      setElders(formattedElders)
    } catch (err) {
      console.error("載入資料時發生錯誤:", err)
    } finally {
      setLoading(false)
    }
  }

  // 格式化時間為 24 小時制
  const formatTimeTo24Hour = (time: string) => {
    if (!time) return '';
    const [hours, minutes] = time.split(':');
    return `${hours.padStart(2, '0')}:${minutes}`;
  }

  // 處理時間輸入
  const handleTimeChange = (field: 'start' | 'end', value: string) => {
    const formattedTime = formatTimeTo24Hour(value);
    setFormData(prev => ({
      ...prev,
      timeRange: {
        ...prev.timeRange,
        [field]: formattedTime
      }
    }));
  }

  const handleSave = async () => {
    try {
      setSaving(true)
      console.log('開始儲存活動紀錄...')

      // 驗證必填欄位
      if (!date || !formData.name || !formData.location || !formData.participants.length) {
        toast.error('請填寫所有必填欄位')
        return
      }

      const record = {
        date: date?.toISOString(),
        category: formData.category,
        type: formData.type,
        theme: formData.theme,
        name: formData.name,
        timeRange: {
          start: formData.timeRange?.start || '',
          end: formData.timeRange?.end || ''
        },
        location: formData.location,
        leader: formData.leader,
        assistant: formData.assistant,
        participantLevel: formData.participantLevel,
        participantCount: parseInt(formData.participantCount),
        purpose: formData.purpose,
        equipment: formData.equipment.split('\n').filter(item => item.trim()),
        content: formData.content,
        notes: formData.notes,
        participants: formData.participants.map(name => ({
          id: elders.find(e => e.name === name)?.id || '',
          name,
          level: elders.find(e => e.name === name)?.adlScore?.toString() || ''
        })),
        status: 'pending'
      }

      console.log('準備發送的資料:', record)

      // 發送資料到 API
      console.log('正在發送請求到 API...')
      const response = await fetch('/api/record/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(record),
      })

      console.log('收到 API 回應:', response.status, response.statusText)
      const responseData = await response.json()
      console.log('API 回應內容:', responseData)

      if (!response.ok) {
        throw new Error(responseData.error || '儲存失敗')
      }

      toast.success('活動紀錄已儲存')
      // console.log('儲存成功，準備跳轉...')
      router.push('/record/history')
    } catch (error) {
      console.error('儲存活動紀錄失敗:', error)
      toast.error(error instanceof Error ? error.message : '儲存失敗，請稍後再試')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="p-6 space-y-6 ml-48 min-h-screen bg-cover bg-center bg-no-repeat" style={{ backgroundImage: 'url(/images/background.jpg)' }}>
      <Card className="bg-white/180 backdrop-blur-[2px]">
        <CardHeader>
          <CardTitle>新增活動紀錄</CardTitle>
          <CardDescription>記錄活動的詳細資訊</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Link href="/record">
                <Button variant="ghost" size="icon">
                  <ChevronLeft className="h-4 w-4" />
                </Button>
              </Link>
              <h1 className="text-3xl font-bold">新增活動紀錄</h1>
            </div>
          </div>

          <Card className="bg-white/180 backdrop-blur-[2px]">
            <CardHeader>
              <CardTitle>活動紀錄</CardTitle>
              <CardDescription>填寫活動相關資訊</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* 基本資訊 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>活動類別</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="選擇活動類別" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="static">靜態活動</SelectItem>
                      <SelectItem value="dynamic">動態活動</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>活動類型</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="選擇活動類型" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="individual">個人活動</SelectItem>
                      <SelectItem value="group">團體活動</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* 主題和名稱 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>活動主題</Label>
                  <Input
                    value={formData.theme}
                    onChange={(e) => setFormData(prev => ({ ...prev, theme: e.target.value }))}
                    placeholder="請輸入活動主題"
                  />
                </div>
                <div className="space-y-2">
                  <Label>活動名稱</Label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="請輸入活動名稱"
                  />
                </div>
              </div>

              {/* 時間和地點 */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>活動日期</Label>
                  <DatePicker date={date} setDate={setDate} />
                </div>
                <div className="space-y-2">
                  <Label>開始時間</Label>
                  <Input
                    type="time"
                    value={formData.timeRange.start}
                    onChange={(e) => handleTimeChange('start', e.target.value)}
                    className="w-full"
                    step="60"
                  />
                </div>
                <div className="space-y-2">
                  <Label>結束時間</Label>
                  <Input
                    type="time"
                    value={formData.timeRange.end}
                    onChange={(e) => handleTimeChange('end', e.target.value)}
                    className="w-full"
                    step="60"
                  />
                </div>
              </div>

              {/* 地點和人員 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>活動地點</Label>
                  <Input
                    value={formData.location}
                    onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                    placeholder="請輸入活動地點"
                  />
                </div>
                <div className="space-y-2">
                  <Label>帶領者</Label>
                  <Input
                    value={formData.leader}
                    onChange={(e) => setFormData(prev => ({ ...prev, leader: e.target.value }))}
                    placeholder="請輸入帶領者姓名"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>協助者</Label>
                  <Input
                    value={formData.assistant}
                    onChange={(e) => setFormData(prev => ({ ...prev, assistant: e.target.value }))}
                    placeholder="請輸入協助者姓名"
                  />
                </div>
                <div className="space-y-2">
                  <Label>參與者程度</Label>
                  <Input
                    value={formData.participantLevel}
                    onChange={(e) => setFormData(prev => ({ ...prev, participantLevel: e.target.value }))}
                    placeholder="請輸入參與者程度"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>參與人數</Label>
                <Input
                  type="number"
                  value={formData.participantCount}
                  onChange={(e) => setFormData(prev => ({ ...prev, participantCount: e.target.value }))}
                  placeholder="請輸入參與人數"
                />
              </div>

              {/* 活動目的 */}
              <div className="space-y-2">
                <Label>活動目的</Label>
                <Textarea
                  value={formData.purpose}
                  onChange={(e) => setFormData(prev => ({ ...prev, purpose: e.target.value }))}
                  placeholder="請描述活動目的"
                  rows={3}
                />
              </div>

              {/* 活動器材 */}
              <div className="space-y-2">
                <Label>活動器材</Label>
                <Textarea
                  value={formData.equipment}
                  onChange={(e) => setFormData(prev => ({ ...prev, equipment: e.target.value }))}
                  placeholder="請輸入活動器材，用逗號分隔多個器材"
                  rows={2}
                />
              </div>

              {/* 活動內容 */}
              <div className="space-y-2">
                <Label>活動內容</Label>
                <Textarea
                  value={formData.content}
                  onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                  placeholder="請描述活動內容"
                  rows={4}
                />
              </div>

              {/* 注意事項 */}
              <div className="space-y-2">
                <Label>注意事項</Label>
                <Textarea
                  value={formData.notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="請輸入注意事項"
                  rows={3}
                />
              </div>

              {/* 參與人員 */}
              <div className="space-y-2">
                <Label>參與人員</Label>
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
                        : "選擇參與長輩..."}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0">
                    <Command>
                      <CommandInput placeholder="搜尋長輩名字..." />
                      <CommandEmpty>找不到符合的長輩</CommandEmpty>
                      <CommandGroup className="max-h-[300px] overflow-auto">
                        {elders.map((elder) => (
                          <CommandItem
                            key={elder.id}
                            onSelect={() => {
                              const newParticipants = formData.participants.includes(elder.name)
                                ? formData.participants.filter(name => name !== elder.name)
                                : [...formData.participants, elder.name]
                              setFormData(prev => ({
                                ...prev,
                                participants: newParticipants
                              }))
                            }}
                            className={cn(
                              "flex items-center",
                              elder.adlScore !== undefined && {
                                "bg-red-100/50 hover:bg-red-100": elder.adlScore <= 30,
                                "bg-orange-100/50 hover:bg-orange-100": elder.adlScore > 30 && elder.adlScore <= 60,
                                "bg-green-100/50 hover:bg-green-100": elder.adlScore >= 65,
                              }
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
                              {elder.adlScore !== undefined && (
                                <span className="text-xs text-muted-foreground">
                                  ADL: {elder.adlScore <= 30 ? "極重度依賴" : elder.adlScore <= 60 ? "重度依賴" : "中度依賴"}
                                </span>
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
                          onClick={() => {
                            setFormData(prev => ({
                              ...prev,
                              participants: prev.participants.filter(n => n !== name)
                            }))
                          }}
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full" 
                onClick={handleSave}
                disabled={saving}
              >
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    儲存中...
                  </>
                ) : (
                  '儲存紀錄'
                )}
              </Button>
            </CardFooter>
          </Card>
        </CardContent>
      </Card>
    </div>
  )
}

