import os from 'os';
import {app, shell, dialog, BrowserWindow, Menu, MenuItemConstructorOptions} from 'electron';

const appName = app.getName();

const helpSubmenu: MenuItemConstructorOptions[] = [{
  label: `${appName} Website`,
  async click() {
    await shell.openExternal('https://github.com/1000ch/whale');
  }
}, {
  label: 'Report an Issue...',
  async click() {
    const body = `
<!-- Please succinctly describe your issue and steps to reproduce it. -->
-
${app.getName()} ${app.getVersion()}
Electron ${process.versions.electron}
${process.platform} ${process.arch} ${os.release()}`;

    await shell.openExternal(`https://github.com/1000ch/whale/issues/new?body=${encodeURIComponent(body)}`);
  }
}];

if (process.platform !== 'darwin') {
  helpSubmenu.push({
    role: 'about',
    async click() {
      await dialog.showMessageBox({
        title: `About ${appName}`,
        message: `${appName} ${app.getVersion()}`,
        detail: 'Created by Shogo Sensui',
        buttons: []
      });
    }
  });
}

const darwinTemplate: MenuItemConstructorOptions[] = [{
  label: appName,
  submenu: [{
    role: 'about'
  }, {
    type: 'separator'
  }, {
    role: 'services',
    submenu: []
  }, {
    type: 'separator'
  }, {
    role: 'hide'
  }, {
    role: 'unhide'
  }, {
    type: 'separator'
  }, {
    role: 'quit'
  }]
}, {
  label: 'Edit',
  submenu: [{
    role: 'undo'
  }, {
    role: 'redo'
  }, {
    type: 'separator'
  }, {
    role: 'cut'
  }, {
    role: 'copy'
  }, {
    role: 'paste'
  }, {
    role: 'delete'
  }]
}, {
  label: 'View',
  submenu: [{
    label: 'Reload',
    accelerator: 'CmdOrCtrl+R',
    click: (item, focusedWindow) => {
      if (focusedWindow) {
        focusedWindow.reload();
      }
    }
  }]
}, {
  role: 'window',
  submenu: [{
    role: 'minimize'
  }, {
    role: 'close'
  }, {
    type: 'separator'
  }, {
    type: 'separator'
  }, {
    role: 'front'
  }, {
    role: 'togglefullscreen'
  }]
}, {
  role: 'help',
  submenu: helpSubmenu
}];

const otherTemplate: MenuItemConstructorOptions[] = [{
  label: 'File',
  submenu: [{
    role: 'quit'
  }]
}, {
  label: 'Edit',
  submenu: [{
    role: 'undo'
  }, {
    role: 'redo'
  }, {
    type: 'separator'
  }, {
    role: 'cut'
  }, {
    role: 'copy'
  }, {
    role: 'paste'
  }, {
    role: 'delete'
  }, {
    type: 'separator'
  }]
}, {
  label: 'View',
  submenu: [{
    label: 'Reload',
    accelerator: 'CmdOrCtrl+R',
    click: (item, focusedWindow) => {
      if (focusedWindow) {
        focusedWindow.reload();
      }
    }
  }]
}, {
  role: 'help',
  submenu: helpSubmenu
}];

const template = process.platform === 'darwin' ? darwinTemplate : otherTemplate;

export default Menu.buildFromTemplate(template);
