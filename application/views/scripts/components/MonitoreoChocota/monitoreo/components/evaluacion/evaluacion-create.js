Vue.component('evaluacion-create',{
  template: //html
  `
    <div>
      <evaluacion-modal-form
        btn_submit="Crear"
        :data="dataEvaluacion"
        :nombre_modal="nombre_modal"
        :modulo="modulo"
        :id_tipo_evaluacion="id_tipo_evaluacion"
        :id_asignatura_selected.sync="id_asignatura_selected"
        :nombre_asignatura="nombre_asignatura"
        :tipo_evaluacion="tipo_evaluacion"
        :tiempo_nota.sync="tiempo_nota"
        :guias.sync="guias"
        :id_evaluacion="id_evaluacion"
        :tiempo_evaluacion.sync="tiempo_evaluacion"
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
    getGuiasCurso: {
      get() {
        return guias.getters.getGuiasCurso
      }
    },
    getGuiasFormativaCurso: {
      get() {
        return guias.getters.getGuiasFormativaCurso
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
        tipoEvaluacion: 3,
        porcentaje: null,
      },
      guias: [],
    }
  },
  watch: {
    getGuiasCurso() {
      this.guias = this.getGuiasCurso
    },
    getGuiasFormativaCurso() {
      this.guias = this.getGuiasFormativaCurso
    },
    getEvaluacionesCurso() {
      const findEvaluacion = this.getEvaluacionesCurso.find(ge => ge.idEvaluacion === this.id_evaluacion)
      if (findEvaluacion !== undefined) {
        this.tiempo_nota = findEvaluacion.tiempo
      }
      const findEvaluacionAsignatura = this.getEvaluacionesCurso.filter(ge => ge.idAsignatura === this.id_asignatura_selected)
      if (this.tipo_evaluacion === 'Formativa') {

      } else {
        this.guias = findEvaluacionAsignatura
      }
      // this.setEvaluacionesAsignatura()
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
    tiempo_evaluacion: {
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
    ...Vuex.mapActions({
      createGuia: 'guias/addGuia',
      createEvaluacion: 'evaluacion/addEvaluacion',
     }),
    processCreate(dataGuia) {

      if (dataGuia.tipoEvaluacion === 3) { // sumativa
        const evaluacion = {
          idCurso: this.id_curso,
          idAsignatura: this.id_asignatura_selected,
          modalidad: dataGuia.modalidad,
          fecha: dataGuia.fecha,
          contenido: dataGuia.contenido,
          tipoEvaluacion: dataGuia.tipoEvaluacion,
        }
        evaluaciones.dispatch('addEvaluacion', evaluacion).then(() => {
          const data = {
            idCurso: this.id_curso,
            idPeriodo: this.id_periodo,
          }

          this.dataEvaluacion.modalidad = null
          this.dataEvaluacion.contenido = ''

          evaluaciones.dispatch('fetchEvaluacionesCurso', data)
          notas.dispatch('fetchNotas', data)
          Swal.fire({
              title: 'Guardado Éxitoso!',
              text: "Evaluación creada con éxito.",
              icon: 'success',
              confirmButtonText: 'Ok!',
              footer: 'Este proceso podría tardar...'
          }).then((result) => {
              if (result.value) {
                this.$root.$bvModal.hide(this.nombre_modal);
              }
          })
        })
      }
      if (dataGuia.tipoEvaluacion === 2) { // formativa+
        const guia = {
          idPeriodo: this.id_periodo,
          idCursos: this.id_curso,
          idAsignatura: this.id_asignatura_selected,
          modalidad: dataGuia.modalidad,
          nombreGuia: dataGuia.contenido,
          fechaGuia: dataGuia.fecha,
          tipoGuia: dataGuia.tipoEvaluacion,
          porcentajeGuia: dataGuia.porcentaje,
          tiempoNota: this.tiempo_evaluacion
        }

        guias.dispatch('addGuia', guia).then(() => {
          const data = {
            idPeriodo: this.id_periodo,
            idCurso: this.id_curso,
            idAsignaturaSelected: this.id_asignatura_selected,
            tiempoNota: this.tiempo_evaluacion,
          }

          console.log('data :', data)

          // if (dataGuia.tipoEvaluacion !== 2) {
          // guias.dispatch('fetchGuiasCurso', data)
          // notas.dispatch('fetchNotasGuias', data)
          // } else {
          // }
          guias.dispatch('fetchGuiasFormativasCurso', data)
          notas.dispatch('fetchNotasFormativas', data)

          this.dataEvaluacion.contenido = ''
          if (this.tipo_evaluacion !== 'Formativa') {
            this.dataEvaluacion.tipoEvaluacion = 3
            this.dataEvaluacion.porcentaje = null
          }
          Swal.fire({
              title: 'Guardado Éxitoso!',
              text: "Evaluación creada con éxito.",
              icon: 'success',
              confirmButtonText: 'Ok!'
          }).then((result) => {
              if (result.value) {
                this.$root.$bvModal.hide(this.nombre_modal);
              }
          })
        })
      }
    },
  },
});