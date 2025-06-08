export interface ActivityGenerationRequest {
  goal: string
  participants: string
  duration: string
  preferences: string
}

export interface ActivityResponse {
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

export interface ActivityFormData {
  goal: string
  participants: string[]
  duration: string
  preferences: string
} 