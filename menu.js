'use strict';
const os = require('os');
const path = require('path');
const electron = require('electron');

const app = electron.app;
const shell = electron.shell;
const appName = app.getName();
const BrowserWindow = electron.BrowserWindow;

function activate(command) {
  const appWindow = BrowserWindow.getAllWindows()[0];
  // Extra measure in order to be shown
  appWindow.show();
  appWindow.webContents.send(command);
}

const helpSubmenu = [{
  label: `${appName} Website`,
  click() {
    shell.openExternal('https://github.com/1000ch/whale');
  }
}, {
  label: 'Report an Issue...',
  click() {
    const body = `
<!-- Please succinctly describe your issue and steps to reproduce it. -->
-
${app.getName()} ${app.getVersion()}
Electron ${process.versions.electron}
${process.platform} ${process.arch} ${os.release()}`;

    shell.openExternal(`https://github.com/1000ch/whale/issues/new?body=${encodeURIComponent(body)}`);
  }
}];

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
  label: 'File',
  submenu: [{
    label: 'Profile',
    accelerator: 'CmdorCtrl+P',
    click() {
      activate('toggle-profile');
    }
  }, {
    label: 'Notifications',
    accelerator: 'CmdorCtrl+N',
    click() {
      activate('toggle-notifications');
    }
  }, {
    label: 'Subscribed Cards',
    accelerator: 'CmdorCtrl+Shift+S',
    click() {
      activate('toggle-cards');
    }
  }, {
    type: 'separator'
  }, {
    label: 'Search',
    accelerator: 'CmdorCtrl+F',
    click() {
      activate('search');
    }
  }, {
    type: 'separator'
  }, {
    label: 'Settings',
    accelerator: 'CmdorCtrl+,',
    click() {
      activate('settings');
    }
  }, {
    label: 'Return Home',
    accelerator: 'CmdorCtrl+H',
    click() {
      activate('return-home');
    }
  }, {
    label: 'Change language',
    accelerator: 'CmdorCtrl+Shift+L',
    click() {
      activate('change-language');
    }
  }, {
    type: 'separator'
  }, {
    label: 'Log Out',
    accelerator: 'CmdorCtrl+Shift+Q',
    click() {
      activate('log-out');
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
    role: 'selectall'
  }]
}, {
  label: 'Boards',
  submenu: [{
    label: 'Board Actions',
    submenu: [{
      label: 'Star Board',
      accelerator: 'CmdorCtrl+S',
      click() {
        activate('star-board');
      }
    }, {
      label: 'Copy Board',
      accelerator: 'CmdorCtrl+Shift+C',
      click() {
        activate('copy-board');
      }
    }, {
      label: 'Create Board',
      accelerator: 'CmdorCtrl+B',
      click() {
        activate('create-board');
      }
    }, {
      label: 'Rename Board',
      accelerator: 'CmdorCtrl+E',
      click() {
        activate('rename-board');
      }
    }, {
      type: 'separator'
    }, {
      label: 'Info',
      accelerator: 'CmdorCtrl+I',
      click() {
        activate('toggle-info');
      }
    }, {
      label: 'Labels',
      accelerator: 'CmdorCtrl+L',
      click() {
        activate('board-labels');
      }
    }, {
      label: 'Archive',
      accelerator: 'CmdorCtrl+Shift+E',
      click() {
        activate('board-archive');
      }
    }, {
      label: 'Subscribe',
      accelerator: 'CmdorCtrl+U',
      click() {
        activate('board-subsribe');
      }
    }, {
      type: 'separator'
    }, {
      label: 'Stickers',
      accelerator: 'CmdorCtrl+K',
      click() {
        activate('toggle-stickers');
      }
    }, {
      label: 'Power-Ups',
      accelerator: 'CmdorCtrl+O',
      click() {
        activate('toggle-power-ups');
      }
    }]
  }, {
    type: 'separator'
  }, {
    label: 'Create Team',
    accelerator: 'CmdorCtrl+T',
    click() {
      activate('create-team');
    }
  }, {
    label: 'Add Members',
    accelerator: 'CmdorCtrl+Shift+M',
    click() {
      activate('add-members');
    }
  }, {
    type: 'separator'
  }, {
    label: 'Board Settings',
    accelerator: 'CmdorCtrl+Shift+,',
    click() {
      activate('board-settings');
    }
  }, {
    label: 'Print/Export Board',
    accelerator: 'CmdorCtrl+Shift+P',
    click() {
      activate('print-export-board');
    }
  }, {
    label: 'Change Background',
    accelerator: 'CmdorCtrl+Shift+B',
    click() {
      activate('change-background');
    }
  }, {
    label: 'Email-to-Board Settings',
    accelerator: 'CmdorCtrl+Shift+G',
    click() {
      activate('email-to-board-settings');
    }
  }, {
    type: 'separator'
  }, {
    label: 'Close Board',
    accelerator: 'CmdorCtrl+Shift+Y',
    click() {
      activate('close-board');
    }
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
  }, {
    type: 'separator'
  }, {
    label: 'Make Text Larger',
    accelerator: 'CmdOrCtrl+Plus',
    click() {
      activate('zoom-in');
    }
  }, {
    label: 'Make Text Smaller',
    accelerator: 'CmdOrCtrl+-',
    click() {
      activate('zoom-out');
    }
  }, {
    label: 'Reset Zoom Level',
    accelerator: 'CmdOrCtrl+0',
    click() {
      activate('zoom-reset');
    }
  }, {
    type: 'separator'
  }, {
    label: 'Toggle Full Screen',
    accelerator: 'Ctrl+Command+F',
    click: (item, focusedWindow) => {
      if (focusedWindow) {
        focusedWindow.setFullScreen(!focusedWindow.isFullScreen());
        focusedWindow.send('window:fullscreen', {state: focusedWindow.isFullScreen()});
      }
    }
  }, {
    label: 'Toggle Developer Tools',
    accelerator: 'Alt+Command+I',
    click: (item, focusedWindow) => {
      focusedWindow.toggleDevTools();
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

const otherTpl = [{
  label: 'File',
  submenu: [{
    label: 'Profile',
    accelerator: 'CmdorCtrl+P',
    click() {
      activate('toggle-profile');
    }
  }, {
    label: 'Notifications',
    accelerator: 'CmdorCtrl+N',
    click() {
      activate('toggle-notifications');
    }
  }, {
    label: 'Subscribed Cards',
    accelerator: 'CmdorCtrl+Shift+S',
    click() {
      activate('subscribed-cards');
    }
  }, {
    type: 'separator'
  }, {
    label: 'Search',
    accelerator: 'CmdorCtrl+F',
    click() {
      activate('search');
    }
  }, {
    type: 'separator'
  }, {
    label: 'Settings',
    accelerator: 'CmdorCtrl+,',
    click() {
      activate('settings');
    }
  }, {
    label: 'Return Home',
    accelerator: 'CmdorCtrl+H',
    click() {
      activate('return-home');
    }
  }, {
    label: 'Change language',
    accelerator: 'CmdorCtrl+Shift+L',
    click() {
      activate('change-language');
    }
  }, {
    type: 'separator'
  }, {
    label: 'Log Out',
    accelerator: 'CmdorCtrl+Shift+Q',
    click() {
      activate('log-out');
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
  label: 'Boards',
  submenu: [{
    label: 'Board Actions',
    submenu: [{
      label: 'Star Board',
      accelerator: 'CmdorCtrl+S',
      click() {
        activate('star-board');
      }
    }, {
      label: 'Copy Board',
      accelerator: 'CmdorCtrl+Shift+C',
      click() {
        activate('copy-board');
      }
    }, {
      label: 'Create Board',
      accelerator: 'CmdorCtrl+B',
      click() {
        activate('create-board');
      }
    }, {
      label: 'Rename Board',
      accelerator: 'CmdorCtrl+E',
      click() {
        activate('rename-board');
      }
    }, {
      type: 'separator'
    }, {
      label: 'Info',
      accelerator: 'CmdorCtrl+I',
      click() {
        activate('toggle-info');
      }
    }, {
      label: 'Labels',
      accelerator: 'CmdorCtrl+L',
      click() {
        activate('board-labels');
      }
    }, {
      label: 'Archive',
      accelerator: 'CmdorCtrl+Shift+E',
      click() {
        activate('board-archive');
      }
    }, {
      label: 'Subscribe',
      accelerator: 'CmdorCtrl+U',
      click() {
        activate('board-subsribe');
      }
    }, {
      type: 'separator'
    }, {
      label: 'Stickers',
      accelerator: 'CmdorCtrl+K',
      click() {
        activate('toggle-stickers');
      }
    }, {
      label: 'Power-Ups',
      accelerator: 'CmdorCtrl+O',
      click() {
        activate('toggle-power-ups');
      }
    }]
  }, {
    type: 'separator'
  }, {
    label: 'Create Team',
    accelerator: 'CmdorCtrl+T',
    click() {
      activate('create-team');
    }
  }, {
    label: 'Add Members',
    accelerator: 'CmdorCtrl+Shift+M',
    click() {
      activate('add-members');
    }
  }, {
    type: 'separator'
  }, {
    label: 'Board Settings',
    accelerator: 'CmdorCtrl+Shift+,',
    click() {
      activate('board-settings');
    }
  }, {
    label: 'Print/Export Board',
    accelerator: 'CmdorCtrl+Shift+P',
    click() {
      activate('print-export-board');
    }
  }, {
    label: 'Change Background',
    accelerator: 'CmdorCtrl+Shift+B',
    click() {
      activate('change-background');
    }
  }, {
    label: 'Email-to-Board Settings',
    accelerator: 'CmdorCtrl+Shift+G',
    click() {
      activate('email-to-board-settings');
    }
  }, {
    type: 'separator'
  }, {
    label: 'Close Board',
    accelerator: 'CmdorCtrl+Shift+Y',
    click() {
      activate('close-board');
    }
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
  }, {
    type: 'separator'
  }, {
    label: 'Make Text Larger',
    accelerator: 'CmdOrCtrl+Plus',
    click() {
      activate('zoom-in');
    }
  }, {
    label: 'Make Text Smaller',
    accelerator: 'CmdOrCtrl+-',
    click() {
      activate('zoom-out');
    }
  }, {
    label: 'Reset Zoom Level',
    accelerator: 'CmdOrCtrl+0',
    click() {
      activate('zoom-reset');
    }
  }, {
    type: 'separator'
  }, {
    label: 'Toggle Full Screen',
    accelerator: 'F11',
    click: (item, focusedWindow) => {
      if (focusedWindow) {
        focusedWindow.setFullScreen(!focusedWindow.isFullScreen());
        focusedWindow.send('window:fullscreen', {state: focusedWindow.isFullScreen()});
      }
    }
  }, {
    label: 'Toggle Developer Tools',
    accelerator: 'Ctrl+Shift+I',
    click: (item, focusedWindow) => {
      focusedWindow.toggleDevTools();
    }
  }]
}, {
  role: 'help',
  submenu: helpSubmenu
}];

const tpl = process.platform === 'darwin' ? darwinTpl : otherTpl;

module.exports = electron.Menu.buildFromTemplate(tpl);
