const evaluaciones = new Vuex.Store({
  state: () => ({
    evaluacionesCurso: [],
    evaluacionesFormativasCurso: [],
    evaluacionesAlumnos: [],
    selectedEvaluacion: null,
    selectedEvaluacionAlumno: null,
    evaluacionError: false,
    evaluacionErrorMessage: '',
    evaluacionCursoError: false,
    evaluacionCursoErrorMessage: '',
    evaluacionFormativaCursoError: false,
    evaluacionFormativaCursoErrorMessage: '',
  }),
  computed: {
		...Vuex.mapState(['index', 'api']),
	},
  getters: {
    getEvaluacionesCurso: state => {
      return state.evaluacionesCurso
    },
    getEvaluacionesFormativaCurso: state => {
      return state.evaluacionesFormativasCurso
    },
    getEvaluacionesAlumnos: state => {
      return state.evaluacionesAlumnos
    },
  },
  actions: {

    fetchEvaluacionesCurso: async function ({ commit }, dataEvaluaciones) {
      // const separador = cadenaADividir.split(separador)
      try {
        const { idCurso, idPeriodo } = dataEvaluaciones
        const { api } = index.getters
        const url = `${api}Monitoreo/chocotagetevaluacionescurso?idPeriodo=${idPeriodo}&&idCurso=${idCurso}`
        const { data } = await axios.get(url)
        commit('setEvaluacionesCurso', data)
      } catch (e) {
        commit('evaluacionCursoError', e.response.data)
      } finally {
        console.log('La petición para obtener las evaluaciones ha finalizado...')
      }
    },

    fetchEvaluacionesFormativasCurso: async function ({ commit }, dataEvaluaciones) {
      // const separador = cadenaADividir.split(separador)
      try {
        const { idCurso, idPeriodo } = dataEvaluaciones
        const { api } = index.getters
        const url = `${api}Monitoreo/chocotagetevaluacionesformativascurso?idPeriodo=${idPeriodo}&&idCurso=${idCurso}`
        const { data } = await axios.get(url)
        commit('setEvaluacionesFormativasCurso', data)
      } catch (e) {
        commit('evaluacionFormativaCursoError', e.response.data)
      } finally {
        console.log('La petición para obtener las evaluaciones formativas ha finalizado...')
      }
    },

    addEvaluacion: async function ({ commit }, evaluacion) {
      try {
        commit('evaluacionErrorNull')
        const { api } = index.getters
        const url = `${api}Monitoreo/chocotaaddevaluacion`
        const {data} = await axios({
          method: 'POST',
          url,
          data: {
              idCurso: evaluacion.idCurso,
              idAsignatura: evaluacion.idAsignatura,
              modalidad: evaluacion.modalidad,
              fecha: evaluacion.fecha,
              contenido: evaluacion.contenido,
              tipoEvaluacion: evaluacion.tipoEvaluacion,
          },
        })
        console.log('data :', data)
      } catch (e) {
        console.log('e.response.data :', e.response.data)
        commit('evaluacionError', e.response.data)
      } finally {
        console.log('La petición para agregar la evaluación ha finalizado...')
      }
    },

    updateEvaluacion: async function({ commit }, evaluacion) {
      try {
        commit('evaluacionErrorNull')
        const { api } = index.getters
        const {data} = await axios({
          method: 'PUT',
          url: `${api}Monitoreo/chocotaupdateevaluacion`,
          data: {
            idEvaluacion: evaluacion.idEvaluacion,
            idCurso: evaluacion.idCurso,
            idAsignatura: evaluacion.idAsignatura,
            modalidad: evaluacion.modalidad,
            contenido: evaluacion.contenido,
            fecha: evaluacion.fecha,
          },
        })
      } catch (e) {
        commit('evaluacionError', e.response.data)
      }
    },

    updateEvaluacionFormativa: async function({ commit }, evaluacion) {
      try {
        commit('evaluacionErrorNull')
        const { api } = index.getters
        const {data} = await axios({
          method: 'PUT',
          url: `${api}Monitoreo/chocotaupdateevaluacionformativa`,
          data: {
            idGuia: evaluacion.idGuia,
            idCurso: evaluacion.idCurso,
            idAsignatura: evaluacion.idAsignatura,
            modalidad: evaluacion.modalidad,
            nombreGuia: evaluacion.nombreGuia,
            fecha: evaluacion.fecha,
            tipoEvaluacion: evaluacion.tipoEvaluacion,
            porcentaje: evaluacion.porcentaje,
          },
        })
      } catch (e) {
        console.log('e.response.data :', e.response.data)
        commit('evaluacionError', e.response.data)
      }
    },


    removeEvaluacion: async function({ commit }, idEvaluacion) {
      try {
        commit('evaluacionErrorNull')
        const { api } = index.getters
        const {data} = await axios({
          method: 'delete',
          url: `${api}Monitoreo/chocotaremoveevaluacion`,
          data: {
            idEvaluacion: idEvaluacion,
          },
        })
      } catch (e) {
        commit('evaluacionError', e.response.data)
      }
    },

  },
  mutations: {
    setEvaluacionesCurso: function (state, evaluacionesCurso) {
      state.evaluacionesCurso = []
      state.evaluacionesCurso = evaluacionesCurso
    },

    setEvaluacionesFormativasCurso: function (state, evaluacionesFormativasCurso) {
      state.evaluacionesFormativasCurso = []
      state.evaluacionesFormativasCurso = evaluacionesFormativasCurso
    },

    setEvaluacion: function (state, evaluacion) {
      state.selectedEvaluacion = evaluacion
    },

    setEvaluacionesAlumnos: function (state, evaluacionesAlumnos) {
      state.evaluacionesAlumnos = evaluacionesAlumnos
    },
    setEvaluacionAlumno: function (state, evaluacionesAlumnos) {
      state.selectedEvaluacionAlumno = evaluacionesAlumnos
    },

    evaluacionCursoError: function (state, payload) {
      state.evaluacionCursoError = true
      state.evaluacionCursoErrorMessage = payload
      state.evaluacionCurso = []
    },
    evaluacionCursoErrorNull: function (state) {
      state.evaluacionCursoError = false
      state.evaluacionCursoErrorMessage = []
    },

    evaluacionFormativaCursoError: function (state, payload) {
      state.evaluacionFormativaCursoError = true
      state.evaluacionFormativaCursoErrorMessage = payload
      state.evaluacionFormativaCurso = []
    },
    evaluacionFormativaCursoErrorNull: function (state) {
      state.evaluacionFormativaCursoError = false
      state.evaluacionFormativaCursoErrorMessage = []
    },

    evaluacionErrorNull: function (state) {
      state.evaluacionError = false
      state.evaluacionErrorMessage = []
    },

    evaluacionError: function (state, payload) {
      state.evaluacionError = true
      state.evaluacionErrorMessage = payload
      state.evaluaciones = []
    },
  },
})
