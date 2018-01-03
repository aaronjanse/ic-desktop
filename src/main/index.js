'use strict'

import { app, BrowserWindow, Menu, dialog } from 'electron'
import { autoUpdater } from 'electron-updater'

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`

function createWindow () {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    height: 563,
    useContentSize: true,
    width: 1000
  })

  mainWindow.loadURL(winURL)

  mainWindow.on('closed', () => {
    mainWindow = null
  })

  var template = [{
    label: 'ic-desktop',
    submenu: [
      { label: 'About Application', selector: 'orderFrontStandardAboutPanel:' },
      { label: 'Check for Updates', click: checkForUpdates },
      { type: 'separator' },
      { label: 'Quit',
        accelerator: 'Command+Q',
        click: function () { app.quit() }
      }
    ]}, {
    label: 'Edit',
    submenu: [
      { label: 'Undo', accelerator: 'CmdOrCtrl+Z', selector: 'undo:' },
      { label: 'Redo', accelerator: 'Shift+CmdOrCtrl+Z', selector: 'redo:' },
      { type: 'separator' },
      { label: 'Cut', accelerator: 'CmdOrCtrl+X', selector: 'cut:' },
      { label: 'Copy', accelerator: 'CmdOrCtrl+C', selector: 'copy:' },
      { label: 'Paste', accelerator: 'CmdOrCtrl+V', selector: 'paste:' },
      { label: 'Select All', accelerator: 'CmdOrCtrl+A', selector: 'selectAll:' }
    ]}, {
    submenu: [
      { accelerator: 'CmdOrCtrl+Shift+I',
        click: function () { mainWindow.webContents.openDevTools() }
      }
    ]}
  ]

  Menu.setApplicationMenu(Menu.buildFromTemplate(template))
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

let updater
autoUpdater.autoDownload = false

let manuallyUpdating = false

autoUpdater.on('error', (event, error) => {
  const errorString = (error.stack || error).toString()
  if (errorString.indexOf('dev-app-update.yml not found') === -1) {
    dialog.showErrorBox('Error: ', error == null ? 'unknown' : errorString)
  } else if (manuallyUpdating) {
    dialog.showMessageBox({
      title: 'Updating not Available',
      message: 'Updating not Available in Dev Mode'
    })
  }
})

autoUpdater.on('update-available', () => {
  dialog.showMessageBox({
    type: 'info',
    title: 'Found Updates',
    message: 'Found updates, do you want update now?',
    buttons: ['Sure', 'No']
  }, (buttonIndex) => {
    if (buttonIndex === 0) {
      autoUpdater.downloadUpdate()
    } else {
      updater.enabled = true
      updater = null
    }
  })
  manuallyUpdating = false
})

autoUpdater.on('update-not-available', () => {
  if (manuallyUpdating) {
    dialog.showMessageBox({
      title: 'No Updates',
      message: 'Current version is up-to-date.'
    })
    updater.enabled = true
    updater = null
    manuallyUpdating = false
  }
})

autoUpdater.on('update-downloaded', () => {
  dialog.showMessageBox({
    title: 'Install Updates',
    message: 'Updates downloaded, application will quit for update...'
  }, () => {
    setImmediate(() => autoUpdater.quitAndInstall())
  })
  manuallyUpdating = false
})

// export this to MenuItem click callback
function checkForUpdates (menuItem, focusedWindow, event) {
  updater = menuItem
  updater.enabled = false
  manuallyUpdating = true
  autoUpdater.checkForUpdates()
}

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') {
    manuallyUpdating = false
    autoUpdater.checkForUpdates()
  }

  mainWindow.webContents.on('new-window', (e, url) => {
    e.preventDefault()
    require('electron').shell.openExternal(url)
  })
})
