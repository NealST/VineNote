import { useState, useRef, useEffect, ChangeEvent, useCallback } from "react";
import { FilePlus, Search } from "lucide-react";
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
import { useSelectedTag } from "@/components/navigation-bar/controllers/selected-tag";
import { useSelectedNav } from "../navigation-bar/controllers/selected-nav";
import { produce } from "immer";
import { emitter } from "@/utils/events";
import { cn } from "@/lib/utils";
import type { IArticleItem } from "./types";
import styles from "./index.module.css";

const NotesList = function () {
  const [dataSource, setDataSource] = useState<IArticleItem[]>([]);
  const { selectedFile, setSelectedFile } = useSelectedFile();
  const selectedFolder = useSelectedFolder((state) => state.folder);
  const selectedTag = useSelectedTag((state) => state.tag);
  const selectedNav = useSelectedNav((state) => state.id);
  const inputRef = useRef("");
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
    const inputValue = inputRef.current;
    const newFilePath = `${selectedFolder.path}/${inputValue}.json`;
    renameFile(dataSource[index].path, newFilePath).then(() => {
      setDataSource(
        produce(dataSource, (draft) => {
          draft[index] = {
            ...draft[index],
            name: inputValue,
            path: newFilePath,
          };
        })
      );
    });
  };

  const handleInputChange = function (event: ChangeEvent<HTMLInputElement>) {
    inputRef.current = event.target?.value;
  };

  const handleDeleteFile = useCallback(
    function (file: IArticleItem) {
      const len = dataSource.length;
      const deleteIndex = dataSource.findIndex((item) => item.id === file.id);
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
    },
    [dataSource]
  );

  useEffect(() => {
    if (!selectedFolder?.path) {
      return;
    }
    if (isInTagNav) {
      return;
    }
    getFiles(selectedFolder.path).then((retStr) => {
      const searchResult = JSON.parse(retStr);
      console.log("searchResult", searchResult);
      const files: IArticleItem[] = searchResult.children || [];
      // setDataSource(articles);
      const newDataSource = files.map((item) => {
        return {
          ...item,
          name: item.name.replace(/-([^-]+).json/, ""),
        };
      });
      setDataSource(newDataSource);
      if (newDataSource.length > 0) {
        setSelectedFile(newDataSource[0]);
      }
    });
  }, [selectedFolder]);

  useEffect(() => {
    if (!isInTagNav) {
      return;
    }
    setDataSource(selectedTag.files);
  }, [selectedTag]);

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
        {!isInTagNav && (
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
            <Search size={14} />
            <Input
              className="border-0 outline-0 focus-visible:border-0 focus-visible:ring-[0px]"
              type="text"
              placeholder={t("searchNotes")}
            />
          </div>
          <Separator />
        </>
      )}
      <div className={styles.list_display}>
        {dataSource.length > 0 ? (
          dataSource.map((item, index) => {
            const { id, name, action, metadata } = item;
            const isSelected = id === selectedFile?.id;
            return (
              <div
                className={cn(
                  styles.file_item,
                  "hover:bg-accent rounded-md cursor-pointer",
                  isSelected ? "bg-accent" : ""
                )}
                key={id}
                onClick={() => setSelectedFile(item)}
              >
                {action === "input" ? (
                  <Input
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
            );
          })
        ) : (
          <Empty />
        )}
      </div>
    </div>
  );
};

export default NotesList;
