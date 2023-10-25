import { login, getInfo, saveStealth } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import router, { resetRouter } from '@/router'

const state = {
  token: getToken(),
  created: '',
  name: '',
  avatar: '',
  email: '',
  id: '',
  stealth: false,
  roles: []
}

const mutations = {
  SET_STEALTH: (state, token) => {
    state.stealth = token
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_CREATED: (state, introduction) => {
    state.created = introduction
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLES: (state, avatar) => {
    state.roles = avatar
  },
  SET_EMAIL: (state, roles) => {
    state.email = roles
  },
  SET_ID: (state, roles) => {
    state.id = roles
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password }).then(response => {
        const data = response
        const token = `Bearer ${data.token}`

        commit('SET_TOKEN', token)
        setToken(token)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  saveStealth({ commit }, stealth) {
    return new Promise((resolve, reject) => {
      saveStealth({ stealth: JSON.stringify(stealth) }).then(() => {
        commit('SET_STEALTH', stealth.privKey)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo().then(response => {
        const data = response

        if (!data) {
          reject('Verification failed, please Login again.')
        }

        const { email, name, id, createdAt, picture, stealth } = data
        const stealParsed = JSON.parse(stealth)

        const roles = ['admin']

        // roles must be a non-empty array
        // if (!roles || roles.length <= 0) {
        //   reject('getInfo: roles must be a non-null array!')
        // }

        commit('SET_CREATED', createdAt)
        commit('SET_ID', id)
        commit('SET_STEALTH', stealParsed?.privKey)
        commit('SET_ROLES', roles)
        commit('SET_NAME', name)
        commit('SET_AVATAR', picture)
        commit('SET_EMAIL', email)
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
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      commit('SET_CREATED', '')
      commit('SET_ID', '')
      commit('SET_ROLES', '')
      commit('SET_NAME', '')
      commit('SET_AVATAR', '')
      commit('SET_EMAIL', '')
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
