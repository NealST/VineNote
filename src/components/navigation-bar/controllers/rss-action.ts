import {
  writeTextFile,
  readTextFile,
  exists,
  create,
} from "@tauri-apps/plugin-fs";
import getNavPath from "@/utils/get-nav-path";
import { produce } from "immer";
import { invoke } from "@tauri-apps/api/core";
import type { IRssItem } from "../types";

export const getRssInfo = async function(rssUrl: string) {
  const rssChannel: IRssItem = await invoke('get_rss', { url: rssUrl });
  console.log('rssChannel', rssChannel);
  return rssChannel;
};

export const createRssFile = async function (filePath: string) {
  const file = await create(filePath);
  await file.write(new TextEncoder().encode("[]"));
  await file.close();
};

export const getRssList = async function () {
  const rssDirPath = await getNavPath("rss");
  const rssFilePath = `${rssDirPath}/list.json`;
  const isFileExists = await exists(rssFilePath);
  if (!isFileExists) {
    await createRssFile(rssFilePath);
    return {
      filePath: rssFilePath,
      dataSource: [],
    };
  }
  const rssContentJson = await readTextFile(rssFilePath);
  const rssContent = JSON.parse(rssContentJson);
  return {
    filePath: rssFilePath,
    dataSource: rssContent,
  };
};

export const createRss = async function (filePath: string, rssUrl: string) {
  const rssContentJson = await readTextFile(filePath);
  const rssContent = JSON.parse(rssContentJson);
  const newRssItem = {
    title: '',
    link: rssUrl,
    description: ''
  };
  if (rssContent.length === 0) {
    await writeTextFile(filePath, JSON.stringify([newRssItem]));
  } else {
    await writeTextFile(
      filePath,
      JSON.stringify(rssContent.concat(newRssItem))
    );
  }
  return newRssItem;
};

export const deleteRss = async function (filePath: string, rssUrl: string) {
  const rssContentJson = await readTextFile(filePath);
  const rssContent = JSON.parse(rssContentJson);
  const deleteIndex = rssContent.findIndex(
    (item: IRssItem) => item.link === rssUrl
  );
  rssContent.splice(deleteIndex, 1);
  await writeTextFile(filePath, JSON.stringify(rssContent));
};

export const renameRss = async function (
  filePath: string,
  oldLink: string,
  newLink: string
) {
  const rssContentJson = await readTextFile(filePath);
  const rssContent = JSON.parse(rssContentJson);
  const renameIndex = rssContent.findIndex(
    (item: IRssItem) => item.link === oldLink
  );
  const newRssContent = produce(rssContent, (draft: IRssItem[]) => {
    draft[renameIndex].link = newLink
  });
  await writeTextFile(filePath, JSON.stringify(newRssContent));
};
