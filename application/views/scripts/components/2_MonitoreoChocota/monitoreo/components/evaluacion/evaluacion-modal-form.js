Vue.component('evaluacion-modal-form',{
  template: //html
  `
    <div>
      <b-modal
        :id="nombre_modal"
        :title="btn_submit+' '+modulo+': '+nombre_asignatura+''"
        hide-backdrop
        data-keyboard="true"
        style="z-index: 10000;"
        aria-hidden="true"
        size="lg"
        button-size="sm"
        button-color="primary"
        centered
      >
        <b-form
          v-if="data"
        >
          <!-- MODALIDAD -->
          <b-form-group
            id="labelModalidad"
            label="Modalidad"
            label-for="modalidad"
          >
            <b-form-select
              id="modalidad"
              class="mt-1"
              v-model="data.modalidad"
              label="text"
              :options="modalidades"
              :reduce="option => option.value"
              :value="data.modalidad"
              size="sm"
              :disabled="true"
              @change="validaTipoEvaluacion"
            />
          </b-form-group>

          <!-- CONTENIDO -->
          <b-form-group
            id="labelContenido"
            label="Contenido"
            label-for="c-input"
          >
            <b-form-input
              id="c-input"
              v-model="data.contenido"
              size="sm"
              placeholder="Ingresa el contenido"
              trim
            ></b-form-input>
          </b-form-group>

          <!-- TIPO EVALUACION -->
          <b-form-group
            id="labelTipoEvaluacion"
            label="Tipo Evaluación"
            label-for="tipoEvaluacion"
          >
            <b-form-select
              id="tipoEvaluacion"
              v-model="data.tipoEvaluacion"
              class="mt-1"
              :state="!validaEvaluacionCreada ? null : false"
              placeholder="Selecciona la evaluación..."
              :options="tipoEvaluaciones"
              :value="data.tipoEvaluacion"
              size="sm"
              :disabled="tipo_evaluacion === 'Formativa'"
              @change="validaTipoEvaluacion"
            />
            <b-alert
              variant="danger"
              class="mt-1"
              :show="validaEvaluacionCreada"
            >
              {{ evaluacionRepetida }}
            </b-alert>
          </b-form-group>

        </b-form>

        <!-- Butons -->
        <template #modal-footer="{ cancel }">

          <b-button
            size="sm"
            variant="danger"
            class="red"
            @click="cancel()"
          >
            Cancelar
          </b-button>

          <b-button
            v-if="btn_submit === 'Editar'"
            size="sm"
            variant="danger"
            class="red"
            @click.prevent="processDelete(data)"
          >
            Eliminar Evaluación
          </b-button>

          <b-button
            size="sm"
            variant="success"
            class="blue"
            :disabled="!disabledSubmit"
            @click.prevent="disabledSubmit
              ? processForm(data)
              : ''"
          >
            {{ btn_submit }} {{ modulo }}
          </b-button>
        </template>

      </b-modal>
    </div>
  `,
  computed: {
  },
  data() {
    return {
      modalidades: [],
      tipoEvaluaciones: [],
      validaEvaluacionCreada: false,
    }
  },
  props: {
    id_asignatura_selected: {
      type: Number,
      required: true,
    },
    nombre_modal: {
      type: String,
      required: true,
    },
    modulo: {
      type: String,
      required: true,
    },
    nombre_asignatura: {
      type: String,
      required: true,
    },
    id_tipo_evaluacion: {
      type: Number,
      required: true,
    },
    data: {
      type: Object,
      required: true,
    },
    btn_submit: {
      type: String,
      required: true,
    },
    tiempo_nota: {
      type: Number,
      required: true,
    },
    tipo_evaluacion: {
      type: String,
      required: false,
      default: null,
    },
  },
  computed: {
    nombreTipoEvaluacion() {
      let nombre
      if (this.id_tipo_evaluacion == 1) {
        nombre = 'Semestre'
      } else if (this.id_tipo_evaluacion == 2) {
        nombre = 'Trimestre'
      }
      return nombre
    },
    disabledSubmit() {
      const disabled = this.setDisabledSubmit()
      return disabled && !this.validaEvaluacionCreada
    },
    evaluacionRepetida() {
      return this.setMessageEvaluacionRepetida()
    },
  },
  methods: {
    setMessageEvaluacionRepetida() {
      const { modalidad, tipoEvaluacion } = this.data
      const tipoEvaluacionFind = this.tipoEvaluaciones.find(te => te.value === tipoEvaluacion)
      let message
      if (typeof tipoEvaluacionFind !== 'undefined' && modalidad !== null) {
        const modalidadFind = this.modalidades.find(mo => mo.value === modalidad)
        message = `Ya existe una evaluación de tipo "${tipoEvaluacionFind.text}"
         creada en el "${modalidadFind.text}".`
      }
      return message
    },
    setDisabledSubmit() {
      const { modalidad, contenido, tipoEvaluacion } = this.data
      let disabled = false
      if (
        modalidad !== null &&
        contenido !== '' &&
        tipoEvaluacion !== null
      ) {
        disabled = true
      }
      return disabled
    },
    processForm(data) {
      this.$emit('processForm', data)
    },
    processDelete(data) {
      this.$emit('processDelete', data.idGuia)
    },
    validaTipoEvaluacion() {
      const { modalidad, tipoEvaluacion } = this.data
      if (modalidad !== null && tipoEvaluacion !== null) {
        const idAsignatura = this.id_asignatura_selected
        const btnSubmit = this.btn_submit
        const data = this.data
        const { getGuiasCurso } = guias.getters
        const validaEvaluacionCreada = getGuiasCurso.find( function(guia) {

          if (guia.tiempoGuia === modalidad &&
            guia.idAsignatura === idAsignatura &&
            Number(guia.tipoGuia) === tipoEvaluacion) {
            if (btnSubmit === 'Crear') {
              return true
            } else if (btnSubmit === 'Editar') {
              if (guia.idGuia !== data.idEvaluacion) {
                return true
              }
            }
          }
        })
        this.validaEvaluacionCreada = validaEvaluacionCreada ? true : false
      }

      switch (tipoEvaluacion) {
        case 1:
          this.data.porcentaje = 10
          break;
        case 2:
          this.data.porcentaje = 40
          break;
        case 3:
          this.data.porcentaje = 50
          break;

        default:
          break;
      }
    },
  },
  created() {
    // SEMESTRE
    if (this.id_tipo_evaluacion === 1) {
      this.modalidades = []
      this.modalidades = [
        { value: null, text: 'Selecciona el ' + this.nombreTipoEvaluacion + '...' },
        { value: 1, text: 'I ' + this.nombreTipoEvaluacion },
        { value: 2, text: 'II ' + this.nombreTipoEvaluacion },
      ]
    }

    // TRIMESTRE
    if (this.id_tipo_evaluacion === 2) {

      this.modalidades = []

      if (this.tiempo_nota === 4) {
        this.modalidades = [
          { value: 4, text: 'II ' + this.nombreTipoEvaluacion }
        ]
        this.data.modalidad = 4
      } else if (this.tiempo_nota === 5) {
        this.modalidades = [
          { value: 5, text: 'III ' + this.nombreTipoEvaluacion },
        ]
        this.data.modalidad = 5
      } else {
        this.modalidades = [
          { value: null, text: 'Selecciona el ' + this.nombreTipoEvaluacion + '...' },
          { value: 4, text: 'II ' + this.nombreTipoEvaluacion },
          { value: 5, text: 'III ' + this.nombreTipoEvaluacion },
        ]
      }
    }
    if (this.tipo_evaluacion === 'Formativa') {
      this.data.tipoEvaluacion = 2
      this.tipoEvaluaciones = [
        { value: 2, text: 'Formativa' },
      ]
    } else {
      this.tipoEvaluaciones = [
        { value: null, text: 'Selecciona el Tipo Evaluación...'},
        { value: 1, text: 'Autoevaluación' },
        { value: 3, text: 'Sumativa' },
      ]
    }
  },
});