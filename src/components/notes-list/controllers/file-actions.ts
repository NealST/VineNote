import { rename, remove, create } from "@tauri-apps/plugin-fs";
import { invoke } from "@tauri-apps/api/core";
import type { IFolderItem } from "@/components/side-bar/types";

export const createFile = async function (
  selectedFolder: IFolderItem,
  name: string
) {
  const filePath = `${selectedFolder.path}/${name}.json`;
  const file = await create(filePath);
  await file.write(new TextEncoder().encode(""));
  await file.close();
  return filePath;
};

export const renameFile = async function (oldPath: string, newPath: string) {
  await rename(oldPath, newPath);
};

export const deleteFile = async function (path: string) {
  await remove(path, {
    recursive: true,
  });
};

export const getFiles = async function (folderPath: string): Promise<string> {
  try {
    const result: string = await invoke("get_dir_info", { path: folderPath });
    return result;
  } catch (e) {
    console.error(e);
    return "";
  }
};
