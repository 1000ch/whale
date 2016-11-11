'use strict';
const os = require('os');
const path = require('path');
const electron = require('electron');

const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const shell = electron.shell;
const appName = app.getName();

function sendAction(action) {
    const win = BrowserWindow.getAllWindows()[0];

    if (process.platform === 'darwin') {
        win.restore();
    }

    win.webContents.send(action);
}

const viewSubmenu = [
    {
        label: 'Reset Text Size',
        accelerator: 'CmdOrCtrl+0',
        click() {
            sendAction('zoom-reset');
        }
    },
    {
        label: 'Increase Text Size',
        accelerator: 'CmdOrCtrl+Plus',
        click() {
            sendAction('zoom-in');
        }
    },
    {
        label: 'Decrease Text Size',
        accelerator: 'CmdOrCtrl+-',
        click() {
            sendAction('zoom-out');
        }
    }
];

const helpSubmenu = [
    {
        label: `${appName} Website`,
        click() {
            shell.openExternal('https://github.com/1000ch/trello-app');
        }
    },
    {
        label: 'Report an Issue...',
        click() {
            const body = `
<!-- Please succinctly describe your issue and steps to reproduce it. -->
-
${app.getName()} ${app.getVersion()}
Electron ${process.versions.electron}
${process.platform} ${process.arch} ${os.release()}`;

            shell.openExternal(`https://github.com/1000ch/trello-app/issues/new?body=${encodeURIComponent(body)}`);
        }
    }
];

if (process.platform !== 'darwin') {
    helpSubmenu.push({
        type: 'separator'
    }, {
        role: 'about',
        click() {
            electron.dialog.showMessageBox({
                title: `About ${appName}`,
                message: `${appName} ${app.getVersion()}`,
                detail: 'Created by Shogo Sensui',
                icon: path.join(__dirname, 'static/Icon.png'),
                buttons: []
            });
        }
    });
}

const darwinTpl = [{
  label: appName,
  submenu: [{
    role: 'about'
  }, {
    type: 'separator'
  }, {
    label: 'Log Out',
    click() {
      sendAction('log-out');
    }
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
    role: 'hideothers'
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
    role: 'pasteandmatchstyle'
  }, {
    role: 'delete'
  }, {
    role: 'selectall'
  }]
}, {
  label: 'View',
  submenu: viewSubmenu
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

const otherTpl = [{
  label: 'File',
  submenu: [{
    label: 'Log Out',
    click() {
      sendAction('log-out');
    }
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
      role: 'pasteandmatchstyle'
  }, {
      role: 'delete'
  }, {
      type: 'separator'
  }, {
      role: 'selectall'
  }]
}, {
  label: 'View',
  submenu: viewSubmenu
}, {
  role: 'help',
  submenu: helpSubmenu
}];

const tpl = process.platform === 'darwin' ? darwinTpl : otherTpl;

module.exports = electron.Menu.buildFromTemplate(tpl);
