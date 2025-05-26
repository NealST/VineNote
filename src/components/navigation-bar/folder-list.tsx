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
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { InputWithAlert } from "../ui/input-with-alert";
import type { IFolderItem } from "./types";
import styles from "./index.module.css";

const FolderList = function () {
  const [dataSource, setDataSource] = useState([] as IFolderItem[]);
  const [inputAlert, setInputAlert] = useState('');
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
    inputValueRef.current = inputValue;
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
          const newFolder = {
            type: 'folder',
            name: inputValue,
            path: folderPath
          };
          setDataSource(produce(dataSource, draft => {
            draft[0] = newFolder;
          }));
          setSelectedFolder(newFolder);
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
    renameFolder(renameOrigin, inputValue).then((newFolderPath) => {
      const newFolder = {
        type: 'folder',
        name: inputValue,
        path: newFolderPath,
      };
      setDataSource(
        produce(dataSource, (draft) => {
          draft[index] = newFolder;
        })
      );
      setSelectedFolder(newFolder);
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

  const handleDelete = function (deleteIndex: number) {
    const len = dataSource.length;
    deleteFolder(dataSource[deleteIndex].path).then(() => {

      if (len === 1) {
        setSelectedFolder(null);
        setDataSource([]);
        return;
      }
      if (deleteIndex === len - 1) {
        setSelectedFolder(dataSource[deleteIndex - 1]);
      } else {
        setSelectedFolder(dataSource[deleteIndex + 1]);
      }
      setDataSource(
        produce(dataSource, (draft) => {
          draft.splice(deleteIndex, 1);
        })
      );
    });
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
            const isSelected = name === selectedFolder?.name;
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
                      // "dark:hover:bg-accent/50",
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
                        <InputWithAlert
                          className="h-8"
                          ref={inputRef}
                          type="text"
                          defaultValue={name}
                          alertTip={inputAlert}
                          onChange={(event) => handleInputChange(event, index)}
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
          <Empty tipKey="emptyFolders" />
        )}
      </div>
    </div>
  );
};

export default FolderList;
