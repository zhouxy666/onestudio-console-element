import request from '@/utils/request'

export function login(data) {
  // return request({
  //   url: '/vue-element-admin/user/login',
  //   method: 'post',
  //   data
  // })
  return request({
    url: '/v1/token',
    method: 'post',
    data
  })
}

// export function getInfo(token) {
//   return request({
//     url: '/vue-element-admin/user/info',
//     method: 'get',
//     params: { token }
//   })
// }
export function getInfo(token) {
  return request({
    url: '/v1/user',
    method: 'get',
    params: { token }
  })
}

export function getMembers(params) {
  return request({
    url: '/v1/members',
    method: 'get',
    params
  })
}

export function getMember(memberId) {
  return request({
    url: `/v1/members/${memberId}`,
    method: 'get'
  })
}

export function addMember(data) {
  return request({
    url: '/v1/members',
    method: 'post',
    data
  })
}

export function deleteMember(memberId) {
  return request({
    url: `/v1/members/${memberId}`,
    method: 'delete'
  })
}

export function updateMember(data) {
  return request({
    url: `/v1/members/${data.id}`,
    method: 'put',
    data
  })
}

export function logout() {
  return request({
    url: '/vue-element-admin/user/logout',
    method: 'post'
  })
}

export function getGrades(params) {
  return request({
    url: '/v1/grade',
    method: 'get'
  })
}

export function getGrade(gradeId) {
  return request({
    url: `/v1/grade/${gradeId}`,
    method: 'get'
  })
}

/**
 * @param {{"grade_name":"3班","week":"2", "start_time":"11:00","end_time":"12:30"}}
 */
export function createGrade(params) {
  return request({
    url: '/v1/grade',
    method: 'post',
    params
  })
}

/**
 *
 * @param {{"grade_name":"2班","week":"2", "start_time":"11:00","end_time":"12:30","member_ids":"16"}}
 */
export function updateGrade(params) {
  return request({
    url: '/v1/grade/24',
    method: 'put'
  })
}

export function deleteGrade(gradeId) {
  return request({
    url: `/v1/grade/${gradeId}`,
    method: 'delete'
  })
}

