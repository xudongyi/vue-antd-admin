import TabsView from '@/layouts/tabs/TabsView'
import PageView from '@/layouts/PageView'

// 路由配置(路由不设置则全部人能够看，设置了role 则只能)
const options = {
  routes: [
    {
      path: '/login',
      name: '登录页',
      component: () => import('@/pages/login')
    },
    {
      path: '*',
      name: '404',
      component: () => import('@/pages/exception/404'),
    },
    {
      path: '/403',
      name: '403',
      component: () => import('@/pages/exception/403'),
    },
    {
      path: '/sso/:loginid/:token',
      name: 'sso',
      component: () => import('@/pages/login/Sso'),
    },
    {
      path: '/firstLogin',
      name: 'firstLogin',
      component: () => import('@/pages/login/firstLogin'),
    },
    {
      path: '/modifypwd',
      name: 'modifypwd.vue',
      component: () => import('@/pages/user/modifypwd'),
    },
    {
      path: '/',
      name: '首页',
      component: TabsView,
      redirect: '/index',
      children: [
        {
          path: 'index',
          name: '首页',
          meta: {
            icon: 'dashboard'
          },
          component: () => import('@/pages/dashboard/analysis'),
        },
        {
          path: 'query',
          name: '薪资查询',
          meta: {
            icon: 'money-collect',
          },
          component: () => import('@/pages/list/salary/SalaryQueryList'),
        },
        {
          path: 'report',
          name: '报表查询',
          meta: {
            icon: 'money-collect',
          },
          component: () => import('@/pages/list/salary/SalaryQueryReport'),
        },
        {
          path: 'log',
          name: '日志查询',
          meta: {
            icon: 'exclamation-circle',
            authority:'2'
          },
          component: () => import('@/pages/log/QueryList'),
        }

      ]
    }
  ]
}

export default options
