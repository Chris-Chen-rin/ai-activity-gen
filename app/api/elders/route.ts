import { NextResponse } from 'next/server'

const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxx_1ZIjUpeK0Zcw3WBm69N7nsxAuqvSShA7IwqGiOzf683T_9ihm-oBQntYIulrbL1/exec'

export async function GET() {
  try {
    const response = await fetch(`${SCRIPT_URL}?action=getElders`)
    if (!response.ok) {
      throw new Error('獲取長輩列表失敗')
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('獲取長輩列表時發生錯誤:', error)
    return NextResponse.json(
      { error: '獲取長輩列表失敗' },
      { status: 500 }
    )
  }
} 