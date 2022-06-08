const inicio = new Vuex.Store({
  state: () => ({
    inicios: 2
  }),
  mutations: {
    increment (state) {
      // `state` is the local module state
      state.count++
    }
  },

  getters: {
    getInicios (state) {
      return state.inicios
    }
  }
})
