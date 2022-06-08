Vue.component('salidasindividual-update',{
	template: //html
	`
		<div>
			<salidasindividual-form
				btnText="Editar Salida"
				form="update"
				:salida.sync="salida"
				:cursos="cursos"
				:alumnos="alumnos"
				:apoderados="apoderados"
				@processForm="updateSalida"
			/>
		</div>
	`,
	computed: {
	},
 	data() {
   	return {
     	salida: [],
			cursos: [],
			alumnos: [],
			apoderados: [],
   	}
	},
	watch: {
		getSelectedSalida() {
			this.salida = this.getSelectedSalida
		},
		getCursos() {
			this.cursos = this.getCursos
		},
		getAlumnos() {
			this.alumnos = this.getAlumnos
		},
		getApoderados() {
			this.apoderados = this.getApoderados
		},
	},
	computed: {
		getSelectedSalida: {
			get () {
				this.salida = salidas.getters.getSelectedSalida
				return this.salida
			}
		},
		getCursos: {
			get () {
				return cursos.getters.getCursos
			}
		},
		getAlumnos: {
			get () {
				return alumnos.getters.getAlumnos
			}
		},
		getApoderados: {
			get () {
				return apoderados.getters.getApoderados
			}
		}
	},
	created() {
		cursos.dispatch('fetchCursos')
		alumnos.dispatch('fetchAlumnos')
		apoderados.dispatch('fetchApoderados')
	},
	methods: {
		updateSalida(salida) {
			console.log(salida)
			// salidas.dispatch('addSalida', salida).then(() => {
			// 	const Toast = Swal.mixin({
			// 		toast: true,
			// 		position: 'top-end',
			// 		showConfirmButton: false,
			// 		timer: 4000,
			// 		timerProgressBar: true,
			// 		didOpen: (toast) => {
			// 			toast.addEventListener('mouseenter', Swal.stopTimer)
			// 			toast.addEventListener('mouseleave', Swal.resumeTimer)
			// 		}
			// 	})

			// 	const error = salidas.getters.getError.error
			// 	if (!error) {
			// 		Toast.fire({
			// 			icon: 'success',
			// 			title: 'Salida creada con éxito!'
			// 		})

			// 		const { origin } = window.location;
			// 		const url = origin+'/Soft/sie_colegiospuchuncavi3/salidas';
			// 		window.location.href = url;
			// 	} else {
			// 		Toast.fire({
			// 			icon: 'error',
			// 			title: 'Ingreso de datos fraudulento!',
			// 		})
			// 	}
			// })
			// .catch((resp) => {
			// 	console.log('catch')
			// 	console.log(resp)
			// })
		},
	},
});
