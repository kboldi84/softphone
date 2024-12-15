const { contextBridge, ipcRenderer } = require('electron');

/* hívásokkal kapcsolatos eventek  */
contextBridge.exposeInMainWorld('callHandlers', {
    /* bejövő hívás ablak felnyitására event küldés */
    wakeUpIncommingCallWindow: (invitationOptions) => ipcRenderer.invoke('wakeUpInCommingCallWindow-event', invitationOptions),
    /* hívás ablak felnyitására event küldés */
    wakeUpCallWindow: (invitationOptions) => ipcRenderer.invoke('wakeUpCallWindow-event', invitationOptions),
    /* hívás ablak preloader leállításánal triggere node réteg felé*/
    setCallState: (state) => ipcRenderer.invoke('setCallState-event', state),
    /* node rétegből trigger a call ablaknak, hogy a hívás álllapota megváltozott trying-ról */
    onCallingStateChange: (callback) => ipcRenderer.on('onCallingStateChange', (event, state) => callback(state)),
    /*  call ablak bezárása  Terminated, recejt, accept  event-re */
    closeCallWindow: () => ipcRenderer.invoke('closeCallWindow-event'),
    /* node rétegben létrehozott bejövő hívás ablak a megjelenítendő vue-felé küldött eventje, amiben elküldjük az invite paramétereket (hívó neve, száma stb...) */
    invitationOptionsDataLoader: (callback) => ipcRenderer.on('load-invitation-options', (event, invitationOptions) => callback(invitationOptions)),
    /*bejövő hívás ablak elfogad/ elutasít gomb eredményének node réteg felé küldő eventje*/
    incomingCallHandler: async (answer) => { return await ipcRenderer.invoke('incomingCallHandler', answer) },
    /* kimenő hívás ablak elutasít gomb eredményének node réteg felé küldő eventje*/
    onAnswerHandler: async (answer) => { return await ipcRenderer.invoke('onAnswerHandler', answer) },
    /* main window (node réteg) a bejövő hívásra adott válasz tovább küldése a vue frontend-nek */
    onInvitationAnswer: async (callback) => await ipcRenderer.on('onInvitationAnswer', (event, answer) => callback(answer)),
    /* main window (node réteg) a bejövő hívásra adott válasz tovább küldése a vue frontend-nek  2. változat, egy ablakos verziónál volt jelentősége*/
    onCallAnswer:  (callback) =>  ipcRenderer.on('onCallAnswer', (event, answer) => callback(answer)),
    /* hívás befejezése (hangup) hívás ablakban hangup button megnyomása, event küldése node processhez*/
    onHangUpCall: (option) => ipcRenderer.invoke('onHangUpCall'),
    /* main window (node réteg) a frontend felől ékező muted vagy close call event küldése */
    setCallingProcess: (callback) => ipcRenderer.on('setCallProcess', (event) => callback()),
    /* hívás kezdeményezése event küldés node process felé */
    makeCall: (target) => ipcRenderer.invoke('makeCall-event', target),
    /* node process felől jövő hívás kezdeményezése event fogadása */
    onOutgoingCall: (callback) => ipcRenderer.on('onOutgoingCall', (event, target) => callback(target)),


    /* bejövő hívás elutasítása local user felől  node réteg felé*/
    incomingCallRejectHandler: () => ipcRenderer.invoke('incomingCallReject-event'),
    /* bejövő hívás elutasítása local user felől  node réteg felől App.vue felé */
    onInvitationRejectAnswer: (callback)=> ipcRenderer.on('onInvitation-Reject-Answer',(event,answer)=> callback(answer) ),

    /* bejövő hívás elfogadása local user felől  node réteg felé*/
    incomingCallAcceptHandler: () => ipcRenderer.invoke('incomingCallAccept-event'),
    /* bejövő hívás elfogadása local user felől  node réteg felől App.vue felé */
    onInvitationAcceptAnswer: (callback)=> ipcRenderer.on('onInvitation-Accept-Answer',(event,answer)=> callback(answer) ),

});
/* hívásokkal kapcsolatos eventek  */

/* Ablak események, fő ablak + hívás és bejövő hívás ablak eseményei */
contextBridge.exposeInMainWorld('electronApi', {
    /* bejövő hívás ablak bezárása, hívás visszautasítása*/
    closeIncomingCallWindow: async () => await ipcRenderer.invoke('close-incoming-call-window'),
    /* főablak bezárása, app bezárása*/
    closeMainWindow: async () => await ipcRenderer.invoke('close-main-window'),
    /* főablak letétele "alvó" állapotba tálcára, háttérben fut tovább*/
    hideMainWindow: async () => await ipcRenderer.invoke('hide-main-window'),


    showSmallWindow: async () => await ipcRenderer.invoke('show-small-window'),
});
/* Ablak események, fő ablak + hívás és bejövő hívás ablak eseményei */