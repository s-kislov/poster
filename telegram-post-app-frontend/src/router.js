import { createRouter, createWebHistory } from 'vue-router';
import Home from './views/Home.vue';
import PostMessage from './components/PostMessage.vue';

const routes = [
    { path: '/', component: Home },
    { path: '/post', component: PostMessage },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
