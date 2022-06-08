Vue.component('salidas-list',{
template: //html
`
<div>
  <h2>{{title}}</h2>
  <div class="overflow-auto">
    <b-row>

      <b-col
        md="2"
        sm="2"
        class="my-1"
      >
        <btn-porpagina
          :pageOptions.sync="pageOptions"
          :perPage.sync="perPage"
          :total.sync="items.length"
        />
      </b-col>

      <b-col
        md="6"
        sm="6"
        class="my-1"
      >
        <input-filtro
          :filter.sync="filter"
        />
      </b-col>

      <b-col
        md="4"
        sm="4"
        class="my-1"
      >
        <btn-crear
          class="mr-1"
          texto="Salida"
          @processAdd="addSalida"
        />
      </b-col>
    </b-row>

    <!-- Main table element -->
    <b-table
      :items="items"
      :fields="fields"
      :current-page="currentPage"
      :per-page="perPage"
      :filter="filter"
      :filter-included-fields="filterOn"
      :sort-by.sync="sortBy"
      :sort-desc.sync="sortDesc"
      :sort-direction="sortDirection"
      stacked="md"
      show-empty
      @filtered="onFiltered"

      outlined

    >
      <template #cell(acciones)="data">
        <col-acciones
          :data="data"
          @goToUpdate="goToUpdate"
          @processRemove="remove(data.item)"
        />
      </template>

    </b-table>

    <!--<b-pagination
      v-model="currentPage"
      :total-rows="totalRows"
      :per-page="perPage"
      align="fill"
      size="sm"
      pills
      class="my-0"
    />-->
    <!-- Info modal -->
    <b-modal :id="infoModal.id" :title="infoModal.title" ok-only @hide="resetInfoModal">
      <pre>{{ infoModal.content }}</pre>
    </b-modal>
  </div>
</div>
`,
computed: {
},
data() {
  return {
    title: 'Listado de salidas',
    items: [],
    fields: [
      { key: 'idCurso', label: 'Curso', sortable: true },
      { key: 'idAlumno', label: 'Alumno', sortable: true,  },
      { key: 'fecha', label: 'Fecha', sortable: true, class: 'text-center' },
      { key: 'hora', label: 'Hora', sortable: true, class: 'text-center' },
      { key: 'horaRegreso', label: 'Hora regreso', sortable: true, class: 'text-center' },
      { key: 'idRetira', label: 'Apoderado retira', sortable: true },
      { key: 'tipoIdRetira', label: 'Tipo apoderado', sortable: true },
      { key: 'acciones', label: 'Acciones' }
    ],
    totalRows: 1,
    currentPage: 1,
    perPage: 5,
    pageOptions: [25, 50, 100, { value: 500, text: "Mostrar todo" }],
    sortBy: '',
    sortDesc: false,
    sortDirection: 'asc',
    filter: '',
    filterOn: [],
    infoModal: {
      id: 'info-modal',
      title: '',
      content: ''
    },
  }
},
watch: {
  getSalidas() {
    this.items = this.getSalidas
  },
},
computed: {
  sortOptions() {
    // Create an options list from our fields
    return this.fields
      .filter(f => f.sortable)
      .map(f => {
        return { text: f.label, value: f.key }
      })
  },
  getSalidas: {
    get () {
      return salidas.getters.getSalidas
    }
  },
},
created() {
  salidas.dispatch('fetchSalidas')
},
mounted() {
  this.totalRows = this.items.length
},
methods: {
  ...Vuex.mapMutations('salidas', ['setSalida']),
  addSalida() {
    const { href } = window.location;
    const url = `${href}/create`;
    window.location.href = url;
  },
  goToUpdate({ item }) {
    salidas.commit('setSalida', item)
    const { href } = window.location;
    const url = `${href}/update/${item.id}`;
    window.location.href = url;
  },
  remove (id) {
    console.log('remove')
    console.log(id)
  },
  info(item, index, button) {
    this.infoModal.title = `Row index: ${index}`
    this.infoModal.content = JSON.stringify(item, null, 2)
    this.$root.$emit('bv::show::modal', this.infoModal.id, button)
  },
  resetInfoModal() {
    this.infoModal.title = ''
    this.infoModal.content = ''
  },
  onFiltered(filteredItems) {
    // Trigger pagination to update the number of buttons/pages due to filtering
    this.totalRows = filteredItems.length
    this.currentPage = 1
  }
}
});