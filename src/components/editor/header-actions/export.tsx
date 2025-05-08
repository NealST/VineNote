import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ArrowRightFromLine } from "lucide-react";
import { emitter } from "@/utils/events";
import { useSelectedFile } from "@/components/notes-list/controllers/selected-file";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useTranslation } from "react-i18next";

const ExportAction = function () {
  const selectedFile = useSelectedFile((state) => state.selectedFile);
  const { t } = useTranslation();

  const handleExport = (type: string) => {
    emitter.emit("export", {
      type,
      file: selectedFile,
    });
  };

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <ArrowRightFromLine
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
          <DropdownMenuItem onSelect={() => handleExport("html")}>
            {t("export2Html")}
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => handleExport("pdf")}>
            {t("export2Pdf")}
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => handleExport("image")}>
            {t("export2Image")}
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => handleExport("markdown")}>
            {t("export2Markdown")}
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ExportAction;
