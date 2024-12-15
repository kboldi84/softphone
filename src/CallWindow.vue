<script setup>
import { ref, onMounted, computed, watch } from 'vue';

const title = ref('')
const callingContext = ref('') //Hívása...  Keres...
const destinationUser = ref('')
const callType = ref("")
const onTrying = ref(true)
const callState = ref('')

const timer = ref('00:00')


var startTime; // to keep track of the start time
var stopwatchInterval; // to keep track of the interval
var elapsedPausedTime = 0; // to keep track of the elapsed time while stopped
 
const startWatch = ()=> {
        if (!stopwatchInterval) {
          startTime = new Date().getTime() - elapsedPausedTime; // get the starting time by subtracting the elapsed paused time from the current time
          stopwatchInterval = setInterval(updateWatch, 1000); // update every second
        }
}
const updateWatch = ()=> {
        var currentTime = new Date().getTime(); // get current time in milliseconds
        var elapsedTime = currentTime - startTime; // calculate elapsed time in milliseconds
        var seconds = Math.floor(elapsedTime / 1000) % 60; // calculate seconds
        var minutes = Math.floor(elapsedTime / 1000 / 60) % 60; // calculate minutes
        var hours = Math.floor(elapsedTime / 1000 / 60 / 60); // calculate hours
        var displayTime = pad(hours) + ":" + pad(minutes) + ":" + pad(seconds); // format display time
        timer.value = displayTime; // update the display
      }
const  pad = (number)=> {
        // add a leading zero if the number is less than 10
        return (number < 10 ? "0" : "") + number;
 }
        

watch(callState, async (newcallState, oldcallState) => {

    switch (newcallState) {
        case 'accept':
            onTrying.value = false;

            // timer indítása
            startWatch()

            break;
        default:
            break;
    }

})

 

const rejectCall = ()=>{
  console.log("reject Call")

 window.callHandlers.onAnswerHandler('reject') 
  .then( ()=>{ 
    //window.callHandlers.closeCallWindow();
  })

  
}
const hangup = ()=>{
    console.log('hangup clicked')
    console.log('hívás megszakítás hívás közben')
    window.callHandlers.onHangUpCall()
}

onMounted(() => {
    window.callHandlers.invitationOptionsDataLoader((data) => {

   console.log('data :', data)


        switch (data.callType) {
            case 'outgoing':
                title.value = 'Kimenő hívás'
                callType.value = 'outgoing'
                destinationUser.value = data.displayName
                callingContext.value = 'Hívása...'
                break;
            case 'inbound':
                title.value = 'Bejövő hívás';
                callType.value = 'inbound';
                destinationUser.value = data.displayName;
                callingContext.value = 'Hívásban van...';
                callState.value = 'accept'
                break;
            default:
                break;
        }


    })

    window.callHandlers.onCallingStateChange((state) => {
        console.log(`call state change to ${state}`)
        callState.value = state;
    })


    



})
</script>

<template>
 <Menubar style="-webkit-app-region: drag; background-color:#f5f5f5; border-radius: 0; height:3em; "
        class="custom-menubar">
        <template #start>
            <!--<svg width="23" height="30" viewBox="0 0 35 40" fill="none" xmlns="http://www.w3.org/2000/svg" class="h-8" style="-webkit-app-region: no-drag;">
            <path d="..." fill="slateblue" />
            <path d="..." fill="grey" />
        </svg>-->
        </template>

        <template #end>
            <div class="flex items-center gap-2" style="-webkit-app-region: no-drag;">



                <i class="pi pi-minus" style="color: slateblue; padding: 0.75em;margin-right: 2em;"
                    @click="minimizeApp"></i>
                <i class="pi pi-times" style="color: slateblue; padding: 0.75em;margin-right: 0.2em;"
                    @click="closeApp"></i>


            </div>
        </template>
    </Menubar>

    <div class="content">
        <div class="title">
            <h2>{{ title }} </h2>
        </div>
        <div v-if="onTrying" class="preloader-container">
            <div class="card">
                <div class="header">
                    <div class="animation">

                        <span class="icon ring"><i
                                style="color:green ;font-size: 2.5em;transform: translateX(20px) translateY(20px);"
                                class="fa-solid fa-phone-flip"></i></span>
                        <div class="cercle one"></div>
                        <div class="cercle two"></div>
                        <div class="cercle three"></div>
                    </div>

                    <p class="phoneNumber">{{ destinationUser }}</p>
                    <p class="calling">{{ callingContext }}</p>
                </div>

                <div class="footer">
                    <div class="btn-reject">
                        <Button label="Leteszem" @click="rejectCall()" severity="danger" icon="pi pi-times-circle" />
                    </div>
               
                </div>
            </div>
        </div>
        <div v-if="!onTrying" class="call-container">
            <div class="timer">
                <i class="fa-regular fa-clock"></i> - {{ timer }}
                <!--<Tag severity="secondary" value="00:00"></Tag>-->
            </div>
            <div class="remote_user">
                {{ destinationUser }}
            </div>
            <div class="avatar">
                <i class="pi pi-user" style="color: #fff"></i>
            </div>

        </div>
        <div class="controls">
            <div class="btn_cnfg mic"><i class="fa-solid fa-microphone"></i></div>
            <div class="btn_cnfg"><i class="fa-solid fa-volume-high"></i></div>
            <div class="btn_cnfg"><i class="fa-solid fa-circle-pause"></i></div>
            <div class="btn_cnfg" @click="hangup"><i class="fa-solid fa-phone-slash"></i></div>
        </div>

    </div>

</template>

<style scoped>
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

.content {
    /*background-color: rgb(117, 20, 165);*/
    background-color: #1d1b31;
}

.title {
    text-align: center;
    color: #fff;
}

.preloader-container {
    transition: all 0.8s ease;
}

.call-container {
    text-align: center;
    display: flex;
    flex-direction: column;
    transition: all 0.5s ease;
    width: 100%;

    color: #fff;
}

.timer {
    margin-top: 20px;
    color: #ffff00;

}

.remote_user {
    padding-top: 20px;
    color: #fff;
    text-align: center;
    font-size: 25px;

}

.avatar {
    padding-top: 30px;
}

.avatar i {
    padding-top: 25px;
    font-size: 10em;
    width: 250px;
    height: 250px;
    border-radius: 50%;
    color: #ffff00;
    box-shadow: 2px 2px 2px #fff;
}

.controls {

    height: 242px;
    padding-top: 50px;
    display: flex;
    flex-direction: row;
    justify-content: center;
    justify-items: flex-end;
}

.btn_cnfg {
    margin-left: 30px;
    padding-left: 13px;
    padding-top: 8px;
    color: #fff;
    font-size: 20px;
    width: 50px;
    height: 50px;
    cursor: pointer;
    border-radius: 50%;
    border: 1px solid rgba(255, 255, 255, .3);
    box-shadow: 0px 1px 1px #fff;
}

.btn_cnfg.mic {
    padding-left: 17px
}

.btn_cnfg:hover {
    background-color: #fff;
    color: #000;
}

.btn_cnfg:active {
    background-color: rgba(255, 255, 255, .3);
    color: #000;
}

/*




.btn-mic button {
    cursor: pointer;
    font-size: 1.2em;
    margin-left: 25px;
    padding-top: 5px;
    padding-bottom: 5px;
    border-radius: 10px;
}

.btn-mic button:hover {
    background-color: grey;
}*/

.card {
    position: absolute;
    overflow: hidden;
    width: 100%;
    height: 92%;
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

.cercle {
    position: absolute;
    width: 130px;
    height: 130px;
    transform: translate(-25px, -25px);
    border-radius: 50%;
    border: 10px solid #fff;
    background-color: transparent;
    -webkit-animation: wave 1.4s infinite linear;
    -o-animation: wave 1.4s infinite linear;
    animation: wave 1.4s infinite linear;
}

.two {
    animation-delay: 0.35s;
    opacity: 0;
}

.three {
    animation-delay: 0.7s;
    opacity: 0;
}

@keyframes wave {
    0% {
        width: 130px;
        height: 130px;
        transform: translate(-25px, -25px);
        opacity: 1;
        border-width: 8px;
    }

    100% {
        width: 320px;
        height: 320px;
        transform: translate(-120px, -120px);
        opacity: 0.2;
        border-width: 15px;
    }
}

.phoneNumber {
    width: 100%;
    font-family: 'Open Sans Condensed', sans-serif;
    font-size: 25px;
    text-align: center;
    transform: translateY(350px);
    color: #fff;
}

.calling {
    width: 100%;
    font-family: 'Hind', sans-serif;
    font-size: 14px;
    font-weight: 300;
    text-align: center;
    transform: translateY(370px);
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
    margin-top: 15px;
    margin: 0 auto;
    display: flex;
    width: 80%;
    justify-content: space-evenly;
    justify-items: center;
    /*background-color: #fff;*/
}
 
</style>