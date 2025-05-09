import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Focus, Minimize } from "lucide-react";
import useFocusMode from "../controllers/focus-mode";
import { useTranslation } from "react-i18next";

const FocusAction = function () {
  const { isFocusMode, setFocusMode } = useFocusMode();
  const { t } = useTranslation();
  const Icon = isFocusMode ? Minimize : Focus;
  const textLabel = isFocusMode ? "unFocusmode" : "focusmode";

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Icon
            style={{ marginLeft: "20px" }}
            className="cursor-pointer"
            size={16}
            onClick={() => setFocusMode(!isFocusMode)}
          />
        </TooltipTrigger>
        <TooltipContent>
          <p>{t(textLabel)}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default FocusAction;
