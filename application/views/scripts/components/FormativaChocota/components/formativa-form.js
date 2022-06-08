Vue.component('formativa-form',{
  template: //html
  `
    <div>
        <!--@reset="onReset"-->
        <!--@submit="onSubmit"-->
        <!-- NOMBRE -->
        <b-form-group
          id="nombreLabel"
          label="Nombre"
          label-for="nombre"
        >
          <b-form-input
            id="nombre"
            v-model="formativa.nombreGuia"
            type="text"
            size="sm"
            placeholder="Ingresa el nombre"
          />
        </b-form-group>
        <b-form-group
          id="nombreLabel"
          label="Semestre"
          label-for="modalidad"
        >
          <b-form-select
            class="mt-1"
            v-model="formativa.modalidad"
            placeholder="Selecciona el Semestre..."
            :options="options"
            size="sm"
          />
            <!--@change="seleccionaModalidad"-->
        </b-form-group>

    </div>
  `,
  computed: {
    },
  data() {
    return {
      trimestre: 2,
      options: [
        { value: 1, text: 'Primer Trimestre' },
        { value: 2, text: 'Segundo Trimestre' },
        { value: 3, text: 'Tercer Trimestre' },
      ],
    }
  },
  props: {
    formativa: {
      type: Object,
      required: true,
    },
    btnSubmit: {
      type: String,
      required: true,
    },
  },
  computed: {
    // getGuiasAlumnos: {
    //   get() {
    //     return guias.getters.getGuiasAlumnos
    //   }
    // },
  },
  created() {
    // guias.dispatch('fetchGuias')
    // console.log('nombreModal')
    // console.log(this.nombreModal)
  },
  methods: {
    // ...Vuex.mapMutations('guias', ['setGuiasAlumnos']),
  },
});