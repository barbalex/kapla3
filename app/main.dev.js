/* eslint global-require: 1, flowtype-errors/show-errors: 0 */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build-main`, this file is compiled to
 * `./app/main.prod.js` using webpack. This gives us some performance wins.
 *
 * @flow
 */
import { app, BrowserWindow } from 'electron'
import MenuBuilder from './menu'

let mainWindow = null

const saveConfigValue = require('./src/saveConfigValue.js')
const getConfigSync = require('./src/getConfigSync.js')

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support')
  sourceMapSupport.install()
}

if (process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true') {
  require('electron-debug')()
  const path = require('path')
  const p = path.join(__dirname, '..', 'app', 'node_modules')
  require('module').globalPaths.push(p)
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer')
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS
  const extensions = ['REACT_DEVELOPER_TOOLS', 'REDUX_DEVTOOLS']

  return Promise.all(extensions.map(name => installer.default(installer[name], forceDownload))).catch(console.log)
}

/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

const browserWindowOptions = {
  width: 1800,
  height: 1024,
  icon: './app/etc/app.png',
  /*
  webPreferences: {
    experimentalFeatures: true
  },*/
  show: false,
}

// get last window state
// and set it again
const lastWindowState = getConfigSync().lastWindowState
if (lastWindowState) {
  if (lastWindowState.width) browserWindowOptions.width = lastWindowState.width
  if (lastWindowState.height) {
    browserWindowOptions.height = lastWindowState.height
  }
  if (lastWindowState.x) browserWindowOptions.x = lastWindowState.x
  if (lastWindowState.y) browserWindowOptions.y = lastWindowState.y
}

app.on('ready', async () => {
  if (process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true') {
    await installExtensions()
  }

  mainWindow = new BrowserWindow(browserWindowOptions)
  if (lastWindowState && lastWindowState.maximized) {
    mainWindow.maximize()
  }

  mainWindow.loadURL(`file://${__dirname}/app.html`)

  // @TODO: Use 'ready-to-show' event
  //        https://github.com/electron/electron/blob/master/docs/api/browser-window.md#using-ready-to-show-event
  mainWindow.webContents.on('did-finish-load', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined')
    }
    mainWindow.show()
    mainWindow.focus()
  })

  mainWindow.on('closed', () => {
    mainWindow = null
  })

  // save window state on close
  mainWindow.on('close', () => {
    const bounds = mainWindow.getBounds()
    saveConfigValue('lastWindowState', {
      x: bounds.x,
      y: bounds.y,
      width: bounds.width,
      height: bounds.height,
      maximized: mainWindow.isMaximized(),
    })
  })

  const menuBuilder = new MenuBuilder(mainWindow)
  menuBuilder.buildMenu()
})