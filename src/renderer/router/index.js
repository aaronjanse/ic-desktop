import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'login',
      component: require('@/components/Login').default
    },
    {
      path: '/about',
      name: 'about',
      component: require('@/components/About').default,
      meta: { protected: true }
    },
    {
      path: '/recent',
      name: 'recent',
      component: require('@/components/Recent').default,
      meta: { protected: true }
    },
    {
      path: '/grades',
      name: 'grades',
      component: require('@/components/Grades').default,
      children: [
        {
          path: ':id',
          component: require('@/components/Assignments').default
        }
      ],
      meta: { protected: true }
    },
    {
      path: '/attendance',
      name: 'attendance',
      component: require('@/components/Attendance').default,
      meta: { protected: true }
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})

export default router
