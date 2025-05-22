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
  name: string
  description: string
  objectives: string[]
  materials: string[]
  procedure: string[]
  adaptations: string[]
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
  "name": "活動名稱",
  "description": "活動描述",
  "objectives": ["目標1", "目標2", ...],
  "materials": ["材料1", "材料2", ...],
  "procedure": ["步驟1", "步驟2", ...],
  "adaptations": ["調整建議1", "調整建議2", ...]
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