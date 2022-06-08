Vue.component('evaluacion-update',{
  template: //html
  `
    <div>
      <evaluacion-modal-form
          v-if="evaluacionSelected !== null"
          btn_submit="Editar"
          :data="evaluacionSelected"
          :nombre_modal="nombre_modal"
          :modulo="modulo"
          :id_tipo_evaluacion="id_tipo_evaluacion"
          :id_asignatura_selected="id_asignatura_selected"
          :nombre_asignatura="nombre_asignatura"
          :tipo_evaluacion="tipo_evaluacion"
          :tiempo_nota="tiempo_nota"
          @processForm="processUpdate"
          @processDelete="deleteEvaluacion"
      />
    </div>
  `,
  computed: {
  },
  data() {
    return {
      evaluacionSelected: null,
    }
  },
  props: {
    guias: {
      type: Array,
      required: true,
    },
    id_asignatura_selected: {
      type: Number,
      required: true,
    },
    id_guia: {
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
    tiempo_nota: {
      type: Number,
      required: true,
    },
    tipo_evaluacion: {
      type: String,
      required: false,
      default: null,
    }
  },
  mounted() {
    const evaluacionSelected = this.guias
      .find(ev => ev.idGuia === this.id_guia)
    this.evaluacionSelected = {
      contenido: evaluacionSelected.nombreguia,
      idGuia: evaluacionSelected.idGuia,
      fecha: evaluacionSelected.fechaGuia,
      modalidad: evaluacionSelected.tiempoGuia,
      tipoEvaluacion: Number(evaluacionSelected.tipoGuia),
      porcentaje: evaluacionSelected.porcentajeGuia,
    }
  },
  methods: {
    ...Vuex.mapActions({ updateEvaluacion: 'evaluaciones/updateEvaluacion' }),
    processUpdate(dataGuia) {
      const evaluacion = {
        idGuia: dataGuia.idGuia,
        modalidad: dataGuia.modalidad,
        nombreGuia: dataGuia.contenido,
        fechaGuia: dataGuia.fecha,
        tipoGuia: dataGuia.tipoEvaluacion,
        porcentajeGuia: dataGuia.porcentaje,
      }
      guias.dispatch('updateGuia', evaluacion).then(() => {
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

        Swal.fire({
            title: 'Editado Éxitoso!',
            text: "Evaluación editada con éxito!",
            icon: 'success',
            confirmButtonText: 'Ok!'
        }).then((result) => {
            if (result.value) {
              this.$root.$bvModal.hide(this.nombre_modal);
            }
        })
      })
    },
    deleteEvaluacion(idGuia) {

      Swal.fire({
        title: 'Estas seguro que deseas eliminar?',
        text: "Junto con eliminar la evaluación, se eliminarán todas las notas asignadas a esta. No se podrá revertir esta desición!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, eliminar!',
        cancelButtonText: 'Cancelar'
      }).then((result) => {

        if (result.value) {
          guias.dispatch('removeGuia', idGuia).then(() => {
            const data = {
              idCurso: this.id_curso,
              idPeriodo: this.id_periodo,
              idEvaluacion: this.id_evaluacion,
            }

            guias.dispatch('fetchGuiasCurso', data)
            notas.dispatch('fetchNotasGuias', data)
            guias.dispatch('fetchGuiasFormativasCurso', data)
            notas.dispatch('fetchNotasFormativas', data)

            Swal.fire({
                title: 'Eliminado Éxitoso!',
                text: "Evaluación eliminada con éxito!",
                icon: 'success',
                confirmButtonText: 'Ok!'
            }).then((result) => {
                if (result.value) {
                  this.$root.$bvModal.hide(this.nombre_modal);
                }
            })
          })

        }
      })
    },
  },
});