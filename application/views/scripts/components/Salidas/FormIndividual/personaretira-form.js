Vue.component('personaretira-form',{
	template: //html
	`
		<div>
			<b-card
				bg-variant="light"
			>
				<b-card-title
					class="mt-2"
					:title="title"
				/>

				<b-row
					class="justify-content-md-left"
				>
					<!-- Agregar nuevo Registro -->
					<b-col
						cols="2"
						md="2"
						xs="2"
						class="mt-4"
					>
						<b-card>
							<b-form-radio
								v-model="selectedRadio"
								name="some-radios"
								value="0"
							>
								<b-card-text>
									Agregar Nuevo Registro
								</b-card-text>
							</b-form-radio>
						</b-card>
					</b-col>
				</b-row>

				<b-row
					class="justify-content-md-left"
				>

					<!-- Apoderados Registrados -->
					<b-col
						cols="3"
						md="3"
						sm="3"
						v-for="apoderado in apoderadosAlumno"
						:key="apoderado.idApoderado"
						class="mt-4"
					>
						<b-card>
							<b-form-radio
								v-model="selectedRadio"
								name="some-radios"
								:value="apoderado.idApoderado"
							>
								<b-card-text
									class="small text-muted"
								>
									{{apoderado.tipoApoderado}}
								</b-card-text>
								<b-card-title>
									{{apoderado.nombres}}
									{{apoderado.apaterno}}
									{{apoderado.amaterno}}
								</b-card-title>
								<b-card-text>
									Rut: {{apoderado.rut}}
									<br>
									Teléfono: {{apoderado.telefono}}
									<br>
									Celular: {{apoderado.celular}}
								</b-card-text>
							</b-form-radio>
						</b-card>
					</b-col>
				</b-row>

			</b-card>
		</div>
	`,
	computed: {
	},
	data() {
		return {
			title: 'Información de la persona que retira',
			selectedRadio: null,
		}
	},
	props: {
		salida: {
			type: Object,
			required: true,
		},
		apoderadosAlumno: {
			type: Array,
			required: false,
		},
		apoderadoNull: {},
		seleccionaPersonaRetira: {},
	},
	watch: {
		selectedRadio() {
			this.selectedCheck(this.selectedRadio)
		},
	},
	mounted() {
		const retira = this.salida.tipoIdRetira
		if (retira == 'createApoderado') {
				this.selectedRadio = '0';
		} else {
			this.selectedRadio = this.salida.idRetira
		}
	},
	methods: {
		selectedCheck (selectedRadio) {
			if (selectedRadio == 0) {
				this.salida.idRetira = null
				this.salida.tipoIdRetira = 'createApoderado'
			} else if (selectedRadio > 0) {
				this.salida.idRetira = selectedRadio
				const apoderado = this.apoderadosAlumno.find(apo => apo.idApoderado == selectedRadio)
				this.salida.tipoIdRetira = apoderado.tipoApoderado
				this.$emit('apoderadoNull')
			}
			this.$emit('seleccionaPersonaRetira', this.salida.tipoIdRetira)
		},
	},
});
