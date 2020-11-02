import {
  login, logout, getInfo,
  getMembers, getMember, addMember, deleteMember, updateMember, searchMember,
  getGrades, getGrade, updateGrade, deleteGrade, createGrade, bindMembers, unBindMembers
} from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import router, { resetRouter } from '@/router'
import { param } from '@/utils'

const state = {
  token: getToken(),
  name: '',
  avatar: '',
  introduction: '',
  roles: []
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_INTRODUCTION: (state, introduction) => {
    state.introduction = introduction
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password, type: 100 }).then(response => {
        commit('SET_TOKEN', response.data)
        setToken(response.data)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(response => {
        const { data } = response

        if (!data) {
          reject('Verification failed, please Login again.')
        }

        data['roles'] = ['admin']
        data['name'] = data.nickname
        data['avatar'] = 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif'
        data['introduction'] = '这是一个很牛逼的系统'

        const { roles, name, avatar, introduction } = data

        // roles must be a non-empty array
        if (!roles || roles.length <= 0) {
          reject('getInfo: roles must be a non-null array!')
        }

        commit('SET_ROLES', roles)
        commit('SET_NAME', name)
        commit('SET_AVATAR', avatar)
        commit('SET_INTRODUCTION', introduction)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  getMembers({ commit, state }, params) {
    return new Promise((resolve, reject) => {
      getMembers(params).then(data => {
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  getMember({ commit, state }, memberId) {
    return new Promise((resolve, reject) => {
      getMember(memberId).then(data => {
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  searchMember({ commit, state }, params) {
    return new Promise((resolve, reject) => {
      searchMember(params).then(data => {
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  addMember({ commit, state }, member) {
    return new Promise((resolve, reject) => {
      addMember(member).then(data => {
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  deleteMember({ commit, state }, memberId) {
    return new Promise((resolve, reject) => {
      deleteMember(memberId).then(data => {
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  updateMember({ commit, state }, params) {
    return new Promise((resolve, reject) => {
      updateMember(params).then(data => {
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  createGrade({ commit, state }, params) {
    return new Promise((resolve, reject) => {
      createGrade(params).then(data => {
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  updateGrade({ commit, state }, params) {
    return new Promise((resolve, reject) => {
      updateGrade(params).then(data => {
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  getGrades({ commit, state }, params) {
    return new Promise((resolve, reject) => {
      getGrades(params).then(data => {
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  getGrade({ commit, state }, params) {
    return new Promise((resolve, reject) => {
      getGrade(params).then(data => {
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  deleteGrade({ commit, state }, gradeId) {
    return new Promise((resolve, reject) => {
      deleteGrade(gradeId).then(data => {
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  unBindMembers({ commit, state }, params) {
    return new Promise((resolve, reject) => {
      unBindMembers(params).then(data => {
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  bindMembers({ commit, state }, params) {
    return new Promise((resolve, reject) => {
      bindMembers(params).then(data => {
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state, dispatch }) {
    return new Promise((resolve, reject) => {
      // logout(state.token).then(() => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      removeToken()
      resetRouter()

      // reset visited views and cached views
      // to fixed https://github.com/PanJiaChen/vue-element-admin/issues/2485
      dispatch('tagsView/delAllViews', null, { root: true })

      resolve()
      // }).catch(error => {
      //   reject(error)
      // })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      removeToken()
      resolve()
    })
  },

  // dynamically modify permissions
  async changeRoles({ commit, dispatch }, role) {
    const token = role + '-token'

    commit('SET_TOKEN', token)
    setToken(token)

    const { roles } = await dispatch('getInfo')

    resetRouter()

    // generate accessible routes map based on roles
    const accessRoutes = await dispatch('permission/generateRoutes', roles, { root: true })
    // dynamically add accessible routes
    router.addRoutes(accessRoutes)

    // reset visited views and cached views
    dispatch('tagsView/delAllViews', null, { root: true })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
