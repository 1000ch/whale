import path from 'path';
import fs from 'fs';
import {app, shell, BrowserWindow, Menu} from 'electron';
import electronDebug from 'electron-debug';
import electronDl from 'electron-dl';
import electronContextMenu from 'electron-context-menu';
import appMenu from './menu';
import tray from './tray';
import config from './config';
import update from './update';

electronDebug({isEnabled: true});
electronDl();
electronContextMenu();

let mainWindow: BrowserWindow = null;
let isQuitting = false;

const cssPath = path.resolve(__dirname, '../browser.css');
const browserCSS = fs.readFileSync(cssPath, 'utf8');

app.on('second-instance', () => {
  if (mainWindow?.isMinimized()) {
    mainWindow?.restore();
  }

  mainWindow?.show();
});

if (!app.requestSingleInstanceLock()) {
  app.quit();
}

function createMainWindow() {
  const lastWindowState = config.get('lastWindowState');
  const maxWindowInteger = 2147483647;

  const window = new BrowserWindow({
    title: app.getName(),
    show: false,
    x: lastWindowState.x,
    y: lastWindowState.y,
    width: lastWindowState.width,
    height: lastWindowState.height,
    icon: process.platform === 'linux' && path.resolve(__dirname, '../static/Icon.png'),
    minWidth: 480,
    minHeight: 480,
    titleBarStyle: 'hiddenInset',
    autoHideMenuBar: true,
    backgroundColor: '#fff',
    webPreferences: {
      preload: path.resolve(__dirname, '../browser.js'),
      nodeIntegration: false,
      plugins: true
    }
  });

  if (process.platform === 'darwin') {
    window.setSheetOffset(40);
  }

  window.on('close', event => {
    if (!isQuitting) {
      event.preventDefault();

      if (process.platform === 'darwin') {
        app.hide();
      } else {
        window.hide();
      }
    }
  });

  window.on('page-title-updated', event => {
    event.preventDefault();
  });

  window.on('enter-full-screen', () => {
    window.setMaximumSize(maxWindowInteger, maxWindowInteger);
  });

  return window;
}

app.on('ready', async () => {
  Menu.setApplicationMenu(appMenu);
  mainWindow = createMainWindow();
  tray.create(mainWindow);

  mainWindow.webContents.on('dom-ready', async () => {
    await mainWindow.webContents.insertCSS(browserCSS);
    mainWindow.show();
  });

  mainWindow.webContents.on('new-window', async (event, url) => {
    event.preventDefault();
    await shell.openExternal(url);
  });

  mainWindow.webContents.on('did-navigate-in-page', (event, url) => {
    config.set('lastURL', url);
  });

  const lastURL = config.get('lastURL');
  await mainWindow.loadURL(lastURL);

  update.init();
  update.checkUpdate();
});

app.on('activate', () => {
  mainWindow?.show();
});

app.on('before-quit', () => {
  isQuitting = true;

  if (!mainWindow?.isFullScreen()) {
    config.set('lastWindowState', mainWindow?.getBounds());
  }
});
