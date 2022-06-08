Vue.component('formativa-modal-create',{
  template: //html
  `
    <div>
      <b-modal
        id="modal-crear-formativa"
        title="Crear Formativa"
        hide-backdrop
        data-keyboard="true"
        style="z-index: 10000;"
        aria-hidden="true"
        size="lg"
        button-size="sm"
        button-color="primary"
      >


        <b-form
          v-if="formativa"
        >
          <formativa-form
            btnSubmit="Crear Formativa"
            :formativa="formativa"
          />
        </b-form>

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
            size="sm"
            variant="success"
            class="blue"
            @click.prevent="crearFormativa(formativa)"
          >
            Guardar Formativa
          </b-button>
        </template>

      </b-modal>
    </div>
  `,
  computed: {
    },
  data() {
    return {
      formativa: {
        nombreGuia: '',
        modalidad: '',
      },
    }
  },
  props: {
  },
  methods: {
    crearFormativa(formativa) {
      console.log('Crear Formativa')
      console.log(formativa)
    },
  },
});