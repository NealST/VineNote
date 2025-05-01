import { LazyStore } from '@tauri-apps/plugin-store';

const store = new LazyStore('vinenote-settings.json');

const CONFIG_KEY = 'vinenote-config';

export const setConfig = async function(value: string) {
  await store.set(CONFIG_KEY, {value});
  await store.save();
};

export const getConfig = async function() {
  const configInfo: {value: string} | undefined = await store.get(CONFIG_KEY);
  const configValue = configInfo?.value;
  return configValue ? JSON.parse(configValue) : {};
};
