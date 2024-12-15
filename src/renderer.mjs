import './index.css'; 
import "primeicons/primeicons.css";
import '@fortawesome/fontawesome-free/js/all'
 
import { createApp } from 'vue';
import Toast from 'primevue/toast';
import ToastService from 'primevue/toastservice';
import Aura from '@primevue/themes/aura';
import App from "./App.vue"; 
import { definePreset } from '@primevue/themes';
import PrimeVue from 'primevue/config'; 
import { createPinia } from 'pinia'

import router from './router/index';

const MyPreset = definePreset(Aura, {
    semantic: {
        primary: {
            50: '{indigo.50}',
            100: '{indigo.100}',
            200: '{indigo.200}',
            300: '{indigo.300}',
            400: '{indigo.400}',
            500: '{indigo.500}',
            600: '{indigo.600}',
            700: '{indigo.700}',
            800: '{indigo.800}',
            900: '{indigo.900}',
            950: '{indigo.950}'
        },
        formField:{
            paddingX: '1rem',
            paddingY: '1rem'
        },
        myButton: {
            paddingX: '2rem',
            paddingY: '1rem'
        },
        colorSchma: {
            light: {
                formField: {
                    hoverBorderColor: '{primary.color}'
                }
            },
            dark:{
                formField: {
                    hoverBorderColor: '{primary.color}'
                },
                surface: {
                    50 : '{zinc.50}',
                   100 : '{zinc.100}',
                   200 : '{zinc.200}',
                   300 : '{zinc.300}',
                   400 : '{zinc.400}',
                   500 : '{zinc.500}',
                   600 : '{zinc.600}',
                   700 : '{zinc.700}',
                   800 : '{zinc.800}',
                   900 : '{zinc.900}',
                   950 : '{zinc.950}',

                }
            }
        }
    },
    components:{
        button: {
            extend: {
                accent: {
                    background: 'indigo',
                borderColor: 'indigo',
                color: 'white'
                }
            }
        }
    },
    css: ({dt}) => `
    .p-button.p-button-accent {
        background: ${dt('button.accent.background')};
        border-color: ${dt('button.accent.border.color')};
        color: ${dt('button.accent.color')};
    }
    `
});

const app = createApp(App); 
app.use(createPinia())
app.use(ToastService);
app.use(PrimeVue,{
    theme: {
        preset: MyPreset,
        options: {
            darkModeSelector: '.my-app-dark',
        }
    }
})

 
app.use(router)
app.mount("#app");
console.log('renderer log');