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
    url: '/v1/members',
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
