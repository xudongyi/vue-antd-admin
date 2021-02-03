import TabsView from '@/layouts/tabs/TabsView'

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
      path: '/mobile/query',
      name: 'mobileQuery',
      component: () => import('@/pages/mobile/query'),
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
      path: '/forgetPwd',
      name: 'forgetPwd',
      component: () => import('@/pages/login/forgetPwd'),
    },
    {
      path: '/modifypwd',
      name: 'modifypwd',
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
            icon: 'money-collect',
            authority:'2'
          },
          component: () => import('@/pages/list/salary/SalaryQueryReport'),
        },
        {
          path: 'salary',
          name: '薪资查询（崇川）',
          meta: {
            icon: 'money-collect',
            site: '21',
          },
          component: () => import('@/pages/list/salary/SalaryQueryList'),
        },
        {
          path: 'salaryST',
          name: '薪资查询（苏通）',
          meta: {
            icon: 'money-collect',
            site: '41',
          },
          component: () => import('@/pages/list/salary/SalaryQueryList'),
        },
        {
          path: 'welfare',
          name: '福利查询（崇川）',
          meta: {
            icon: 'money-collect',
            site: '21',
          },
          component: () => import('@/pages/list/salary/WelfareQueryList'),
        },
        {
          path: 'welfareST',
          name: '福利查询（苏通）',
          meta: {
            icon: 'money-collect',
            site: '41',
          },
          component: () => import('@/pages/list/salary/WelfareQueryList'),
        },
        {
          path: 'log',
          name: '日志查询',
          meta: {
            icon: 'exclamation-circle',
            authority:'2'
          },
          component: () => import('@/pages/log/QueryList'),
        },
        {
          path: 'report',
          name: '报表查询',
          meta: {
            icon: 'exclamation-circle',
            authority:'2',
            site: '21'
          },
          component: () => import('@/pages/list/salary/SalaryReport'),
        },
          {
              path: 'salaryConfig',
              name: '报表配置',
              meta: {
                  icon: 'exclamation-circle',
                  authority:'2',
                  site: '21'
              },
              component: () => import('@/pages/salaryConfig/SalaryReportConfig'),
          },
        {
          path: 'subDeptConfig',
          name: '分部配置',
          meta: {
            icon: 'exclamation-circle',
            authority:'2'
          },
          component: () => import('@/pages/subDeptConfig/SalarySubDeptConfig'),
        },
        {
          path: 'employeeSync',
          name: '人员同步',
          meta: {
            icon: 'exclamation-circle',
            authority:'2'
          },
          component: () => import('@/pages/employeeSync/employeeSyncList'),
        }

      ]
    }
  ]
}

export default options
