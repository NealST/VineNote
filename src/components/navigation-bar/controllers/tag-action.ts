import {
  writeTextFile,
  readTextFile,
  exists,
  create,
} from "@tauri-apps/plugin-fs";
import getNavPath from "@/utils/get-nav-path";
import { uid } from "uid";
import { produce } from "immer";
import type { ITagItem } from "../types";

export const createTagFile = async function (filePath: string) {
  const file = await create(filePath);
  await file.write(new TextEncoder().encode("[]"));
  await file.close();
};

export const getTagFilePath = async function() {
  const tagsDirPath = await getNavPath("tags");
  const tagsFilePath = `${tagsDirPath}/list.json`;
  return tagsFilePath;
}

export const getTagList = async function () {
  const tagsFilePath = await getTagFilePath();
  const isFileExists = await exists(tagsFilePath);
  if (!isFileExists) {
    await createTagFile(tagsFilePath);
    return {
      filePath: tagsFilePath,
      dataSource: [] as ITagItem[],
    };
  }
  const tagsContentJson = await readTextFile(tagsFilePath);
  const tagsContent = JSON.parse(tagsContentJson);
  return {
    filePath: tagsFilePath,
    dataSource: tagsContent as ITagItem[],
  };
};

export const createTag = async function (filePath: string, tagName: string) {
  const tagsContentJson = await readTextFile(filePath);
  const tagsContent = JSON.parse(tagsContentJson);
  const newTagItem = {
    id: uid(),
    name: tagName,
    files: [],
  };
  if (tagsContent.length === 0) {
    await writeTextFile(filePath, JSON.stringify([newTagItem]));
  } else {
    await writeTextFile(
      filePath,
      JSON.stringify(tagsContent.concat(newTagItem))
    );
  }
  return newTagItem;
};

export const deleteTag = async function (filePath: string, tagName: string) {
  const tagsContentJson = await readTextFile(filePath);
  const tagsContent = JSON.parse(tagsContentJson);
  const deleteIndex = tagsContent.findIndex(
    (item: ITagItem) => item.name === tagName
  );
  tagsContent.splice(deleteIndex, 1);
  await writeTextFile(filePath, JSON.stringify(tagsContent));
};

export const renameTag = async function (
  filePath: string,
  oldName: string,
  newName: string
) {
  const tagsContentJson = await readTextFile(filePath);
  const tagsContent = JSON.parse(tagsContentJson);
  const renameIndex = tagsContent.findIndex(
    (item: ITagItem) => item.name === oldName
  );
  const newTagsContent = produce(tagsContent, (draft: ITagItem[]) => {
    draft[renameIndex].name = newName;
  });
  await writeTextFile(filePath, JSON.stringify(newTagsContent));
};
