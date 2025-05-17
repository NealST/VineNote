import { mkdir, rename, remove } from '@tauri-apps/plugin-fs';
import getNavPath from '@/utils/get-nav-path';

export const createFolder = async function(name: string) {
  const notesPath = await getNavPath('notes');
  const folderPath = `${notesPath}/${name}`;
  await mkdir(folderPath);
  return folderPath;
}

export const renameFolder = async function(oldName: string, newName: string) {
  const notesPath = await getNavPath('notes');
  const oldPath = `${notesPath}/${oldName}`;
  const newPath = `${notesPath}/${newName}`;
  await rename(oldPath, newPath);
  return newPath;
}

export const deleteFolder = async function(path: string) {
  await remove(path, {
    recursive: true
  });
}
