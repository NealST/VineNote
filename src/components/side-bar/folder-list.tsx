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
import { Folder, Plus, FolderPlus } from "lucide-react";
import { cn } from "@/lib/utils";
import { produce } from "immer";
import Empty from "./empty";
import { Input } from "@/components/ui/input";
import type { IFolderItem } from "./types";
import styles from "./index.module.css";

const FolderList = function () {
  const [dataSource, setDataSource] = useState([] as IFolderItem[]);
  const { name: selectedFolder, setName: setSelectedFolder } =
    useSelectedFolder((state: IFolderState) => state);
  const inputRef = useRef("");
  const actionTypeRef = useRef("add");
  const renameOriginRef = useRef("");
  const { t } = useTranslation();

  const handleAddFolder = function () {
    const newDataSource = [
      {
        type: "input",
        name: "",
      },
    ].concat(dataSource);
    inputRef.current = "";
    actionTypeRef.current = "add";
    setDataSource(newDataSource);
  };

  const handleInputChange = function (event: ChangeEvent<HTMLInputElement>) {
    inputRef.current = event.target?.value;
  };

  const handleSelect = function (folder: IFolderItem) {
    if (folder.type === "input") {
      return;
    }
    setSelectedFolder(folder.name);
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
        .then(() => {
          newFolders[0] = {
            type: "folder",
            name: inputValue,
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

  useEffect(() => {
    getFolderList().then((ret) => {
      console.log("folders ret", ret);
      if (ret.length === 0) {
        return;
      }
      setDataSource(
        ret
          .filter((item) => item.isDirectory)
          .map((item) => ({
            name: item.name,
            type: "cate",
          }))
      );
      setSelectedFolder(ret[0].name);
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
            const isSelected = name === selectedFolder;
            const isInput = type === "input";
            return (
              <div
                className={cn(
                  styles.folder_item,
                  isSelected ? styles.folder_selected : "",
                  isInput ? styles.folder_input : ""
                )}
                key={index}
                onClick={() => handleSelect(item)}
              >
                <Folder
                  style={{
                    color: "var(--foreground)",
                    marginRight: "8px",
                  }}
                  size={18}
                />
                {isInput ? (
                  <Input
                    className={styles.item_input}
                    type="text"
                    defaultValue={name}
                    onChange={handleInputChange}
                    onBlur={() => handleInputBlur(index)}
                  />
                ) : (
                  <span className={styles.item_name}>{name}</span>
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
