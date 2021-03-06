import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  mode: process.env.VUE_APP_ROUTER_MODE,
  linkActiveClass: 'active',
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/Home.vue')
    },
    {
      path: '/subject/:id',
      name: 'subject',
      component: () => import('@/views/Subject.vue')
    },
    {
      path: '/search',
      name: 'search',
      component: () => import('@/views/Search.vue')
    },
    {
      path: '/signup',
      name: 'signup',
      component: () => import('@/views/Signup.vue')
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/Login.vue')
    },
    {
      path: '/user/:name',
      name: 'profile',
      component: () => import('@/views/User.vue')
    },
    {
      path: '/admin',
      name: 'admin',
      component: () => import('@/views/Admin.vue')
    },
    {
      path: '*',
      name: 'notFound',
      component: () => import('@/views/NotFound.vue')
    }
  ]
})
