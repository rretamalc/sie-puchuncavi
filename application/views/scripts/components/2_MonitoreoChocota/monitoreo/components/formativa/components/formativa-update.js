Vue.component('formativa-update',{
  template: //html
  `
    <div>
      <evaluacion-modal-form
          v-if="guiaSelected !== null"
          btn_submit="Editar"
          :data="guiaSelected"
          :nombre_modal="nombre_modal"
          :modulo="modulo"
          :id_tipo_evaluacion="id_tipo_evaluacion"
          :id_asignatura_selected="id_asignatura_selected"
          :nombre_asignatura="nombre_asignatura"
          :tipo_evaluacion="tipo_evaluacion"
          @processForm="processUpdate"
          @processDelete="processDelete"
      />
    </div>
  `,
  computed: {
  },
  data() {
    return {
      guiaSelected: null,
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
    const guiasSelected = this.guias
      .find(ev => ev.idGuia === this.id_guia)
    this.guiaSelected = {
      contenido: guiasSelected.nombreGuia,
      idGuia: guiasSelected.idGuia,
      fecha: guiasSelected.fechaEvaluacion,
      modalidad: guiasSelected.tiempoGuia,
      tipoEvaluacion: Number(guiasSelected.tipoEvaluacion),
      porcentaje: guiasSelected.porcentajeExamen,
    }
  },
  methods: {
    processUpdate(dataGuia) {

      const evaluacion = {
        idCurso: this.id_curso,
        idAsignatura: this.id_asignatura_selected,
        idGuia: dataGuia.idGuia,
        modalidad: dataGuia.modalidad,
        nombreGuia: dataGuia.contenido,
        fecha: dataGuia.fecha,
        tipoEvaluacion: dataGuia.tipoEvaluacion,
        porcentaje: dataGuia.porcentaje,
      }
      guias.dispatch('updateEvaluacionFormativa', evaluacion).then(() => {
        const data = {
          idCurso: this.id_curso,
          idPeriodo: this.id_periodo,
          idPeriodo: this.id_periodo,
        }

        guias.dispatch('fetchGuiasFormativasCurso', data)
        notas.dispatch('fetchNotasFormativas', data)

        Swal.fire({
            title: 'Editado ??xitoso!',
            text: "Evaluaci??n editada con ??xito!",
            icon: 'success',
            confirmButtonText: 'Ok!'
        }).then((result) => {
            if (result.value) {
              this.$root.$bvModal.hide(this.nombre_modal);
            }
        })
      })
    },
    processDelete(idGuia) {

      Swal.fire({
        title: 'Estas seguro que deseas eliminar la evaluaci??n?',
        text: "Junto con la evaluaci??n, se eliminar??n todas las notas asociadas a esta y no podr??s revertir esto!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
      }).then((result) => {
        if (result.isConfirmed) {

          guias.dispatch('removeEvaluacion', idGuia).then(() => {
            const data = {
              idCurso: this.id_curso,
              idPeriodo: this.id_periodo,
              idPeriodo: this.id_periodo,
            }

            guias.dispatch('fetchGuiasFormativasCurso', data)
            notas.dispatch('fetchNotasFormativas', data)

            Swal.fire({
                title: 'Eliminado ??xitoso!',
                text: "Evaluaci??n eliminada con ??xito!",
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