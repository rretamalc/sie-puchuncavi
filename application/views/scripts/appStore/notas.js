const notas = new Vuex.Store({
  state: () => ({
    notas: [],
    notasChange: [],
    notasGuias: [],
    notasFormativas: [],
    selectedNota: null,
    notaError: false,
    notaErrorMessage: '',
    notaFormativaError: false,
    notaFormativaErrorMessage: '',
    notaGuiaError: false,
    notaGuiaErrorMessage: '',
  }),
  computed: {
		...Vuex.mapState(['index', 'api']),
	},
  getters: {
    getNotas: state => {
      return state.notas
    },
    getNotasChange: state => {
      return state.notasChange
    },

    getNotasGuias: state => {
      return state.notasGuias
    },

    getNotasFormativas: state => {
      return state.notasFormativas
    },
  },
  actions: {
    fetchNotas: async function ({ commit }, dataNotas) {
      try {
        const { idCurso, idPeriodo } = dataNotas
        const { api } = index.getters
        const url = `${api}Monitoreo/chocotagetnotascurso?idPeriodo=${idPeriodo}&&idCurso=${idCurso}`
        const { data } = await axios.get(url)
        commit('setNotas', data)
      } catch (e) {
        commit('notaError', e.response.data)
      } finally {
        console.log('La petición para obtener notas ha finalizado...')
      }
    },

    fetchNotasChange: async function ({ commit }, dataNotas) {
      try {
        const { idCurso, idPeriodo } = dataNotas
        const { api } = index.getters
        const url = `${api}Monitoreo/chocotagetnotascurso?idPeriodo=${idPeriodo}&&idCurso=${idCurso}`
        const { data } = await axios.get(url)
        commit('setNotasChange', data)
      } catch (e) {
        commit('notaError', e.response.data)
      } finally {
        console.log('La petición para obtener notas change ha finalizado...')
      }
    },

    fetchNotasGuias: async function ({ commit }, dataNotas) {
      try {
        const { idCurso, idPeriodo, idEvaluacion } = dataNotas
        const { api } = index.getters
        const url = `${api}Monitoreo/chocotagetnotasguias?idPeriodo=${idPeriodo}&&idCurso=${idCurso}&&idEvaluacion=${idEvaluacion}`
        const { data } = await axios.get(url)
        commit('setNotasGuias', data)
      } catch (e) {
        commit('notaGuiaError', e.response.data)
      } finally {
        console.log('La petición para obtener notas ha finalizado...')
      }
    },

    fetchNotasFormativas: async function ({ commit }, dataNotas) {
      try {
        const { idCurso, idPeriodo, idAsignaturaSelected, tiempoNota } = dataNotas
        const { api } = index.getters
        const url = `${api}Monitoreo/chocotagetnotasformativacurso?idPeriodo=${idPeriodo}&&idCurso=${idCurso}&&idAsignatura=${idAsignaturaSelected}&&tiempoNota=${tiempoNota}`
        const { data } = await axios.get(url)
        commit('setNotasFormativa', data)
      } catch (e) {
        commit('notaFormativaError', e.response.data)
      } finally {
        console.log('La petición para obtener notas Formativas ha finalizado...')
      }
    },

    updateNota: async function({ commit }, nota) {
      try {
        commit('notaErrorNull')
        const { api } = index.getters
        const { data } = await axios({
          method: 'PUT',
          url: `${api}Monitoreo/chocotaupdatenotas`,
          data: {
            idEvaluacion: nota.idEvaluacion,
            idNotas: nota.idNotas,
            idAlumnos: nota.idAlumnos,
            nota: nota.nota,
          },
        })
      } catch (e) {
        commit('notaError', e.response.data)
      }
    },

    updateNotaGuia: async function({ commit }, nota) {
      try {
        commit('notaErrorNull')
        const { api } = index.getters
        const { data } = await axios({
          method: 'PUT',
          url: `${api}Monitoreo/chocotaupdatenotasguias`,
          data: {
            idNotasGuia: nota.idNotasGuia,
            nota_1: Number(nota.nota_1),
            idEvaluacion: nota.idEvaluacion,
            idAlumnos: nota.idAlumnos,
            idGuia: nota.idGuia,
          },
        })
        console.log('data guia :', data)
      } catch (e) {
        console.log('e.response.data :', e.response.data)
        commit('notaError', e.response.data)
      }
    },

    updateNotaFormativa: async function({ commit }, nota) {
      try {
        const { api } = index.getters
        const { data } = await axios({
          method: 'PUT',
          url: `${api}Monitoreo/chocotaupdatenotasformativas`,
          data: {
            idNota: nota.idNota,
            idNotaGuia: nota.idNotaGuia,
            nota: nota.nota,
          },
        })
      } catch (e) {
        commit('notaFormativaError', e.response.data)
      }
    },

  },
  mutations: {

    setNotas: function (state, notas) {
      state.notas = []
      state.notas = notas
    },

    setNotasChange: function (state, notas) {
      state.notasChange = []
      state.notasChange = notas
    },

    setNotasGuias: function (state, notasGuias) {
      state.notasGuias = []
      state.notasGuias = notasGuias
    },

    setNotasFormativa: function (state, notasFormativa) {
      state.notasFormativas = []
      state.notasFormativas = notasFormativa
    },

    setNota: function (state, nota) {
      state.selectedNota = nota
    },


    notaErrorNull: function (state) {
      state.notaError = false
      state.notaErrorMessage = []
    },

    notaError: function (state, payload) {
      state.notaError = true
      state.notaErrorMessage = payload
      state.notas = []
    },

    notaGuiaErrorNull: function (state) {
      state.notaGuiaError = false
      state.notaGuiaErrorMessage = []
    },

    notaError: function (state, payload) {
      state.notaGuiaError = true
      state.notaGuiaErrorMessage = payload
      state.notasGuias = []
    },

    notaFormativaError: function (state, payload) {
      state.notaFormativaError = true
      state.notaFormativaErrorMessage = payload
      state.notasFormativa = []
    },
  },
})
