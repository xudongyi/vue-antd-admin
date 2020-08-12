import TabsView from '@/layouts/tabs/TabsView'
import PageView from '@/layouts/PageView'

// 路由配置
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
      path: '/',
      name: '首页',
      component: TabsView,
      redirect: '/login',
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
            icon: 'money-collect'
          },
          component: () => import('@/pages/list/QueryList'),
        },
        {
          path: 'log',
          name: '日志查询',
          meta: {
            icon: 'exclamation-circle'
          },
          component: () => import('@/pages/list/QueryList'),
        },
        {
          path: 'result',
          name: '结果页',
          meta: {
            icon: 'check-circle-o',
          },
          component: PageView,
          children: [
            {
              path: 'success',
              name: '成功',
              component: () => import('@/pages/result/Success')
            },
            {
              path: 'error',
              name: '失败',
              component: () => import('@/pages/result/Error')
            }
          ]
        }
      ]
    }
  ]
}

export default options
