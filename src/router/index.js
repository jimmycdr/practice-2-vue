import { createRouter, createWebHistory } from 'vue-router'
import PropertyList from '@/views/PropertyList.vue';
import HomePage from '@/views/HomePage.vue';
import ClientsPage from '@/views/ClientsPage.vue';
import AgentPage from '@/views/AgentPage.vue';
import ConfigPage from '@/views/ConfigPage.vue';


const routes = [
  { path: '/', name: 'home', component: HomePage },
  { path: '/properties', name: 'properties', component: PropertyList },
  { path: '/clients', name: 'clients', component: ClientsPage },
  { path: '/agents', name: 'agents', component: AgentPage },
  { path: '/settings', name: 'settings', component: ConfigPage },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
