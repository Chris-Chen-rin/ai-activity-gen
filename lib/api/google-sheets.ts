import { ElderProfile, ElderDatabaseResponse } from '../types/elder'

export async function fetchElderData(): Promise<{ elders: string[][], total: number }> {
  try {
    const response = await fetch('/api/elders')

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    
    if (!data || !Array.isArray(data)) {
      console.warn('收到的資料格式不正確:', data)
      return { elders: [], total: 0 }
    }

    return {
      elders: data,
      total: data.length - 1 // 減去標題列
    }
  } catch (error) {
    console.error('獲取長者資料時發生錯誤:', error)
    return { elders: [], total: 0 }
  }
} 