Vue.component('formativa-modal-update',{
  template: //html
  `
    <div>
      <b-modal
        :id="'modal-editar-formativa-'+formativa.idGuia"
        title="Editar Formativa"
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
            btnSubmit="Editar Formativa"
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
            @click.prevent="editarFormativa(formativa)"
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
    }
  },
  props: {
    formativa: {
      type: Object,
      required: true,
    }
  },
  computed: {
    // getGuiasAlumnos: {
    //   get() {
    //     return guias.getters.getGuiasAlumnos
    //   }
    // },
  },
  created() {
    console.log(this.formativa)
    // guias.dispatch('fetchGuias')
    // console.log('nombreModal')
    // console.log(this.nombreModal)
  },
  methods: {
    editarFormativa(formativa) {
      console.log('Editar Formativa')
      console.log(formativa)
    },
    // ...Vuex.mapMutations('guias', ['setGuiasAlumnos']),
  },
});