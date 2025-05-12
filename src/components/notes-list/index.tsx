import { useState, useRef, useEffect, ChangeEvent, useCallback } from "react";
import { FilePlus, Search, FilePen, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import Empty from "./empty";
import { useTranslation } from "react-i18next";
import { useSelectedFolder } from "../navigation-bar/controllers/selected-folder";
import { uid } from "uid";
import { createTimeStamp } from "./controllers/create-time-format";
import {
  renameFile,
  deleteFile,
  createFile,
  getFiles,
} from "./controllers/file-actions";
import { useSelectedFile } from "./controllers/selected-file";
import { searchFilesForKeyword } from "./controllers/search-keyword";
import { useSelectedTag } from "@/components/navigation-bar/controllers/selected-tag";
import { useSelectedNav } from "../navigation-bar/controllers/selected-nav";
import { deleteTagForFile } from "../editor/controllers/file-tag-action";
import { useTagDataSource } from "../navigation-bar/controllers/tag-datasource";
import { getTagFilePath } from "../navigation-bar/controllers/tag-action";
import { produce } from "immer";
import { emitter } from "@/utils/events";
import { cn } from "@/lib/utils";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { SearchResults } from "./search-result";
import type { ISearchResult } from "./controllers/search-keyword";
import type { IArticleItem } from "./types";
import styles from "./index.module.css";

const NotesList = function () {
  const [dataSource, setDataSource] = useState<IArticleItem[]>([]);
  const [isInSearchMode, setIsInSearchMode] = useState(false);
  const [searchDataSource, setSearchDataSource] = useState<ISearchResult[]>([]);
  const { selectedFile, setSelectedFile } = useSelectedFile();
  const selectedFolder = useSelectedFolder((state) => state.folder);
  const selectedTag = useSelectedTag((state) => state.tag);
  const selectedNav = useSelectedNav((state) => state.id);
  const { dataSource: tagDataSource, setDataSource: setTagDataSource } =
    useTagDataSource();
  const inputRef = useRef("");
  const inputElRef = useRef<HTMLInputElement>(null);
  const searchTextRef = useRef("");
  const { t } = useTranslation();
  const isInTagNav = selectedNav === "tags";
  const headerName = isInTagNav ? selectedTag.name : selectedFolder?.name;

  const handleAddFile = function () {
    const defaultName = t("untitled");
    const id = uid();
    createFile(selectedFolder, `${defaultName}-${id}`).then((filePath) => {
      const newDataSource = [
        {
          id: id,
          name: defaultName,
          path: filePath,
          metadata: {
            is_file: true,
            is_dir: false,
            len: 0,
            created: createTimeStamp(),
          },
        } as IArticleItem,
      ].concat(dataSource);
      setDataSource(newDataSource);
      setSelectedFile(newDataSource[0]);
    });
  };

  const handleInputBlur = function (index: number) {
    const inputValue = inputRef.current.trim();
    const oldFile = dataSource[index];
    if (!inputValue || inputValue === oldFile.name) {
      setDataSource(
        produce(dataSource, (draft) => {
          draft[index].action = "";
        })
      );
      return;
    }
    const oldFilePath = oldFile.path;
    const folderPaths = oldFilePath.split("/");
    const theFolderPath = folderPaths
      .slice(0, folderPaths.length - 1)
      .join("/");
    const newFilePath = `${theFolderPath}/${inputValue}-${oldFile.id}.json`;
    renameFile(oldFilePath, newFilePath).then(() => {
      setDataSource(
        produce(dataSource, (draft) => {
          draft[index].name = inputValue;
          draft[index].path = newFilePath;
          draft[index].action = "";
        })
      );
    });
  };

  const handleSearchChange = function (inputValue: string) {
    searchTextRef.current = inputValue;
    if (!inputValue.trim()) {
      setIsInSearchMode(false);
    }
  };

  const handleSearch = function () {
    const searchText = searchTextRef.current.trim();
    if (searchText) {
      searchFilesForKeyword(selectedFolder.path, searchText).then((result) => {
        console.log("search keyword result", result);
        setIsInSearchMode(true);
        setSearchDataSource(result);
      });
    }
  };

  const handleInputChange = function (event: ChangeEvent<HTMLInputElement>) {
    inputRef.current = event.target?.value;
  };

  const handleRenameFile = function (index: number) {
    setDataSource(
      produce(dataSource, (draft) => {
        draft[index].action = "input";
      })
    );
    setTimeout(() => {
      inputElRef.current?.focus();
    }, 10);
  };

  const handleDeleteInTag = async function (deleteIndex: number) {
    const tagFilePath = await getTagFilePath();
    deleteTagForFile(
      tagDataSource,
      tagFilePath,
      selectedTag,
      dataSource[deleteIndex]
    ).then((newTagDataSource) => {
      setTagDataSource(newTagDataSource);
    });
  };

  const handleDeleteFile = function (deleteIndex: number) {
    const len = dataSource.length;
    const file = dataSource[deleteIndex];
    deleteFile(file.path)
      .then(() => {
        if (len === 1) {
          setSelectedFile(null);
          setDataSource([]);
          return;
        }
        if (deleteIndex === len - 1) {
          setSelectedFile(dataSource[deleteIndex - 1]);
        } else {
          setSelectedFile(dataSource[deleteIndex + 1]);
        }
        setDataSource(
          produce(dataSource, (draft) => {
            draft.splice(deleteIndex, 1);
          })
        );
      })
      .catch(() => {
        // todo: add exception log for delete fail
      });
  };

  useEffect(() => {
    const folederPath = selectedFolder?.path;
    if (!folederPath) {
      return;
    }
    if (isInTagNav) {
      return;
    }
    getFiles(folederPath).then((retStr) => {
      const searchResult = JSON.parse(retStr);
      console.log("searchResult", searchResult);
      const files: IArticleItem[] = searchResult.children || [];
      // setDataSource(articles);
      const newDataSource = files.map((item) => {
        return {
          ...item,
          name: item.name.replace(/(-([^-]+)){1,5}.json/, ""),
        };
      });
      setDataSource(newDataSource);
      setSelectedFile(newDataSource[0]);
    });
  }, [selectedFolder, isInTagNav]);

  useEffect(() => {
    if (!isInTagNav) {
      return;
    }
    const tagFiles = selectedTag.files;
    setDataSource(tagFiles);
    setSelectedFile(tagFiles[0]);
  }, [selectedTag, isInTagNav]);

  useEffect(() => {
    emitter.on("deleteFile", handleDeleteFile);

    return () => {
      emitter.off("deleteFile", handleDeleteFile);
    };
  }, []);

  return (
    <div className={styles.notes_list}>
      <div
        className={cn(
          styles.list_header,
          isInTagNav ? styles.list_header_tags : ""
        )}
      >
        <span className={styles.header_label}>
          {headerName || t("allNotes")}
        </span>
        {!isInTagNav && !isInSearchMode && (
          <FilePlus
            className="cursor-pointer text-foreground"
            size={16}
            onClick={handleAddFile}
          />
        )}
      </div>
      <Separator />
      {!isInTagNav && (
        <>
          <div className={cn(styles.list_search, "h-9")}>
            <Search size={14} onClick={handleSearch} />
            <Input
              className="border-0 outline-0 focus-visible:border-0 focus-visible:ring-[0px]"
              type="text"
              placeholder={t("searchNotes")}
              onChange={(e) => handleSearchChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleSearch();
                }
              }}
            />
          </div>
          <Separator />
        </>
      )}

      <div className={styles.list_display}>
        {!isInSearchMode &&
          dataSource.length > 0 &&
          dataSource.map((item, index) => {
            const { id, name, action, metadata } = item;
            const isSelected = id === selectedFile?.id;
            return (
              <ContextMenu key={id}>
                <ContextMenuTrigger>
                  <div
                    className={cn(
                      styles.file_item,
                      "hover:bg-accent rounded-md cursor-pointer",
                      isSelected ? "bg-accent" : ""
                    )}
                    onClick={() => setSelectedFile(item)}
                  >
                    {action === "input" ? (
                      <Input
                        ref={inputElRef}
                        defaultValue={name}
                        onChange={handleInputChange}
                        onBlur={() => handleInputBlur(index)}
                      />
                    ) : (
                      <div
                        className={cn(
                          styles.item_name,
                          "text-sm text-muted-foreground",
                          isSelected ? "text-accent-foreground" : ""
                        )}
                      >
                        {name}
                      </div>
                    )}
                    <div
                      className={cn(
                        styles.item_time,
                        "text-muted-foreground text-sm",
                        isSelected ? "text-accent-foreground" : ""
                      )}
                    >
                      {metadata.modified || metadata.created}
                    </div>
                  </div>
                </ContextMenuTrigger>
                <ContextMenuContent>
                  <ContextMenuItem onClick={() => handleRenameFile(index)}>
                    <FilePen size={12} />
                    <span className={styles.menu_item}>{t("rename")}</span>
                  </ContextMenuItem>
                  {isInTagNav && (
                    <ContextMenuItem onClick={() => handleDeleteInTag(index)}>
                      <Trash2 size={12} />
                      <span className={styles.menu_item}>
                        {t("deleteInTag")}
                      </span>
                    </ContextMenuItem>
                  )}
                  <ContextMenuItem onClick={() => handleDeleteFile(index)}>
                    <Trash2 size={12} />
                    <span className={styles.menu_item}>{t("deleteFile")}</span>
                  </ContextMenuItem>
                </ContextMenuContent>
              </ContextMenu>
            );
          })}
        {isInSearchMode && searchDataSource.length > 0 && (
          <SearchResults
            keyword={searchTextRef.current.trim()}
            results={searchDataSource}
          />
        )}
        {((isInSearchMode && searchDataSource.length === 0) ||
          (!isInSearchMode && dataSource.length === 0)) && <Empty />}
      </div>
    </div>
  );
};

export default NotesList;
