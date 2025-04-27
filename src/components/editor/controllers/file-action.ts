import { writeTextFile, readTextFile } from '@tauri-apps/plugin-fs';

export const writeToFile = async function(content: Object, filePath: string) {
  const contentStr = JSON.stringify(content);
  await writeTextFile(filePath, contentStr)
};

export const readFile = async function(filePath: string) {
  let result = '[]';
  try {
    result = await readTextFile(filePath);
  } catch(e) {
    console.log('read error', e);
  }
  return result;
};