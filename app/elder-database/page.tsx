"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Plus, Search, Upload } from "lucide-react"

export default function ElderDatabasePage() {
  const [activeTab, setActiveTab] = useState("table")

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">長輩資料庫</h1>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Upload className="mr-2 h-4 w-4" />
            匯入 Excel
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            新增長輩
          </Button>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input type="search" placeholder="搜尋長輩資料..." className="pl-8" />
        </div>
        <Button variant="outline">篩選</Button>
      </div>

      <Tabs defaultValue="table" onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="table">表格檢視</TabsTrigger>
          <TabsTrigger value="excel">Excel 檢視</TabsTrigger>
        </TabsList>
        <TabsContent value="table" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>長輩資料列表</CardTitle>
              <CardDescription>所有長輩的基本資料</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="py-3 px-4 text-left font-medium">姓名</th>
                      <th className="py-3 px-4 text-left font-medium">年齡</th>
                      <th className="py-3 px-4 text-left font-medium">性別</th>
                      <th className="py-3 px-4 text-left font-medium">入住日期</th>
                      <th className="py-3 px-4 text-left font-medium">照護等級</th>
                      <th className="py-3 px-4 text-left font-medium">主要聯絡人</th>
                      <th className="py-3 px-4 text-left font-medium">操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      {
                        name: "王大明",
                        age: 78,
                        gender: "男",
                        date: "2022/03/15",
                        level: "中度",
                        contact: "王小明 (兒子)",
                      },
                      {
                        name: "李小芬",
                        age: 82,
                        gender: "女",
                        date: "2021/08/20",
                        level: "輕度",
                        contact: "李大華 (女兒)",
                      },
                      {
                        name: "張美麗",
                        age: 75,
                        gender: "女",
                        date: "2023/01/10",
                        level: "中度",
                        contact: "張小美 (女兒)",
                      },
                      {
                        name: "陳志明",
                        age: 80,
                        gender: "男",
                        date: "2022/05/05",
                        level: "重度",
                        contact: "陳小明 (兒子)",
                      },
                      {
                        name: "林淑芬",
                        age: 76,
                        gender: "女",
                        date: "2022/11/18",
                        level: "輕度",
                        contact: "林大方 (兒子)",
                      },
                      {
                        name: "黃建國",
                        age: 85,
                        gender: "男",
                        date: "2021/04/30",
                        level: "中度",
                        contact: "黃小華 (女兒)",
                      },
                      {
                        name: "吳麗珠",
                        age: 79,
                        gender: "女",
                        date: "2023/02/22",
                        level: "輕度",
                        contact: "吳大維 (兒子)",
                      },
                      {
                        name: "趙明德",
                        age: 83,
                        gender: "男",
                        date: "2022/07/12",
                        level: "重度",
                        contact: "趙小德 (兒子)",
                      },
                    ].map((elder, i) => (
                      <tr key={i} className="border-b">
                        <td className="py-3 px-4">{elder.name}</td>
                        <td className="py-3 px-4">{elder.age}</td>
                        <td className="py-3 px-4">{elder.gender}</td>
                        <td className="py-3 px-4">{elder.date}</td>
                        <td className="py-3 px-4">{elder.level}</td>
                        <td className="py-3 px-4">{elder.contact}</td>
                        <td className="py-3 px-4">
                          <Button variant="outline" size="sm">
                            查看
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="excel" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Excel 檢視</CardTitle>
              <CardDescription>以 Excel 格式檢視長輩資料</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-muted rounded-md p-8 text-center">
                <p className="text-muted-foreground">Excel 嵌入視圖將在此處顯示</p>
                <p className="text-sm text-muted-foreground mt-2">（實際整合時將嵌入 Excel Online 或類似服務）</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
