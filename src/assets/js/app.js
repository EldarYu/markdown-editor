const remote = require('electron').remote;
const ipc = require('electron').ipcRenderer;
const dialog = remote.dialog;
const fs = require('fs');

let editor;
let currFilePath;

window.onload = () => {

  var preview = document.getElementById("preview");
  var source = document.getElementById("source");

  editor = CodeMirror(source, {
    mode: "markdown",
    lineNumbers: true,
    lineWrapping: true,
  });

  editor.setSize('100%', '100%');

  editor.on("change", (editor) => {
    let text = editor.getValue();
    html = marked(text);
    preview.innerHTML = html;
  });

  ipc.on("new", (event) => {
    let text = editor.getValue();
    if (text != "") {
      dialog.showMessageBox({ type: ['warning'], message: "file is not saved, check out?", buttons: ["ok", "cancel"] },
        (result) => {

        });
    }
  });

  ipc.on("open-file", (event) => {
    dialog.showOpenDialog({ properties: ['openFile'], filters: [{ name: 'Markdown File', extensions: ['md'] }], },
      (path) => {
        if (path[0] != "") {
          fs.readFile(path[0], 'utf8', (err, data) => {
            if (err) {
              dialog.showMessageBox({ type: ['error'], message: err });
              return;
            };
            editor.setValue(data);
          });
        }
      });
  });

  ipc.on("save", (event) => {

  });

  ipc.on("save-as", (event) => {
    dialog.showSaveDialog({ filters: [{ name: 'Markdown File', extensions: ['md'] }], },
      (path) => {

      })
  });


  ipc.on("about", (event) => {

  })

  ipc.on("quit", (event) => {
    let text = editor.getValue();
    if (text != "") {

    }
  });

}
