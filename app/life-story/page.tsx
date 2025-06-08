"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Loader2, Image as ImageIcon } from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import Image from "next/image"

interface Story {
  ID: string
  人物名稱: string
  圖片URL: string
  圖片描述: string
}

// 轉換 Google Drive 連結為直接圖片連結
function convertDriveUrlToDirectImageUrl(driveUrl: string): string {
  try {
    // 從分享連結中提取檔案 ID
    const fileId = driveUrl.match(/\/d\/(.*?)\/view/)?.[1]
    if (!fileId) return driveUrl
    
    // 使用不同的 URL 格式
    return `https://drive.google.com/thumbnail?id=${fileId}&sz=w1000`
  } catch (error) {
    console.error('轉換圖片 URL 時發生錯誤:', error)
    return driveUrl
  }
}

export default function LifeStoryPage() {
  const router = useRouter()
  const [stories, setStories] = useState<Story[]>([])
  const [loading, setLoading] = useState(true)
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({})

  useEffect(() => {
    fetchStories()
  }, [])

  const fetchStories = async () => {
    try {
      const response = await fetch('/api/stories')
      if (!response.ok) {
        throw new Error('獲取故事書列表失敗')
      }
      const data = await response.json()
      // 轉換每個故事的圖片 URL
      const storiesWithDirectUrls = data.map((story: Story) => ({
        ...story,
        圖片URL: convertDriveUrlToDirectImageUrl(story.圖片URL)
      }))
      setStories(storiesWithDirectUrls)
    } catch (error) {
      console.error('獲取故事書列表時發生錯誤:', error)
      toast.error('獲取故事書列表失敗，請稍後再試')
    } finally {
      setLoading(false)
    }
  }

  const handleImageError = (storyId: string) => {
    setImageErrors(prev => ({ ...prev, [storyId]: true }))
  }

  return (
    <div className="p-6 space-y-6 ml-48 min-h-screen bg-cover bg-center bg-no-repeat" style={{ backgroundImage: 'url(/images/background.jpg)' }}>
      <Card className="bg-white/180 backdrop-blur-[2px]">
        <CardHeader>
          <CardTitle>生命故事書</CardTitle>
          <CardDescription>記錄長輩的生命故事</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold">故事書列表</h1>
            <Button onClick={() => router.push("/life-story/new")}>
              <Plus className="mr-2 h-4 w-4" />
              新增故事書
            </Button>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : stories.length === 0 ? (
            <Card className="bg-white/180 backdrop-blur-[2px]">
              <CardContent className="flex flex-col items-center justify-center h-64">
                <p className="text-muted-foreground">還沒有故事書，點擊上方按鈕新增</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {stories.map((story) => (
                <Card key={story.ID} className="hover:shadow-lg transition-shadow bg-white/180 backdrop-blur-[2px] border-4 border-stone-700">
                  <CardHeader>
                    <CardTitle>{story.人物名稱}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="aspect-video relative mb-4 bg-muted rounded-lg overflow-hidden">
                      {!imageErrors[story.ID] ? (
                        <img
                          src={story.圖片URL}
                          alt={story.圖片描述}
                          className="object-cover w-full h-full"
                          onError={() => handleImageError(story.ID)}
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <ImageIcon className="h-12 w-12 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                    <p className="text-base text-muted-foreground line-clamp-3">{story.圖片描述}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
