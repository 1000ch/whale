import {resolve} from 'path';
import {readFileSync} from 'fs';
import {app, shell, BrowserWindow, Menu} from 'electron';
import electronDl from 'electron-dl';
import electronContextMenu from 'electron-context-menu';
import appMenu from './menu';
import store from './store';
import tray from './tray';
import update from './update';

electronDl();
electronContextMenu();

let mainWindow: BrowserWindow = null;
let isQuitting = false;

const cssPath = resolve(__dirname, '../browser.css');
const browserCSS = readFileSync(cssPath, 'utf8');

app.on('second-instance', () => {
  if (mainWindow?.isMinimized()) {
    mainWindow.restore();
  }

  mainWindow.show();
});

if (!app.requestSingleInstanceLock()) {
  app.quit();
}

function createMainWindow() {
  const lastWindowState = store.get('lastWindowState');
  const maxWindowInteger = 2147483647;

  const window = new BrowserWindow({
    title: app.getName(),
    show: false,
    x: lastWindowState.x,
    y: lastWindowState.y,
    width: lastWindowState.width,
    height: lastWindowState.height,
    icon: process.platform === 'linux' && resolve(__dirname, '../static/Icon.png'),
    minWidth: 480,
    minHeight: 480,
    titleBarStyle: 'hiddenInset',
    autoHideMenuBar: true,
    backgroundColor: '#fff',
    webPreferences: {
      preload: resolve(__dirname, '../browser.js'),
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
    store.set('lastURL', url);
  });

  const lastURL = store.get('lastURL');
  await mainWindow.loadURL(lastURL);

  update.init();
  update.checkUpdate();
});

app.on('activate', () => {
  mainWindow.show();
});

app.on('before-quit', () => {
  isQuitting = true;

  if (!mainWindow?.isFullScreen()) {
    store.set('lastWindowState', mainWindow?.getBounds());
  }
});
