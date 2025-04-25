// get folder list in notes
import getAppPath from "@/utils/get-app-path";
import ensureDir from "@/utils/ensure-dir";
import { readDir } from "@tauri-apps/plugin-fs";

const getFolderList = async function() {
  try {
    const appPath = await getAppPath();
    const notesPath = `${appPath}/notes`;
    await ensureDir(notesPath);
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
