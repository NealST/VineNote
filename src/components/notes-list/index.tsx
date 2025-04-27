import { useState, useRef, useEffect, ChangeEvent } from "react";
import { FilePlus, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import Empty from "./empty";
import { useTranslation } from "react-i18next";
import { useSelectedFolder } from "../side-bar/controllers/selected-folder";
import { uid } from "uid";
import { createTimeStamp } from "./controllers/create-time-format";
import {
  renameFile,
  deleteFile,
  createFile,
  getFiles,
} from "./controllers/file-actions";
import { useSelectedFile } from "./controllers/selected-file";
import { produce } from "immer";
import { cn } from "@/lib/utils";
import type { IArticleItem } from "./types";
import styles from "./index.module.css";

const NotesList = function () {
  const [dataSource, setDataSource] = useState<IArticleItem[]>([]);
  const { selectedFile, setSelectedFile } = useSelectedFile();
  const selectedFolder = useSelectedFolder((state) => state.folder);
  const inputRef = useRef("");
  const { t } = useTranslation();

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

  useEffect(() => {
    if (!selectedFolder?.path) {
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

  return (
    <div className={styles.notes_list}>
      <div className={styles.list_header}>
        <span className={styles.header_label}>
          {selectedFolder?.name || t("allNotes")}
        </span>
        <FilePlus
          className="cursor-pointer text-foreground"
          size={16}
          onClick={handleAddFile}
        />
      </div>
      <Separator />
      <div className={styles.list_search}>
        <Search size={14} />
        <Input
          className="border-0 outline-0 focus-visible:border-0"
          type="text"
          placeholder={t("searchNotes")}
        />
      </div>
      <Separator />
      <div className={styles.list_display}>
        {dataSource.length > 0 ? (
          dataSource.map((item, index) => {
            const { id, name, action, metadata } = item;
            const isSelected = id === selectedFile.id;
            return (
              <div
                className={cn(styles.file_item, "hover:bg-card rounded-md cursor-pointer", isSelected ? 'bg-card' : '')}
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
                  <div className={cn(styles.item_name, "text-card-foreground text-sm")}>
                    {name}
                  </div>
                )}
                <div
                  className={cn(
                    styles.item_time,
                    "text-muted-foreground text-sm"
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
