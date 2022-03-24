

const state = {
    page: 1,
    limit: 20,
    keyword: '',
    topicOfIntrest: [],
    profession: [],
    rateOfApproval: 0,
}

const mutations = {
    SET_DATA: (state, data) => {
      state.page = data.page
      state.limit = data.limit
      state.keyword = data.keyword
      state.topicOfIntrest = data.topicOfIntrest
      state.profession = data.profession
      state.rateOfApproval = data.rateOfApproval
    }
}

const actions = {
  
    // remove token
  resetToken({ commit }, data) {
    return new Promise(resolve => {
      commit('SET_DATA', data)
      resolve()
    })
  },
}


export default {
  namespaced: true,
  state,
  mutations,
  actions
}
