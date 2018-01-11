'use strict';
const electron = require('electron');
const config = require('./config');

const ipc = electron.ipcRenderer;
const webFrame = electron.webFrame;
const boardsListSelector = '.boards-page-board-section-list';

function defaultView() {
  // Reset menu to default view
  document.querySelector('.board-menu-header-back-button').click();
  document.querySelector('.board-menu-header-back-button').click();
  document.querySelector('.board-menu-header-back-button').click();
}

ipc.on('toggle-profile', () => {
  // Toggle profile
  document.querySelector('.member-avatar').click();
  document.querySelector('.js-profile').click();
});

ipc.on('toggle-notifications', () => {
  // Toggle notifications
  document.querySelector('.header-notifications').click();
});

ipc.on('subscribed-cards', () => {
  // Toggle subscribed cards
  document.querySelector('.member-avatar').click();
  document.querySelector('.js-cards').click();
});

ipc.on('search', () => {
  // Toggle search box
  document.querySelector('.header-search').firstChild.click();
});

ipc.on('settings', () => {
  // Toggle info
  document.querySelector('.member-avatar').click();
  document.querySelector('.js-account').click();
});

ipc.on('return-home', () => {
  // Return home
  document.querySelector('.header-logo-default').click();
});

ipc.on('change-language', () => {
  // Change language
  document.querySelector('.member-avatar').click();
  document.querySelector('.js-change-locale').click();
});

ipc.on('log-out', () => {
  // Log out
  document.querySelector('.member-avatar').click();
  document.querySelector('.js-logout').click();
});

ipc.on('star-board', () => {
  // Star board
  document.querySelector('.board-header-btn-icon.icon-star').click();
});

ipc.on('copy-board', () => {
  // Copy board
  defaultView();
  document.querySelector('.js-open-more').click();
  document.querySelector('.js-copy-board').click();
});

ipc.on('create-board', () => {
  // Create board
  document.querySelector('.js-open-add-menu').click();
  document.querySelector('.js-new-board').click();
});

ipc.on('rename-board', () => {
  // Rename board
  document.querySelector('.board-header-btn-name').click();
});

ipc.on('toggle-info', () => {
  // Toggle info
  document.querySelector('.js-open-header-info-menu').click();
});

ipc.on('board-labels', () => {
  // Subscribe to board
  defaultView();
  document.querySelector('.js-open-more').click();
  document.querySelector('.js-open-labels').click();
});

ipc.on('board-archive', () => {
  // Toggle board archived items
  defaultView();
  document.querySelector('.js-open-more').click();
  document.querySelector('.js-open-archive').click();
});

ipc.on('toggle-stickers', () => {
  // Toggle stickers
  defaultView();
  document.querySelector('.js-open-stickers').click();
});

ipc.on('board-subsribe', () => {
  // Subscribe to board
  defaultView();
  document.querySelector('.js-open-more').click();
  document.querySelector('.js-subscribed-state').click();
});

ipc.on('toggle-power-ups', () => {
  // Toggle power-ups
  defaultView();
  document.querySelector('.js-open-power-ups').click();
});

ipc.on('create-team', () => {
  // Create team
  document.querySelector('.js-open-add-menu').click();
  document.querySelector('.js-new-org').click();
});

ipc.on('add-members', () => {
  // Add members to board
  document.querySelector('.js-open-manage-board-members').click();
});

ipc.on('board-settings', () => {
  // Toggle board settings
  defaultView();
  document.querySelector('.js-open-more').click();
  document.querySelector('.js-open-settings').click();
});

ipc.on('print-export-board', () => {
  // Print and export
  defaultView();
  document.querySelector('.js-open-more').click();
  document.querySelector('.js-share').click();
});

ipc.on('change-background', () => {
  // Change board background
  document.querySelector('.board-menu-header-back-button').click();
  document.querySelector('.js-change-background').click();
});

ipc.on('email-to-board-settings', () => {
  // Toggle email-to-board settings
  defaultView();
  document.querySelector('.js-open-more').click();
  document.querySelector('.js-email').click();
});

ipc.on('leave-board', () => {
  // Leave board
  defaultView();
  document.querySelector('.js-open-more').click();
  document.querySelector('.js-leave-board').click();
});

ipc.on('close-board', () => {
  // Close board
  defaultView();
  document.querySelector('.js-open-more').click();
  document.querySelector('.js-close-board').click();
});

ipc.on('zoom-in', () => {
  // Get zoom factor and increase it
  const currentZoomFactor = webFrame.getZoomFactor();
  const zoomFactor = currentZoomFactor + 0.05;
  // Upper bound check
  if (zoomFactor < 1.3) {
    webFrame.setZoomFactor(zoomFactor);
    config.set('zoomFactor', zoomFactor);
  }
});

ipc.on('zoom-out', () => {
  // Get zoom factor and decrease it
  const currentZoomFactor = webFrame.getZoomFactor();
  const zoomFactor = currentZoomFactor - 0.05;
  // Lower bound check
  if (zoomFactor > 0.7) {
    webFrame.setZoomFactor(zoomFactor);
    config.set('zoomFactor', zoomFactor);
  }
});

ipc.on('zoom-reset', () => {
  // Reset zoom factor
  webFrame.setZoomFactor(1.0);
  config.set('zoomFactor', 1.0);
});

function selectBoard(index) {
  // Select the appropriate board based on given index
  document.querySelector(boardsListSelector).children[index].firstChild.click();
}

function jumpToBoard(key) {
  // Decrement given num since list indexing start add 0
  const index = key - 1;
  selectBoard(index);
}

document.addEventListener('keydown', event => {
  let comboKey;

  // OS check
  if (process.platform === 'darwin') {
    comboKey = event.metaKey;
  } else {
    comboKey = event.ctrlKey;
  }

  // Validity check
  if (comboKey === false) {
    return null;
  }

  // Parse as decimal
  const givenNum = parseInt(event.key, 10);

  // Get index
  if (givenNum < 10 && givenNum > 0) {
    jumpToBoard(givenNum);
  }
});

document.addEventListener('DOMContentLoaded', () => {
  // Preserve zoom factor
  const zoomFactor = config.get('zoomFactor');
  webFrame.setZoomFactor(zoomFactor);
});
