import { NextResponse } from 'next/server'

const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyuW6YG77Li4_5w9Hf9qvqXwIPHB4BjUSgDTp1SBH3qtoP9NsQPrb2i_8h-Dd7fxN2w/exec'

export async function GET() {
  try {
    // console.log('開始請求 Google Sheet 資料...')
    
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
    
    // console.log('Google Sheet 回應狀態:', response.status, response.statusText)
    
    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('需要 Google 帳號認證')
      }
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const text = await response.text()
    // console.log('Google Sheet 原始回應:', text)
    
    let data
    try {
      data = JSON.parse(text)
      // console.log('解析後的資料:', JSON.stringify(data, null, 2))
    } catch (e) {
      console.error('JSON 解析錯誤:', text)
      throw new Error('無效的 JSON 格式')
    }
    
    if (!Array.isArray(data)) {
      console.error('無效的資料格式:', data)
      throw new Error('資料格式錯誤：預期為陣列')
    }

    // 跳過表頭（第一筆資料）
    const activitiesData = data.slice(1)
    // console.log('移除表頭後的資料:', JSON.stringify(activitiesData, null, 2))

    // console.log("breakpoint 1")
    // 確保每個活動都有必要的欄位
    const formattedData = activitiesData.map((activity, index) => {
      // console.log(`處理活動 ${index}:`, activity)
      // console.log(`活動 ${index} 的型別:`, typeof activity)
      // console.log(`活動 ${index} 的鍵值:`, Object.keys(activity))
      // console.log(`活動 ${index} 的值:`, Object.values(activity))

      // 如果活動資料不是物件，返回空物件
      if (!activity || typeof activity !== 'object') {
        console.warn(`活動 ${index} 資料無效:`, activity)
        return {
          ID: `temp-${index}`,
          活動類別: '',
          活動類型: '',
          活動主題: '',
          活動名稱: '未命名活動',
          活動時間範圍: '',
          活動地點: '',
          帶領者: '',
          協助者: '',
          參與者程度: '',
          參與人數: '0',
          活動目的: '',
          活動器材: '',
          活動內容: '',
          注意事項: '',
          參與成員: ''
        }
      }

      // console.log(`處理完活動 ${index}:`, activity)

      // 檢查資料結構
      const activityData = {
        ID: activity.ID || activity[0] || `temp-${index}`,
        活動類別: activity.活動類別 || activity[1] || '',
        活動類型: activity.活動類型 || activity[2] || '',
        活動主題: activity.活動主題 || activity[3] || '',
        活動名稱: activity.活動名稱 || activity[4] || '未命名活動',
        活動時間範圍: activity.活動時間範圍 || activity[5] || '',
        活動地點: activity.活動地點 || activity[6] || '',
        帶領者: activity.帶領者 || activity[7] || '',
        協助者: activity.協助者 || activity[8] || '',
        參與者程度: activity.參與者程度 || activity[9] || '',
        參與人數: activity.參與人數 || activity[10] || '0',
        活動目的: activity.活動目的 || activity[11] || '',
        活動器材: activity.活動器材 || activity[12] || '',
        活動內容: activity.活動內容 || activity[13] || '',
        注意事項: activity.注意事項 || activity[14] || '',
        參與成員: activity.參與成員 || activity[15] || ''
      }

      // console.log(`格式化後的活動 ${index}:`, activityData)
      return activityData
    })

    // console.log('所有格式化後的資料:', JSON.stringify(formattedData, null, 2))

    return NextResponse.json(formattedData, {
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