Vue.component('nota-alumno',{
	template: //html
	`
		<div>
			<b-form-input
				v-if="nombre_tipo_evaluacion !== 'Formativas'"
				:id="'idNotas-'+idNotas"
				type="text"
				v-model="nota"
				style="width: 164px !important"
				size="sm"
				:state="state"
				@change="validarNota"
				maxlength="3"
			/>
			<p
				v-else
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
				idNotas: null,
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
						idEvaluacion: this.id_evaluacion,
						idNotas: this.idNotas,
						nota: this.nota.replace('.', ''),
						idAlumnos: this.id_alumnos,
					}

					notas.dispatch('updateNota', nota).then(() => {
						this.state = true

						const data = {
							idCurso: this.id_curso,
							idPeriodo: this.id_periodo,
						}
						notas.dispatch('fetchNotasChange', data)

						const Toast = Swal.mixin({
							toast: true,
							position: 'top-end',
							showConfirmButton: false,
							timer: 200
						});

						Toast.fire({
							type: 'success',
							title: 'Nota Actualizadas!'
						})
						this.state = null

					})

					// notas.dispatch('updateNotaGuia', nota).then(() => {
					// 	this.state = true

					// 	const data = {
					// 		idCurso: this.id_curso,
					// 		idPeriodo: this.id_periodo,
					// 		idEvaluacion: this.id_evaluacion,
					// 	}
					// 	notas.dispatch('fetchNotasGuias', data)

					// 	// const Toast = Swal.mixin({
					// 	// 	toast: true,
					// 	// 	position: 'top-end',
					// 	// 	showConfirmButton: false,
					// 	// 	timer: 2000
					// 	// });

					// 	// Toast.fire({
					// 	// 	type: 'success',
					// 	// 	title: 'Nota Actualizada!'
					// 	// })
					// 	// this.state = null


					// })
			},
			setNotas(notas_alumnos) {
				// console.log('this.id_alumnos :', this.id_alumnos)
				// console.log('this.id_curso :', this.id_curso)
				let notas = notas_alumnos.filter(no => no.tipoEvaluacion !== null)
				notas = notas.filter(no => no.idAlumnos === this.id_alumnos)
				notas = notas.filter(no => no.idPeriodo === this.id_periodo)

				// notas = notas.filter(no => no.idCursos === this.id_curso)
				// notas = notas.filter(no => no.idEvaluacion === this.id_evaluacion)
				// const notasFormativas = notas.filter(no => no.tipoEvaluacion === this.id_curso)
				// console.log('notas_alumnos :', notas_alumnos)
				notas.forEach(n => {
					if (n.idAlumnos === this.id_alumnos &&
							n.idEvaluacion === this.id_evaluacion &&
							n.idCursos === this.id_curso

						) {
							// console.log('n.tipoEvaluacion :', n.tipoEvaluacion)
							if (n.tipoEvaluacion === '3') {
								this.nota = this.soloNumeros(n.nota)
								this.notaObject = n
								this.idNotas = n.idNotas
							} else if (n.tipoEvaluacion === '2') {
								this.nota = this.soloNumerosFormativa(n.nota)
								this.notaObject = n
								this.idNotas = n.idNotas
								// console.log('notas :', notas)
							}

					}
					// if (n.idCursos === this.id_curso &&
					// 		n.tipoEvaluacion === '2') { // formativas
								// console.log('1212122121 :', 1212122121)
								// console.log('n.idEvaluacionGuia :', n.idEvaluacionGuia)
							// let findFormativas = notas.filter(ng => ng.idAlumnos === n.idAlumnos)
							// findFormativas = findFormativas.filter(ng => ng.idEvaluacionGuia === n.idEvaluacionGuia)
							// findFormativas = findFormativas.filter(ng => ng.tiempoGuia === n.tiempoGuia)
							// findFormativas = findFormativas.filter(ng => ng.tipoGuia === n.tipoGuia)
							// let sumaPromedio = 0
							// let divisor = 0
							// findFormativas.forEach(formativa => {
							// 	console.log('formativa :', formativa)
							// 	if (formativa.nota > 0 && formativa.nota !== null) {
							// 		sumaPromedio = formativa.nota + sumaPromedio
							// 		divisor = divisor + Number(1)
							// 	}
							// });
							// const promedio = sumaPromedio / divisor
							// this.nota = this.soloNumeros(promedio)

							// // this.nota = this.soloNumerosFinal(promedio)

							// this.notaObject = n
							// this.idNotas = n.idNotas
					// }
				})



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
			soloNumerosFormativa(value) {
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
					const notaSeparada = notaSinPunto.toString().split('', 3)
					nota = `${notaSeparada[0]}.${notaSeparada[1]}${notaSeparada[2]}`
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
