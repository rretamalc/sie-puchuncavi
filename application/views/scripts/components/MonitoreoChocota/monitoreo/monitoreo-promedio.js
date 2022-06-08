Vue.component('monitoreo-promedio',{
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
		getNotasGuias: {
      get() {
        return notas.getters.getNotasGuias
      }
    },
	},
	data() {
		return {
			promedio: null,
			notas_alumnos: [],
		}
	},
	watch: {
		notas_alumnos() {
			this.setPromedio()
		},
		getNotasGuias() {
			this.setNotas(this.getNotasGuias)
    },
	},
	props: {
		evaluaciones: {
			type: Array,
			required: true,
		},
		id_alumnos: {
			type: Number,
			required: true,
		},
		id_evaluacion: {
			type: Number,
			required: true,
		},
		id_periodo: {
			type: Number,
			required: true,
		},
		id_curso: {
			type: Number,
			required: true,
		},
	},
	mounted() {
		const data = {
			idCurso: this.id_curso,
			idPeriodo: this.id_periodo,
			idEvaluacion: this.id_evaluacion,
		}
		notas.dispatch('fetchNotasGuias', data)
	},
	methods: {
		setNotas(notas) {
			this.notas_alumnos = notas
		},
		roundDecimal(num) {
			return +(Math.round(num + "e+1")  + "e-1")
		},
		soloNumeros(value) {
			let nota = value
			if (nota.toString().length == 1 && nota > 0) {
				nota = Number.parseFloat(nota).toFixed(1).toString() // agrega .0
			} else if (nota > 0 && nota < 1) {
				if (nota.toString().length === 3) {
					nota = Number.parseFloat(nota).toFixed(1).toString()
				} else if (nota.toString().length === 4) {
					nota = Number.parseFloat(nota).toFixed(2).toString()
				}
			} else if (nota.toString().length == 2) {
				const notaSeparada = nota.toString().split('', 2)
				nota = `${notaSeparada[0]}.${notaSeparada[1]}`
			} else if (nota.toString().length == 3) {
				const notaSinPunto = Number(nota.toString().replace(".",""))
				const notaSeparada = notaSinPunto.toString().split('', 2)
				nota = `${notaSeparada[0]}.${notaSeparada[1]}`
			} else if (nota.toString().length == 4) {
				const notaSinPunto = Number(nota.toString().replace(".",""))
				const notaSeparada = notaSinPunto.toString().split('', 3)
				nota = `${notaSeparada[0]}.${notaSeparada[1]}${notaSeparada[2]}`
			} else if (nota.toString().length > 4) {
				// const notaSet = nota.toFixed(2)
				const notaSinPunto = Number(nota.toString().replace(".",""))
				const notaSeparada = notaSinPunto.toString().split('', 4)
				// const notaSet = Number.parseFloat(nota).toFixed(2).toString()
				// const notaSeparada = notaSinPunto.toString().split('', 3)
				if (notaSeparada[2] === '0') {
					nota = `${notaSeparada[0]}.${notaSeparada[1]}`
				} else {
					nota = `${notaSeparada[0]}.${notaSeparada[1]}${notaSeparada[2]}`
				}
			} else{
				nota = Number.parseFloat(nota).toFixed(0).toString()
			}
			nota = nota.replace(/[^0-9,.]/g, '') // Solo Numeros
			nota = nota.replace(/,/g, '.') // con punto
			return nota
		},
		setPromedio() {
			const notasAlumno = this.notas_alumnos.filter(na => na.idAlumnos === this.id_alumnos)
			let promedioNota = 0
			let contador = 0
			this.evaluaciones.forEach(guia => {
				notasAlumno.forEach(nota => {
					if (guia.idGuia === nota.idGuia) {
						let notaPorcentaje = 0
						if (nota.tipoGuia === '3') {
							const notaDecimal = this.soloNumeros(nota.nota_1)
							if (notaDecimal !== "0") {
								contador += 1
							}
							notaPorcentaje = Number(notaDecimal)
						} else if (nota.tipoGuia === '2') {
							let findFormativas = notasAlumno.filter(ng => ng.idAlumnos === nota.idAlumnos)
							findFormativas = findFormativas.filter(ng => ng.idEvaluacionGuia === nota.idEvaluacionGuia)
							findFormativas = findFormativas.filter(ng => ng.tiempoGuia === nota.tiempoGuia)
							findFormativas = findFormativas.filter(ng => ng.tipoGuia === nota.tipoGuia)
							let sumaPromedio = 0
							let divisor = 0
							findFormativas.forEach(formativa => {
								if (formativa.nota_1 > 0 && formativa.nota_1 !== null) {
									sumaPromedio = formativa.nota_1 + sumaPromedio
									divisor = divisor + Number(1)
								}
							});

							if (sumaPromedio !== 0) {
								const promedio = sumaPromedio / divisor
								const notaDecimal = this.soloNumeros(promedio)
								if (notaDecimal !== "0") {
									contador += 1
								}
								notaPorcentaje = Number(notaDecimal)
							}
						}
						promedioNota += Number(notaPorcentaje)
					}
				})
			})
			const promedioFinal = Number.parseFloat(promedioNota / contador)
			this.promedio = this.soloNumeros(promedioFinal)
			// this.promedio = this.soloNumeros(promedioNota)
			// this.promedio = this.soloNumerosFinal(Number.parseFloat(promedioNota))

		}
	}
});