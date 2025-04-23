import { Card } from "@/components/ui/card"
import { FileText } from "lucide-react"
import styles from "./index.module.css";

interface IProps {
  tip: string;
}

const Empty = function ({ tip }: IProps) {
  return (
    <Card className="max-w-md p-8 text-center">
      <div className="flex flex-col items-center gap-4">
        <FileText className="h-12 w-12 text-muted-foreground" />
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">无文件夹</h3>
          <p className="text-sm text-muted-foreground">
            当前没有文件夹，尝试去添加一个吧~
          </p>
        </div>
      </div>
    </Card>
  )
};

export default Empty;
