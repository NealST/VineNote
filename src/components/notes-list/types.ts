export type FileType = "group" | "file";

export interface IMetadata {
  is_file: boolean;
  is_dir: boolean;
  len?: number;
  created: string;
  modified?: string;
}

export interface IArticleItem {
  id: string;
  name: string;
  path: string;
  metadata: IMetadata;
  action?: string;
}
