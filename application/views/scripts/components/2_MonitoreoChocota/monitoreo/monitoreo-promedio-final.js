Vue.component('monitoreo-promedio-final',{
template: //html
`
	<div>
		<p
			:class="Number(promedio) > 3.9
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
	},
	data() {
		return {
			promedio: null,
		}
	},
	watch: {
		notas_alumnos() {
			this.setPromedio()
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
	},

	mounted() {
		this.setPromedio()
	},
	methods: {
		soloNumeros(value) {
			let nota = value
			if (nota.toString().length == 1 && nota > 0) {
				nota = Number.parseFloat(nota).toFixed(1).toString() // agrega .0
			} else if (nota.toString().length == 2) {
				const notaSeparada = nota.toString().split('', 2)
				nota = `${notaSeparada[0]}.${notaSeparada[1]}`
			} else {
				nota = Number.parseFloat(nota).toFixed(0).toString()
			}
			nota = nota.replace(/[^0-9,.]/g, '') // Solo Numeros
			nota = nota.replace(/,/g, '.') // con punto
			return nota
		},
		setPromedio() {
			const notasAlumno = this.notas_alumnos.filter(na => na.idAlumnos === this.id_alumnos)

			let sumaPrimer = 0
			let divisorPrimer = 0
			let sumaSegundo = 0
			let divisorSegundo = 0
			let sumaTercer = 0
			let divisorTercer = 0
			if (this.evaluaciones_primer_tri != 0) {
				this.evaluaciones_primer_tri.forEach(evaluacionp => {
					notasAlumno.forEach(nota => {
						if (evaluacionp.idEvaluacion === nota.idEvaluacion) {
							sumaPrimer = sumaPrimer + Number(nota.nota)
							divisorPrimer = divisorPrimer + Number(1)
						}
					})
				})
				promedioPrimer = sumaPrimer / divisorPrimer
			}

			if (this.evaluaciones_segundo_tri != 0) {
				this.evaluaciones_segundo_tri.forEach(evaluacions => {
					notasAlumno.forEach(nota => {
						if (evaluacions.idEvaluacion === nota.idEvaluacion) {
							sumaSegundo = sumaSegundo + Number(nota.nota)
							divisorSegundo = divisorSegundo + Number(1)
						}
					})
				})
				promedioSegundo = sumaSegundo / divisorSegundo
			}

			if (this.evaluaciones_tercer_tri != 0) {
				this.evaluaciones_tercer_tri.forEach(evaluaciont => {
					notasAlumno.forEach(nota => {
						if (evaluaciont.idEvaluacion === nota.idEvaluacion) {
							sumaTercer = sumaTercer + Number(nota.nota)
							divisorTercer = divisorTercer + Number(1)
						}
					})
				})
				promedioTercer = sumaTercer / divisorTercer
			}

			let sumaPromedio = 0
			let divisorPromedio = 0
			if (promedioPrimer != 0) {
				sumaPromedio = sumaPromedio + promedioPrimer
				divisorPromedio = divisorPromedio + 1
			}
			if (promedioSegundo != 0) {
				sumaPromedio = sumaPromedio + promedioSegundo
				divisorPromedio = divisorPromedio + 1
			}
			if (promedioTercer != 0) {
				sumaPromedio = sumaPromedio + promedioTercer
				divisorPromedio = divisorPromedio + 1
			}
			const promedio = sumaPromedio / divisorPromedio
			const promedioFinal = !isNaN(promedio)
				? Math.round(promedio)
				: 0
			this.promedio = this.soloNumeros(promedioFinal)
		}
	}
});