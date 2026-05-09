import electronUpdater from 'electron-updater';

export function init() {
  electronUpdater.autoUpdater.on('error', error => {
    console.error('auto-updater error:', error.message);
  });
}

export async function checkUpdate() {
  await electronUpdater.autoUpdater.checkForUpdatesAndNotify();
}
