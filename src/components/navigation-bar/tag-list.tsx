"use client";

import { useEffect, useState, useRef, ChangeEvent } from "react";
import {
  createTag,
  renameTag,
  deleteTag,
  getTagList
} from "./controllers/tag-action";
import {
  useSelectedTag,
} from "./controllers/selected-tag";
import { useTagDataSource } from './controllers/tag-datasource';
import { useTranslation } from "react-i18next";
import { Hash, BookmarkPlus, FolderPen, Trash2 } from "lucide-react";
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
import { uid } from 'uid';
import type { ITagItem } from "./types";
import styles from "./index.module.css";

const TagList = function () {
  const { dataSource, setDataSource } = useTagDataSource();
  const { tag: selectedTag, setTag: setSelectedTag } =
    useSelectedTag();
  const inputValueRef = useRef("");
  const inputRef = useRef<HTMLInputElement>(null);
  const tagFilePathRef = useRef('');
  const renameOriginRef = useRef("");
  const { t } = useTranslation();

  const handleAddTag = function () {
    const newDataSource = ([
      {
        id: uid(),
        type: "input",
        name: "",
        files: []
      },
    ] as ITagItem[]).concat(dataSource);
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

  const handleSelect = function (tag: ITagItem) {
    if (tag.type === "input") {
      return;
    }
    setSelectedTag(tag);
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
      createTag(tagFilePathRef.current, inputValue)
        .then(() => {
          setDataSource(produce(dataSource, draft => {
            draft[0].name = inputValue;
            draft[0].type = '';
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
          draft[index].type = '';
        })
      );
      return;
    }
    renameTag(tagFilePathRef.current, renameOrigin, inputValue).then(() => {
      setDataSource(
        produce(dataSource, (draft) => {
          draft[index].name = inputValue;
          draft[index].type = '';
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
    deleteTag(tagFilePathRef.current, dataSource[index].name).then(() => {
      setDataSource(produce(dataSource, draft => {
        draft.splice(index, 1);
      }))
    });
  };

  useEffect(() => {
    getTagList().then((ret) => {
      console.log("tags ret", ret);
      const { filePath, dataSource } = ret;
      tagFilePathRef.current = filePath;
      setDataSource(dataSource);
      if (dataSource.length > 0) {
        setSelectedTag(dataSource[0]);
      }
    });
  }, []);

  return (
    <div className={styles.data_list}>
      <div className={styles.list_header}>
        <span className={cn(styles.header_label, "text-muted-foreground")}>
          {t("allTags")}
        </span>
        <BookmarkPlus
          className="cursor-pointer text-foreground"
          size={16}
          onClick={handleAddTag}
        />
      </div>
      <div className={styles.list_display}>
        {dataSource.length > 0 ? (
          dataSource.map((item, index) => {
            const { name, type, id } = item;
            const isSelected = id === selectedTag.id;
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
                      <Hash
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

export default TagList;
