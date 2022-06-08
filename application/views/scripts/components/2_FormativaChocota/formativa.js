Vue.component('formativa',{
template: //html
`
<div>
  <b-container class="mt-2">
    <b-row>
      <b-col>
        <btn-modal
          texto="Crear Formativa"
          color="green"
          nombreModal="modal-crear-formativa"
        />
      </b-col>
    </b-row>

    <formativa-modal-create

    />

    <b-table
      class="mt-4"
      outlined
    />
      <!-- THEAD TOP -->
      <b-tr>
        <b-th v-for="(field, index) in fields" :key="index">
          <btn-modal
            v-if="field.btn"
            color="blue"
            texto="Editar"
            :nombreModal="'modal-editar-formativa-'+field.formativa.idGuia"
          />
          <formativa-modal-update
            v-if="field.btn"
            :formativa="field.formativa"
          />
        </b-th>
      </b-tr>

      <!-- THEAD -->
      <tr>
        <th v-for="field in fields">
          {{ field.key }}
        </th>
      </tr>

      <!-- TBODY -->
      <template v-for="item in items">
        <formativa-tr
          :item="item"
          :formativas="formativas"
          :getGuiasAlumnos="guiasAlumnos"
        />
      </template>
		</b-table>
  </b-container>
</div>
`,
	computed: {
 	},
  data() {
    return {
      formativas: [],
      guiasAlumnos: [],
      items: [],
      fields: [
        { key: 'Alumnos', btn: false, },
      ],
    }
  },
  watch: {
    getAlumnos() {
      this.items = this.getAlumnos
    },
    getGuias() {
      this.guias = this.getGuias
      this.formatFields(this.guias)
    },
    getGuiasAlumnos() {
      this.guiasAlumnos = this.getGuiasAlumnos
    },
  },
  computed: {
    getAlumnos: {
      get() {
        const { getAlumnos } = alumnos.getters
        return getAlumnos.filter( ga => ga.idCursosActual === '502')
      }
    },
    getGuias: {
      get() {
        return guias.getters.getGuias
      }
    },
    getGuiasAlumnos: {
      get() {
        return guias.getters.getGuiasAlumnos
      }
    },
  },
  created() {
    guias.dispatch('fetchGuias')
    guias.dispatch('fetchGuiasAlumnos')
    alumnos.dispatch('fetchAlumnos')
  },
  methods: {
    ...Vuex.mapMutations('alumnos', ['setAlumnos']),
    ...Vuex.mapMutations('guias', ['setGuias']),
    ...Vuex.mapMutations('guias', ['setGuiasAlumnos']),
    formatFields(guias) {
      this.formativas = guias.filter(g => g.tipoGuia === 'Formativa')

      this.formativas.forEach(formativa => {
        this.fields.push({
          key: formativa.nombreGuia,
          formativa,
          btn: true,
        })
      })

      this.fields.push({
        key: 'Acciones',
        btn: false,
      })
    },
    crearFormativa() {
      console.log('Crear Formativa')
    },
    seleccionaTrimestre() {
      console.log(this.trimestre)
    }
  },
});