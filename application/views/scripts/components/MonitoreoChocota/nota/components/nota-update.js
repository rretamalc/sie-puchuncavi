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
      cargando: false,
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
          icon: 'success',
          title: 'Editado ??xitoso!',
          text: "Evaluaci??n editada con ??xito!",
          confirmButtonText: 'Ok!',
          footer: 'Este proceso podr??a tardar...'
        }).then((result) => {
            if (result.value) {
              this.$root.$bvModal.hide(this.nombre_modal);
            }
        })
      })
    },
    deleteForm(idEvaluacion) {
      Swal.fire({
        title: '??Seguro que deseas eliminar?',
        text: 'Se eliminar?? la evaluaci??n sumativa junto a las notas ingresadas. "No se podr?? revertir esta desici??n!"',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si, elim??nala!',
        cancelButtonText: 'Cancelar'
      }).then((result) => {

        if (result.value) {
          evaluaciones.dispatch('removeEvaluacion', idEvaluacion).then(() => {
            const data = {
              idCurso: this.id_curso,
              idPeriodo: this.id_periodo,
            }

            evaluaciones.dispatch('fetchEvaluacionesCurso', data)
            notas.dispatch('fetchNotas', data).then(() => {
            })

            Swal.fire({
              title: 'Eliminado ??xitoso!',
              text: "Evaluaci??n sumativa y notas eliminadas con ??xito.",
              icon: 'success',
              confirmButtonText: 'Ok!',
              footer: 'Este proceso podr??a tardar...'
              }).then((result) => {
                console.log('result :', result)
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