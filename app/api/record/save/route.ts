import { NextResponse } from 'next/server'

interface Participant {
  name: string;
  id: string;
  level: string;
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    console.log('API 收到請求:', body)
    
    // 轉換資料格式以匹配 Google Sheet 表頭
    const sheetData = {
      'ID': '', // 讓 Google Apps Script 自動生成 ID
      '活動類別': body.category,
      '活動類型': body.type,
      '活動主題': body.theme,
      '活動名稱': body.name,
      '活動時間範圍': `${body.date ? new Date(body.date).toLocaleDateString() : ''} ${body.timeRange.start} - ${body.timeRange.end}`,
      '活動地點': body.location,
      '帶領者': body.leader,
      '協助者': body.assistant,
      '參與者程度': body.participantLevel,
      '參與人數': body.participantCount,
      '活動目的': body.purpose,
      '活動器材': Array.isArray(body.equipment) ? body.equipment.join(', ') : body.equipment,
      '活動內容': body.content,
      '注意事項': body.notes,
      '參與成員': Array.isArray(body.participants) ? body.participants.map((p: Participant) => p.name).join(', ') : '',
    }

    console.log('轉換後的資料:', sheetData)
    
    // 發送請求到 Google Apps Script
    const response = await fetch(
      'https://script.google.com/macros/s/AKfycbyuW6YG77Li4_5w9Hf9qvqXwIPHB4BjUSgDTp1SBH3qtoP9NsQPrb2i_8h-Dd7fxN2w/exec',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(sheetData),
      }
    )

    console.log('Google Apps Script 回應狀態:', response.status, response.statusText)

    // 檢查 HTTP 狀態碼
    if (!response.ok) {
      const errorText = await response.text()
      console.error('Google Apps Script 回應錯誤:', {
        status: response.status,
        statusText: response.statusText,
        errorText
      })
      throw new Error(`Google Apps Script 回應錯誤: ${response.status} ${response.statusText}`)
    }

    // 嘗試解析回應
    let result
    try {
      const responseText = await response.text()
      console.log('原始回應內容:', responseText)
      
      if (!responseText) {
        throw new Error('回應內容為空')
      }

      try {
        result = JSON.parse(responseText)
      } catch (parseError) {
        console.error('JSON 解析錯誤:', parseError)
        throw new Error('回應格式不正確')
      }

      console.log('解析後的回應:', result)
    } catch (e) {
      console.error('無法解析 Google Apps Script 回應:', e)
      throw new Error('無法解析 Google Apps Script 回應: ' + (e instanceof Error ? e.message : String(e)))
    }

    // 檢查回應內容
    if (!result || result.status !== 'success') {
      console.error('Google Apps Script 回傳錯誤:', result)
      throw new Error('Google Apps Script 回傳錯誤: ' + JSON.stringify(result))
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('儲存活動紀錄時發生錯誤:', error)
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : '儲存失敗',
        details: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    )
  }
} 