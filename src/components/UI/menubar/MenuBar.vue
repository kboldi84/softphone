<script setup>
import {ref } from 'vue';
 


const dark = ref(false)


const closeApp = ()=>{
  window.electronApi.closeMainWindow()
}

const minimizeApp = ()=>{
  window.electronApi.hideMainWindow()
}

const setThemeStyle = ()=>{
  console.log("clicked theme selector");
  dark.value = !dark.value;
  document.documentElement.classList.toggle('my-app-dark');
}

//pi pi-sun, pi pi-moon

</script>

<template>
      <Menubar style="-webkit-app-region: drag; background-color:#7514a5; border-radius: 0; height:3em; "
        class="custom-menubar">
        <template #start>
          <OverlayBadge value=""   severity="success" >
            <Avatar label="BK" class="mr-2" style="background-color: #dee9fc; color: #1a2551" shape="circle" />
          
      </OverlayBadge>
          <div class="user">
            <span id="username">Boldizsár Krisztián</span>
            <span id="ustatus">Online</span>
          </div>
         

        </template>

        <template #end>
          <div class="flex items-center gap-2" style="-webkit-app-region: no-drag;">
            <i class="pi pi-sun" v-if="dark" style="color: white; padding: 0.75em;margin-right: 1em;cursor:pointer" @click="setThemeStyle"></i>
            <i class="pi pi-moon" v-if="!dark" style="color: white; padding: 0.75em;margin-right: 1em;cursor:pointer" @click="setThemeStyle"></i>
            <i class="pi pi-minus" style="color: white; padding: 0.75em;margin-right: 1em;cursor:pointer"
              @click="minimizeApp"></i>
            <i class="pi pi-times" style="color: white; padding: 0.75em;margin-right: 0.2em;cursor:pointer"
              @click="closeApp"></i>
          </div>
        </template>
      </Menubar>
 
</template>

<style scoped>
.user {
  margin-left: 10px;
  display: flex;
  flex-direction: column;
}
.dark-theme-selector{
  margin-left: 40px;
  color:#fff;
}

.dark-theme-selector >Button{
  color:#fff;
  box-shadow:  1px 2px 4px #fff;
}



#ustatus {
  padding-left: 8px;
  font-size: 12px;
  font-weight: 600;
  color: aqua;
}
#username {
  padding-left: 8px;
  font-size: 12px;
  font-weight: 600;
  color:chartreuse;
}
   
</style>
