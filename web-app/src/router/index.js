import Vue from 'vue'
import VueRouter from 'vue-router'
import Daily from '@/views/Daily'
import Live from '@/views/Live.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Live',
    component: Live
  },
  {
    path: '/daily',
    name: 'Daily',
    component: Daily
  }
]

const router = new VueRouter({
  routes
})

export default router
