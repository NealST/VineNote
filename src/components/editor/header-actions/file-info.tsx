import { useSelectedFile } from "@/components/notes-list/controllers/selected-file";
import { useTranslation } from "react-i18next";
import { useTextCount } from "../controllers/text-count";
import { SquarePen } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { emitter } from '@/utils/events';
import styles from "./index.module.css";

const FileInfo = function () {
  const selectedFile = useSelectedFile((state) => state.selectedFile);
  const textCount = useTextCount((state) => state.count);
  const { t } = useTranslation();

  return (
    <div className="flex flex-row items-center">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <SquarePen
              size={14}
              className="mr-1.5 cursor-pointer"
              onClick={() => emitter.emit('renameFile', selectedFile)}
            />
          </TooltipTrigger>
          <TooltipContent>
            <p>{t("rename")}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <span className={styles.info_title}>{selectedFile?.name}</span>
      <span className={cn(styles.info_count, "text-muted-foreground")}>
        {t("wordCount")}: {textCount}
      </span>
    </div>
  );
};

export default FileInfo;
