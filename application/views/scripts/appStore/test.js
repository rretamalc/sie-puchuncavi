const test = new Vuex.Store({
  state: () => ({
    test: 'test'
  }),
  mutations: {
    increment (state) {
      // `state` is the local module state
      state.count++
    }
  },

  getters: {
    getTest (state) {
      return state.test
    }
  }
})
