/**
 * Created by fedrtg on 2020/8/6.
 */
/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const courseRouter = {
  path: '/course',
  component: Layout,
  redirect: '/table/complex-table',
  name: 'course',
  meta: {
    title: '课程管理',
    icon: 'table'
  },
  children: [
    {
      path: 'record',
      component: () => import('@/new-views/course/courseRecord/CourseRecord.vue'),
      name: 'courseRecord',
      meta: { title: '课程记录' }
    }
  ]
}
export default courseRouter
