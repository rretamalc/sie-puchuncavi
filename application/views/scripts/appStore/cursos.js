const cursos = new Vuex.Store({
  state: () => ({
    baseUrl: {
      origin: 'http://localhost:3000/'
    },
    api: 'http://localhost:3000/',
    baseUrlFake: 'application/views/scripts/json-server/db.json',
    cursos: [],
    selectedCurso: null,
    error: false,
    errorMessage: '',
  }),
  getters: {
    getCursos: state => {
      return state.cursos
    },
  },
  mutations: {
    setCursos: function (state, cursos) {
      state.cursos = cursos
    },
    setCurso: function (state, curso) {
      state.selectedCurso = curso
    },
    cursoError: function (state, payload) {
      state.error = true
      state.errorMessage = payload
      state.cursos = []
    },
    cursoErrorNull: function (state) {
      state.error = false
      state.errorMessage = []
    },
  },
  actions: {
    fetchCursos: async function ({commit, state}) {
      try {
        const detalle = await fetch(state.api+'Cursos/vstore');
        const data = await detalle.json();
        commit('setCursos', data)
      } catch (e) {
        commit('cursoError', e.response.data)
      } finally {
        console.log('La petición para obtener las cursos ha finalizado...')
      }
    },
  },

})
