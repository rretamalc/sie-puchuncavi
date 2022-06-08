Vue.component('nota-alumno',{
template: //html
`
	<div>
		<p
			class="text-dark"
		>
			{{ nota }}
		</p>
	</div>
`,
  computed: {
	},
	data() {
		return {
			idNota: null,
			nota: null,
			notaObject: [],
			notasAlumnos: [],
			state: null,
		}
	},
	props: {
		notas_alumnos: {
			type: Array,
			required: true,
		},
		id_asignatura: {
			type: Number,
			required: true,
		},
		id_alumnos: {
			type: Number,
			required: true,
		},
		id_alumnos_actual: {
			type: Number,
			required: true,
		},
		id_evaluacion: {
			type: Number,
			required: true,
		},
		id_curso: {
			type: Number,
			required: true,
		},
		id_periodo: {
			type: Number,
			required: true,
		},
		nombre_tipo_evaluacion: {
			type: String,
			required: true,
		},
	},
	watch : {
		notas_alumnos() {
			this.setNotas(this.notas_alumnos)

		},
		notasAlumnos() {
			this.setNotas(this.notasAlumnos)
		}
	},
	mounted() {
		this.notasAlumnos = notas.getters.getNotas
	},
	methods: {
		// ...Vuex.mapActions({ updateNota: 'notas/updateNota' }),
		soloNumeros(value) {
			let nota = value
			if (nota.toString().length == 1 && nota > 0) {
				nota = `0.${nota}`
				// nota = Number.parseFloat(nota).toFixed(1).toString() // agrega .0
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
				if (notaSinPunto.toString().length === 3) {
					const notaSeparada = notaSinPunto.toString().split('', 3)
					nota = `${notaSeparada[0]}.${notaSeparada[1]}${notaSeparada[2]}`
				} else {
					const notaSeparada = notaSinPunto.toString().split('', 2)
					nota = `${notaSeparada[0]}.${notaSeparada[1]}`
				}
			} else if (nota.toString().length == 4) {
				const notaSinPunto = Number(nota.toString().replace(".",""))
				const notaSeparada = notaSinPunto.toString().split('', 3)
				nota = `${notaSeparada[0]}.${notaSeparada[1]}${notaSeparada[2]}`
			} else if (nota.toString().length > 4) {
				const notaSet = nota.toFixed(2)
				const notaSinPunto = Number(notaSet.toString().replace(".",""))
				const notaSeparada = notaSinPunto.toString().split('', 3)
				if (notaSeparada[2] === '0') {
					nota = `${notaSeparada[0]}.${notaSeparada[1]}`
				} else {
					nota = `${notaSeparada[0]}.${notaSeparada[1]}${notaSeparada[2]}`
				}
			} else {
				nota = Number.parseFloat(nota).toFixed(0).toString()
			}
			nota = nota.replace(/[^0-9,.]/g, '') // Solo Numeros
			nota = nota.replace(/,/g, '.') // con punto
			return nota
		},
		soloNumerosFinal(value) {
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
		validarNota() {
			this.nota = this.nota.replace('.', '')
			if (Number(this.nota) < 0) {
				this.nota = 0
			}
			if (
					Number(this.nota) > 70 ||
					Number(this.nota) === 8 ||
					Number(this.nota) === 9
				) {
				this.nota = 7
			}
			this.nota = this.soloNumeros(this.nota)
			this.changeNota()
		},
		changeNota() {
				const nota = {
					idNota: this.idNota,
					nota: this.nota.replace('.', ''),
				}

				notas.dispatch('updateNota', nota).then(() => {
					this.state = true

					const data = {
						idCurso: this.id_curso,
						idPeriodo: this.id_periodo,
					}
					// notas.dispatch('fetchNotas', data)

					const Toast = Swal.mixin({
						toast: true,
						position: 'top-end',
						showConfirmButton: false,
						timer: 2000
					});

					Toast.fire({
						type: 'success',
						title: 'Nota Actualizada!'
					})
					this.state = null

				})
		},
		setNotas(notas_alumnos) {
			notas_alumnos.forEach(n => {
				if (
					n.idAlumnos === this.id_alumnos &&
					n.idPruebas === this.id_evaluacion &&
					n.idCursos === this.id_curso
					) {
					// this.nota = this.soloNumerosFinal(n.nota)
					this.nota = this.soloNumeros(n.nota)
					this.notaObject = n
					this.idNota = n.idNotas
				}
			})
		},
	},
});