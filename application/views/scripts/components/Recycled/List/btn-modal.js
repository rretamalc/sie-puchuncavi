Vue.component('btn-modal',{
  template: //html
  `
    <b-button
      variant="primary"
      :class="clases"
      v-b-modal="nombre_modal"
    >
      <i
        v-if="tipo === 'Crear'"
        class="icon-plus"
      ></i>
      <i
        v-else-if="tipo === 'Editar'"
        class="icon-pencil"
      ></i>
      {{ tipo }} {{ texto }}

    </b-button>
  `,
  computed: {
  },
  props: {
    tipo: {
      type: String,
      required: true,
    },
    texto: {
      type: String,
      required: true,
    },
    clases: {
      type: String,
      required: true,
    },
    nombre_modal: {
      type: String,
      required: true,
    },
  },
});
