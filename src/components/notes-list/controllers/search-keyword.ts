import { invoke } from "@tauri-apps/api/core";

export interface ISearchResult {
  file_path: string;
  matches: {
    text: string;
    node: {
      type: string;
      id: string;
      children: Array<{ text: string }>;
    };
  }[];
}

export async function searchFilesForKeyword(dirPath: string, keyword: string) {
  try {
    const results = await invoke<ISearchResult[]>("search_content", {
      dirPath,
      keyword,
    });
    return results;
  } catch (error) {
    console.error("Search failed:", error);
    throw error;
  }
}
