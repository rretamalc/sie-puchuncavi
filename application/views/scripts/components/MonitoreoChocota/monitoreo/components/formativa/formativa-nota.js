Vue.component('formativa-nota',{
template: //html
`
	<div>
		<div
      v-if="spinner"
      class="text-center"
    >
      <b-spinner
				small
        label="Spinning"
        variant="primary"
        class="mt-5 mb-5 "
      ></b-spinner>
    </div>
		<b-form-input
			v-else
			:id="'idNotasGuia-'+idNotasGuia"
			type="text"
			v-model="nota_1"
			style="width: 164px !important"
			size="sm"
			:state="state"
			@change="validarNota"
			maxlength="3"
		/>

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
			idNotasGuia: null,
			nota_1: null,
			notaObject: [],
			state: null,
			spinner: true,
			notasAlumnos: [],
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
		id_guia: {
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
		id_evaluacion: {
			type: Number,
			required: true,
		},
		nombre_tipo_evaluacion: {
			type: String,
			required: true,
		},
		tiempo_nota: {
			type: Number,
			required: true,
		},
	},
	watch : {
		getNotasFormativas() {
			this.spinner = true
      if (this.tiempo_nota !== null) {
				// if (this.notasAlumnos.length !== this.getNotasFormativas.length) {
					this.setNotas(this.getNotasFormativas)
				// }
      }
    },
	},
	mounted() {
		this.spinner = true
		this.setNotas(notas.getters.getNotasFormativas)
	},
	methods: {
		validarNota() {
			this.nota_1 = this.nota_1.replace('.', '')
			if (Number(this.nota_1) < 0) {
				this.nota_1 = 0
			}
			if (
					Number(this.nota_1) > 70 ||
					Number(this.nota_1) === 8 ||
					Number(this.nota_1) === 9
				) {
				this.nota_1 = 7
			}
			this.nota_1 = this.soloNumeros(this.nota_1)
			this.changeNota()
		},
		changeNota() {
				const nota = {
					idNotasGuia: this.idNotasGuia,
					nota_1: this.nota_1.replace('.', ''),
					idEvaluacion: this.id_evaluacion,
					idAlumnos: this.id_alumnos,
					idGuia: this.id_guia,
				}

				notas.dispatch('updateNotaGuia', nota).then(() => {
					this.state = true

					const data = {
						idCurso: this.id_curso,
						idPeriodo: this.id_periodo,
						idAsignaturaSelected: this.id_asignatura,
						tiempoNota: this.tiempo_nota,
					}
					notas.dispatch('fetchNotasFormativas', data)

					const Toast = Swal.mixin({
						toast: true,
						position: 'top-end',
						showConfirmButton: false,
						timer: 3000
					});

					Toast.fire({
						type: 'success',
						title: 'Nota Actualizada!'
					})

					this.state = null
				})
		},
		setNotas(notas) {
			this.notasAlumnos = []
			this.notasAlumnos = notas
			notas.forEach(n => {
				if (
					n.idAlumnos === this.id_alumnos &&
					n.idGuia === this.id_guia &&
					n.idCursos === this.id_curso
					) {
					this.nota_1 = this.soloNumeros(n.nota_1)
					this.notaObject = n
					this.idNotasGuia = n.idNotasGuia
				}
			})
			this.spinner = false
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
				if (notaSeparada[0] === '0') {
					nota = `${notaSeparada[1]}.0`
				} else {
					nota = `${notaSeparada[0]}.${notaSeparada[1]}`
				}
			} else if (nota.toString().length == 3) {
				const notaSinPunto = Number(nota.toString().replace(".",""))
				const notaSeparada = notaSinPunto.toString().split('', 2)
				nota = `${notaSeparada[0]}.${notaSeparada[1]}`
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
			} else{
				nota = Number.parseFloat(nota).toFixed(0).toString()
			}
			nota = nota.replace(/[^0-9,.]/g, '') // Solo Numeros
			nota = nota.replace(/,/g, '.') // con punto
			return nota
		},
	},
});
