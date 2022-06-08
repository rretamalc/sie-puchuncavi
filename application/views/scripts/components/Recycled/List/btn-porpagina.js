Vue.component('btn-porpagina',{
template: //html
`
  <div>
    <b-form-group
      class="mb-0"
    >
      <label class="d-inline-block text-sm-left"></label>
      <b-form-select
        id="perPageSelect"
        v-model="porPage"
        size="sm"
        :options="paginaOptions"
        class="w-50 mr-1"
        @change="sendPage"
      />
      <label class="d-inline-block text-sm-left">de {{ total }}</label>
    </b-form-group>
  </div>
`,
computed: {
},
props: {
  perPage: {
    type: Number,
    required: true,
  },
  pageOptions: {
    type: Array,
    required: true,
  },
  total: {
    type: Number,
    required: true,
  },
},
data() {
  return {
    porPage: null,
    paginaOptions: [],
  }
},
mounted() {
  this.porPage = this.perPage
  this.paginaOptions = this.pageOptions
},
methods: {
  sendPage() {
    this.$emit('update:perPage', this.porPage)
    this.$emit('update:pageOptions', this.paginaOptions)
  },
},
});
