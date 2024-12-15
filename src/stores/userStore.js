import { defineStore } from "pinia";

export const useUseragentStore = defineStore ({
    id: 'useragent',
    state: ()=> ({
        connected: false,
        registered: false,
        dndtoggled: false
    }),
    actions: {
        connectionStateChange(connectionStateValue){
            this.connected = connectionStateValue
        },
        deviceStateChange(registerStateValue){
            this.registered = registerStateValue
        },
        setDnD(){
            this.dndtoggled = !this.dndtoggled
        }
    },
    getters: {
        isConnected: (state) => {
            if (state.connected) return true
            return false
        },
        isRegistered: (state) => {
            if (state.registered) return true
            return false
        },
        getDndInfo: (state) => {
            return state.dndtoggled
        }
    }
})