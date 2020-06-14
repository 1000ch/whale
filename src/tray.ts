import path from 'path';
import {app, Menu, Tray, BrowserWindow} from 'electron';

let tray = null;

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
    }
  }, {
    type: 'separator'
  }, {
    role: 'quit'
  }]);

  tray = new Tray(iconPath);
  tray.setToolTip(`${app.getName()}`);
  tray.setContextMenu(contextMenu);
  tray.on('click', toggleWin);
}

const defaultObject = {create};
export default defaultObject;
