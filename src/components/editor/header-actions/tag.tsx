import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Tags, X } from "lucide-react";
import { useState, useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Command,
  CommandList,
  CommandItem,
  CommandEmpty,
} from "@/components/ui/command";
import { useTranslation } from "react-i18next";
import styles from "./index.module.css";

const AddTag = function () {
  const { t } = useTranslation();
  const [inputValue, setInputValue] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [availableTags, setAvailableTags] = useState<string[]>([]);

  // filter the avaliable tags
  const filteredTags = useMemo(() => {
    return availableTags.filter(
      (tag) =>
        tag.toLowerCase().includes(inputValue.toLowerCase()) &&
        !selectedTags.includes(tag)
    );
  }, [inputValue, availableTags, selectedTags]);

  const handleCreateTag = function () {
    const inputTag = inputValue.trim();
    if (!inputTag) return;
  };

  const handleDeleteTag = function (index: number) {};

  const handleAddTag = function (tag: string) {};

  return (
    <Popover>
      <PopoverTrigger>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Tags className="cursor-pointer" size={16} />
            </TooltipTrigger>
            <TooltipContent>
              <p>{t("addTag")}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </PopoverTrigger>
      <PopoverContent>
        <div className={styles.tag_content}>
          <Input
            placeholder={t("addTag")}
            onChange={(e) => {
              setInputValue(e.target.value.trim());
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && inputValue.trim()) {
                e.preventDefault();
                handleCreateTag();
              }
            }}
          />
          <div className={styles.tag_command}>
            <Command>
              <CommandList className="max-h-48 overflow-auto">
                {/* 现有标签建议 */}
                {filteredTags.map((tag) => (
                  <CommandItem
                    key={tag}
                    onSelect={() => handleAddTag(tag)}
                    className="cursor-pointer px-4 py-2 text-sm hover:bg-accent"
                  >
                    {tag}
                  </CommandItem>
                ))}

                {/* 创建新标签选项 */}
                {inputValue && !availableTags.includes(inputValue) && (
                  <CommandItem
                    onSelect={handleCreateTag}
                    className="cursor-pointer px-4 py-2 text-sm text-primary hover:bg-accent"
                  >
                    {t('createNewTag')}:
                    <span className="ml-1 font-medium">"{inputValue}"</span>
                  </CommandItem>
                )}

                {/* empty state */}
                {!filteredTags.length && !inputValue.trim() && (
                  <CommandEmpty className="px-4 py-2 text-sm text-muted-foreground">{t('input2AddTag')}</CommandEmpty>
                )}
              </CommandList>
            </Command>
          </div>
          <div className={styles.tag_selected}>
            {selectedTags.map((tag, index) => (
              <Badge key={tag} variant="secondary">
                {tag}
                <button
                  onClick={() => handleDeleteTag(index)}
                  className="ml-2 rounded-full hover:bg-accent"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default AddTag;
