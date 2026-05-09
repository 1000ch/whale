import {autoUpdater} from 'electron-updater';

function init() {
  autoUpdater.on('error', error => {
    console.error('auto-updater error:', error.message);
  });
}

function checkUpdate() {
  void autoUpdater.checkForUpdatesAndNotify();
}

const defaultObject = {init, checkUpdate};
export default defaultObject;
