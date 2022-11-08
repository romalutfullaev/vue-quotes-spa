import { createRouter, createWebHistory } from 'vue-router';
import App from '../App.vue';

const routes = [
    {
        path: '/',
        name: 'App',
        component: App,
        children: [
            {
                path: '/feed',
                name: 'feed',
                component: () => import('../views/feed/Feed.vue')
            },
        ]
    }
];

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes,
    scrollBehavior(to, from, savedPosition) {
        if (savedPosition) return savedPosition;
        else return { left: 0, top: 0 };
    }
});

export default router;
