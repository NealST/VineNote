import { mkdir, exists } from "@tauri-apps/plugin-fs";

const ensureDir = async function (path: string) {
  const isPathExist = await exists(path);
  if (!isPathExist) {
    await mkdir(path);
  }
  return path;
};

export default ensureDir;
