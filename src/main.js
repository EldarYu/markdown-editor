const { app, BrowserWindow, Menu, electron, dialog, ipcMain } = require('electron')


let mainWindow;
let template = [{
  label: "File",
  submenu: [
    { label: "New", accelerator: "CmdOrCtrl+N", click: () => { mainWindow.webContents.send("new"); } },
    { label: "Open", click: () => { mainWindow.webContents.send("open-file"); } },
    { type: "separator" },
    { label: "Save", accelerator: "CmdOrCtrl+S", click: () => { mainWindow.webContents.send("save"); } },
    { label: "Save as", accelerator: "CmdOrCtrl+Shift+S", click: () => { mainWindow.webContents.send("save-as"); } },
    { type: "separator" },
    { label: "Quit", accelerator: "CmdOrCtrl+Q", click: () => { mainWindow.webContents.send("quit"); } }
  ]
}, {
  label: "Edit",
  submenu: [
    { label: "Undo", accelerator: "CmdOrCtrl+Z", selector: "undo:", click: () => { mainWindow.webContents.undo(); } },
    { label: "Redo", accelerator: "CmdOrCtrl+Shift+Z", selector: "redo:", click: () => { mainWindow.webContents.redo(); } },
    { type: "separator" },
    { label: "Cut", accelerator: "CmdOrCtrl+X", selector: "cut:", click: () => { mainWindow.webContents.cut(); } },
    { label: "Copy", accelerator: "CmdOrCtrl+C", selector: "copy:", click: () => { mainWindow.webContents.copy(); } },
    { label: "Paste", accelerator: "CmdOrCtrl+V", selector: "paste:", click: () => { mainWindow.webContents.paste(); } },
    { label: "Select All", accelerator: "CmdOrCtrl+A", selector: "selectAll:", click: () => { mainWindow.webContents.selectAll(); } }
  ]
}, {
  label: "Help",
  submenu: [
    { label: "About", click: () => { mainWindow.webContents.send("about"); } }
  ]
}
];

function createWindow() {

  mainWindow = new BrowserWindow({
    width: 1280,
    height: 600,
    title: 'Editor',
    minWidth: 1280,
    minHeight: 600,
    //  transparent: true,  //透明
    // "frame": false,   //窗口标题栏
    show: false,
  });

  mainWindow.loadURL(`file://${__dirname}/views/index.html`);

  //打开开发者工具，方便调试
  //mainWindow.webContents.openDevTools();

  mainWindow.on('ready-to-show', () => {
    mainWindow.show();
    mainWindow.focus();
  });

  // 处理窗口关闭
  mainWindow.on('closed', () => {
    mainWindow = null;
  })
}

// Electron初始化完成
app.on('ready', () => {
  //注册菜单 
  Menu.setApplicationMenu(Menu.buildFromTemplate(template));

  createWindow();
})

// 处理退出
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
})

ipcMain.on('reload', (event) => {
  mainWindow.webContents.reload();
})