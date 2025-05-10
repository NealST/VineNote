// tag action for the file
import type { ITagItem } from "@/components/navigation-bar/types";
import type { IArticleItem } from "@/components/notes-list/types";
import { produce } from "immer";
import {
  writeTextFile,
} from "@tauri-apps/plugin-fs";

export const addTagForFile = async function (
  dataSource: ITagItem[],
  tagFilePath: string,
  tagItem: ITagItem,
  targetFile: IArticleItem
) {
  const newTagItem = produce(tagItem, (draft) => {
    draft.files.push(targetFile);
  });
  const newDataSource = produce(dataSource, draft => {
    const tagIndex = draft.findIndex((item) => item.name === tagItem.name);
    // if the tag does not exist
    if (tagIndex < 0) {
      draft.push(newTagItem);
    } else {
      draft[tagIndex] = newTagItem;
    }
  });
  await writeTextFile(tagFilePath, JSON.stringify(newDataSource));
  return newDataSource;
};

export const deleteTagForFile = async function (
  dataSource: ITagItem[],
  tagFilePath: string,
  tagItem: ITagItem,
  targetFile: IArticleItem
) {
  const newTagItem = produce(tagItem, (draft) => {
    const fileIndex = draft.files.findIndex(
      (item) => item.path === targetFile.path
    );
    if (fileIndex >= 0) {
      draft.files.splice(fileIndex, 1);
    }
  });
  const tagIndex = dataSource.findIndex((item) => item.name === tagItem.name);
  const newDataSource = produce(dataSource, (draft) => {
    draft[tagIndex] = newTagItem;
  });
  await writeTextFile(tagFilePath, JSON.stringify(newDataSource));
  return newDataSource;
};
