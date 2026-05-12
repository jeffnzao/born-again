import { app, BrowserWindow, ipcMain, Notification } from 'electron'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

let mainWindow: BrowserWindow | null = null

const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      sandbox: true,
    },
    icon: path.join(__dirname, '../public/icon.png'),
  })

  const isDev = process.env.NODE_ENV === 'development'
  
  if (isDev) {
    mainWindow.loadURL('http://localhost:5173')
    mainWindow.webContents.openDevTools()
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'))
  }

  mainWindow.on('closed', () => {
    mainWindow = null
  })
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

// IPC Handlers pour notifications système
ipcMain.handle('show-notification', (event, { title, body, tag }: any) => {
  const notification = new Notification({
    title,
    body,
    icon: path.join(__dirname, '../public/icon.png'),
  })

  notification.show()
  return true
})

// IPC Handlers pour la sauvegarde locale (simulated DB)
ipcMain.handle('db-get', (event, key: string) => {
  const store = require('electron-store')
  const store_instance = new store()
  return store_instance.get(key)
})

ipcMain.handle('db-set', (event, key: string, value: any) => {
  const store = require('electron-store')
  const store_instance = new store()
  store_instance.set(key, value)
  return true
})
