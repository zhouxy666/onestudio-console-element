/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const tableRouter = {
  path: '/mch',
  component: Layout,
  redirect: '/table/complex-table',
  name: 'mchInfo',
  meta: {
    title: '商户管理',
    icon: 'table'
  },
  children: [
    {
      icon: '/table',
      path: 'baseinfo',
      component: () => import('@/new-views/mech/base-info/BaseInfo'),
      name: 'mchInfo',
      meta: { title: '商户信息' }
    },
    {
      icon: '/table',
      path: 'lockinfo',
      component: () => import('@/new-views/mech/lock-info/LockInfo'),
      name: 'mchLock',
      meta: { title: '锁粉信息' }
    }
  ]
}
export default tableRouter
