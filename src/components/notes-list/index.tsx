import { useState, useRef, useEffect, ChangeEvent } from "react";
import { FilePlus, Search, FilePen, Trash2 } from "lucide-react";
import { InputWithAlert } from "../ui/input-with-alert";
import { Input } from "../ui/input";
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
import {
  syncDeletedFile2Tag,
  syncRenamedFile2Tag,
} from "@/components/navigation-bar/controllers/tag-action";
import useDataSource from "./controllers/use-datasource";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { ISearchResult } from "./controllers/search-keyword";
import type { IArticleItem } from "./types";
import styles from "./index.module.css";

type Mode = "normal" | "tag" | "search";

const NotesList = function () {
  const [dataSource, dataSourceRef, setDataSource] = useDataSource();
  const [mode, setMode] = useState<Mode>("normal");
  const [searchDataSource, setSearchDataSource] = useState<ISearchResult[]>([]);
  const [inputAlert, setInputAlert] = useState('');
  const { selectedFile, setSelectedFile } = useSelectedFile();
  const selectedFolder = useSelectedFolder((state) => state.folder);
  const selectedTag = useSelectedTag((state) => state.tag);
  const selectedNav = useSelectedNav((state) => state.selectedNav);
  const { dataSource: tagDataSource, setDataSource: setTagDataSource } =
    useTagDataSource();
  const inputRef = useRef("");
  const inputElRef = useRef<HTMLInputElement>(null);
  const searchTextRef = useRef("");
  const { t } = useTranslation();
  const headerName = mode === "tag" ? selectedTag.name : selectedFolder?.name;

  const handleAddFile = function () {
    const defaultName = t("untitled");
    const id = uid();
    if (selectedFolder) {
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
    }
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
      const newFile = {
        id: oldFile.id,
        metadata: oldFile.metadata,
        name: inputValue,
        path: newFilePath,
      };
      // sync the renamed file to tags
      syncRenamedFile2Tag(oldFile, newFile);

      setDataSource(
        produce(dataSource, (draft) => {
          draft[index] = newFile;
        })
      );
      // update the selected file
      setSelectedFile(newFile);
    });
  };

  const handleSearchChange = function (inputValue: string) {
    searchTextRef.current = inputValue;
    if (!inputValue.trim()) {
      setMode("normal");
    }
  };

  const handleSearch = function () {
    const searchText = searchTextRef.current.trim();
    if (searchText && selectedFolder) {
      searchFilesForKeyword(selectedFolder.path, searchText).then((result) => {
        console.log("search keyword result", result);
        setMode("search");
        setSearchDataSource(result);
      });
    }
  };

  const handleInputChange = function (event: ChangeEvent<HTMLInputElement>, index: number) {
    const inputValue = event.target?.value?.trim();
    if (!inputValue) {
      setInputAlert(t('emptyInput'));
      return
    }
    if (dataSource.some((item, dataIndex) => item.name === inputValue && dataIndex !== index)) {
      setInputAlert(t('existedInput'));
      return
    }
    setInputAlert('');
    inputRef.current = inputValue;
  };

  const handleRenameFile = function (renamedFile: IArticleItem) {
    const curDataSource = dataSourceRef.current ?? [];
    const renamedIndex = curDataSource.findIndex(
      (item) => item.path === renamedFile.path
    );
    setDataSource(
      produce(curDataSource, (draft) => {
        draft[renamedIndex].action = "input";
      })
    );
    setTimeout(() => {
      inputElRef.current?.focus();
    }, 100);
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

  const handleDeleteFile = function (deletedFile: IArticleItem) {
    const curDataSource = dataSourceRef.current ?? [];
    const len = curDataSource.length;
    const deleteIndex = curDataSource.findIndex(
      (item) => item.path === deletedFile.path
    );
    deleteFile(deletedFile.path)
      .then(() => {
        // sync the deleted file to tags
        syncDeletedFile2Tag(deletedFile);

        if (len === 1) {
          setSelectedFile(null);
          setDataSource([]);
          return;
        }
        if (deleteIndex === len - 1) {
          setSelectedFile(curDataSource[deleteIndex - 1]);
        } else {
          setSelectedFile(curDataSource[deleteIndex + 1]);
        }
        setDataSource(
          produce(curDataSource, (draft) => {
            draft.splice(deleteIndex, 1);
          })
        );
      })
      .catch(() => {
        // todo: add exception log for delete fail
      });
  };

  useEffect(() => {
    setMode("normal");
    if (!selectedFolder) {
      setDataSource([]);
      setSelectedFile(null);
      return;
    }
    const folederPath = selectedFolder.path;
    if (!folederPath) {
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
  }, [selectedFolder]);

  useEffect(() => {
    const tagFiles = selectedTag.files;
    setDataSource(tagFiles);
    setSelectedFile(tagFiles[0]);
  }, [selectedTag]);

  useEffect(() => {
    if (selectedNav === "tags") {
      setMode("tag");
    } else {
      setMode("normal");
    }
  }, [selectedNav]);

  useEffect(() => {
    emitter.on("deleteFile", handleDeleteFile);
    emitter.on("renameFile", handleRenameFile);

    return () => {
      emitter.off("deleteFile", handleDeleteFile);
      emitter.off("renameFile", handleRenameFile);
    };
  }, []);

  return (
    <div className={styles.notes_list}>
      <div className={cn(styles.list_header)}>
        <span className={styles.header_label}>
          {headerName || t("allNotes")}
        </span>
        {mode === "normal" && (
          <FilePlus
            className="cursor-pointer text-foreground"
            size={16}
            onClick={handleAddFile}
          />
        )}
      </div>
      <Separator />
      {mode !== "tag" && (
        <>
          <div className={cn(styles.list_search, "h-9")}>
            <Search size={14} onClick={handleSearch} />
            <Input
              className="border-0 outline-0 focus-visible:border-0 focus-visible:ring-[0px] caret-ring"
              type="text"
              style={{ backgroundColor: "var(--background)" }}
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
        {mode !== "search" && dataSource.length > 0 && (
          <ScrollArea className="h-full">
            {dataSource.map((item, index) => {
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
                        <InputWithAlert
                          ref={inputElRef}
                          defaultValue={name}
                          alertTip={inputAlert}
                          onChange={(event) => handleInputChange(event, index)}
                          onBlur={() => handleInputBlur(index)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              handleInputBlur(index);
                            }
                          }}
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
                    <ContextMenuItem onClick={() => handleRenameFile(item)}>
                      <FilePen size={12} />
                      <span className={styles.menu_item}>{t("rename")}</span>
                    </ContextMenuItem>
                    {mode === "tag" && (
                      <ContextMenuItem onClick={() => handleDeleteInTag(index)}>
                        <Trash2 size={12} />
                        <span className={styles.menu_item}>
                          {t("deleteInTag")}
                        </span>
                      </ContextMenuItem>
                    )}
                    <ContextMenuItem onClick={() => handleDeleteFile(item)}>
                      <Trash2 size={12} />
                      <span className={styles.menu_item}>
                        {t("deleteFile")}
                      </span>
                    </ContextMenuItem>
                  </ContextMenuContent>
                </ContextMenu>
              );
            })}
          </ScrollArea>
        )}
        {mode === "search" && searchDataSource.length > 0 && (
          <SearchResults
            keyword={searchTextRef.current.trim()}
            results={searchDataSource}
            allFiles={dataSource}
          />
        )}
        {((mode === "search" && searchDataSource.length === 0) ||
          (mode !== "search" && dataSource.length === 0)) && <Empty />}
      </div>
    </div>
  );
};

export default NotesList;
