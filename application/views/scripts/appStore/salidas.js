const vuexLocal = new window.VuexPersistence.VuexPersistence({
  storage: window.localStorage,
  reducer: (state) => ({ selectedSalida: state.selectedSalida })
});

const salidas = new Vuex.Store({
  state: () => ({
    api: 'http://localhost:3000/',
    salidas: [],
    selectedSalida: null,
    error: false,
    errorMessage: '',
  }),
  getters: {
    getSalidas: state => {
      return state.salidas
    },
    getSelectedSalida: state => {
      return state.selectedSalida
    },
    getError: state => {
      const errors = {
        'error': state.error,
        'error': state.errorMessage,
      }
      return errors
    },
  },
  actions: {
    fetchSalidas: async function ({commit, state}) {
      try {
        const { data } = await axios(state.api+'salidas');
        commit('setSalidas', data)
      } catch (e) {
        commit('salidaError', e.response.data)
      } finally {
        console.log('La petición para obtener las salidas ha finalizado...')
      }
    },
    addSalida: async function ({commit, state}, salida) {
      try {
        const url = state.api + 'salidas'
        const { data } = await axios({
          method: 'POST',
          url: url,
          data: {
            idCursos: salida.idCursos,
            idAlumno: salida.idAlumno,
            fecha: salida.fecha,
            hora: salida.hora,
            horaRegreso: salida.horaRegreso,
            tipoIdRetira: salida.tipoIdRetira,
            idRetira: salida.idRetira,
            firma: salida.firma,
            observacion: salida.observacion,
            apoderado: salida.apoderado,
          },
        })
        commit('setSalidas', data)
      } catch (e) {
        commit('salidaError', e)
      } finally {
        console.log('La petición para obtener las salidas ha finalizado...')
      }
    },
    updateSalida: async function ({commit, state}, salida) {
      try {
        const url = state.api + 'salidas'
        const { data } = await axios({
          method: 'POST',
          url: url,
          data: {
            idCurso: salida.idCursos,
            idAlumno: salida.idAlumno,
            fecha: salida.fecha,
            hora: salida.hora,
            horaRegreso: salida.horaRegreso,
            tipoIdRetira: salida.tipoIdRetira,
            idRetira: salida.idRetira,
            firma: salida.firma,
            observacion: salida.observacion,
            nuevoRetira: salida.apoderado,
          },
        })
        commit('setSalidas', data)
      } catch (e) {
        commit('salidaError', e)
      } finally {
        console.log('La petición para obtener las salidas ha finalizado...')
      }
    },
  },
  mutations: {
    setSalidas: function (state, salidas) {
      state.salidas = salidas
    },
    setSalida: function (state, salida) {
      state.selectedSalida = salida
    },
    salidaError: function (state, payload) {
      state.error = true
      state.errorMessage = payload
      state.salidas = []
    },
    salidaErrorNull: function (state) {
      state.error = false
      state.errorMessage = []
    },
  },
  plugins: [vuexLocal.plugin],
})
