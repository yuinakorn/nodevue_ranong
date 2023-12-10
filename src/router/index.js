import {createRouter, createWebHistory} from 'vue-router'
import Home from '../views/Home.vue'
import SearchHn from "@/views/SearchHn";
import Login from "@/views/Login";
import PageNotFound from "@/views/PageNotFound";
import Page401 from "@/views/Page401";
require('dotenv').config();

const secret = process.env.VUE_APP_SECRET_KEY;

function guardMyRoute(to, from, next) {
    let jwt = require('jsonwebtoken');
    let decode = '';
    const token = to.params.token;
    let isAuthenticated = false;

    try {
        decode = jwt.verify(token, secret);
        // console.log("decoded => "+JSON.stringify(decode));
    } catch (err) {
        console.log("err => "+err);
    }

    // console.log("params token => " + token);

    isAuthenticated = !!decode; // shot if

    if (isAuthenticated) {
        next(); // allow to enter route
    } else {
        next('/page401'); // go to 401 page
    }
}

const routes = [
    {
        part: '/',
        redirect: '/login'
    },
    {
        // path: '/:cid/:hcode/t/:token',
        path: '/t/:token',
        name: 'Home',
        component: Home,
        beforeEnter: guardMyRoute,
    },
    {
        path: '/login',
        name: 'Login',
        component: Login
    },
    {
        path: '/search',
        name: 'SearchHn',
        component: SearchHn,
        // beforeEnter: guardMyRoute,
    },
    {
        path: '/page401',
        name: 'Page401',
        component: Page401
    },
    {
        path: '/:pathMatch(.*)*',
        name: 'not-found',
        component: PageNotFound
    },

]

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
})

export default router
