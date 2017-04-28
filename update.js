'use strict';
const electron = require('electron');
const pkg = require('./package');

const autoUpdater = electron.autoUpdater;

module.exports.init = appMenu => {
  if (process.platform !== 'darwin') {
    return;
  }

  const items = appMenu.items[0].submenu.items;
  const checkUpdate = items.find(menu => menu.id === 'check-update');
  const applyUpdate = items.find(menu => menu.id === 'apply-update');

  if (!checkUpdate || !applyUpdate) {
    return;
  }

  autoUpdater.on('error', error => {
    console.error(error);
    checkUpdate.enabled = true;
    applyUpdate.enabled = false;
  });

  autoUpdater.on('checking-for-update', () => {
    console.log('checking-for-update');
    checkUpdate.enabled = false;
    applyUpdate.enabled = false;
  });

  autoUpdater.on('update-available', () => {
    console.log('update-available');
  });

  autoUpdater.on('update-not-available', () => {
    console.log('update-not-available');
    checkUpdate.enabled = true;
  });

  autoUpdater.on('update-downloaded', () => {
    console.log('update-downloaded');
    checkUpdate.enabled = false;
    applyUpdate.enabled = true;
  });

  autoUpdater.setFeedURL(`https://1000ch.github.io/whale/latest.json?v=v${pkg.version}`);
};

module.exports.checkUpdate = () => {
  if (process.platform !== 'darwin') {
    return;
  }

  autoUpdater.checkForUpdates();
};

module.exports.applyUpdate = () => {
  if (process.platform !== 'darwin') {
    return;
  }

  autoUpdater.quitAndInstall();
};
