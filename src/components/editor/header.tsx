import { useMemo } from "react";
import { useSelectedFile } from "@/components/notes-list/controllers/selected-file";
import useTextCount from "./controllers/text-count";
import { useTranslation } from "react-i18next";
import { Focus, ArrowRightFromLine, Trash2, Minimize } from "lucide-react";
import { emitter } from "@/utils/events";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from '@/lib/utils';
import styles from "./index.module.css";

interface IProps {
  isFocusMode: boolean;
  onToggleFocusMode: (isFocusMode: boolean) => void;
}

const Header = function (props: IProps) {
  const { isFocusMode, onToggleFocusMode } = props;
  const selectedFile = useSelectedFile((state) => state.selectedFile);
  const textCount = useTextCount((state) => state.count);
  const { t } = useTranslation();

  const actions = useMemo(() => {
    const result = isFocusMode
      ? [
          {
            id: "unFocusmode",
            Icon: Minimize,
          },
        ]
      : [
          {
            id: "focusmode",
            Icon: Focus,
          },
        ];
    return result.concat([
      {
        id: "export",
        Icon: ArrowRightFromLine,
      },
      {
        id: "delete",
        Icon: Trash2,
      },
    ]);
  }, [isFocusMode]);

  const actionStrategy = useMemo(
    () => ({
      focusmode: () => onToggleFocusMode(!isFocusMode),
      unFocusmode: () => onToggleFocusMode(!isFocusMode),
      export: (type: string) => {
        emitter.emit("export", {
          type,
          file: selectedFile,
        });
      },
      delete: () => {},
    }),
    [isFocusMode, selectedFile]
  );

  return (
    <div className={styles.header}>
      <div className={styles.header_info}>
        <span className={styles.info_title}>{selectedFile.name}</span>
        <span className={cn(styles.info_count, 'text-muted-foreground')}>
          {t("wordCount")}: {textCount}
        </span>
      </div>
      <div className={styles.header_action}>
        {actions.map((item) => {
          const { id, Icon } = item;
          const action = actionStrategy[id as keyof typeof actionStrategy];
          if (id === "export") {
            return (
              <DropdownMenu modal={false} key={id}>
                <DropdownMenuTrigger>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Icon
                          style={{ marginLeft: "16px" }}
                          className="cursor-pointer"
                          size={14}
                          key={id}
                        />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{t("export")}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" side="bottom">
                  <DropdownMenuGroup>
                    <DropdownMenuItem onSelect={() => action("html")}>
                      {t("export2Html")}
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => action("pdf")}>
                      {t("export2Pdf")}
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => action("image")}>
                      {t("export2Image")}
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => action("markdown")}>
                      {t("export2Markdown")}
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            );
          }
          return (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Icon
                    style={{ marginLeft: "16px" }}
                    className="cursor-pointer"
                    size={14}
                    key={id}
                    onClick={() => action("done")}
                  />
                </TooltipTrigger>
                <TooltipContent>
                  <p>{t(id)}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          );
        })}
      </div>
    </div>
  );
};

export default Header;
