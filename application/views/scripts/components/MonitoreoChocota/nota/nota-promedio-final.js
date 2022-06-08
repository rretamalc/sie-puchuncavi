Vue.component('nota-promedio-final',{
template: //html
`
	<div>
		<p
			:class="Number(promedio) > 3.99
				? 'text-primary'
				: Number(promedio) > 0
					? 'text-danger'
					: ''"
		>
			{{ Number(promedio) > 0 ? promedio : '-' }}
		</p>
	</div>
`,
	computed: {
		getNotasChange: {
			get() {
				return notas.getters.getNotasChange
			}
		},
	},
	data() {
		return {
			promedio: null,
		}
	},
	watch: {
		notas_alumnos(notas_alumnos) {
			this.setPromedio(notas_alumnos)
		},
		getNotasChange(notas) {
			// if (notas[0].idAlumnos === this.id_alumnos) {
			// 	console.log('this.evaluaciones_primer_tri :', this.evaluaciones_primer_tri)
			// 	console.log('this.evaluaciones_segundo_tri :', this.evaluaciones_segundo_tri)
			// 	console.log('this.evaluaciones_tercer_tri :', this.evaluaciones_tercer_tri)
			// if (this.evaluaciones_primer_tri[0].idAsignatura === this.id_asignatura_selected
			// 	|| this.evaluaciones_segundo_tri[0].idAsignatura === this.id_asignatura_selected
			// 	|| this.evaluaciones_tercer_tri[0].idAsignatura === this.id_asignatura_selected) {

			// 	}
			this.setPromedio(notas)
			// }
    },
	},
	props: {
		evaluaciones_primer_tri: {
			type: Array,
			required: false,
			default: 0,
		},
		evaluaciones_segundo_tri: {
			type: Array,
			required: false,
			default: 0,
		},
		evaluaciones_tercer_tri: {
			type: Array,
			required: false,
			default: 0,
		},
		notas_alumnos: {
			type: Array,
			required: true,
		},
		id_alumnos: {
			type: Number,
			required: true,
		},
		id_asignatura_selected: {
			type: Number,
			required: true,
		},
	},

	mounted() {
		this.setPromedio(this.notas_alumnos)
	},
	methods: {
		setPromedio(notas_alumnos) {
			const notasAlumno = notas_alumnos.filter(na => na.idAlumnos === this.id_alumnos)

			let promedioPrimer = 0
			let promedioSegundo = 0
			let promedioTercer = 0
			let divisorPrimer = 0
			let divisorSegundo = 0
			let divisorTercer = 0
			if (this.evaluaciones_primer_tri != 0) {
				this.evaluaciones_primer_tri.forEach(evaluacionp => {
					notasAlumno.forEach(nota => {
						if (evaluacionp.idEvaluacion === nota.idEvaluacion && nota.nota > 0) {
							promedioPrimer = Number(promedioPrimer) + Number(this.soloNumeros(Number(nota.nota)))
							divisorPrimer = Number(divisorPrimer) + 1
						}
					})
				})
			}

			if (this.evaluaciones_segundo_tri != 0) {
				this.evaluaciones_segundo_tri.forEach(evaluacions => {
					notasAlumno.forEach(nota => {
						if (evaluacions.idEvaluacion === nota.idEvaluacion && nota.nota > 0) {
							promedioSegundo = Number(promedioSegundo) + Number(this.soloNumeros(Number(nota.nota)))
							divisorSegundo = Number(divisorSegundo) + 1
						}
					})
				})
			}

			if (this.evaluaciones_tercer_tri != 0) {
				this.evaluaciones_tercer_tri.forEach(evaluaciont => {
					notasAlumno.forEach(nota => {
						if (evaluaciont.idEvaluacion === nota.idEvaluacion && nota.nota > 0) {
							promedioTercer = Number(promedioTercer) + Number(this.soloNumeros(Number(nota.nota)))
							divisorTercer = Number(divisorTercer) + 1
						}
					})
				})
			}

			let sumaPromedio = 0
			let divisorPromedio = 0
			if (promedioPrimer != 0) {
				const promedio = promedioPrimer / divisorPrimer
				sumaPromedio = sumaPromedio + Math.floor(promedio)
				divisorPromedio = divisorPromedio + 1
			}
			if (promedioSegundo != 0) {
				const promedio = promedioSegundo / divisorSegundo
				sumaPromedio = sumaPromedio + Math.floor(promedio)
				divisorPromedio = divisorPromedio + 1
			}
			if (promedioTercer != 0) {
				const promedio = promedioTercer / divisorTercer
				sumaPromedio = sumaPromedio + Math.floor(promedio)
				divisorPromedio = divisorPromedio + 1
			}
			const promedio = sumaPromedio / divisorPromedio
			const promedioFinal = !isNaN(promedio)
				? Math.round(promedio)
				: 0

			this.promedio = this.soloNumerosPromedioFinal(promedioFinal)
			// this.promedio = this.soloNumeros(promedioFinal)
			// this.promedio = this.soloNumeros(Number.parseFloat(promedioFinal)).toFixed(1)
			// this.promedio = Number.parseFloat(promedio).toFixed(2)
		},
		soloNumeros(value) {
			let nota = value
			if (nota.toString().length == 1 && nota > 0) {
				const notaSet = `0.${nota}`
				nota = Number.parseFloat(notaSet).toString()  // agrega .0
			} else if (nota > 0 && nota < 1) {
				nota = Number.parseFloat(nota).toFixed(1).toString() // agrega .0
			} else if (nota.toString().length == 2) {
				const notaSeparada = nota.toString().split('', 2)
				nota = `${notaSeparada[0]}${notaSeparada[1]}`
			} else if (nota.toString().length == 3) {
				const notaSinPunto = Number(nota.toString().replace(".",""))
				let notaSeparada = 0
				if (notaSinPunto.toString().length == 3) {
					notaSeparada = notaSinPunto.toString().split('', 3)
					// nota = `${notaSeparada[0]}${notaSeparada[1]}.${notaSeparada[2]}`
					nota = `${notaSeparada[0]}${notaSeparada[1]}`
				}
				else if (notaSinPunto.toString().length == 2) {
					notaSeparada = notaSinPunto.toString().split('', 2)
					nota = `${notaSeparada[0]}${notaSeparada[1]}`
				}
			} else if (nota.toString().length == 4) {
				const notaSinPunto = Number(nota.toString().replace(".",""))
				const notaSeparada = notaSinPunto.toString().split('', 3)
				// nota = `${notaSeparada[0]}${notaSeparada[1]}.${notaSeparada[2]}`
				nota = `${notaSeparada[0]}${notaSeparada[1]}`
			} else if (nota.toString().length > 4) {
				const notaSet = nota.toFixed(2)
				const notaSinPunto = Number(notaSet.toString().replace(".",""))
				const notaSeparada = notaSinPunto.toString().split('', 3)
				// nota = `${notaSeparada[0]}${notaSeparada[1]}.${notaSeparada[2]}`
				nota = `${notaSeparada[0]}${notaSeparada[1]}`
			} else{
				nota = Number.parseFloat(nota).toFixed(0).toString()
			}
			nota = nota.replace(/[^0-9,.]/g, '') // Solo Numeros
			nota = nota.replace(/,/g, '.') // con punto
			return nota
		},
		soloNumerosPromedioFinal(value) {
			let nota = value
			if (nota.toString().length == 1 && nota > 0) {
				const notaSet = `0.${nota}`
				nota = Number.parseFloat(notaSet).toString()  // agrega .0
			} else if (nota > 0 && nota < 1) {
				nota = Number.parseFloat(nota).toFixed(1).toString() // agrega .0
			} else if (nota.toString().length == 2) {
				const notaSeparada = nota.toString().split('', 2)
				nota = `${notaSeparada[0]}.${notaSeparada[1]}`
			} else if (nota.toString().length == 3) {
				const notaSinPunto = Number(nota.toString().replace(".",""))
				let notaSeparada = 0
				if (notaSinPunto.toString().length == 3) {
					notaSeparada = notaSinPunto.toString().split('', 3)
					nota = `${notaSeparada[0]}${notaSeparada[1]}.${notaSeparada[2]}`
				} else if (notaSinPunto.toString().length == 2) {
					notaSeparada = notaSinPunto.toString().split('', 2)
					nota = `${notaSeparada[0]}.${notaSeparada[1]}`
				}
			} else if (nota.toString().length == 4) {
				const notaSinPunto = Number(nota.toString().replace(".",""))
				const notaSeparada = notaSinPunto.toString().split('', 3)
				nota = `${notaSeparada[0]}${notaSeparada[1]}.${notaSeparada[2]}`
			} else if (nota.toString().length > 4) {
				const notaSet = nota.toFixed(2)
				const notaSinPunto = Number(notaSet.toString().replace(".",""))
				const notaSeparada = notaSinPunto.toString().split('', 3)
				if (notaSeparada[2] === '0') {
					nota = `${notaSeparada[0]}.${notaSeparada[1]}`
				} else {
					nota = `${notaSeparada[0]}${notaSeparada[1]}.${notaSeparada[2]}`
				}
			} else{
				nota = Number.parseFloat(nota).toFixed(0).toString()
			}
			nota = nota.replace(/[^0-9,.]/g, '') // Solo Numeros
			nota = nota.replace(/,/g, '.') // con punto
			return nota
		},
	}
});