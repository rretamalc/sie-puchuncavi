Vue.component('evaluacion-create',{
  template: //html
  `
    <div>
      <evaluacion-modal-form
        v-if="tiempo_nota !== null"
        btn_submit="Crear"
        :data="dataEvaluacion"
        :nombre_modal="nombre_modal"
        :modulo="modulo"
        :id_tipo_evaluacion="id_tipo_evaluacion"
        :id_asignatura_selected="id_asignatura_selected"
        :nombre_asignatura="nombre_asignatura"
        :tipo_evaluacion="tipo_evaluacion"
        :tiempo_nota="tiempo_nota"
        @processForm="processCreate"
      />
    </div>
  `,
  computed: {
    getEvaluacionesCurso: {
      get() {
        return evaluaciones.getters.getEvaluacionesCurso
      }
    },
  },
  data() {
    return {
      tiempo_nota: null,
      dataEvaluacion: {
        contenido: '',
        fecha: null,
        modalidad: null,
        tipoEvaluacion: null,
        porcentaje: null,
      }
    }
  },
  watch: {
    getEvaluacionesCurso() {
      const findEvaluacion = this.getEvaluacionesCurso.find(ge => ge.idEvaluacion === this.id_evaluacion)
      this.tiempo_nota = findEvaluacion.tiempo
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
    id_evaluacion: {
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
    ...Vuex.mapActions({ createGuia: 'guias/addGuia' }),
    processCreate(dataGuia) {

      const evaluacion = {
        idEvaluacion: this.id_evaluacion,
        idCursos: this.id_curso,
        idAsignatura: this.id_asignatura_selected,
        modalidad: dataGuia.modalidad,
        nombreGuia: dataGuia.contenido,
        fechaGuia: dataGuia.fecha,
        tipoGuia: dataGuia.tipoEvaluacion,
        porcentajeGuia: dataGuia.porcentaje,
      }


      guias.dispatch('addGuia', evaluacion).then(() => {
        const data = {
          idCurso: this.id_curso,
          idPeriodo: this.id_periodo,
          idEvaluacion: this.id_evaluacion,
        }

        if (dataGuia.tipoEvaluacion !== 2) {
          guias.dispatch('fetchGuiasCurso', data)
          notas.dispatch('fetchNotasGuias', data)
        } else {
          guias.dispatch('fetchGuiasFormativasCurso', data)
          notas.dispatch('fetchNotasFormativas', data)
        }

        if (this.tipo_evaluacion !== 'Formativa') {
          this.dataEvaluacion.contenido = ''
          this.dataEvaluacion.tipoEvaluacion = null
          this.dataEvaluacion.porcentaje = null
        }
        Swal.fire({
            title: 'Guardado Éxitoso!',
            text: "Evaluación creada con éxito!",
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