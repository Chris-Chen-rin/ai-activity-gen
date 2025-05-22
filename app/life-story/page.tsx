import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Plus, Search } from "lucide-react"

export default function LifeStoryPage() {
  return (
    <div className="p-6 space-y-6 ml-48">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">生命故事書</h1>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          新增故事書
        </Button>
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input type="search" placeholder="搜尋長輩姓名..." className="pl-8" />
        </div>
        <Button variant="outline">篩選</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          { name: "王大明", age: 78, progress: 85 },
          { name: "李小芬", age: 82, progress: 100 },
          { name: "張美麗", age: 75, progress: 60 },
          { name: "陳志明", age: 80, progress: 90 },
          { name: "林淑芬", age: 76, progress: 40 },
          { name: "黃建國", age: 85, progress: 70 },
        ].map((elder, i) => (
          <Card key={i}>
            <CardHeader>
              <CardTitle>{elder.name}</CardTitle>
              <CardDescription>{elder.age} 歲</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>完成度</span>
                  <span>{elder.progress}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2.5">
                  <div className="bg-primary h-2.5 rounded-full" style={{ width: `${elder.progress}%` }}></div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" asChild>
                <Link href={`/life-story/${i}`}>查看故事書</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
