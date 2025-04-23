import getAppPath from "./get-app-path";
import ensureDir from "./ensure-dir";
import { NavTypes } from '@/constants';

let retMap: Map<NavTypes, string> = new Map();

const getNavPath = async function (navName: NavTypes) {
  const result = retMap.get(navName);
  if (result) {
    return result;
  }
  const appPath = await getAppPath();
  const navPath = `${appPath}/${navName}`;
  await ensureDir(navPath);
  retMap.set(navName, navPath);
  return navPath;
};

export default getNavPath;
