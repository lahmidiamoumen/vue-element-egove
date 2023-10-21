import request from '@/utils/request'

export function login(data3) {
  const data = { access_token: 'BZzzPD2EOllZPmGUUjLlmy2l1RbA3B5A' }
  return request({
    url: '/auth',
    method: 'post',
    auth: data3,
    data
  })
}

export function getInfo() {
  return request({
    url: '/users/me',
    method: 'get'
  })
}

export function followUser(data) {
  return request({
    url: '/users/follow',
    method: 'post',
    data
  })
}

export function pushStealth(data) {
  return request({
    url: '/users/stealth',
    method: 'post',
    data
  })
}

export function logout() {
  return request({
    url: '/vue-element-admin/user/logout',
    method: 'post'
  })
}
