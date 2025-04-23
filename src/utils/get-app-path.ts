// get the path for application
import * as path from '@tauri-apps/api/path';
import ensureDir from './ensure-dir';
import { APP_PATH } from '@/constants';

const getAppPath = async function() {
  const home = await path.homeDir();
  const appPath = await path.join(home, APP_PATH);
  await ensureDir(appPath);
  return appPath;
};

export default getAppPath;
