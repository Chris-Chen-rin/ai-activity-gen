"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function EasterEggPage() {
  return (
    <div className="p-6 space-y-6 ml-48">
      <Card>
        <CardHeader>
          <CardTitle>專案說明</CardTitle>
          <CardDescription>介紹專案的背景、目的、功能和使用方法</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-3 text-primary">專案背景</h3>
            <p className="text-muted-foreground leading-relaxed">
              隨著高齡化社會的來臨，長者照護需求日益增加。設計適合長者的活動需要考量多項因素，包括長者的身體狀況（ADL評分）、認知功能（CDR評分）、年齡、性別及健康訓練需求等。傳統的活動設計往往耗時且難以精準符合每位長者的個別需求。因此，本專案結合 AI 人工智慧技術，開發一套智慧化的長者活動生成與管理系統，協助照護人員快速設計出適合長者的活動方案。
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3 text-primary">專案目的</h3>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>運用 AI 技術自動生成適合不同程度長者的活動設計</li>
              <li>建立完整的長者資料庫管理系統，整合 Google Sheets 資料</li>
              <li>提供活動記錄與歷史查詢功能，追蹤活動成效</li>
              <li>保存長者的生命故事，促進情感連結與懷舊治療</li>
              <li>提升照護品質，減輕照護人員的工作負擔</li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3 text-primary">專案功能</h3>
            <div className="space-y-4">
              <div className="border-l-4 border-primary pl-4">
                <h4 className="font-medium mb-2">1. 首頁儀表板</h4>
                <p className="text-sm text-muted-foreground">顯示本月活動場次統計、參與人次統計，以及近期活動列表，提供快速概覽。</p>
              </div>
              
              <div className="border-l-4 border-primary pl-4">
                <h4 className="font-medium mb-2">2. AI 智慧活動設計</h4>
                <p className="text-sm text-muted-foreground">
                  根據活動目標（認知刺激、身體活動、社交互動、情緒支持、創意表達、身體訓練）、參與長者資料、活動時長及特殊需求，使用 OpenAI GPT 模型自動生成完整的活動設計，包含活動類別、主題、名稱、地點、目的、器材、內容及注意事項等。支援依據長者的依賴程度（中度/重度/極重度）或健康訓練類型（上肢復健/下肢復健/吞嚥訓練/認知訓練）批次選擇參與對象。
                </p>
              </div>
              
              <div className="border-l-4 border-primary pl-4">
                <h4 className="font-medium mb-2">3. 長者資料庫</h4>
                <p className="text-sm text-muted-foreground">
                  整合 Google Sheets API，即時同步長者的基本資料，包含姓名、年齡、性別、ADL 評分（失能程度）、CDR 評分（失智程度）及健康訓練類型。提供搜尋與篩選功能，方便快速查找資料。
                </p>
              </div>
              
              <div className="border-l-4 border-primary pl-4">
                <h4 className="font-medium mb-2">4. 生命故事書</h4>
                <p className="text-sm text-muted-foreground">
                  記錄長者的生命故事與回憶，透過圖片和文字保存珍貴的人生片段，可用於懷舊治療或情感支持活動。
                </p>
              </div>
              
              <div className="border-l-4 border-primary pl-4">
                <h4 className="font-medium mb-2">5. 活動紀錄與歷史</h4>
                <p className="text-sm text-muted-foreground">
                  記錄已舉辦的活動內容、參與者及執行狀況，並支援歷史查詢功能，方便追蹤活動成效與長者參與情形。
                </p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3 text-primary">專案使用方法</h3>
            <ol className="list-decimal list-inside space-y-3 text-muted-foreground">
              <li>
                <span className="font-medium">查看長者資料：</span>
                <span className="ml-2">進入「長者資料庫」頁面，瀏覽所有長者的基本資料與健康狀況評估。</span>
              </li>
              <li>
                <span className="font-medium">設計活動：</span>
                <span className="ml-2">進入「活動設計」頁面，選擇活動目標、參與長者、活動時長，並可填寫特殊需求。系統會根據長者的 ADL/CDR 評分自動分類並提供批次選擇功能。點擊「生成活動設計」後，AI 將自動產生完整的活動方案。</span>
              </li>
              <li>
                <span className="font-medium">記錄活動：</span>
                <span className="ml-2">活動設計完成後，可直接點擊「紀錄」按鈕進入記錄頁面，或從「活動紀錄」選單進入「記錄新的活動」。</span>
              </li>
              <li>
                <span className="font-medium">查看歷史：</span>
                <span className="ml-2">在「活動紀錄」選單中選擇「查看先前活動」，可瀏覽所有已記錄的活動歷史與詳細資訊。</span>
              </li>
              <li>
                <span className="font-medium">管理生命故事：</span>
                <span className="ml-2">進入「生命故事書」頁面，可新增或查看長者的生命故事，作為懷舊治療的素材。</span>
              </li>
            </ol>
          </div>

          <div className="bg-muted p-4 rounded-lg mt-6">
            <h3 className="text-lg font-semibold mb-2">技術架構</h3>
            <div className="grid grid-cols-2 gap-3 text-sm text-muted-foreground">
              <div>
                <span className="font-medium">前端框架：</span>Next.js 15 + React 19
              </div>
              <div>
                <span className="font-medium">程式語言：</span>TypeScript
              </div>
              <div>
                <span className="font-medium">UI 框架：</span>Tailwind CSS + shadcn/ui
              </div>
              <div>
                <span className="font-medium">AI 模型：</span>OpenAI GPT
              </div>
              <div>
                <span className="font-medium">資料來源：</span>Google Sheets API
              </div>
              <div>
                <span className="font-medium">表單處理：</span>React Hook Form + Zod
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

