import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export const path = {
  index: '/'
}

const routes = [
  {
    path: path.index,
    component: () => import('../views/index'),
    name: 'index',
    meta: {
      requireAuth: true
    }
  }
]

export default new Router({
  routes: routes,
  base: '/'
})
