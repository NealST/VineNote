import { useMemo } from "react";
import { useTextCount } from "./controllers/text-count";
import useFocusMode from "./controllers/focus-mode";
import { useTranslation } from "react-i18next";
import {
  Focus,
  ArrowRightFromLine,
  Trash2,
  Minimize,
  Tags,
} from "lucide-react";
import type { IArticleItem } from "../notes-list/types";
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import AddTag from './header-actions/tag';
import { cn } from "@/lib/utils";
import styles from "./index.module.css";

interface IProps {
  selectedFile: IArticleItem;
}

const Header = function (props: IProps) {
  const { selectedFile } = props;
  const { isFocusMode, setFocusMode } = useFocusMode();
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
    return [
      {
        id: "tag",
        Icon: Tags,
      },
    ]
      .concat(result)
      .concat([
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
      focusmode: () => setFocusMode(!isFocusMode),
      unFocusmode: () => setFocusMode(!isFocusMode),
      export: (type: string) => {
        emitter.emit("export", {
          type,
          file: selectedFile,
        });
      },
      delete: () => {
        emitter.emit("deleteFile", selectedFile);
      },
    }),
    [isFocusMode, selectedFile]
  );

  return (
    <div className={styles.header}>
      <div className={styles.header_info}>
        <span className={styles.info_title}>{selectedFile?.name}</span>
        <span className={cn(styles.info_count, "text-muted-foreground")}>
          {t("wordCount")}: {textCount}
        </span>
      </div>
      <div className={styles.header_action}>
        <AddTag />

        {actions.map((item) => {
          const { id, Icon } = item;
          const action = actionStrategy[id as keyof typeof actionStrategy];
          if (id === "tag") {
            return (
              <AddTag key={id}
            );
          }
          if (id === "export") {
            return (
              <DropdownMenu modal={false} key={id}>
                <DropdownMenuTrigger>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Icon
                          style={{ marginLeft: "20px" }}
                          className="cursor-pointer"
                          size={16}
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
          if (id === "delete") {
            return (
              <AlertDialog key={id}>
                <AlertDialogTrigger>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Icon
                          style={{ marginLeft: "20px" }}
                          className={cn("cursor-pointer", "text-destructive")}
                          size={16}
                        />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{t(id)}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>{t("confirmDelete")}</AlertDialogTitle>
                    <AlertDialogDescription>
                      {t("deleteWarn")}
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>{t("cancel")}</AlertDialogCancel>
                    <AlertDialogAction onClick={() => action("done")}>
                      {t("confirm")}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            );
          }
          return (
            <TooltipProvider key={id}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Icon
                    style={{ marginLeft: "20px" }}
                    className={cn("cursor-pointer")}
                    size={16}
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
