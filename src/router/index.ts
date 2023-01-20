import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'view1',
      component: () => import('../views/view-1.vue'),
      children: [
        {
          path: 'v1children',
          name: 'v1children',
          component: () => import('../views/view-1-children.vue')
        }
      ]
    },
    {
      path: '/view2',
      name: 'view2',
      component: () => import('../views/view-2.vue')
    }
  ]
})

export default router
