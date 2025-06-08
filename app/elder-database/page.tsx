"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
// @ts-ignore
import { Plus, Search, Filter } from 'lucide-react'
import { toast } from "sonner"
import { fetchElderData } from "@/lib/api/google-sheets"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface ElderData {
  [key: string]: string
}

export default function ElderDatabasePage() {
  const [activeTab, setActiveTab] = useState("table")
  const [elders, setElders] = useState<string[][]>([])
  const [filteredElders, setFilteredElders] = useState<string[][]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [headers, setHeaders] = useState<string[]>([])

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
      if (!Array.isArray(columnHeaders)) {
        throw new Error('欄位名稱格式不正確')
      }
      setHeaders(columnHeaders)

      // console.log("response.elders structure:", JSON.stringify(response.elders, null, 2))
      const formattedElders = response.elders.map((row: any) => 
        columnHeaders.map(header => row[header] || '')
      )

      setElders(formattedElders)
      setFilteredElders(formattedElders)
      setError(null)
    } catch (err) {
      console.error("載入資料時發生錯誤:", err)
      setError("無法載入長者資料，請稍後再試")
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (value: string) => {
    setSearchTerm(value)
    const filtered = elders.filter(row => 
      row.some(cell => 
        cell.toLowerCase().includes(value.toLowerCase())
      )
    )
    setFilteredElders(filtered)
  }

  const handleFilter = () => {
    // 實作篩選功能
    console.log("篩選功能待實作")
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">載入中...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-500">{error}</p>
          <Button 
            onClick={loadElderData}
            className="mt-4"
          >
            重試
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6 ml-48 min-h-screen bg-cover bg-center bg-no-repeat" style={{ backgroundImage: 'url(/images/background.jpg)' }}>
      <Card className="bg-white/130 backdrop-blur-[2px]">
        <CardHeader>
          <CardTitle>長者資料庫</CardTitle>
          <CardDescription>管理長者基本資料</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="搜尋長者資料..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" onClick={handleFilter}>
              <Filter className="mr-2 h-4 w-4" />
              篩選
            </Button>
          </div>

          <div className="rounded-md border border-stone-600 overflow-x-auto" style={{ maxHeight: 'calc(100vh - 300px)' }}>
            <Table>
              <TableHeader className="bg-stone-500">
                <TableRow className="bg-stone-500">
                  {headers.map((header, index) => (
                    <TableHead 
                      key={index} 
                      className={`${
                        index < 8 ? 'w-[70px] max-w-[70px]' : 
                        index === 8 ? 'w-[140px] max-w-[140px]' : 
                        'w-[90px] max-w-[90px]'
                      } truncate sticky top-0 bg-stone-500 font-bold text-white`}
                    >
                      {header}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredElders.map((row, index) => (
                  <TableRow key={index} className="hover:bg-stone-300/50 border-b border-stone-600">
                    {row.map((cell, cellIndex) => (
                      <TableCell 
                        key={cellIndex} 
                        className={`${
                          cellIndex < 8 ? 'w-[70px] max-w-[70px]' : 
                          cellIndex === 8 ? 'w-[140px] max-w-[140px]' : 
                          'w-[90px] max-w-[90px]'
                        } truncate`}
                      >
                        {cell}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
