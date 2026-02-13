import { createRouter, createWebHistory } from 'vue-router'
import Index from '@/views/Index.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Index,
      meta: { title: 'SNCF-Destination' }
    }
  ]
})

router.beforeEach((to, from, next) => {
  document.title = to.meta.title ?? 'SNCF-Destination'
  next()
})

export default router