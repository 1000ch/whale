import {readFileSync} from 'node:fs';
import {resolve, dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import process from 'node:process';
import {
  app,
  shell,
  BrowserWindow,
  Menu,
} from 'electron';
import electronDl from 'electron-dl';
import electronContextMenu from 'electron-context-menu';
import appMenu from './menu.js';
import store from './store.js';
import tray from './tray.js';
import * as update from './update.js';

electronDl();
electronContextMenu();

const __dirname = dirname(fileURLToPath(import.meta.url));

let mainWindow: BrowserWindow | undefined;
let isQuitting = false;

const cssPath = resolve(__dirname, '../browser.css');
const browserCss = readFileSync(cssPath, 'utf8');

app.on('second-instance', () => {
  if (mainWindow?.isMinimized()) {
    mainWindow.restore();
  }

  mainWindow?.show();
});

if (!app.requestSingleInstanceLock()) {
  app.quit();
}

function createMainWindow() {
  const lastWindowState = store.get('lastWindowState');
  const maxWindowInteger = 2_147_483_647;

  const window = new BrowserWindow({
    title: app.getName(),
    show: false,
    x: lastWindowState.x,
    y: lastWindowState.y,
    width: lastWindowState.width,
    height: lastWindowState.height,
    icon: process.platform === 'linux' ? resolve(__dirname, '../static/Icon.png') : undefined,
    minWidth: 480,
    minHeight: 480,
    titleBarStyle: 'hiddenInset',
    autoHideMenuBar: true,
    backgroundColor: '#fff',
    webPreferences: {
      nodeIntegration: false,
    },
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

  window.webContents.setWindowOpenHandler(details => {
    void shell.openExternal(details.url);
    return {action: 'deny'};
  });

  return window;
}

app.on('ready', async () => {
  if (process.platform === 'darwin') {
    app.dock?.setIcon(resolve(__dirname, '../static/Icon.png'));
  }

  Menu.setApplicationMenu(appMenu);
  mainWindow = createMainWindow();
  tray.create(mainWindow);

  mainWindow.webContents.on('dom-ready', async () => {
    await mainWindow!.webContents.insertCSS(browserCss);
    mainWindow!.show();
  });

  mainWindow.webContents.on('did-navigate-in-page', (event, url) => {
    store.set('lastURL', url);
  });

  const lastUrl = store.get('lastUrl');
  await mainWindow.loadURL(lastUrl);

  update.init();
  await update.checkUpdate();
});

app.on('activate', () => {
  mainWindow?.show();
});

app.on('before-quit', () => {
  isQuitting = true;

  if (!mainWindow?.isFullScreen()) {
    store.set('lastWindowState', mainWindow?.getBounds());
  }
});
