import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { preferences, members } = await request.json()

    // 這裡只是模擬 API 回應
    // 實際應用中，您可能會呼叫 AI 服務來產生建議
    const mockResponse = {
      success: true,
      activities: [
        {
          name: "團隊野餐",
          description: "在附近的公園進行團隊野餐活動，每個人可以帶一道菜分享。",
          suitability: "非常適合",
          participants: members,
        },
        {
          name: "桌遊聚會",
          description: "選擇幾款適合多人的桌遊，在室內進行互動性高的遊戲。",
          suitability: "適合",
          participants: members,
        },
        {
          name: "健行活動",
          description: "選擇附近的步道進行半日健行，欣賞自然風景。",
          suitability: "較適合",
          participants: members,
        },
      ],
    }

    // 模擬 API 延遲
    await new Promise((resolve) => setTimeout(resolve, 1500))

    return NextResponse.json(mockResponse)
  } catch (error) {
    console.error("API 錯誤:", error)
    return NextResponse.json({ error: "處理請求時發生錯誤" }, { status: 500 })
  }
}
