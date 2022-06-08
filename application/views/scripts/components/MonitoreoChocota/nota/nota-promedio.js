Vue.component('nota-promedio',{
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
			if (this.evaluaciones.length > 0) {
				if (this.evaluaciones[0].idAsignatura === this.id_asignatura_selected) {
					// && notas[0].idAlumnos === this.id_alumnos
					this.setPromedio(notas)
				}
			}
    },
		// getNotas() {

		// 	this.setPromedio(this.getNotas)
    // },
	},
	props: {
		evaluaciones: {
			type: Array,
			required: true,
		},
		notas_alumnos: {
			type: Array,
			required: true,
		},
		id_alumnos: {
			type: Number,
			required: true,
		},
		tiempo: {
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
		// ...Vuex.mapActions([{ fetchNotas: 'notas/fetchNotasPrimerTrimestre' }]),
		roundDecimal(num) {
			return +(Math.round(num + "e+1")  + "e-1")
		},
		setPromedio(notas_alumnos) {
			const notasAlumno = notas_alumnos.filter(na => na.idAlumnos === this.id_alumnos)
			let sumaPromedio = 0
			let divisor = 0
			this.evaluaciones.forEach(evaluacion => {
				notasAlumno.forEach(nota => {
					if (evaluacion.idEvaluacion === nota.idEvaluacion && nota.nota > 0) {
						const notaDecimal = this.soloNumeros(nota.nota)
						sumaPromedio = Number(notaDecimal) + Number(sumaPromedio)
						divisor = divisor + 1
					}
				})
			})
			let promedio = Number(sumaPromedio) / Number(divisor)

			this.promedio = this.soloNumerosFinal(Number.parseFloat(promedio))
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
					nota = `${notaSeparada[0]}${notaSeparada[1]}.${notaSeparada[2]}`
				}
				else if (notaSinPunto.toString().length == 2) {
					notaSeparada = notaSinPunto.toString().split('', 2)
					nota = `${notaSeparada[0]}${notaSeparada[1]}`
				}
			} else if (nota.toString().length == 4) {
				const notaSinPunto = Number(nota.toString().replace(".",""))
				const notaSeparada = notaSinPunto.toString().split('', 3)
				nota = `${notaSeparada[0]}${notaSeparada[1]}.${notaSeparada[2]}`
			} else if (nota.toString().length > 4) {
				const notaSet = nota.toFixed(2)
				const notaSinPunto = Number(notaSet.toString().replace(".",""))
				const notaSeparada = notaSinPunto.toString().split('', 3)
				nota = `${notaSeparada[0]}${notaSeparada[1]}.${notaSeparada[2]}`
			} else{
				nota = Number.parseFloat(nota).toFixed(0).toString()
			}
			nota = nota.replace(/[^0-9,.]/g, '') // Solo Numeros
			nota = nota.replace(/,/g, '.') // con punto
			return nota
		},
		soloNumerosFinal(value) {
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
					// nota = `${notaSeparada[0]}.${notaSeparada[1]}${notaSeparada[2]}`
					nota = `${notaSeparada[0]}.${notaSeparada[1]}`
				} else if (notaSinPunto.toString().length == 2) {
					notaSeparada = notaSinPunto.toString().split('', 2)
					nota = `${notaSeparada[0]}.${notaSeparada[1]}`
				}
			} else if (nota.toString().length == 4) {
				const notaSinPunto = Number(nota.toString().replace(".",""))
				const notaSeparada = notaSinPunto.toString().split('', 3)
				// nota = `${notaSeparada[0]}.${notaSeparada[1]}${notaSeparada[2]}`
				nota = `${notaSeparada[0]}.${notaSeparada[1]}`
			} else if (nota.toString().length > 4) {
				const notaSet = nota.toFixed(2)
				const notaSinPunto = Number(notaSet.toString().replace(".",""))
				const notaSeparada = notaSinPunto.toString().split('', 3)
				if (notaSeparada[2] === '0') {
					nota = `${notaSeparada[0]}.${notaSeparada[1]}`
				} else {
					// nota = `${notaSeparada[0]}.${notaSeparada[1]}${notaSeparada[2]}`
					nota = `${notaSeparada[0]}.${notaSeparada[1]}`
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