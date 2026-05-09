import {
  app,
  shell,
  dialog,
  Menu,
  BrowserWindow,
  type MenuItemConstructorOptions,
} from 'electron';
import os from 'node:os';
import process from 'node:process';
import store from './store.js';

const appName = app.getName();

const historySubmenu: MenuItemConstructorOptions[] = [{
  label: 'Home',
  accelerator: 'CommandOrControl+Shift+H',
  click(item, focusedWindow) {
    if (focusedWindow instanceof BrowserWindow) {
      void focusedWindow.loadURL(store.get('baseUrl'));
    }
  },
}, {
  label: 'Back',
  accelerator: 'CommandOrControl+[',
  click(item, focusedWindow) {
    if (focusedWindow instanceof BrowserWindow) {
      focusedWindow.webContents.navigationHistory.goBack();
    }
  },
}, {
  label: 'Forward',
  accelerator: 'CommandOrControl+]',
  click(item, focusedWindow) {
    if (focusedWindow instanceof BrowserWindow) {
      focusedWindow.webContents.navigationHistory.goForward();
    }
  },
}];

const helpSubmenu: MenuItemConstructorOptions[] = [{
  label: `${appName} Website`,
  click() {
    void shell.openExternal('https://github.com/1000ch/whale');
  },
}, {
  label: 'Report an Issue...',
  click() {
    const body = `
<!-- Please succinctly describe your issue and steps to reproduce it. -->
-
${app.getName()} ${app.getVersion()}
Electron ${process.versions.electron}
${process.platform} ${process.arch} ${os.release()}`;

    void shell.openExternal(`https://github.com/1000ch/whale/issues/new?body=${encodeURIComponent(body)}`);
  },
}, {
  type: 'separator',
}, {
  role: 'toggleDevTools',
}];

if (process.platform !== 'darwin') {
  helpSubmenu.push({
    role: 'about',
    click() {
      void dialog.showMessageBox({
        title: `About ${appName}`,
        message: `${appName} ${app.getVersion()}`,
        detail: 'Created by Shogo Sensui',
        buttons: [],
      });
    },
  });
}

const darwinTemplate: MenuItemConstructorOptions[] = [{
  label: appName,
  submenu: [{
    role: 'about',
  }, {
    type: 'separator',
  }, {
    role: 'services',
    submenu: [],
  }, {
    type: 'separator',
  }, {
    role: 'hide',
  }, {
    role: 'unhide',
  }, {
    type: 'separator',
  }, {
    role: 'quit',
  }],
}, {
  label: 'Edit',
  submenu: [{
    role: 'undo',
  }, {
    role: 'redo',
  }, {
    type: 'separator',
  }, {
    role: 'cut',
  }, {
    role: 'copy',
  }, {
    role: 'paste',
  }, {
    role: 'delete',
  }],
}, {
  label: 'View',
  submenu: [{
    label: 'Reload',
    accelerator: 'CommandOrControl+R',
    click(item, focusedWindow) {
      if (focusedWindow instanceof BrowserWindow) {
        focusedWindow.reload();
      }
    },
  }, {
    type: 'separator',
  }, {
    role: 'togglefullscreen',
  }, {
    role: 'resetZoom',
  }, {
    role: 'zoomIn',
  }, {
    role: 'zoomOut',
  }],
}, {
  label: 'History',
  submenu: historySubmenu,
}, {
  role: 'window',
  submenu: [{
    role: 'minimize',
  }, {
    role: 'close',
  }, {
    type: 'separator',
  }, {
    type: 'separator',
  }, {
    role: 'front',
  }, {
    role: 'togglefullscreen',
  }],
}, {
  role: 'help',
  submenu: helpSubmenu,
}];

const otherTemplate: MenuItemConstructorOptions[] = [{
  label: 'File',
  submenu: [{
    role: 'quit',
  }],
}, {
  label: 'Edit',
  submenu: [{
    role: 'undo',
  }, {
    role: 'redo',
  }, {
    type: 'separator',
  }, {
    role: 'cut',
  }, {
    role: 'copy',
  }, {
    role: 'paste',
  }, {
    role: 'delete',
  }, {
    type: 'separator',
  }],
}, {
  label: 'View',
  submenu: [{
    label: 'Reload',
    accelerator: 'CommandOrControl+R',
    click(item, focusedWindow) {
      if (focusedWindow instanceof BrowserWindow) {
        focusedWindow.reload();
      }
    },
  }, {
    type: 'separator',
  }, {
    role: 'togglefullscreen',
  }, {
    role: 'resetZoom',
  }, {
    role: 'zoomIn',
  }, {
    role: 'zoomOut',
  }],
}, {
  label: 'History',
  submenu: historySubmenu,
}, {
  role: 'help',
  submenu: helpSubmenu,
}];

const template = process.platform === 'darwin' ? darwinTemplate : otherTemplate;

export default Menu.buildFromTemplate(template);
