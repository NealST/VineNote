import { useState } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronRight, ChevronDown, FileText } from "lucide-react";
import type { ISearchResult } from "./controllers/search-keyword";
import { ScrollArea } from "@/components/ui/scroll-area";
import styles from "./index.module.css";

interface SearchResultsProps {
  results: ISearchResult[];
  keyword: string;
}

const HighlightText = ({
  text,
  keyword,
}: {
  text: string;
  keyword: string;
}) => {
  if (!keyword) return <span>{text}</span>;

  const parts = text.split(new RegExp(`(${keyword})`, "gi"));
  return (
    <span>
      {parts.map((part, i) =>
        part.toLowerCase() === keyword.toLowerCase() ? (
          <span
            key={i}
            className="bg-secondary rounded px-1 text-secondary-foreground"
          >
            {part}
          </span>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </span>
  );
};

export function SearchResults({ results, keyword }: SearchResultsProps) {
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({});
  const [selectedItem, setSelectedItem] = useState<ISearchResult>(
    {} as ISearchResult
  );
  const toggleItem = (path: string) => {
    setOpenItems((prev) => ({
      ...prev,
      [path]: !prev[path],
    }));
  };

  return (
    <ScrollArea className="h-full">
      {results.map((result) => {
        const { file_path, matches } = result;
        const isSelected = selectedItem.file_path === file_path;
        return (
          <Collapsible
            open={openItems[file_path]}
            onOpenChange={() => toggleItem(file_path)}
          >
            <CollapsibleTrigger className="w-full">
              <div
                className={cn(
                  styles.file_item,
                  "hover:bg-accent rounded-md cursor-pointer",
                  isSelected ? "bg-accent" : ""
                )}
                onClick={() => setSelectedItem(result)}
              >
                <div
                  className={cn(
                    styles.item_name,
                    "text-sm text-muted-foreground flex flex-row items-center",
                    isSelected ? "text-accent-foreground" : ""
                  )}
                >
                  {openItems[result.file_path] ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                  <div className={cn(styles.name_text, 'line-clamp-1', 'ml-1')}>{file_path.replace(/(-([^-]+)){1,5}.json/, "")}</div>
                </div>
                <div
                  className={cn(
                    styles.item_time,
                    "text-muted-foreground text-sm",
                    isSelected ? "text-accent-foreground" : ""
                  )}
                >
                  <Badge variant="secondary" className="ml-2">
                    {matches.length} matches
                  </Badge>
                </div>
              </div>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div
                className={cn(
                  styles.item_time,
                  "text-muted-foreground text-sm",
                  isSelected ? "text-accent-foreground" : ""
                )}
              >
                {matches.map((match, index) => {
                  const { node, text } = match;
                  return (
                    <div
                      key={`${node.id}-${index}`}
                      className="rounded-lg border bg-card p-4"
                    >
                      <div className="prose prose-sm dark:prose-invert max-w-none">
                        <HighlightText text={text} keyword={keyword} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </CollapsibleContent>
          </Collapsible>
        );
      })}
    </ScrollArea>
  );
}
