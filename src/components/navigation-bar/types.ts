import type { IArticleItem } from "@/components/notes-list/types";

export interface IFolderItem {
  // cate type,maybe input or cate
  type: string;
  // cate name
  name: string;
  // folder path
  path: string;
}

export interface ITagItem {
  id: string;
  name: string;
  type?: string;
  files: IArticleItem[];
}

export interface IEnclosure {
  url: string;
}
