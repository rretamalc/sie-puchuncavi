const apoderados = new Vuex.Store({
  state: () => ({
    apoderados: [],
    selectedApoderado: null,
    error: false,
    errorMessage: '',
  }),
    computed: {
      ...Vuex.mapState(['index', 'api']),
    },
  getters: {
    getApoderados: state => {
      return state.apoderados
    },
  },
  actions: {
    fetchApoderados: async function ({ commit }) {
      try {
        const { api } = index.getters
        const detalle = await fetch( api + 'apoderados');
        const data    = await detalle.json();
        commit('setApoderados', data)
      } catch (e) {
        commit('apoderadoError', e.response.data)
      } finally {
        console.log('La petición para obtener las apoderados ha finalizado...')
      }
    },
  },
  mutations: {
    setApoderados: function (state, apoderados) {
      state.apoderados = apoderados
    },
    setApoderado: function (state, apoderado) {
      state.selectedApoderado = apoderado
    },
    apoderadoError: function (state, payload) {
      state.error = true
      state.errorMessage = payload
      state.apoderados = []
    },
    apoderadoErrorNull: function (state) {
      state.error = false
      state.errorMessage = []
    },
  },
})
