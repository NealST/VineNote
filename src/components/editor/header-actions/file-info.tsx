import { useSelectedFile } from "@/components/notes-list/controllers/selected-file";
import { useTranslation } from "react-i18next";
import { useTextCount } from "../controllers/text-count";
import { cn } from "@/lib/utils";
import styles from "./index.module.css";

const FileInfo = function () {
  const selectedFile = useSelectedFile((state) => state.selectedFile);
  const textCount = useTextCount((state) => state.count);
  const { t } = useTranslation();
  return (
    <div className={styles.header_info}>
      <span className={styles.info_title}>{selectedFile?.name}</span>
      <span className={cn(styles.info_count, "text-muted-foreground")}>
        {t("wordCount")}: {textCount}
      </span>
    </div>
  );
};

export default FileInfo;
