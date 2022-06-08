const guias = new Vuex.Store({
  state: () => ({
    guiasCurso: [],
    guiasFormativasCurso: [],
    guiasAlumnos: [],
    selectedGuia: null,
    selectedGuiaAlumno: null,
    guiaError: false,
    guiaErrorMessage: '',
    guiaCursoError: false,
    guiaCursoErrorMessage: '',
    guiaFormativaCursoError: false,
    guiaFormativaCursoErrorMessage: '',
  }),
  computed: {
		...Vuex.mapState(['index', 'api']),
	},
  getters: {
    getGuiasCurso: state => {
      return state.guiasCurso
    },
    getGuiasFormativaCurso: state => {
      return state.guiasFormativasCurso
    },
    getGuiasAlumnos: state => {
      return state.guiasAlumnos
    },
  },
  actions: {

    fetchGuiasCurso: async function ({ commit }, dataGuias) {
      try {
        const { idCurso, idPeriodo, idEvaluacion } = dataGuias
        const { api } = index.getters
        const url = `${api}Monitoreo/chocotagetguiascurso?idPeriodo=${idPeriodo}&idCurso=${idCurso}&idEvaluacion=${idEvaluacion}`
        const { data } = await axios.get(url)
        commit('setGuiasCurso', data)
      } catch (e) {
        console.log('e.response.data :', e.response.data)
        commit('guiaCursoError', e.response.data)
      } finally {
        console.log('La petición para obtener las guias ha finalizado...')
      }
    },

    fetchGuiasFormativasCurso: async function ({ commit }, dataGuias) {
      // const separador = cadenaADividir.split(separador)
      try {
        const { idCurso, idPeriodo, idEvaluacion } = dataGuias
        const { api } = index.getters
        const url = `${api}Monitoreo/chocotagetguiasformativascurso?idPeriodo=${idPeriodo}&idCurso=${idCurso}`
        const { data } = await axios.get(url)
        commit('setGuiasFormativasCurso', data)
      } catch (e) {
        console.log('e.response.data formativca:', e.response.data)
        commit('guiaFormativaCursoError', e.response.data)
      } finally {
        console.log('La petición para obtener las guias formativas ha finalizado...')
      }
    },

    addGuia: async function ({ commit }, guia) {
      try {
        commit('guiaErrorNull')
        const { api } = index.getters
        const url = `${api}Monitoreo/chocotaaddguia`
        const {data} = await axios({
          method: 'POST',
          url,
          data: {
              idPeriodo: guia.idPeriodo,
              idCurso: guia.idCursos,
              idAsignatura: guia.idAsignatura,
              modalidad: guia.modalidad,
              nombreGuia: guia.nombreGuia,
              fechaGuia: guia.fechaGuia,
              tipoGuia: guia.tipoGuia,
              porcentajeGuia: guia.porcentajeGuia,
          },
        })
      } catch (e) {
        commit('guiaError', e.response.data)
      } finally {
        console.log('La petición para agregar la evaluación ha finalizado...')
      }
    },

    updateGuia: async function({ commit }, guia) {
      try {
        commit('guiaErrorNull')
        const { api } = index.getters
        const {data} = await axios({
          method: 'PUT',
          url: `${api}Monitoreo/chocotaupdateguia`,
          data: {
            idGuia: guia.idGuia,
            modalidad: guia.modalidad,
            nombreGuia: guia.nombreGuia,
            fechaGuia: guia.fechaGuia,
            tipoGuia: guia.tipoGuia,
            porcentajeGuia: guia.porcentajeGuia,
          },
        })
      } catch (e) {
        commit('guiaError', e.response.data)
      }
    },

    updateGuiaFormativa: async function({ commit }, guia) {
      try {
        commit('guiaErrorNull')
        const { api } = index.getters
        const {data} = await axios({
          method: 'PUT',
          url: `${api}Monitoreo/chocotaupdateguiaformativa`,
          data: {
            idGuia: guia.idGuia,
            idCurso: guia.idCurso,
            idAsignatura: guia.idAsignatura,
            modalidad: guia.modalidad,
            nombreGuia: guia.nombreGuia,
            fecha: guia.fecha,
            tipoGuia: guia.tipoGuia,
            porcentaje: guia.porcentaje,
          },
        })
        console.log('data :', data)
      } catch (e) {
        console.log('e.response.data :', e.response.data)
        commit('guiaError', e.response.data)
      }
    },

    removeGuia: async function({ commit }, idGuia) {
      try {
        commit('guiaErrorNull')
        const { api } = index.getters
        const {data} = await axios({
          method: 'delete',
          url: `${api}Monitoreo/chocotaremoveguia`,
          data: {
            idGuia: idGuia,
          },
        })
      } catch (e) {
        commit('guiaError', e.response.data)
      }
    },

  },
  mutations: {
    setGuiasCurso: function (state, guiasCurso) {
      state.guiasCurso = []
      state.guiasCurso = guiasCurso
    },

    setGuiasFormativasCurso: function (state, guiasFormativasCurso) {
      state.guiasFormativasCurso = []
      state.guiasFormativasCurso = guiasFormativasCurso
    },

    setGuia: function (state, guia) {
      state.selectedGuia = guia
    },

    setGuiasAlumnos: function (state, guiasAlumnos) {
      state.guiasAlumnos = guiasAlumnos
    },
    setGuiaAlumno: function (state, guiasAlumnos) {
      state.selectedGuiaAlumno = guiasAlumnos
    },

    guiaCursoError: function (state, payload) {
      state.guiaCursoError = true
      state.guiaCursoErrorMessage = payload
      state.guiaCurso = []
    },
    guiaCursoErrorNull: function (state) {
      state.guiaCursoError = false
      state.guiaCursoErrorMessage = []
    },

    guiaFormativaCursoError: function (state, payload) {
      state.guiaFormativaCursoError = true
      state.guiaFormativaCursoErrorMessage = payload
      state.guiaFormativaCurso = []
    },
    guiaFormativaCursoErrorNull: function (state) {
      state.guiaFormativaCursoError = false
      state.guiaFormativaCursoErrorMessage = []
    },

    guiaErrorNull: function (state) {
      state.guiaError = false
      state.guiaErrorMessage = []
    },

    guiaError: function (state, payload) {
      state.guiaError = true
      state.guiaErrorMessage = payload
      state.guias = []
    },
  },
})
