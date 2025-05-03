// get folder list in notes
import getNavPath from "@/utils/get-nav-path";
import { readDir } from "@tauri-apps/plugin-fs";

const getFolderList = async function() {
  try {
    const notesPath = await getNavPath('notes');
    const entries = await readDir(notesPath);
    if (entries.length > 0) {
      return entries.map(item => {
        return {
          ...item,
          path: `${notesPath}/${item.name}`
        }
      });
    }
    return entries;
  } catch (e) {
    return [];
  }
};

export default getFolderList;
