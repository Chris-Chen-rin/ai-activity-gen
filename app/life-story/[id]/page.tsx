import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"
import { BackButton } from "./components/back-button"

export default function LifeStoryDetailPage() {
  return (
    <div className="p-6 space-y-6 ml-48">
      <div className="flex items-center space-x-4">
        <BackButton />
        <h1 className="text-3xl font-bold">王大明 的生命故事</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* 照片區域 */}
        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <div className="relative w-full h-[400px]">
              <Image
                src="/0.jpg"
                alt="王大明的生活照"
                fill
                className="object-cover"
                priority
              />
            </div>
            <div className="p-4 bg-white">
              <p className="text-sm text-muted-foreground text-center">
                攝於 2023 年春天，在社區花園
              </p>
            </div>
          </CardContent>
        </Card>

        {/* 故事內容區域 */}
        <Card>
          <CardContent className="p-6 space-y-6">
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">我的故事</h2>
              <div className="prose prose-sm max-w-none">
                <p className="text-gray-700 leading-relaxed">
                  我出生於 1945 年的台北，那是一個物資匱乏但人情味濃厚的年代。父親是位木匠，母親則在家照顧我們五個孩子。從小，我就跟著父親學習木工，這不僅讓我學會了一技之長，更讓我明白勤勞和堅持的重要性。
                </p>
                <p className="text-gray-700 leading-relaxed mt-4">
                  年輕時，我在台北開了一家小木工店，專門製作傳統家具。那時候，每天清晨五點就起床工作，雖然辛苦，但看到客人滿意的笑容，一切都值得了。我的作品不僅實用，更融入了傳統工藝的美感，這讓我感到驕傲。
                </p>
                <p className="text-gray-700 leading-relaxed mt-4">
                  現在退休了，我最大的樂趣就是照顧社區的小花園。看著親手種下的花草慢慢長大，就像看著自己的孩子成長一樣。每當鄰居們經過時停下來欣賞，或是向我請教種植技巧，都讓我感到無比快樂。
                </p>
                <p className="text-gray-700 leading-relaxed mt-4">
                  回顧這一生，雖然經歷過許多困難，但正是這些經歷讓我學會了珍惜和感恩。我希望我的故事能夠鼓勵年輕人，讓他們明白：只要保持樂觀和堅持，人生總會充滿希望。
                </p>
              </div>
            </div>

            <div className="pt-4 border-t">
              <h3 className="text-lg font-medium mb-2">生命中的重要時刻</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• 1945 年：出生於台北</li>
                <li>• 1965 年：開始學習木工</li>
                <li>• 1970 年：開設木工店</li>
                <li>• 1980 年：結婚成家</li>
                <li>• 2000 年：退休</li>
                <li>• 2020 年：開始經營社區花園</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 