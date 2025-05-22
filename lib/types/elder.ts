export interface ElderProfile {
  name: string;           // 姓名
  gender: string;         // 性別
  psychologicalState: string;  // 心理素質
  activityPreference: string;  // 喜靜/喜動
  attitude: string;      // 態度
  comprehension: string; // 理解能力
  attention: string;     // 注意力
  social: string;        // 社交
  adlScore: number;      // ADL評分(失能)
  cdrScore: number;      // CDR評分(失智)
  healthTraining: string; // 健康訓練
  age: number;           // 年齡
}

export interface ElderDatabaseResponse {
  elders: ElderProfile[];
  total: number;
} 