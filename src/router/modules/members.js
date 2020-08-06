/**
 * Created by fedrtg on 2020/8/6.
 */
/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const memberRouter = {
  path: '/member',
  component: Layout,
  redirect: '/table/complex-table',
  name: 'member',
  meta: {
    title: '会员信息',
    icon: 'table'
  },
  children: [
    {
      path: 'user',
      component: () => import('@/new-views/members/user/UserPage.vue'),
      name: 'userInfo',
      meta: { title: '用户信息' }
    }
  ]
}
export default memberRouter
