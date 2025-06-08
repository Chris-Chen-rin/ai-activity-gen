import { NextResponse } from 'next/server'
import OpenAI from 'openai'

// 初始化 OpenAI 客戶端
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

// 定義請求體類型
interface GenerateActivityRequest {
  goal: string
  participants: string
  duration: string
  preferences: string
}

// 定義回應類型
interface ActivityResponse {
  category: string // 活動類別（靜態/動態）
  type: string // 個人/團體活動
  theme: string // 活動主題
  name: string // 活動名稱
  timeRange: string // 活動時間範圍
  location: string // 活動地點
  participantLevel: string // 參與者程度
  participantCount: number // 參與人數
  objectives: string[] // 活動目的
  materials: string[] // 活動器材
  content: string[] // 活動內容
  precautions: string[] // 注意事項
  participants: string[] // 參與成員
}

export async function POST(request: Request) {
  try {
    // 解析請求體
    const body: GenerateActivityRequest = await request.json()

    // 驗證必要欄位
    if (!body.goal || !body.participants || !body.duration) {
      return NextResponse.json(
        { error: '缺少必要欄位' },
        { status: 400 }
      )
    }

    // 構建 prompt
    const prompt = `請根據以下條件設計一個適合長者的活動：

活動目標：${body.goal}
參與對象：${body.participants}
活動時長：${body.duration}分鐘
特殊需求：${body.preferences || '無'}

請提供以下格式的回應（請確保回應是 JSON 格式）：
{
  "category": "活動類別（靜態/動態）",
  "type": "個人/團體活動",
  "theme": "活動主題",
  "name": "活動名稱",
  "timeRange": "活動時間範圍",
  "location": "活動地點",
  "participantLevel": "參與者程度",
  "participantCount": 參與人數,
  "objectives": ["活動目的1", "活動目的2", ...],
  "materials": ["活動器材1", "活動器材2", ...],
  "content": ["活動內容1", "活動內容2", ...],
  "precautions": ["注意事項1", "注意事項2", ...],
  "participants": ["參與成員1", "參與成員2", ...]
}`

    // 調用 OpenAI API
    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_API_MODEL || 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'system',
          content: '你是一個專業的長者活動設計師，擅長設計適合不同能力長者的活動。請確保活動設計安全、有趣且具有意義。'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      response_format: { type: 'json_object' }
    })

    // 解析回應
    const response = completion.choices[0].message.content
    if (!response) {
      throw new Error('API 回應為空')
    }

    const activityData: ActivityResponse = JSON.parse(response)

    return NextResponse.json(activityData)
  } catch (error) {
    console.error('活動生成錯誤:', error)
    return NextResponse.json(
      { error: '活動生成失敗，請稍後再試' },
      { status: 500 }
    )
  }
} 