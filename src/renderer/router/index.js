import Vue from 'vue'
import Router from 'vue-router'
import store from '@/store'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/login',
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
      redirect: '/login'
    }
  ]
})

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.protected)) {
    if (!store.state.Student.student) {
      next({path: '/'})
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router
