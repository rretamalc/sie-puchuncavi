Vue.component('formativa-promedio',{
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
		getNotasFormativas: {
      get() {
        return notas.getters.getNotasFormativas
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
		tiempo_nota() {
			this.setPromedio()
		},
		getNotasFormativas() {
			this.setNotas(this.getNotasFormativas)
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
		tiempo_nota: {
			type: Number,
			required: true,
		},
		id_asignatura: {
			type: Number,
			required: true,
		},
	},
	mounted() {
		const data = {
			idCurso: this.id_curso,
			idPeriodo: this.id_periodo,
			idAsignaturaSelected: this.id_asignatura,
			tiempoNota: this.tiempo_nota
		}
		notas.dispatch('fetchNotasFormativas', data)
	},
	methods: {
		setNotas(notas) {
			this.notas_alumnos = notas
			this.setPromedio()
		},
		setPromedio() {
			const notasAlumno = this.notas_alumnos.filter(na => na.idAlumnos === this.id_alumnos)
			let sumaPromedio = 0
			let divisor = 0
			this.evaluaciones.forEach(evaluacion => {
				notasAlumno.forEach(nota => {
					if (evaluacion.idGuia === nota.idGuia && nota.nota_1 > 0 && nota.nota_1 !== null) {
						sumaPromedio = nota.nota_1 + sumaPromedio
						divisor = divisor + Number(1)
					}
				})
			})
			const promedio = sumaPromedio / divisor

			this.promedio = this.soloNumeros(promedio)
			// this.promedio = this.soloNumerosFinal(promedio)
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
				nota = `${notaSeparada[0]}.${notaSeparada[1]}`
			} else if (nota.toString().length > 4) {
				const notaSet = nota.toFixed(2)
				const notaSinPunto = Number(notaSet.toString().replace(".",""))
				const notaSeparada = notaSinPunto.toString().split('', 3)
				if (notaSeparada[2] === '0') {
					nota = `${notaSeparada[0]}.${notaSeparada[1]}`
				} else {
					nota = `${notaSeparada[0]}.${notaSeparada[1]}}`
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