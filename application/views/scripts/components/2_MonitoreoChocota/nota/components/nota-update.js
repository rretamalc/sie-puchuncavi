Vue.component('nota-update',{
  template: //html
  `
    <div>
      <nota-modal-form
          v-if="evaluacionSelected !== null"
          btn_submit="Editar"
          :data="evaluacionSelected"
          :nombre_modal="nombre_modal"
          :modulo="modulo"
          :id_tipo_evaluacion="id_tipo_evaluacion"
          :id_asignatura_selected="id_asignatura_selected"
          :nombre_asignatura="nombre_asignatura"
          :tipo_evaluacion="tipo_evaluacion"
          @processForm="processUpdate"
          @processDelete="deleteForm"
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
    evaluaciones: {
      type: Array,
      required: true,
    },
    id_asignatura_selected: {
      type: Number,
      required: true,
    },
    id_evaluacion: {
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
  mounted() {
    const evaluacionSelected = this.evaluaciones
      .find(ev => ev.idEvaluacion === this.id_evaluacion)
    this.evaluacionSelected = {
      contenido: evaluacionSelected.contenido,
      idEvaluacion: evaluacionSelected.idEvaluacion,
      fecha: evaluacionSelected.fechaEvaluacion,
      modalidad: evaluacionSelected.tiempo,
      tipoEvaluacion: Number(evaluacionSelected.tipoEvaluacion),
      porcentaje: evaluacionSelected.porcentajeExamen,
    }
  },
  methods: {
    ...Vuex.mapActions({ updateEvaluacion: 'evaluaciones/updateEvaluacion' }),
    processUpdate(dataEvaluacion) {
      const evaluacion = {
        idEvaluacion: dataEvaluacion.idEvaluacion,
        idCurso: this.id_curso,
        idAsignatura: this.id_asignatura_selected,
        modalidad: dataEvaluacion.modalidad,
        contenido: dataEvaluacion.contenido,
        fecha: dataEvaluacion.fecha,
      }

      evaluaciones.dispatch('updateEvaluacion', evaluacion).then(() => {
        const data = {
          idCurso: this.id_curso,
          idPeriodo: this.id_periodo,
        }

        evaluaciones.dispatch('fetchEvaluacionesCurso', data)
        notas.dispatch('fetchNotas', data)

        Swal.fire({
            title: 'Editado Éxitoso!',
            text: "Nota editada con éxito!",
            icon: 'success',
            confirmButtonText: 'Ok!'
        }).then((result) => {
            if (result.value) {
              this.$root.$bvModal.hide(this.nombre_modal);
            }
        })
      })
    },
    deleteForm(idEvaluacion) {
      console.log('idEvaluacion :', idEvaluacion)
      Swal.fire({
        title: 'Estas seguro que deseas eliminar?',
        text: "Junto con eliminar la nota, se eliminarán todas las evaluaciones y notas asignadas a esta. No se podrá revertir esta desición!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, eliminar!',
        cancelButtonText: 'Cancelar'
      }).then((result) => {

        if (result.value) {
          evaluaciones.dispatch('removeEvaluacion', idEvaluacion).then(() => {
            const data = {
              idCurso: this.id_curso,
              idPeriodo: this.id_periodo,
            }

            evaluaciones.dispatch('fetchEvaluacionesCurso', data)
            notas.dispatch('fetchNotas', data)

            Swal.fire({
                title: 'Eliminado Éxitoso!',
                text: "Nota eliminada con éxito!",
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