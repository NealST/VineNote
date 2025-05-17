import { MouseEvent, useState } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";
import { ChevronRight, ChevronDown } from "lucide-react";
import { useSelectedFile } from './controllers/selected-file';
import type { ISearchResult } from "./controllers/search-keyword";
import type { IArticleItem } from "./types";
import { ScrollArea } from "@/components/ui/scroll-area";
import styles from "./index.module.css";

interface SearchResultsProps {
  allFiles: IArticleItem[];
  results: ISearchResult[];
  keyword: string;
}

const HighlightText = ({
  text,
  keyword,
  nodeId,
  resultIndex,
  onAnchorNode
}: {
  text: string;
  keyword: string;
  nodeId: string;
  resultIndex: number;
  onAnchorNode: (resultIndex: number, nodeId: string) => void;
 }) => {
  if (!keyword) return <span>{text}</span>;

  const parts = text.split(new RegExp(`(${keyword})`, "gi"));

  const handleAnchorNode = function(e: MouseEvent) {
    e.stopPropagation();
    onAnchorNode(resultIndex, nodeId);
  }

  return (
    <span className="line-clamp-1" onClick={handleAnchorNode}>
      {parts.map((part, i) =>
        part.toLowerCase() === keyword.toLowerCase() ? (
          <span key={i} className="bg-ring rounded px-1 text-white">
            {part}
          </span>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </span>
  );
};

export function SearchResults({ results, keyword, allFiles }: SearchResultsProps) {
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({});
  const [selectedItem, setSelectedItem] = useState<ISearchResult>(
    {} as ISearchResult
  );
  const setSelectedFile = useSelectedFile(state => state.setSelectedFile);
  const toggleItem = (path: string) => {
    setOpenItems((prev) => ({
      ...prev,
      [path]: !prev[path],
    }));
  };

  const handleSelect = function(resultItem: ISearchResult) {
    setSelectedItem(resultItem);
    // filter the selected file through the file path
    setSelectedFile(allFiles.find(item => item.path === resultItem.file_path) ?? null);
  }

  const handleAnchorNode = function(resultIndex: number, nodeId: string) {
    handleSelect(results[resultIndex]);
    // set the editor scroll to the node
    setTimeout(() => {
      const docNode = document.querySelector(`[data-block-id="${nodeId}"]`);
      if (docNode) {
        docNode.scrollIntoView({
          block: 'end',
          behavior: 'smooth'
        });
      }
    }, 100);
    
  }

  return (
    <ScrollArea className="h-full">
      {results.map((result, resultIndex) => {
        const { file_path, matches } = result;
        const isSelected = selectedItem.file_path === file_path;
        const showFilePath = file_path.replace(/(-([^-]+)){1,5}.json/, "");
        const showFilePathStrs = showFilePath.split('/');
        const showFileName = showFilePathStrs[showFilePathStrs.length - 1];
        return (
          <div
            className={cn(
              styles.file_item,
              "hover:bg-accent rounded-md cursor-pointer",
              isSelected ? "bg-accent" : ""
            )}
            key={file_path}
            onClick={() => handleSelect(result)}
          >
            <Collapsible
              open={openItems[file_path]}
              onOpenChange={() => toggleItem(file_path)}
            >
              <CollapsibleTrigger className="w-full">
                <div
                  className={cn(
                    styles.item_name,
                    "text-sm text-muted-foreground flex flex-row items-center",
                    isSelected ? "text-accent-foreground" : ""
                  )}
                >
                  {openItems[result.file_path] ? (
                    <ChevronDown size={14} fontSize={14} style={{flexShrink: 0}} />
                  ) : (
                    <ChevronRight size={14} fontSize={14} style={{flexShrink: 0}} />
                  )}
                  <span>【{matches.length} matches】</span>
                  <span className={cn(styles.name_text, "line-clamp-1", "ml-1")}>
                    {showFileName}
                  </span>
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
                      <div key={`${node.id}-${index}`} className="ml-3">
                        <div className="prose prose-sm dark:prose-invert max-w-none">
                          <HighlightText text={text} keyword={keyword} nodeId={node.id} resultIndex={resultIndex} onAnchorNode={handleAnchorNode} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CollapsibleContent>
            </Collapsible>
          </div>
        );
      })}
    </ScrollArea>
  );
}
