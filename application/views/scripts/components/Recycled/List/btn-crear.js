Vue.component('btn-crear',{
  template: //html
  `
    <div
    class="d-flex align-items-center justify-content-end"
    >
    <b-button
      variant="primary"
      class="btn-sm blue"
      @click="$emit('processAdd')"
    >
      <span class="text-nowrap">Crear {{ texto }}</span>
    </b-button>
    </div>
  `,
  computed: {
  },
  props: {
    texto: {
      type: String,
      required: true,
    },
  },
});
