const { app, BrowserWindow, ipcMain, Menu, nativeImage, Tray } = require('electron');
const path = require('path');
const Store = require('./store.js');

import template from './helpers/menu.js';

let mainWindow;

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

const store = new Store({
  configName: 'user-preferences',
  defaults: {
    windowBounds: { width: 800, height: 600 },
    data: [
      {
        "tabName": "Group #1",
        "entries": [
          {
            label: 'Entry #1',
            subEntry1: { "content": "some text here", "hidden": false },
            subEntry2: { "content": "more text!", "hidden": false },
            subEntry3: { "content": null, "hidden": false },
          }
        ]
      }
    ],
  }
});

const menu = Menu.buildFromTemplate(template());
Menu.setApplicationMenu(menu);

const createWindow = () => {
  let { width, height } = store.get('windowBounds');
  let x = store.get('windowPosition')?.x;
  let y = store.get('windowPosition')?.y;

  let settings = {
    width,
    height,
    icon: path.join(__dirname + './../../src/assets/copy-pasta_200.png'),
    webPreferences: {
      nodeIntegration: true,
      nodeIntegrationInSubFrames: true,
      nodeIntegrationInWorker: true,
      contextIsolation: false,
      // preload: path.join(__dirname + './../../src/preload.js'),
    }
  };

  if (x) {
    settings.x = x;
    settings.y = y;
  }

  mainWindow = new BrowserWindow(settings);

  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  // if (store.get('darkMode')) {
  //   mainWindow.webContents.on('did-finish-load', () => {
  //     mainWindow.webContents.send('darkModeToggle', true);
  //   });
  // }

  // if (store.get('aggroMode')) {
  //   mainWindow.webContents.on('did-finish-load', () => {
  //     mainWindow.webContents.send('aggroModeToggle', true);
  //   });
  // }

  mainWindow.on('minimize', () => {
    mainWindow.webContents.send('stopAllTimers');
  })

  mainWindow.on('resize', () => {
    const { width, height } = mainWindow.getBounds();
    store.set('windowBounds', { width, height });
  });

  mainWindow.on('moved', () => {
    const [ x, y ] = mainWindow.getPosition();
    store.set('windowPosition', { x, y });
  });

  // mainWindow.on('close', (e) => {
  //   if (!closedBySelf) {
  //     e.preventDefault();
  //     mainWindow.webContents.send('saveTimers');
  //   }
  // });

  mainWindow.webContents.openDevTools();

  return mainWindow;
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
  createWindow();
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    mainWindow = createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.

// ipcMain.on('closeWindow', (event, data) => {
//   closedBySelf = true;
//   mainWindow.close();
// });

// ipcMain.on('addOrDelete', (event, data) => {
//   store.set('clientTimers', data);
// });

ipcMain.on('loadSavedEntries', (event, data) => {
  event.reply('loadSavedEntriesReply', store.get('data'));
});

ipcMain.on('updateSavedEntries', (event, data) => {
  store.set('data', data);
});

// ipcMain.on('requestAggro', (event, data) => {
//   event.reply('sendAggroState', store.get('aggroMode'));
// });

// ipcMain.on('timersToggled', (event, data) => {
//   if (data) {
//     let nimage = nativeImage.createFromBuffer(Buffer.from(iconOverlay));
//     mainWindow.setOverlayIcon(nimage, 'timers are going');
//   }
//   else {
//     mainWindow.setOverlayIcon(null, 'timers are all stopped');
//   }
// });

// ipcMain.on('stopWatch', (event, data) => {
//   data.win = mainWindow;
//   stopWatch(data);
// });

// move and uncomment the below if needed for testing

// ipcMain.send('testEvent', data);