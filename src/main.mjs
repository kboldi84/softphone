import { app, BrowserWindow, ipcMain, screen } from 'electron'
import { fileURLToPath } from 'node:url' 
import path from 'node:path'
import electronSquirrelStartup from 'electron-squirrel-startup' 
 
let isCommonJS = process.env.NODE_ENV=='production'
const __filename=fileURLToPath(import.meta.url)
const __dirname=path.dirname(__filename)

let incomingCallWindow = {};
let mainWindow = {}
let callWindow = {}

 

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (electronSquirrelStartup) {
    app.quit();
  }

const createWindow = () => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1465,
    height: 825,
    minHeight: 620,
    minWidth: 720,
    frame: false,
    webPreferences: {
      preload: path.join(__dirname, isCommonJS?'preload.cjs':'preload.cjs'),
      contextIsolation: true,
      enableRemoteModule: false,
      nodeIntegration: false,
      sandbox:true,
    },
  });


  // and load the index.html of the app.
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`));
  }


  app.on('certificate-error', (event, webContents, url, error, certificate, callback) => {
    console.log('cert-error?')
    event.preventDefault()
    callback(true)
  })
  // Open the DevTools.
  mainWindow.webContents.openDevTools();


};




const createIncomingCallWindow = (wwidth, wheight,invitationOptions) => {
  const display = screen.getPrimaryDisplay()

  const bounds = {
    x: display.size.width - wwidth,
    y: display.size.height - (wheight + 50)
  }
  // Create the browser window.
  incomingCallWindow = new BrowserWindow({
    width: wwidth,
    height: wheight,
    //resizable: false,
    frame: false,
    x: bounds.x,
    y: bounds.y,
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      contextIsolation: true,
      enableRemoteModule: false,
      nodeIntegration: false,
      sandbox: true,
    },
  });

  incomingCallWindow.webContents.openDevTools();

  // and load the index.html of the app.
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    incomingCallWindow.loadURL('http://localhost:5173/incomingCallWindow.html');
  }
  else {
    //callWindow.loadFile(path.join(__dirname, `../dist/callWindow.html`));
    incomingCallWindow.loadFile(path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/incomingCallWindow.html`));
  }
  incomingCallWindow.setMenuBarVisibility(false)

  incomingCallWindow.webContents.on('did-finish-load', () => {
    incomingCallWindow.webContents.send('load-invitation-options', invitationOptions)
  })
}


 



const createCallWindow = (invitationOptions) => {

  // Create the browser window.
  callWindow = new BrowserWindow({
    width: 800,
    height: 700,
    minHeight: 600,
    minWidth: 400,
    frame: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      contextIsolation: true,
      enableRemoteModule: false,
      nodeIntegration: false,
      sandbox: true,
    },
  });

  callWindow.webContents.openDevTools();

  // and load the index.html of the app.
   // and load the index.html of the app.
   if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    callWindow.loadURL('http://localhost:5173/callWindow.html');
  }
  else {
    //callWindow.loadFile(path.join(__dirname, `../dist/callWindow.html`));
    callWindow.loadFile(path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/callWindow.html`));
  }
  callWindow.setMenuBarVisibility(false)

  callWindow.webContents.on('did-finish-load', () => {
    console.log(invitationOptions);
    callWindow.webContents.send('load-invitation-options', invitationOptions)
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow();


  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});


ipcMain.handle('close-main-window', (event) => {
    console.log("close-electron-app")
    mainWindow.close();
  })
  
  ipcMain.handle('hide-main-window', (event) => {
    console.log("hide-electron-app")
    mainWindow.hide();
  })

  ipcMain.handle('makeCall-event', (event, target) => {
    console.log('send make a call trigger to App.vue');
    console.log(`call to ${target}`);
    mainWindow.webContents.send('onOutgoingCall', target)
  })


  ipcMain.handle('wakeUpInCommingCallWindow-event', (event, invitationOptions) => {
    createIncomingCallWindow(450,200,invitationOptions);
     console.log('bejövő hívás')
     console.log(invitationOptions)
     
  });

  ipcMain.handle('incomingCallReject-event', (event) => {
    console.log('incomming call rejected by local user');
    incomingCallWindow.close();
    mainWindow.webContents.send('onInvitation-Reject-Answer','reject')
  })

  ipcMain.handle('incomingCallAccept-event', (event) => {
    console.log('incomming call accepted by local user');
    incomingCallWindow.close();
    mainWindow.webContents.send('onInvitation-Accept-Answer','accept')
  })
  

  ipcMain.handle('wakeUpCallWindow-event', (event, invitationOptions) => {
    createCallWindow(invitationOptions);
  });

  ipcMain.handle('onHangUpCall', (event) => {
    console.log('close calling');
    mainWindow.webContents.send('setCallProcess')
  })

  ipcMain.handle('setCallState-event', (event, state) => {
    console.log(`call state change to ${state}`);
    callWindow.webContents.send('onCallingStateChange', state)
  })

  ipcMain.handle('closeCallWindow-event', (event) => {
    console.log("close callWindow")
    callWindow.close();
  });

  ipcMain.handle('onAnswerHandler', (event, answer) => {
    console.log('onAnswerHandler', answer)
    mainWindow.webContents.send('onCallAnswer', answer)
  })

  ipcMain.handle('close-incoming-call-window', (event) => {
    console.log("close-incoming-call-window")
    incomingCallWindow.close();
  })