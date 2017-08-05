'use strict';
const url = require('url');
const electron = require('electron');

const autoUpdater = electron.autoUpdater;

module.exports.init = () => {
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

  const { platform } = process;
  const version = electron.app.getVersion();
  const feedURL = url.resolve('https://hazel-mdyjxpqlnl.now.sh', 'update', platform, version);
  autoUpdater.setFeedURL(feedURL);
};

module.exports.checkUpdate = () => {
  if (process.platform !== 'darwin') {
    return;
  }

  autoUpdater.checkForUpdates();
};
