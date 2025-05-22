"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DatePicker } from "@/components/ui/date-picker"
import { ChevronLeft } from "lucide-react"

export default function NewRecordPage() {
  const [date, setDate] = useState<Date>()

  return (
    <div className="p-6 space-y-6 ml-48">
      <div className="flex items-center space-x-2">
        <Button variant="outline" size="icon" asChild>
          <Link href="/record">
            <ChevronLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">紀錄新活動</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>活動資訊</CardTitle>
          <CardDescription>請填寫活動的基本資訊</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="activity-name">活動名稱</Label>
              <Input id="activity-name" placeholder="請輸入活動名稱" />
            </div>
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
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>活動日期</Label>
              <DatePicker date={date} setDate={setDate} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="start-time">開始時間</Label>
              <Input id="start-time" type="time" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="end-time">結束時間</Label>
              <Input id="end-time" type="time" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">活動地點</Label>
            <Input id="location" placeholder="請輸入活動地點" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="participants">參與長輩</Label>
            <Select>
              <SelectTrigger id="participants">
                <SelectValue placeholder="選擇參與長輩" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部長輩</SelectItem>
                <SelectItem value="group-a">A組長輩</SelectItem>
                <SelectItem value="group-b">B組長輩</SelectItem>
                <SelectItem value="custom">自訂長輩名單</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">活動描述</Label>
            <Textarea id="description" placeholder="請描述活動內容、目的及進行方式" rows={4} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="observation">觀察與記錄</Label>
            <Textarea id="observation" placeholder="請記錄長輩參與情況、反應及特殊表現" rows={4} />
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" asChild>
            <Link href="/record">取消</Link>
          </Button>
          <div className="space-x-2">
            <Button variant="outline">儲存草稿</Button>
            <Button>提交紀錄</Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
