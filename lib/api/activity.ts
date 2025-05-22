import { ActivityGenerationRequest, ActivityResponse } from '../types/activity'

export async function generateActivity(data: ActivityGenerationRequest): Promise<ActivityResponse> {
  try {
    const response = await fetch('/api/activity/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || '活動生成失敗')
    }

    return await response.json()
  } catch (error) {
    console.error('活動生成錯誤:', error)
    throw error
  }
} 