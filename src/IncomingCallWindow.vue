<script setup>
import { ref, onMounted } from 'vue';
 

const remoteUser = ref('')

const acceptCall = ()=>{
  console.log("acceptCall");
  window.callHandlers.incomingCallAcceptHandler() 
  .then( ()=>{ 
    //window.electronApi.closeIncommingCallWindow();
  })
}

const rejectCall = ()=>{
  console.log("rejectCall")
  window.callHandlers.incomingCallRejectHandler() 
  .then( ()=>{ 
    //window.electronApi.closeIncommingCallWindow();
  })

  
}

  onMounted(async ()=>{  
    window.callHandlers.invitationOptionsDataLoader((data)=>{
      remoteUser.value=`${data.displayName} [${data.userName}]`  
    })
  })
</script>

<template>
 <div class="card">
  <div class="header">
    <div class="animation">
      <span class="icon ring">
        <i style="color:yellowgreen ;font-size: 2.5em;transform: translateX(20px) translateY(20px);"
           class="fa-solid fa-phone-flip"></i>
      </span>
 
 
    </div>
  >
    <p class="phoneNumber">{{ remoteUser }}</p>
    <p class="calling">Bejövő hívás</p>
  </div>

  <div class="footer">
    <div @click="rejectCall" class="bouton raccrocher">
      <span class="icon red"> 
        <i style="transform: translateX(35px) translateY(10px) rotate(135deg);font-size: 1.6em;color:black" class="fa-solid fa-phone"></i>
      </span>
    </div>
    <div @click="acceptCall" class="bouton decrocher">
      <span class="icon green">
        <i style="transform: translateX(35px) translateY(5px);font-size: 1.6em;color:black" class="fa-solid fa-phone-flip"></i>
      </span>
    </div>
  </div>
	</div>

  
</template>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
/* CODE */



.card {
  position: absolute;
  overflow: hidden;
  width: 450px;
  height: 200px;
  background-color: #1d1b31;
}

.header {
  position: relative;
  width: 100%;
  height: 70%;
  border-top-left-radius: 15px;
  border-top-right-radius: 15px;
  background-color: transparent;
}

.animation {
  position: absolute;
  width: 80px;
  height: 80px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -70%);
  border-radius: 50%;
  background-color: #fff;
}

.ring {
  display: block;
  position: absolute;
  width: 100%;
  height: 100%;
  -webkit-animation: ring 0.6s infinite;
  -o-animation: ring 0.6s infinite;
  animation: ring 0.6s infinite;
}

@keyframes ring {
  0% {
    transform: rotate(0deg);
  }
  20% {
    transform: rotate(-20deg);
  }
  21% {
    transform: rotate(0deg);
  }
  40% {
    transform: rotate(-20deg);
  }
  41% {
    transform: rotate(0deg);
  }
  60% {
    transform: rotate(-20deg);
  }
  80% {
    transform: rotate(-10deg);
  }
  100% {
    transform: rotate(0deg);
  }
}



.phoneNumber {
  width: 100%;
  font-family: 'Open Sans Condensed', sans-serif;
  font-size: 22px;
  text-align: center;
  transform: translateY(100px);
  color: #fff;
}

.calling {
  width: 100%;
  font-family: 'Hind', sans-serif;
  font-size: 20px;
  font-weight: 600;
  text-align: center;
  transform: translateY(100px);
  color: #fff;
  -webkit-animation: opacity 2.5s infinite linear;
  -o-animation: opacity 2.5s infinite linear;
  animation: opacity 2.5s infinite linear;
}

@keyframes opacity {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0.2;
  }
  100% {
    opacity: 1;
  }
}

.footer {
  position: relative;
  width: 100%;
  height: 30%;
  
  border-bottom-left-radius: 15px;
  border-bottom-right-radius: 15px;
  background-color: transparent;
}

.bouton {
  position: absolute;
  display: inline-block;
  width: 100px;
  height: 40px;
  top: 50%;
  cursor: pointer;
  border-radius: 12px;
  transform: translateY(-50%);
}

.raccrocher {
  left: 7%;
  transition: all 0.3s;
  background-color: #E72E04;
}

.decrocher {
  right: 7%;
  transition: all 0.3s;
  background-color: #1ACE7A;
}

.red {
  display: block;
  position: absolute;
  width: 100px;
  height: 40px;
}

.green {
  display: block;
  position: absolute;
  width: 100px;
  height: 40px;
}


 

a {
  text-decoration: none;
  color: #fff;
}
 

 

</style>