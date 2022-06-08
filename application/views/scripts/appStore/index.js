const index = new Vuex.Store({
  state: () => ({
    api: 'https://sie.colegiospuchuncavi.cl/',
    // api: 'http://localhost:8891/Soft/sie_colegiospuchuncavi/',
  }),
  getters: {
    api: state => {
      return state.api
    },
  },
})