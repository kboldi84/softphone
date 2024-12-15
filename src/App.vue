<script setup>
import { db } from './dixiedb.js';
import MenuBar from './components/UI/menubar/MenuBar.vue'
import { ref, computed, onMounted, useTemplateRef } from 'vue';
import {
  UserAgent,
  Registerer,
  Inviter,
  Invitation,
  Session,
  Messager
} from "sip.js";

const callObjcet = ref(
  {
    'call_type': '',
    'call_interval': {
      'start': '',
      'end': ''
    },
    'peer_connections':
    {
      'local': '',
      'remote': ''
    },
    'peer_connection_state': {
      'ringing': 0,
      'accept': 0,
      'cancel': 0,
      'bye': 0
    }
  }
)

const clearCallObject = () => {
  callObjcet.value = {
    'call_type': '',
    'call_interval': {
      'start': '',
      'end': ''
    },
    'peer_connections':
    {
      'local': '',
      'remote': ''
    },
    'peer_connection_state': {
      'ringing': 0,
      'accept': 0,
      'cancel': 0,
      'bye': 0
    }
  }
}

const asteriskDomain = '192.168.42.131'
const localuser = 'webrtc_client'

const remoteAudio = ref(null);
const collapsed = ref();
const session = ref();
const userAgent = ref();
const registerer = ref();

const transportOptions = {
  server: `wss://${asteriskDomain}:8089/ws`
};
let remoteStream = new MediaStream();

const setRemoteMedia = (session) => {
  const volumes = [0, 1]

  session.sessionDescriptionHandler.peerConnection.getReceivers().forEach((receiver) => {

    if (receiver.track.kind === 'audio') {
      remoteStream.addTrack(receiver.track);
    }
  });

  remoteAudio.value.srcObject = remoteStream;
  remoteAudio.value.play();

}

const cleanupMedia = () => {
  remoteAudio.value.srcObject = null;
  remoteAudio.value.pause();
}


const toggleSidebar = () => {
  console.log("toogle btn clicked")
  collapsed.value = !collapsed.value

}
const setCollapsed = computed(() => {
  if (collapsed.value === true) {
    return 'close'
  } else {
    return ''
  }
})


const onCallReceived = (invitation) => {

  invitation.stateChange.addListener((state) => {
    console.log(`onCallReceived =====> session state changed to ${state}`);

    switch (state) {
      case 'Initial':
        console.log('onCallReceived Initial...');
        break;
      case 'Establishing':
        console.log('onCallReceived Establishing...');
        break;
      case 'Established':
        console.log('onCallReceived Established...');
        callObjcet.value.peer_connection_state.accept = 1;
        setRemoteMedia(invitation);
        const invitationOptions = {
          'displayName': invitation.remoteIdentity.displayName,
          'userName': invitation.remoteIdentity.uri.raw.user,
          'callType': 'inbound',
          'state': 'accept'
        }
        window.callHandlers.wakeUpCallWindow(invitationOptions)
        break;
      case 'Terminating':
        console.log('onCallReceived Terminating...');
      // fall through
      case 'Terminated':
        console.log('onCallReceived Terminated...');
        callObjcet.value.call_interval.end = new Date();
          callObjcet.value.peer_connection_state.bye = 1;
          console.log(callObjcet.value)
          //clearCallObject();
        window.callHandlers.closeCallWindow()
        cleanupMedia();
        break;
      default:
        throw new Error("Unknown session state.");
    }

  });

  invitation.accept().then(() => {


  });
}

const onCallCreated = (invitation) => {


  invitation.stateChange.addListener((state) => {
    console.log(`onCallCreated =====> Session state changed to ${state}`);

    switch (state) {
      case 'Initial':
        console.log('onCallCreated Initial...');
        break;
      case 'Establishing':
        console.log('onCallCreated Establishing...');
        break;
      case 'Established':
        console.log('onCallCreated Established...');
        setRemoteMedia(invitation);

        break;
      case 'Terminating':
        console.log('onCallCreated Terminating...');
      // fall through
      case 'Terminated':
        console.log('onCallCreated Terminated...');
        callObjcet.value.call_interval.end = new Date()
        callObjcet.value.peer_connection_state.bye = 1
        console.log(callObjcet.value);
        clearCallObject()
        
        if (session.value != null){
          window.callHandlers.closeCallWindow()
        }
        
        session.value = null
      
        
        cleanupMedia();
        break;
      default:
        throw new Error("Unknown session state.");
         break;
    }

  });

}



const delegate = {
  onConnect: () => {
    console.log("onConnect event")
  },
  onDisconnect: () => {
    console.log("onDisconnect event")
  },
  onRefer: () => {
    console.log("onRefer event")
  },
  onInvite: (invitation) => {
    console.log("onInvite event")
    session.value = invitation

    callObjcet.value.call_type = 'received';
    callObjcet.value.call_interval.start = new Date();
    callObjcet.value.peer_connections.local = localuser;
    callObjcet.value.peer_connections.remote = invitation.remoteIdentity.displayName + ' - ' + invitation.remoteIdentity.uri.raw.user;
    callObjcet.value.peer_connection_state.ringing = 1;
    
 
    session.value.delegate = {
      onCancel: () => {
        console.log('onvinvite delegate cancel.....');
        console.log('a hívó fél megszakította a hívást.....');
        callObjcet.value.call_interval.end = new Date();
        callObjcet.value.peer_connection_state.bye = 1;
        callObjcet.value.peer_connection_state.cancel = 1;
        window.electronApi.closeIncomingCallWindow();
      },
      onReject: () => {
        console.log('onvinvite delegate reject.....');
      },
      onAccept: () => {
        console.log('onvinvite delegate accept.....');
      }
    }


    const invitationOptions = {
      //'displayName': invitation.remoteIdentity.displayName,
      //'userName': invitation.remoteIdentity.uri.raw.user,
      'displayName': 'teszt',
      'userName': 'teszt',
      'type': 'incomming'
    }

    window.callHandlers.wakeUpIncommingCallWindow(invitationOptions)

    session.value.stateChange.addListener((state) => {
      console.log(`Oninvite Invitation ======> Session state changed to ${state}`);

      switch (state) {
        case 'Initial':
          console.log('Oninvite Invitation session Initial...');

          break;
        case 'Establishing':
          console.log('Oninvite Invitation session Establishing...');
          break;
        case 'Established':
          console.log('Oninvite Invitation session Established...');

          break;
        case 'Terminating':
          console.log('Oninvite Invitation session Terminating...');
          break;
        case 'Terminated':
          console.log('Oninvite Invitation session Terminated...');
          session.value = null;
          // hívás(napló) object mentése

          if (callObjcet.value.peer_connection_state.accept == 1){
              console.log("szabályosan lerakott hívás valaki részéről")
              callObjcet.value.peer_connection_state.bye = 1
              callObjcet.value.peer_connection_state.cancel = 1
          }

          addToCallLog(callObjcet.value)
          // hívás object default-ra állítása 
          clearCallObject()
          
          //window.electronApi.closeIncommingCallWindow();
          break;
        default:
          throw new Error("Invitation session Unknown session state.");
          break;
      }



    });


  },
  onMessage: (message) => {
    console.log("onMessage event")
    console.log(message)

  },
  onNotify: (m) => {
    console.log("onNotify event")
    console.log(m)
  },
}

const userAgentOptions = {
  delegate: delegate,
  aor: `sip:${localuser}@${asteriskDomain}`,
  media: {
    remote: {
      audio: true
    }
  },
  authorizationUsername: localuser,
  authorizationPassword: 'webrtc_client',
  transportOptions,
  uri: UserAgent.makeURI(`sip:${localuser}@${asteriskDomain}`)

};


const userAgentInit = () => {
  userAgent.value = new UserAgent(userAgentOptions);
  registerer.value = new Registerer(userAgent.value);
  userAgent.value.start().then(() => {
    registerer.value.register();

  });

  registerer.value.stateChange.addListener((state) => {
    switch (state) {
      case 'Initial':
        break;
      case 'Registered':
        console.log('Useragent registered')
        break;
      case 'Unregistered':
        console.log('Useragent Unregistered')

        break;
      case 'Terminated':
        console.log('Useragent Terminated')
        break;
      default:
        throw new Error("Unknown registerer state.");
    }
  });

}


const addToCallLog = async (logItem) => {
  const id = await db.callList.add({
    call_type: logItem.call_type,
    call_interval_start: logItem.call_interval.start,
    call_interval_end: logItem.call_interval.end,
    peer_connections_local: logItem.peer_connections.local,
    peer_connections_remote: logItem.peer_connections.remote,
    peer_connection_state_ringing: logItem.peer_connection_state.ringing,
    peer_connection_state_accept: logItem.peer_connection_state.accept,
    peer_connection_state_cancel: logItem.peer_connection_state.cancel,
    peer_connection_state_bye: logItem.peer_connection_state.bye,

  });
}



const addUser = async (user) => {
  const id = await db.users.add({
    tasz: user.id,
    rovidszam: user.rovidszam,
    varosi_plusz: user.varosi_plusz,
    varosi: user.varosi,
    email: user.email,
    nev: user.nev,
    favorite: false

  });
}

const getUsersFromDb = async () => {
  try {
    const response = await fetch('http://localhost:3000/api/users');
    const userList = await response.json();
    return userList
  } catch (error) {
    console.error(error);
  }
}
onMounted(async () => {

const count = await db.users.count();

  if (count > 0) {
    console.log('db exists...');
  } else {
    const userList = await getUsersFromDb()
    userList.forEach((user) => {
      addUser(user)
    });
  }


userAgentInit();

  window.callHandlers.setCallingProcess(() => {
    //if (data === 'hangup') {
    session.value.bye();
    //}
  })

    window.callHandlers.onCallAnswer((data) => {
    console.log("kimenő hívás megszakítása *** " + data)
    //endCall();
    session.value.cancel();
  })


  window.callHandlers.onInvitationRejectAnswer((data) => {
    console.log('reject invitation by local user: ', data);
    callObjcet.value.call_interval.end = new Date();
    callObjcet.value.peer_connection_state.cancel = 1
    //if (session.value != null){
    session.value.reject()

    //}
  })

  window.callHandlers.onInvitationAcceptAnswer((data) => {
    console.log('accept invitation by local user: ', data);
    
    onCallReceived(session.value);
  })


window.callHandlers.onOutgoingCall((destination) => {

  const target = UserAgent.makeURI(`sip:${destination}@${asteriskDomain}`);

const inviterOptions = {
      requestDelegate: {
        onAccept: () => {
          console.log("requestDelegate invitation onAccept.....");
          callObjcet.value.peer_connection_state.accept = 1;
          window.callHandlers.setCallState('accept')

        },
        onBye: () => {
          console.log("requestDelegate invitation onBye.....");
          callObjcet.value.peer_connection_state.bye = 1;
          //window.callHandlers.setCallState('accept')

        },
        onReject: () => {
          console.log("requestDelegate invitation onReject.....");
          callObjcet.value.peer_connection_state.cancel = 1;
          console.log("close call window");
        },
        onProgress: (outgoingcall) => {
          console.log("requestDelegate invitation onProgress.....");

        },
        onTrying: (response) => {
          console.log("requestDelegate invitation onTrying.....");
          const destinationUser = response.message.to.uri.raw.user
          console.log(response.message.to.uri.raw.user)
          const invitationOptions = {
            'displayName': destinationUser,
            'userName': destinationUser,
            'type': 'outgoing'

          }
          callObjcet.value.call_type = 'outbound'
          callObjcet.value.call_interval.start = new Date();
          callObjcet.value.peer_connection_state.ringing = 1;
          callObjcet.value.peer_connections.local = localuser;
          callObjcet.value.peer_connections.remote = destinationUser

          window.callHandlers.wakeUpCallWindow(invitationOptions)
        },
        onMessage: () => {
          console.log("requestDelegate invitation onMessage.....");
        },
        onNotify: () => {
          console.log("requestDelegate invitation onNotify.....");
        },
        onCancel: () => {
          console.log("requestDelegate onReject.....");
        },
        onAck: () => {
          console.log("requestDelegate onAck.....");
        },
        onInfo: () => {
          console.log("requestDelegate onInfo.....");
        },
        onRefer: () => {
          console.log("requestDelegate onRefer.....");
        },
      },
      sessionDescriptionHandlerOptions: {
        constraints: { audio: true, video: false },
      },
    };

    const inviter = new Inviter(userAgent.value, target);

    inviter.delegate = {
      onBye: () => {
        console.log("inviter.delegate onBye.....");
      },
      onReject: () => {
        console.log("inviter.delegate onReject.....");
      },
      onCancel: () => {
        console.log("inviter.delegate onReject.....");
      },
      onAck: () => {
        console.log("inviter.delegate onAck.....");
      },
      onInfo: () => {
        console.log("inviter.delegate onInfo.....");
      },
      onRefer: () => {
        console.log("inviter.delegate onRefer.....");
      },


    }

        inviter.invite(inviterOptions).then(() => {
      session.value = inviter;
      onCallCreated(session.value)
    });

})

})
</script>

<template>
  <div>
   <audio ref="remoteAudio" autoplay></audio>

    <!--Custom Menubar-->
     <MenuBar></MenuBar>
    <!--Custom Menubar-->

    <!-- APP CONTENT START-->
    <div class="app-container">
      <div class="sidebar" :class="setCollapsed">
        <div class="logo-details">
          <span class="headset_ico"><i class="fa-solid fa-headset" style="color:#ffff00;font-size: 1.5rem;"></i></span>
          <span class="logo_name">NavTel</span>
          <button class="sidebar-toggler" @click="toggleSidebar">
            <i class="fa-solid fa-left-long" id="bx bx-menu"></i>
          </button>
        </div>
        <SideBar></SideBar>
      </div>

      <section class="home-section">
 
        <router-view />

      </section>
    </div>

    <!-- APP CONTENT END-->

  </div>

</template>


<style>
 .barcontainer {
  background-color: #181818;
  position: relative;
  margin-left: 50px;
  width: 25px;
  height: 200px;
  float: left;

}

.bar {
  background-color: #7514a5;
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 80%;
  box-sizing: border-box;
  animation: grow 1.5s ease-out forwards;
  transform-origin: bottom;
}

@keyframes grow {
  from {
    transform: scaleY(0);
  }
}

:root {
  --body-bg: var(--p-surface-50);
  --card-bg: var(--p-surface-0);
  --card-border: var(--p-surface-200);
}

:root[class="my-app-dark"] {
  --body-bg: var(--p-surface-950);
  --card-bg: var(--p-surface-900);
  --card-border: var(--p-surface-700);
}

.custom-menubar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
}

.app-container {
  padding-top: 3em;
}

.sidebar {
  position: fixed;
  top: 3em;
  left: 0;
  height: calc(100vh - 3em);
  width: 270px;
  /*background-color: var(--body-bg);*/
  background: #7514a5;
  z-index: 100;
  transition: all 0.5s ease;
}

.sidebar.close {
  width: 78px;
}

.sidebar .logo-details {
  height: 60px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-around;
}

.sidebar .logo-details i {
  font-size: 30px;
  color: #fff;
  height: 50px;
  min-width: 78px;
  width: 100%;
  text-align: center;
  line-height: 50px;
}

.sidebar .logo-details .sidebar-toggler {
  margin-left: 20px;
  height: 30px;
  width: 30px;
  color: #151A2D;
  border: none;
  cursor: pointer;
  display: flex;
  background: #fff;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  transition: 0.8s ease;
}

.sidebar .logo-details .logo_name {
  font-size: 22px;
  color: #fff;
  font-weight: 600;
  transition: 0.3s ease;
  transition-delay: 0.1s;
}

.sidebar.close .logo-details .headset_ico {
  transition: 0.8s ease;
  transition-delay: 0.1s;
  transform: translateX(25px);
}

.sidebar.close .logo-details .logo_name {
  transition-delay: 0s;
  opacity: 0;
  pointer-events: none;
}

.sidebar .nav-links {
  padding-top: 25px;
  height: 100%;
  display: flex;
  flex-direction: column;
  transition: 0.8s ease;
  gap: 1em;
  list-style: none;

}

.nav-links-item {
  width: 100%;
  display: flex;
  line-height: 20px;

}

.sidebar .nav-links .nav-links-item .nav-links-item-element {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  height: 30px;

}

.sidebar .nav-links .nav-links-item a {
  font-size: 1.3em;
  color: #fff;
}

.sidebar.close .nav-links {
  overflow: visible;
  display: flex;
  flex-direction: column;
  transition: 0.8s ease;
  gap: 1em;
  transform: translateY(30px) translateX(-15px);
}

.sidebar .nav-links::-webkit-scrollbar {
  display: none;
}

.sidebar .nav-links li {
  position: relative;
  list-style: none;
  transition: all 0.4s ease;
}

/*collapsed sidebar icon colors*/
.sidebar .nav-links li:hover {
  background: #1d1b31;
}

.sidebar .nav-links li .iocn-link {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.sidebar.close .nav-links li .iocn-link {
  display: block
}

.sidebar .nav-links li.showMenu i.arrow {
  transform: rotate(-180deg);
}

.sidebar.close .nav-links i.arrow {
  display: none;
}

.sidebar .nav-links li a {
  display: flex;
  align-items: center;
  text-decoration: none;
}

.sidebar .nav-links li a .link_name {
  font-size: 15px;
  font-weight: 400;
  padding-left: 20px;
  color: #fff;
  transition: all 0.4s ease;
}

.sidebar.close .nav-links li a .link_name {
  opacity: 0;
  pointer-events: none;
}

.sidebar .nav-links li .sub-menu {
  padding: 6px 6px 14px 80px;
  margin-top: -10px;
  background: #1d1b31;
  display: none;
}

.sidebar .nav-links li.showMenu .sub-menu {
  display: block;
}

.sidebar .nav-links li .sub-menu a {
  color: #fff;
  font-size: 15px;
  padding: 5px 0;
  white-space: nowrap;
  opacity: 0.6;
  transition: all 0.3s ease;
}

.sidebar .nav-links li .sub-menu a:hover {
  opacity: 1;
}

/*csukott állapotú sidebar tooltip  */
.sidebar.close .nav-links li .sub-menu {
  position: absolute;
  left: 100%;
  top: -10px;
  margin-top: 0;
  padding: 10px 20px;
  border-radius: 0 6px 6px 0;
  opacity: 0;
  display: block;
  pointer-events: none;
  transition: 0s;
  background: #7514a5;
  color: #fff;
}

.sidebar.close .nav-links li:hover .sub-menu {
  top: 0;
  opacity: 1;
  pointer-events: auto;
  transition: all 0.4s ease;
}

.sidebar .nav-links li .sub-menu .link_name {
  display: none;
}

.sidebar.close .nav-links li .sub-menu .link_name {
  font-size: 15px;
  opacity: 1;
  display: block;
}

.sidebar .nav-links li .sub-menu.blank {
  opacity: 1;
  pointer-events: auto;
  padding: 3px 20px 6px 16px;
  opacity: 0;
  pointer-events: none;
}

.sidebar .nav-links li:hover .sub-menu.blank {
  top: 50%;
  transform: translateY(-50%);
}



.sidebar .profile-details {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 270px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #1d1b31;
  padding: 12px 0;
  transition: all 0.5s ease;
}

.sidebar.close .profile-details {
  background: none;
}

.sidebar.close .profile-details {
  width: 78px;
}

.sidebar .profile-details .profile-content {
  display: flex;
  align-items: center;
}

.sidebar .profile-details img {
  height: 52px;
  width: 52px;
  object-fit: cover;
  border-radius: 16px;
  margin: 0 14px 0 12px;
  background: #1d1b31;
  transition: all 0.5s ease;
}

.sidebar.close .profile-details img {
  padding: 10px;
}

.sidebar .profile-details .logout-icon {
  color: #fff;
  font-size: 1.3em;
  padding-right: 15px;
}





.sidebar .profile-details .profile_name,
.sidebar .profile-details .job {
  color: #fff;
  font-size: 15px;
  font-weight: 500;
  white-space: nowrap;
}

.sidebar.close .profile-details i,
.sidebar.close .profile-details .profile_name,
.sidebar.close .profile-details .job {
  display: none;
}

.sidebar .profile-details .job {
  font-size: 12px;
}

.home-section {
  position: relative;
  background: #fff;
  height: calc(100vh - 3em);
  left: 270px;
  width: calc(100% - 270px);
  transition: all 0.5s ease;
}

.sidebar.close~.home-section {
  left: 78px;
  width: calc(100% - 78px);
}

/*
.home-section .home-content{
  height: 60px;
  display: flex;
  align-items: center;
}
.home-section .home-content .bx-menu,
.home-section .home-content .text{
  color: #11101d;
  font-size: 35px;
}
.home-section .home-content .bx-menu{
  margin: 0 15px;
  cursor: pointer;
}
  */
.sidebar.close .sidebar-toggler {
  transform: translate(-85px, 35px) rotate(180deg);
  transition: all 0.5s ease;
}

/*
.home-section .home-content .text{
  font-size: 26px;
  font-weight: 600;
}*/
@media (max-width: 420px) {
  .sidebar.close .nav-links li .sub-menu {
    display: none;
  }
}

#volume-visualizer {
  --volume: 0%;
  position: relative;
  width: 200px;
  height: 20px;
  margin: 50px;
  background-color: #DDD;
}

#volume-visualizer::before {
  content: '';
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  width: var(--volume);
  background-color: green;
  /*transition: width 100ms linear;*/
}


</style>