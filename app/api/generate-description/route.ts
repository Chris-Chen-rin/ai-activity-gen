import { NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

async function getImageAsBase64(url: string): Promise<string> {
  try {
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    const buffer = await response.arrayBuffer()
    const base64 = Buffer.from(buffer).toString('base64')
    return `data:image/jpeg;base64,${base64}`
  } catch (error) {
    console.error('下載圖片時發生錯誤:', error)
    throw error
  }
}

function convertGoogleDriveUrl(url: string): string {
  // 如果是 Google Drive 分享連結，轉換為直接訪問的 URL
  if (url.includes('drive.google.com/file/d/')) {
    const fileId = url.split('/file/d/')[1].split('/')[0]
    return `https://drive.google.com/uc?export=view&id=${fileId}`
  }
  return url
}

export async function POST(request: Request) {
  try {
    const { imageUrl } = await request.json()

    if (!imageUrl) {
      return NextResponse.json(
        { error: '請提供圖片URL' },
        { status: 400 }
      )
    }

    // 轉換 Google Drive URL
    const directImageUrl = convertGoogleDriveUrl(imageUrl)
    // console.log('原始URL:', imageUrl)
    // console.log('轉換後的URL:', directImageUrl)

    // 下載圖片並轉換為 base64
    const base64Image = await getImageAsBase64(directImageUrl)
    // console.log('圖片已轉換為 base64')

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: "請根據這張圖片生成一段約20字的中文描述，描述要溫馨、正面，適合用於長輩的生命故事書。" },
            {
              type: "image_url",
              image_url: {
                url: base64Image
              }
            }
          ],
        },
      ],
      max_tokens: 100,
    })

    const description = completion.choices[0].message.content

    return NextResponse.json({ description })
  } catch (error) {
    console.error('生成描述時發生錯誤:', error)
    return NextResponse.json(
      { error: '生成描述失敗，請稍後再試' },
      { status: 500 }
    )
  }
} 