import {autoUpdater} from 'electron-updater';

function init() {
  autoUpdater.on('error', error => {
    console.error('auto-updater error:', error.message);
  });
}

async function checkUpdate() {
  await autoUpdater.checkForUpdatesAndNotify();
}

const defaultObject = {init, checkUpdate};
export default defaultObject;
