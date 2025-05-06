import { contextBridge, ipcRenderer } from 'electron/renderer';

contextBridge.exposeInMainWorld('electronAPI', {
  requestRss: (rssUrl) => ipcRenderer.invoke('request-rss', rssUrl)
})
