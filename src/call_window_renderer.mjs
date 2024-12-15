import './index.css'; 
import "primeicons/primeicons.css";
import '@fortawesome/fontawesome-free/js/all'
 
import { createApp } from 'vue';
import Aura from '@primevue/themes/aura';
import CallComponent from "./CallWindow.vue"; 
import PrimeVue from 'primevue/config'; 




const app = createApp(CallComponent); 

app.use(PrimeVue,{
    theme: {
        preset: Aura,
        options: {
            darkModeSelector: '.my-app-dark',
        }
    }
})
 
app.mount("#app");
console.log('call window renderer log');