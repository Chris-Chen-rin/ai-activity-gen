export interface ActivityGenerationRequest {
  goal: string
  participants: string
  duration: string
  preferences: string
}

export interface ActivityResponse {
  name: string
  description: string
  participants: string[]
  objectives: string[]
  materials: string[]
  procedure: string[]
  adaptations: string[]
}

export interface ActivityFormData {
  goal: string
  participants: string[]
  duration: string
  preferences: string
} 