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
import { Folder, Ellipsis, FolderPlus, FolderPen, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { produce } from "immer";
import Empty from "./empty";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { IFolderItem } from "./types";
import styles from "./index.module.css";

const FolderList = function () {
  const [dataSource, setDataSource] = useState([] as IFolderItem[]);
  const { folder: selectedFolder, setFolder: setSelectedFolder } =
    useSelectedFolder((state: IFolderState) => state);
  const inputRef = useRef("");
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
    inputRef.current = "";
    renameOriginRef.current = "";
    setDataSource(newDataSource);
  };

  const handleInputChange = function (event: ChangeEvent<HTMLInputElement>) {
    inputRef.current = event.target?.value;
  };

  const handleSelect = function (folder: IFolderItem) {
    if (folder.type === "input") {
      return;
    }
    setSelectedFolder(folder);
  };

  const handleInputBlur = function (index: number) {
    const newFolders = ([] as IFolderItem[]).concat(dataSource);
    const renameOrigin = renameOriginRef.current;
    const inputValue = inputRef.current;
    // no rename indicates that it is in add mode
    if (!renameOrigin) {
      if (!inputValue) {
        newFolders.shift();
        setDataSource(newFolders);
        return;
      }
      createFolder(inputValue)
        .then((folderPath) => {
          newFolders[0] = {
            type: "folder",
            name: inputValue,
            path: folderPath,
          };
          setDataSource(newFolders);
        })
        .catch(() => {
          newFolders.shift();
          setDataSource(newFolders);
        });
      return;
    }

    renameFolder(renameOrigin, inputValue).then(() => {
      setDataSource(
        produce(dataSource, (draft) => {
          draft[index] = {
            ...draft[index],
            name: inputValue,
            type: "folder",
          };
        })
      );
    });
  };

  const handleRename = function (index: number) {
    renameOriginRef.current = dataSource[index].name;
    setDataSource(
      produce(dataSource, (draft) => {
        draft[index] = {
          ...draft[index],
          type: "input",
        };
      })
    );
  };

  const handleDelete = function (index: number) {
    deleteFolder(dataSource[index].path);
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
      setSelectedFolder(retDataSource[0]);
    });
  }, []);

  return (
    <div className={styles.folder_list}>
      <div className={styles.list_header}>
        <span className={cn(styles.header_label, "text-muted-foreground")}>
          {t("folders")}
        </span>
        <FolderPlus
          className="cursor-pointer"
          size={16}
          style={{ color: "var(--ring)" }}
          onClick={handleAddFolder}
        />
      </div>
      <div className={styles.list_folders}>
        {dataSource.length > 0 ? (
          dataSource.map((item, index) => {
            const { name, type } = item;
            const isSelected = name === selectedFolder.name;
            const isInput = type === "input";
            return (
              <div
                className={cn(
                  styles.folder_item,
                  "hover:bg-accent",
                  "text-accent-foreground",
                  // 'text-muted-foreground hover:text-accent-foreground',
                  "dark:hover:bg-accent/50",
                  "h-8 rounded-md cursor-pointer",
                  isSelected ? 'bg-accent' : "",
                  isInput ? styles.folder_input : ""
                )}
                key={index}
                onClick={() => handleSelect(item)}
              >
                <div className={styles.item_content}>
                  <Folder
                    style={{
                      marginRight: "8px",
                    }}
                    size={14}
                  />
                  {isInput ? (
                    <Input
                      className={cn(styles.item_input, "h-8")}
                      type="text"
                      defaultValue={name}
                      onChange={handleInputChange}
                      onBlur={() => handleInputBlur(index)}
                    />
                  ) : (
                    <span className={styles.item_name}>{name}</span>
                  )}
                </div>
                {!isInput && (
                  <DropdownMenu>
                    <DropdownMenuTrigger>
                      <Ellipsis className="outline-0" size={14} />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={() => handleRename(index)}>
                        <FolderPen size={12} />
                        <span className={styles.menu_item}>{t("rename")}</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDelete(index)}>
                        <Trash2 size={12} />
                        <span className={styles.menu_item}>{t("delete")}</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
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
