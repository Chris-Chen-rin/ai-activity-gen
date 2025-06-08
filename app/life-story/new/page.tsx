"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Loader2, Wand2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

export default function NewStoryPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [formData, setFormData] = useState({
    長輩名稱: "",
    圖片URL: "",
    圖片描述: ""
  })

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
          ID: "", // ID 由 GAS 產生
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
    <div className="p-6 space-y-6 ml-48">
      <Card>
        <CardHeader>
          <CardTitle>新增故事書</CardTitle>
          <CardDescription>建立一本新的故事書</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="personName">長輩名稱</Label>
              <Input
                id="personName"
                placeholder="請輸入長輩名稱"
                value={formData.長輩名稱}
                onChange={(e) => setFormData({ ...formData, 長輩名稱: e.target.value })}
                required
              />
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