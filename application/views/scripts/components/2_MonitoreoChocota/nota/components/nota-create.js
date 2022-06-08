Vue.component('nota-create',{
  template: //html
  `
    <div>
      <nota-modal-form
        btn_submit="Crear"
        :data="dataNota"
        :nombre_modal="nombre_modal"
        :modulo="modulo"
        :id_tipo_evaluacion="id_tipo_evaluacion"
        :id_asignatura_selected="id_asignatura_selected"
        :nombre_asignatura="nombre_asignatura"
        :tipo_evaluacion="tipo_evaluacion"
        @processForm="processCreate"
      />
    </div>
  `,
  computed: {
  },
  data() {
    return {
      dataNota: {
        fecha: null,
        modalidad: null,
        contenido: '',
      }
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
    id_curso: {
      type: Number,
      required: true,
    },
    id_periodo: {
      type: Number,
      required: true,
    },
    tipo_evaluacion: {
      type: String,
      required: false,
      default: null,
    }
  },
  methods: {
    ...Vuex.mapActions({ createEvaluacion: 'evaluacion/addEvaluacion' }),
    processCreate(dataNota) {
      const evaluacion = {
        idCurso: this.id_curso,
        idAsignatura: this.id_asignatura_selected,
        modalidad: dataNota.modalidad,
        fecha: dataNota.fecha,
        contenido: dataNota.contenido,
      }

      evaluaciones.dispatch('addEvaluacion', evaluacion).then(() => {
        const data = {
          idCurso: this.id_curso,
          idPeriodo: this.id_periodo,
        }

        // evaluaciones.dispatch('fetchEvaluacionesFormativasCurso', data)
        // notas.dispatch('fetchNotasFormativas', data)
        // if (this.tipo_evaluacion !== 'Formativa') {
          this.dataNota.modalidad = null
          this.dataNota.contenido = ''
        // }
        evaluaciones.dispatch('fetchEvaluacionesCurso', data)
        notas.dispatch('fetchNotas', data)
        Swal.fire({
            title: 'Guardado Éxitoso!',
            text: "Nota creada con éxito!",
            icon: 'success',
            confirmButtonText: 'Ok!'
        }).then((result) => {
            if (result.value) {
              this.$root.$bvModal.hide(this.nombre_modal);
            }
        })
      })
    },
  },
});