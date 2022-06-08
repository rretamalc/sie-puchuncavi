const alumnos = new Vuex.Store({
	state: () => ({
		alumnos: [],
		selectedAlumno: null,
		error: false,
		errorMessage: '',
	}),
	computed: {
		...Vuex.mapState(['index', 'api']),
	},
	getters: {
		getAlumnos: state => {
			return state.alumnos
		},
	},
	mutations: {
		...Vuex.mapMutations('alumnos', ['setAlumnos']),
		setAlumnos: function (state, alumnos) {
			state.alumnos = alumnos
		},
		setAlumno: function (state, alumno) {
			state.selectedAlumno = alumno
		},
		alumnoError: function (state, payload) {
			state.error = true
			state.errorMessage = payload
			state.alumnos = []
		},
		alumnoErrorNull: function (state) {
			state.error = false
			state.errorMessage = []
		},
	},
	actions: {
		fetchAlumnos: async function ({ commit }) {
			try {
				const { api } = index.getters
				const { data } = await axios.get(api +'Alumnos/vstore')

				commit('setAlumnos', data)
			} catch (e) {
				commit('alumnoError', e.response.data)
			} finally {
				console.log('La petición para obtener las alumnos ha finalizado...')
			}
		},
	},
})
