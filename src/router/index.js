import { createWebHashHistory,createRouter } from "vue-router";
import Home from '../components/UI/views/home/Home.vue'
import Calls from '../components/UI/views/call/Calls.vue'
import Favorites from '../components/UI/views/favorites/Favorites.vue'
import Nevjegyzek from '../components/UI/views/nevjegyzek/Nevjegyzek.vue'
import Hivaslista from '../components/UI/views/hivaslista/Hivaslista.vue'


const routes = [
    {
      path: '/',
      name: 'Home',
      meta: { requiresAuth: false ,authLevel:0},
      component: Home, 
    },
    {
      path: '/Calls',
      name: 'Calls',
      meta: { requiresAuth: false ,authLevel:0},
      component: Calls
    },
    {
      path: '/Fav',
      name: 'Fav',
      meta: { requiresAuth: false ,authLevel:0},
      component: Favorites
    },
    {
      path: '/Cimtar',
      name: 'Cimtar',
      meta: { requiresAuth: false ,authLevel:0},
      component: Nevjegyzek
    },
    {
      path: '/Logs',
      name: 'Logs',
      meta: { requiresAuth: false ,authLevel:0},
      component: Hivaslista
    },
  ]
const router = createRouter({
    history: createWebHashHistory(),
    routes,
})
export default router