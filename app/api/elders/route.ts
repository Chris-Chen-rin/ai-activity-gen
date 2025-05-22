import { NextResponse } from 'next/server'

const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxx_1ZIjUpeK0Zcw3WBm69N7nsxAuqvSShA7IwqGiOzf683T_9ihm-oBQntYIulrbL1/exec'

export async function GET() {
  try {
    const response = await fetch(SCRIPT_URL, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${process.env.GOOGLE_API_KEY}`,
      },
      cache: 'no-store',
      credentials: 'include'
    })
    
    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('需要 Google 帳號認證')
      }
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const text = await response.text()
    let data
    try {
      data = JSON.parse(text)
    } catch (e) {
      console.error('JSON 解析錯誤:', text)
      throw new Error('無效的 JSON 格式')
    }
    
    if (!Array.isArray(data)) {
      console.error('無效的資料格式:', data)
      throw new Error('資料格式錯誤：預期為陣列')
    }

    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    })
  } catch (error: unknown) {
    console.error('代理請求時發生錯誤:', error)
    const errorMessage = error instanceof Error ? error.message : '未知錯誤'
    
    // 根據錯誤類型返回不同的狀態碼
    const status = errorMessage.includes('需要 Google 帳號認證') ? 401 : 500
    
    return NextResponse.json(
      { 
        error: '無法獲取資料', 
        details: errorMessage,
        timestamp: new Date().toISOString()
      },
      { status }
    )
  }
} 