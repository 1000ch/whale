import {app, autoUpdater} from 'electron';
import process from 'process';

function init() {
  if (process.platform !== 'darwin') {
    return;
  }

  autoUpdater.on('checking-for-update', () => {
    console.log('checking-for-update');
  });

  autoUpdater.on('update-available', () => {
    console.log('update-available');
  });

  autoUpdater.on('update-not-available', () => {
    console.log('update-not-available');
  });

  autoUpdater.on('update-downloaded', () => {
    console.log('update-downloaded');
  });

  const version = app.getVersion();
  const url = `https://whale-updater.herokuapp.com/update/${process.platform}/${version}`;
  autoUpdater.setFeedURL({url});
}

function checkUpdate() {
  if (process.platform !== 'darwin') {
    return;
  }

  autoUpdater.checkForUpdates();
}

const defaultObject = {init, checkUpdate};
export default defaultObject;
