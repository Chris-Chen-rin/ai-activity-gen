"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Loader2, Wand2, X, ChevronsUpDown, Check } from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface Elder {
  id: string
  name: string
  age?: number
  gender?: string
  adlScore?: number
  cdrScore?: number
  healthTraining?: string
}

interface FormData {
  長輩名稱: string
  圖片URL: string
  圖片描述: string
}

export default function NewStoryPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [open, setOpen] = useState(false)
  const [elders, setElders] = useState<Elder[]>([])
  const [formData, setFormData] = useState<FormData>({
    長輩名稱: "",
    圖片URL: "",
    圖片描述: ""
  })

  useEffect(() => {
    fetchElders()
  }, [])

  const fetchElders = async () => {
    try {
      const response = await fetch('/api/elders')
      if (!response.ok) {
        throw new Error('獲取長輩列表失敗')
      }
      const data = await response.json()
      
      if (!Array.isArray(data) || data.length < 2) {
        throw new Error('資料格式不正確')
      }

      const columnHeaders = Object.keys(data[0])
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

      const formattedElders = data.map((row, index) => {
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
    } catch (error) {
      console.error('獲取長輩列表時發生錯誤:', error)
      toast.error('獲取長輩列表失敗，請稍後再試')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/stories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          人物名稱: formData.長輩名稱,
          圖片URL: formData.圖片URL,
          圖片描述: formData.圖片描述
        }),
      })

      if (!response.ok) {
        throw new Error('儲存故事書失敗')
      }

      toast.success("故事書建立成功！")
      router.push("/life-story")
    } catch (error) {
      console.error("建立故事書時發生錯誤:", error)
      toast.error("建立故事書失敗，請稍後再試")
    } finally {
      setLoading(false)
    }
  }

  const handleGenerateDescription = async () => {
    if (!formData.圖片URL) {
      toast.error("請先輸入圖片URL")
      return
    }

    setGenerating(true)
    try {
      const response = await fetch('/api/generate-description', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ imageUrl: formData.圖片URL }),
      })

      if (!response.ok) {
        throw new Error('生成描述失敗')
      }

      const data = await response.json()
      setFormData(prev => ({ ...prev, 圖片描述: data.description }))
      toast.success("描述生成成功！")
    } catch (error) {
      console.error("生成描述時發生錯誤:", error)
      toast.error("生成描述失敗，請稍後再試")
    } finally {
      setGenerating(false)
    }
  }

  return (
    <div className="p-4 pb-16 space-y-8 ml-48 min-h-screen bg-cover bg-center bg-no-repeat" style={{ backgroundImage: 'url(/images/background.jpg)' }}>
      <Card className="bg-white/180 backdrop-blur-[2px]">
        <CardHeader>
          <CardTitle>新增故事書</CardTitle>
          <CardDescription>建立一本新的故事書</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label>長輩名稱</Label>
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between"
                  >
                    {formData.長輩名稱 ? (
                      formData.長輩名稱
                    ) : (
                      "選擇參與長輩..."
                    )}
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
                            setFormData(prev => ({
                              ...prev,
                              長輩名稱: elder.name
                            }))
                            setOpen(false)
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
                              formData.長輩名稱 === elder.name ? "opacity-100" : "opacity-0"
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
              {formData.長輩名稱 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  <Badge
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    {formData.長輩名稱}
                    <button
                      className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                      onClick={() => {
                        setFormData(prev => ({
                          ...prev,
                          長輩名稱: ""
                        }))
                      }}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="imageUrl">圖片URL</Label>
              <Input
                id="imageUrl"
                placeholder="請先將圖片上傳到Google Drive，再將圖片的URL貼到這裡"
                value={formData.圖片URL}
                onChange={(e) => setFormData({ ...formData, 圖片URL: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="imageDescription">圖片描述</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleGenerateDescription}
                  disabled={generating || !formData.圖片URL}
                >
                  {generating ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Wand2 className="mr-2 h-4 w-4" />
                  )}
                  生成描述
                </Button>
              </div>
              <Textarea
                id="imageDescription"
                placeholder="請輸入圖片描述"
                value={formData.圖片描述}
                onChange={(e) => setFormData({ ...formData, 圖片描述: e.target.value })}
                required
              />
            </div>

            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/life-story")}
              >
                取消
              </Button>
              <Button type="submit" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                建立故事書
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
} 