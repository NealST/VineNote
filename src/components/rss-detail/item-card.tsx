import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Clock, ExternalLink } from "lucide-react"

export default function ItemCard({
  title,
  description,
  pubDate,
  link,
  imageUrl,
}: {
  title: string
  description: string
  pubDate: string
  link: string
  imageUrl?: string
}) {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1">
      <div className="flex flex-col md:flex-row gap-4 p-4">
        {/* 左侧封面图（可选） */}
        {imageUrl && (
          <div className="w-full md:w-48 h-32 md:h-48 overflow-hidden rounded-lg bg-muted">
            <img
              src={imageUrl}
              alt="Article cover"
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* 右侧内容区域 */}
        <div className="flex-1 flex flex-col">
          <div className="space-y-2">
            {/* 标题 */}
            <h3 className="text-lg font-semibold line-clamp-2">{title}</h3>

            {/* 描述 */}
            <p className="text-sm text-muted-foreground line-clamp-3">
              {description}
            </p>

            {/* 信息条 */}
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {pubDate}
              </span>
            </div>
          </div>

          {/* 操作按钮 */}
          <div className="mt-auto flex items-center justify-between pt-3 border-t">
            <Button
              variant="ghost"
              size="sm"
              className="text-primary hover:bg-primary/10"
              onClick={() => window.open(link, "_blank")}
            >
              <ExternalLink className="h-4 w-4 mr-1" />
              阅读原文
            </Button>
          </div>
        </div>
      </div>
    </Card>
  )
}
