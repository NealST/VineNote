import { app, BrowserWindow } from 'electron';

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600
  });

  win.loadURL("http://localhost:1420")
};

app.whenReady().then(() => {
  createWindow();
})

