"use client";

import { useEffect, useState, useRef, ChangeEvent } from "react";
import getFolderList from "./controllers/get-folders";
import {
  useSelectedFolder,
  type IFolderState,
} from "./controllers/selected-folder";
import { useTranslation } from "react-i18next";
import { Folder } from "lucide-react";
import { cn } from "@/lib/utils";
import Empty from "./empty";
import type { IFolderItem } from "./types";
import styles from "./index.module.css";

const FolderList = function () {
  const [dataSource, setDataSource] = useState([] as IFolderItem[]);
  const { name: selectedFolder, setName: setSelectedFolder } =
    useSelectedFolder((state: IFolderState) => state);
  const { t } = useTranslation();

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
      <div className={styles.list_header}></div>
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
                onMouseEnter={() => handleEnter(item)}
                onMouseLeave={() => handleLeave(item)}
              >
                <div className={styles.cate_item_label}>
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
                      onBlur={handleInputBlur}
                    />
                  ) : (
                    <span className={styles.item_name}>{name}</span>
                  )}
                </div>
                {enterItem.name === name && enterItem.isEntering && (
                  <div className={styles.cate_item_action}>
                    <div
                      style={{
                        color: "hsl(var(--foreground))",
                        marginRight: "6px",
                      }}
                      title={t("rename")}
                    >
                      <Pencil
                        style={{
                          color: "hsl(var(--foreground))",
                        }}
                        size={14}
                        onClick={() => handleRename(index)}
                      />
                    </div>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <div title={t("remove")}>
                          <Trash2
                            style={{
                              color: "var(--danger)",
                            }}
                            size={14}
                          />
                        </div>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            {t("confirmDelete")}
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            {t("deleteWarn")}
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>{t("cancel")}</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(index)}
                          >
                            {t("confirm")}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <Empty tip="" />
        )}
      </div>
    </div>
  );
};

export default FolderList;
