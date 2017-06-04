const { ipcRenderer } = require('electron')
const remote = require('electron').remote;
const ipc = ipcRenderer;
const dialog = remote.dialog;
const fs = require('fs');
const app = remote.app;
const shell = require('electron').shell
const githubLink = document.getElementById('github-link');

let editor;   //codemirror 文本框对象
let currFilePath;  //记录当前打开的文件目录
let fileSaved;  //记录保存状态

window.onload = () => {
  var preview = document.getElementById("preview");
  var source = document.getElementById("source");

  //初始化文本框
  editor = CodeMirror(source, {
    mode: "markdown",
    lineNumbers: true,
    lineWrapping: true,
  });
  editor.setSize('100%', '100%');

  //文本框变化,改变preview
  editor.on("change", (editor) => {
    preview.innerHTML = marked(editor.getValue());
  });

  githubLink.addEventListener('click', () => {
    shell.openExternal('https://github.com/EldarYu/markdown-editor');
  })
};

//监听新增文件请求
ipc.on("new", (event) => {
  if (fileSaved) {
    ipc.send('reload');
    fileSaved = false;
  } else if (editor.getValue() == "") {
    ipc.send('reload');
    fileSaved = false;
  } else if (dialog.showMessageBox({ type: 'warning', message: 'file is not saved, need save?', buttons: ['yes', 'no'] }) == 0) {
    saveFile();
    ipc.send('reload');
    fileSaved = false;
  } else {
    ipc.send('reload');
    fileSaved = false;
  }
});

//监听打开文件请求
ipc.on("open-file", (event) => {
  dialog.showOpenDialog({ properties: ['openFile'], filters: [{ name: 'Markdown File', extensions: ['md'] }], },
    (path) => {
      if (path) {
        fs.readFile(path[0], 'utf8', (err, data) => {
          if (err) {
            dialog.showMessageBox({ type: 'error', buttons: ['ok'], message: 'file open failed' });
            return;
          };
          fileSaved = false;
          currFilePath = path[0];
          editor.setValue(data);
        });
      }
    });
});

//监听保存文件请求
ipc.on("save", (event) => {
  saveFile();
});

//监听另存为请去
ipc.on("save-as", (event) => {
  dialog.showSaveDialog({ filters: [{ name: 'Markdown File', extensions: ['md'] }], },
    (path) => {
      if (path) {
        currFilePath = path;
        saveFile();
      }
    })
});

//监听关于页面请求
ipc.on("about", (event) => {
  $('#about').modal('show');
});

//监听退出请求
ipc.on("quit", (event) => {
  if (fileSaved) {
    app.quit();
  } else if (editor.getValue() == "") {
    app.quit();
  } else if (dialog.showMessageBox({ type: 'warning', message: 'file is not saved, need save?', buttons: ['yes', 'no'] }) == 0) {
    saveFile();
    app.quit();
  } else {
    app.quit();
  }
});

//保存文件
function saveFile() {
  if (currFilePath) {
    fs.writeFile(currFilePath, editor.getValue(), (err) => {
      if (err) {
        dialog.showMessageBox({ type: 'error', buttons: ['ok'], message: 'file save failed' });
        return;
      };
      fileSaved = true;
    })
  } else {
    dialog.showSaveDialog({ filters: [{ name: 'Markdown File', extensions: ['md'] }], },
      (path) => {
        if (path) {
          currFilePath = path;
          saveFile();
        }
      })
  }
};
