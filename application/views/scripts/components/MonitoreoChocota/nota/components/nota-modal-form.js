Vue.component('nota-modal-form',{
  template: //html
  `
    <div>
      <b-modal
        :id="nombre_modal"
        :title="btn_submit+' Evaluación Sumativa > '+nombre_asignatura+''"
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
              :disabled="btn_submit === 'Editar'"
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
              placeholder="Selecciona la evaluación..."
              :options="tipoEvaluaciones"
              :value="data.tipoEvaluacion"
              size="sm"
              :disabled="true"
            />
            <!--:state="!validaEvaluacionCreada ? null : false"-->
            <!--:disabled="tipo_evaluacion === 'Formativa'"-->
          </b-form-group>

        </b-form>

        <!-- Butons -->
        <template #modal-footer="{ cancel }">
          <!--<b-button
            size="sm"
            variant="info"
            class="blue"
            @click="cancel()"
          >
            Salir
          </b-button>
-->
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
            Guardar Evaluación
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
  },
  methods: {
    processDelete(data) {
      this.$emit('processDelete', data.idEvaluacion)
    },
    setDisabledSubmit() {
      const { modalidad } = this.data
      return modalidad !== null
    },
    processForm(data) {
      this.$emit('processForm', data)
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
      this.modalidades = [
        { value: null, text: 'Selecciona el ' + this.nombreTipoEvaluacion + '...' },
        { value: 3, text: 'I ' + this.nombreTipoEvaluacion },
        { value: 4, text: 'II ' + this.nombreTipoEvaluacion },
        { value: 5, text: 'III ' + this.nombreTipoEvaluacion },
      ]
    }

    this.tipoEvaluaciones = [
      { value: 2, text: 'Formativa' },
      { value: 3, text: 'Sumativa' },
    ]

    // if (this.data.tipoEvaluacion === 2) {
    //   this.data.tipoEvaluacion = 2
    // } else {
    //   this.data.tipoEvaluacion = 3
    //   this.tipoEvaluaciones = [
    //     // { value: null, text: 'Selecciona el Tipo Evaluación...'},
    //     // { value: 1, text: 'Autoevaluación' },
    //     { value: 3, text: 'Sumativa' },
    //   ]
    // }
  },
});
