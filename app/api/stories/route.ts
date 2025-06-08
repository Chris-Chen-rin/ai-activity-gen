import { NextResponse } from 'next/server'

const GAS_URL = 'https://script.google.com/macros/s/AKfycbwCAT88VhOh7yOxJ6HX5d__RJB9cWCHCMgylHCvGjBZeEGyn-5hxQpxZZmK2taIePnp/exec'

// 獲取故事書列表
export async function GET() {
  try {
    const response = await fetch(GAS_URL, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error('獲取故事書列表失敗')
    }

    const responseText = await response.text()
    // console.log('GAS 回應內容:', responseText)

    try {
      const jsonResponse = JSON.parse(responseText)
      return NextResponse.json(jsonResponse)
    } catch (e) {
      return NextResponse.json({ 
        error: '解析回應失敗',
        rawResponse: responseText 
      }, { status: 500 })
    }
  } catch (error) {
    console.error('獲取故事書列表時發生錯誤:', error)
    return NextResponse.json(
      { error: '獲取故事書列表失敗，請稍後再試' },
      { status: 500 }
    )
  }
}

// 新增故事書
export async function POST(request: Request) {
  try {
    const data = await request.json()

    // 確保資料格式符合 GAS API 要求
    const formattedData = {
      ID: "", // ID 由 GAS 自動產生
      人物名稱: data.人物名稱,
      圖片URL: data.圖片URL,
      圖片描述: data.圖片描述
    }

    // console.log('發送到 GAS 的資料:', formattedData)

    const response = await fetch(GAS_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formattedData),
    })

    if (!response.ok) {
      throw new Error('儲存故事書失敗')
    }

    // 獲取回應內容
    const responseText = await response.text()
    // console.log('GAS 回應內容:', responseText)

    // 嘗試解析 JSON
    try {
      const jsonResponse = JSON.parse(responseText)
      return NextResponse.json(jsonResponse)
    } catch (e) {
      // 如果不是 JSON，返回原始文字
      return NextResponse.json({ 
        success: true,
        rawResponse: responseText 
      })
    }
  } catch (error) {
    console.error('儲存故事書時發生錯誤:', error)
    return NextResponse.json(
      { error: '儲存故事書失敗，請稍後再試' },
      { status: 500 }
    )
  }
} 