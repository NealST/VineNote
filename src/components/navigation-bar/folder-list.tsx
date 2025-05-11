"use client";

import { useEffect, useState, useRef, ChangeEvent } from "react";
import getFolderList from "./controllers/get-folders";
import {
  createFolder,
  renameFolder,
  deleteFolder,
} from "./controllers/folder-action";
import {
  useSelectedFolder,
  type IFolderState,
} from "./controllers/selected-folder";
import { useTranslation } from "react-i18next";
import { Folder, FolderPlus, FolderPen, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { produce } from "immer";
import Empty from "./empty";
import { Input } from "@/components/ui/input";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import type { IFolderItem } from "./types";
import styles from "./index.module.css";

const FolderList = function () {
  const [dataSource, setDataSource] = useState([] as IFolderItem[]);
  const { folder: selectedFolder, setFolder: setSelectedFolder } =
    useSelectedFolder((state: IFolderState) => state);
  const inputValueRef = useRef("");
  const inputRef = useRef<HTMLInputElement>(null);
  const renameOriginRef = useRef("");
  const { t } = useTranslation();

  const handleAddFolder = function () {
    const newDataSource = [
      {
        type: "input",
        name: "",
        path: "",
      },
    ].concat(dataSource);
    inputValueRef.current = "";
    renameOriginRef.current = "";
    setDataSource(newDataSource);

    setTimeout(() => {
      inputRef.current?.focus();
    }, 10);
  };

  const handleInputChange = function (event: ChangeEvent<HTMLInputElement>) {
    inputValueRef.current = event.target?.value;
  };

  const handleSelect = function (folder: IFolderItem) {
    if (folder.type === "input") {
      return;
    }
    setSelectedFolder(folder);
  };

  const handleInputBlur = function (index: number) {
    const renameOrigin = renameOriginRef.current;
    const inputValue = inputValueRef.current;
    // no rename indicates that it is in add mode
    if (!renameOrigin) {
      if (!inputValue) {
        setDataSource(produce(dataSource, draft => {
          draft.shift();
        }));
        return;
      }
      createFolder(inputValue)
        .then((folderPath) => {
          setDataSource(produce(dataSource, draft => {
            draft[0].type = 'folder';
            draft[0].name = inputValue;
            draft[0].path = folderPath;
          }));
        })
        .catch(() => {
          setDataSource(produce(dataSource, draft => {
            draft.shift();
          }));
        });
      return;
    }
    // verify whether the inputValue has existed
    if (!inputValue || dataSource.some(item => item.name === inputValue)) {
      setDataSource(
        produce(dataSource, (draft) => {
          draft[index].type = 'folder';
        })
      );
      return;
    }
    renameFolder(renameOrigin, inputValue).then(() => {
      setDataSource(
        produce(dataSource, (draft) => {
          draft[index].type = 'folder';
          draft[index].name = inputValue;
        })
      );
    });
  };

  const handleRename = function (index: number) {
    renameOriginRef.current = dataSource[index].name;
    setDataSource(
      produce(dataSource, (draft) => {
        draft[index].type = 'input';
      })
    );
    setTimeout(() => {
      inputRef.current?.focus();
    }, 10);
  };

  const handleDelete = function (index: number) {
    deleteFolder(dataSource[index].path).then(() => {
      setDataSource(produce(dataSource, draft => {
        draft.splice(index, 1);
      }))
    })
  };

  useEffect(() => {
    getFolderList().then((ret) => {
      console.log("folders ret", ret);
      if (ret.length === 0) {
        return;
      }
      const retDataSource = ret
        .filter((item) => item.isDirectory)
        .map((item) => ({
          name: item.name,
          // @ts-ignore
          path: item.path,
          type: "folder",
        }));
      setDataSource(retDataSource);
      if (retDataSource.length > 0) {
        setSelectedFolder(retDataSource[0]);
      }
    });
  }, []);

  return (
    <div className={styles.data_list}>
      <div className={styles.list_header}>
        <span className={cn(styles.header_label, "text-muted-foreground")}>
          {t("folders")}
        </span>
        <FolderPlus
          className="cursor-pointer text-foreground"
          size={16}
          onClick={handleAddFolder}
        />
      </div>
      <div className={styles.list_display}>
        {dataSource.length > 0 ? (
          dataSource.map((item, index) => {
            const { name, type } = item;
            const isSelected = name === selectedFolder.name;
            const isInput = type === "input";
            return (
              <ContextMenu key={index}>
                <ContextMenuTrigger>
                  <div
                    className={cn(
                      styles.display_item,
                      "hover:bg-accent",
                      "text-sidebar-accent-foreground",
                      // 'text-muted-foreground hover:text-accent-foreground',
                      "dark:hover:bg-accent/50",
                      "h-8 rounded-md cursor-pointer",
                      isSelected && !isInput ? "bg-accent" : "",
                      isInput ? styles.item_input : ""
                    )}
                    onClick={() => handleSelect(item)}
                  >
                    <div className={styles.item_content}>
                      <Folder
                        style={{
                          marginRight: "4px",
                        }}
                        size={14}
                      />
                      {isInput ? (
                        <Input
                          className="h-8"
                          ref={inputRef}
                          type="text"
                          defaultValue={name}
                          onChange={handleInputChange}
                          onBlur={() => handleInputBlur(index)}
                        />
                      ) : (
                        <span
                          className={cn(
                            styles.item_name,
                            "text-sidebar-accent-foreground"
                          )}
                        >
                          {name}
                        </span>
                      )}
                    </div>
                  </div>
                </ContextMenuTrigger>
                <ContextMenuContent>
                  <ContextMenuItem onClick={() => handleRename(index)}>
                    <FolderPen size={12} />
                    <span className={styles.menu_item}>{t("rename")}</span>
                  </ContextMenuItem>
                  <ContextMenuItem onClick={() => handleDelete(index)}>
                    <Trash2 size={12} />
                    <span className={styles.menu_item}>{t("delete")}</span>
                  </ContextMenuItem>
                </ContextMenuContent>
              </ContextMenu>
            );
          })
        ) : (
          <Empty tip={t("emptyFolders")} />
        )}
      </div>
    </div>
  );
};

export default FolderList;
