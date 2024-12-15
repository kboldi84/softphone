<script setup>
import { ref,watch,reactive,computed, onMounted } from 'vue';
import { db } from '../../../../dixiedb.js';

const callerid = ref('')
const volume = ref('')
const remote_user_id = ref('') 

const userList = ref()
const selectedUser = ref();

const keysActive = ref({
  keys: ['','','','','','','','','','']
})

const makeCall = ()=> {
    console.log("make call clicked");
    /* 
    1: meg kell hívni az App.vue-ban az invitert, ki kell építeni a hívást
    2: fel kell nyitni a call ablakot, event a node processnek
    */
    // hívás indítás event küldése node process felé
    window.callHandlers.makeCall(callerid.value);


}

const editNumber = (enteredValue) => {
    callerid.value = callerid.value + enteredValue;
}
const deleteNumber = () => {
    callerid.value = callerid.value.substring(0, callerid.value.length - 1);
}

watch(callerid, async (newcallerid, oldcallerid) => {

    if (newcallerid.length > oldcallerid.length){
        const lastInputNumber = newcallerid.substring(newcallerid.length - 1, newcallerid.length);
    keysActive.value.keys[lastInputNumber] = 'active';
    setInterval(()=>{
        keysActive.value.keys[lastInputNumber] = '';
    },250)
    
    }

    
 
  
})
const pressKeyByInput0 = computed(() => {
    return  keysActive.value.keys[0] 
})
const pressKeyByInput1 = computed(() => {
    return  keysActive.value.keys[1] 
})
const pressKeyByInput2 = computed(() => {
    return  keysActive.value.keys[2] 
})

const pressKeyByInput3 = computed(() => {
    return  keysActive.value.keys[3] 
})
const pressKeyByInput4 = computed(() => {
    return  keysActive.value.keys[4] 
})
const pressKeyByInput5 = computed(() => {
    return  keysActive.value.keys[5] 
})

const pressKeyByInput6 = computed(() => {
    return  keysActive.value.keys[6] 
})
const pressKeyByInput7 = computed(() => {
    return  keysActive.value.keys[7] 
})
const pressKeyByInput8 = computed(() => {
    return  keysActive.value.keys[8] 
})
const pressKeyByInput9 = computed(() => {
    return  keysActive.value.keys[9] 
})

 

const makeCallByAddressList = (id)=>{
    callerid.value = id;
    makeCall()
}

const getUsersFromDb = async ()=>{
  try {
    const response = []
    await db.users.each(user => {
         response.push(user)
     });
       

    userList.value =  response ;
     
  } catch (error) {
    console.error(error);
  }
}

onMounted(() => {
    getUsersFromDb();
  

})
</script>

<template>
    <div class="grid-container">
        <div class="grid-sidebar">
            <div class="card flex justify-center">
                <Select v-model="selectedUser" :options="userList" filter optionLabel="nev" placeholder="válassz egy személyt" class="w-full md:w-56">
    <template #value="slotProps">
        <div v-if="slotProps.value" class="flex items-center">
            <div>{{ slotProps.value.nev }}</div>
        </div>
        <span v-else>
            {{ slotProps.placeholder }}
        </span>
    </template>
    <template #option="slotProps">
        <div class="flex items-center">
            <div>
                {{ slotProps.option.nev }} - ({{ slotProps.option.tasz }})
                <Button icon="pi pi-phone" style="margin-left: 30px;" variant="text" raised rounded aria-label="Filter"  @click="makeCallByAddressList(slotProps.option.tasz)"  />
            </div>
        </div>
    </template>
</Select>
     
    </div>
        </div>
        
        <div class="grid-caller">
            <div class="dialpad">
                <div class="inputdial">
                    <InputText type="text" size="large" id="callerid" v-model="callerid" />
                    <button class="delete-left" @click="deleteNumber">
                        <i class="fa-solid fa-delete-left"></i>
                    </button>

                </div>

                <div class="keyboard">
                    <div class="key-row">
                        <div class="key" :class="pressKeyByInput1"  @click="editNumber('1')">
                            <span class="num"><i class="fa-solid fa-1"></i></span>
                            <span class="label"><i style="opacity: .5;" class="fa-solid fa-voicemail"></i></span>
                        </div>
                        <div class="key" :class="pressKeyByInput2"  @click="editNumber('2')">
                            <span class="num"><i class="fa-solid fa-2"></i></span>
                            <span class="label">ABC</span>
                        </div>
                        <div class="key" :class="pressKeyByInput3"  @click="editNumber('3')">
                            <span class="num"><i class="fa-solid fa-3"></i></span>
                            <span class="label">DEF</span>
                        </div>
                    </div>

                    <div class="key-row">
                        <div class="key" :class="pressKeyByInput4" @click="editNumber('4')">
                            <span class="num"><i class="fa-solid fa-4"></i></span>
                            <span class="label">GHI</span>
                        </div>
                        <div class="key" :class="pressKeyByInput5" @click="editNumber('5')">
                            <span class="num"><i class="fa-solid fa-5"></i></span>
                            <span class="label">JKL</span>
                        </div>
                        <div class="key" :class="pressKeyByInput6" @click="editNumber('6')">
                            <span class="num"><i class="fa-solid fa-6"></i></span>
                            <span class="label">MNO</span>
                        </div>
                    </div>
                    <div class="key-row">
                        <div class="key" :class="pressKeyByInput7" @click="editNumber('7')">
                            <span class="num"><i class="fa-solid fa-7"></i></span>
                            <span class="label">PQRS</span>
                        </div>
                        <div class="key" :class="pressKeyByInput8" @click="editNumber('8')">
                            <span class="num"><i class="fa-solid fa-8"></i></span>
                            <span class="label">TUV</span>
                        </div>
                        <div class="key" :class="pressKeyByInput9" @click="editNumber('9')">
                            <span class="num"><i class="fa-solid fa-9"></i></span>
                            <span class="label">WXYZ</span>
                        </div>
                    </div>

                    <div class="key-row">
                        <div class="key"  @click="editNumber('*')">
                            <span class="num" style="font-weight: 700;font-size: 1.2em;">*</span>
                            <span class="label"> </span>
                        </div>
                        <div class="key" :class="pressKeyByInput0" @click="editNumber('0')">
                            <span class="num"><i class="fa-solid fa-0"></i></span>
                            <span class="label"><i class="fa-solid fa-plus"></i></span>
                        </div>
                        <div class="key" @click="editNumber('#')">
                            <span class="num"><i class="fa-solid fa-hashtag"></i></span>
                            <span class="label"></span>
                        </div>
                    </div>

                    <div class="key-row">
                        <!--<div class="key">
                            <span class="mic">
                                <i class="fa-solid fa-microphone-lines-slash"></i>
                            </span>
                        </div>
                        <div class="key">
                            <span class="group">
                                <i class="fa-solid fa-people-group"></i>
                            </span>
                        </div>-->
                        <div @click="makeCall" class="key">
                            <span class="phone">
                                <i class="fa-solid fa-phone"></i>
                            </span>
                        </div>
                    </div>

                </div>

            </div>
        </div>


    </div>
</template>

<style scoped>
.grid-container {
    height: calc(100vh - 3em);
    display: flex;
    flex-direction: row;
}
 
.grid-sidebar {
    
    width: 40%;
}

.grid-caller {
    
    width: 60%;
}

.dialpad {
    height: 70%;

}

.inputdial {
    margin-top: 40px;
    text-align: center;
}

.delete-left {

    height: 30px;
    width: 30px;
    color: #151A2D;
    border: none;
    cursor: pointer;
    background: #fff;
    font-size: 1.6em;
}
.keyboard {
    margin: 0 auto;
    width: 70%;
    margin-top: 40px;
    padding-bottom: 20px;
    border-radius: 18px;
    box-shadow: 0px 0px 17px -1px rgba(132, 132, 132, 0.15);
}

/* numpad style start*/
.keyboard .key-row {
    width: 100%;
    font-size: 0;
    text-align: center;
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
    padding-top: 15px;

}
.keyboard .key-row .key {
    padding-top: 8px;
    font-size: 20px;
    color: #000;
    display: flex;
    flex-direction: column;
    border-radius: 50%;
    width: 70px;
    height: 70px;
    border: 1px solid rgba(0, 0, 0, 0.02);
    transition: 250ms;
    box-shadow: 8px 8px 8px 0px rgba(132, 132, 132, 0.09);
}
.keyboard .key-row .key:hover {
    background: #151A2D;
    opacity: .3;
    color: #fff;
}
.keyboard .key-row .key:active {
    background: #151A2D;
    opacity: .8;
    color: #fff;
}
.keyboard .key-row .key.active {
    background: #151A2D;
    opacity: .8;
    color: #fff;
}
.keyboard .key-row .key .label{
    font-size: 15px;
}

.keyboard .key-row .key .phone {
    margin-top: 5px;
    color: green;
    font-size: 1.6em;
}

.keyboard .key-row .key .mic {
    margin-top: 10px;
    color: black;
    font-size: 1.4em;
}

.keyboard .key-row .key .group {
    margin-top: 10px;
    color: black;
    font-size: 1em;
}
/* numpad style end*/
</style>