import {
  app,
  Menu,
  Tray,
  type BrowserWindow,
} from 'electron';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import process from 'node:process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

let tray: Tray | undefined;

function create(window: BrowserWindow) {
  if (process.platform === 'darwin' || tray) {
    return;
  }

  const iconPath = path.resolve(__dirname, '../static/IconTray.png');

  const toggleWin = () => {
    if (window.isVisible()) {
      window.hide();
    } else {
      window.show();
    }
  };

  const contextMenu = Menu.buildFromTemplate([{
    label: 'Toggle',
    click() {
      toggleWin();
    },
  }, {
    type: 'separator',
  }, {
    role: 'quit',
  }]);

  tray = new Tray(iconPath);
  tray.setToolTip(app.getName());
  tray.setContextMenu(contextMenu);
  tray.on('click', toggleWin);
}

const defaultObject = {create};
export default defaultObject;
