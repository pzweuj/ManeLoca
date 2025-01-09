/** @type {import('electron').SaveDialogOptions} */
const defaultDialogOptions = {
  title: '保存文件',
  filters: [
    { name: 'TSV Files', extensions: ['tsv'] },
    { name: 'All Files', extensions: ['*'] }
  ]
}

const { app, BrowserWindow, ipcMain, dialog } = require('electron')
const path = require('path')
const fs = require('fs/promises')

let mainWindow

// 添加对话框处理程序
ipcMain.handle('show-save-dialog', async (event, options = defaultDialogOptions) => {
  const result = await dialog.showSaveDialog(options)
  /** @type {import('electron').SaveDialogReturnValue} */
  return result
})

// 添加文件写入处理程序
ipcMain.handle('write-file', async (event, { filePath, content }) => {
  await fs.writeFile(filePath, content)
  return { success: true }
})

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    frame: true,
    icon: path.join(__dirname, '../src/app/icon.ico'),
    // titleBarStyle: 'hidden',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      webSecurity: false,
      sandbox: false,
      preload: path.join(__dirname, 'preload.js')
    }
  })

  mainWindow.setMenu(null)
  // 总是使用开发服务器
  mainWindow.loadURL('http://localhost:3000')

  if (process.env.NODE_ENV === 'development') {
    mainWindow.webContents.openDevTools()
  }
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})