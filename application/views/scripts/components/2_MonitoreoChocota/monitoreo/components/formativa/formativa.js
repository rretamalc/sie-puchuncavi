Vue.component('formativa',{
template: //html
`
<div>
  <div>
    <div
      v-if="countEvaluacionesTri != 0"
    >
      <b-table-simple
        class="sm"
        :small="true"
        :busy="isBusy"
        responsive
        sticky-header
        hover
        bordered
        outlined
        />
        <b-thead>
          <b-tr>
            <b-th
              colspan="1"
              rowspan="3"
              class="text-center"
              style="border: 1px solid #ddd; "
              variant="secondary"
            >
              Alumnos
            </b-th>
            <b-th
              v-if="colEvaluacionPrimerTri.length"
              class="text-center"
              variant="warning"
              :colspan="colEvaluacionPrimerTri.length"
            >
              I Trimestre
            </b-th>
            <b-th
              v-if="colEvaluacionSegundoTri.length"
              class="text-center"
              variant="success"
              :colspan="colEvaluacionSegundoTri.length"
            >
              II Trimestre
            </b-th>
            <b-th
              v-if="colEvaluacionTercerTri.length"
              class="text-center"
              variant="info"
              :colspan="colEvaluacionTercerTri.length"
            >
              III Trimestre
            </b-th>
            <b-th
              class="text-center"
              style="border: 1px solid #ddd; max-width: 100px !important;"
              variant="primary"
              colspan="1"
              rowspan="2"
            >
              Promedio Evaluación Formativa
            </b-th>
          </b-tr>

          <!-- BTN -->
          <b-tr>
            <b-th
              v-for="(title, index) in colEvaluacionPrimerTri"
              class="text-center"
              colspan="1"
              :key="'head-btn-eval-pri-tri'+index"
              :variant="title.variant"
            >
              <evaluacion-update
                v-if="id_asignatura_selected !== null"
                modulo="Evaluación"
                :guias="guias"
                :id_guia="title.idGuia"
                :nombre_modal="'formativa-modal-'+title.idGuia"
                :id_tipo_evaluacion="id_tipo_evaluacion"
                :id_asignatura_selected="id_asignatura_selected"
                :id_curso="id_curso"
                :nombre_asignatura="nombre_asignatura"
                :id_periodo="id_periodo"
                :id_evaluacion="Number(id_evaluacion)"
                :tiempo_nota="tiempo_nota"
                tipo_evaluacion="Formativa"
              />
              <btn-modal
                :nombre_modal="'formativa-modal-'+title.idGuia"
                clases="btn-sm blue"
                tipo="Editar"
                texto="Evaluación"
              />
            </b-th>
            <b-th
              v-for="(title, index) in colEvaluacionSegundoTri"
              class="text-center"
              colspan="1"
              :key="'head-btn-eval-seg-tri'+index"
              :variant="title.variant"
            >
              <evaluacion-update
                v-if="id_asignatura_selected !== null"
                modulo="Evaluación"
                :guias="guias"
                :id_guia="title.idGuia"
                :nombre_modal="'formativa-modal-'+title.idGuia"
                :id_tipo_evaluacion="id_tipo_evaluacion"
                :id_asignatura_selected="id_asignatura_selected"
                :id_curso="id_curso"
                :nombre_asignatura="nombre_asignatura"
                :id_periodo="id_periodo"
                :id_evaluacion="Number(id_evaluacion)"
                :tiempo_nota="tiempo_nota"
                tipo_evaluacion="Formativa"
              />
              <btn-modal
                :nombre_modal="'formativa-modal-'+title.idGuia"
                clases="btn-sm blue"
                tipo="Editar"
                texto="Evaluación"
              />
            </b-th>
            <b-th
              v-for="(title, index) in colEvaluacionTercerTri"
              class="text-center"
              colspan="1"
              :key="'head-btn-eval-ter-tri'+index"
              :variant="title.variant"
            >
              <evaluacion-update
                v-if="id_asignatura_selected !== null"
                modulo="Evaluación"
                :guias="guias"
                :id_guia="title.idGuia"
                :nombre_modal="'formativa-modal-'+title.idGuia"
                :id_tipo_evaluacion="id_tipo_evaluacion"
                :id_asignatura_selected="id_asignatura_selected"
                :id_curso="id_curso"
                :nombre_asignatura="nombre_asignatura"
                :id_periodo="id_periodo"
                :id_evaluacion="Number(id_evaluacion)"
                :tiempo_nota="tiempo_nota"
                tipo_evaluacion="Formativa"
              />
              <btn-modal
                :nombre_modal="'formativa-modal-'+title.idGuia"
                clases="btn-sm blue"
                tipo="Editar"
                texto="Evaluación"
              />
            </b-th>
          </b-tr>

          <!-- CONTENIDO -->
          <b-tr>
            <b-th
              v-for="(title, index) in colEvaluacionPrimerTri"
              class="text-center"
              :title="title.contenidoCompleto"
              :key="'eval-pri-tri'+index"
              :variant="title.variant"
            >
            {{ title.contenido }}
            </b-th>

            <b-th
              v-for="(title, index) in colEvaluacionSegundoTri"
              class="text-center"
              :title="title.contenidoCompleto"
              :key="'eval-seg-tri'+index"
              :variant="title.variant"
            >
            {{ title.contenido }}
            </b-th>

            <b-th
              v-for="(title, index) in colEvaluacionTercerTri"
              class="text-center"
              :title="title.contenidoCompleto"
              :key="'eval-ter-tri'+index"
              :variant="title.variant"
            >
            {{ title.contenido }}
            </b-th>

            <b-th
              v-for="(title, index) in colPromedios"
              :key="'promedio'+index"
              :variant="title.variant"
              class="text-center"
            >
            Nota
            </b-th>
          </b-tr>
        </b-thead>

        <b-tbody>
          <b-tr v-for="(item, ind) in items" :key="ind">
            <b-th
              style="background: #efefef;"
            >
              {{ item.alumnos }}
            </b-th>
            <b-th
              v-for="(title, index) in colEvaluacionPrimerTri"
              class="text-center"
              style="border-left: 1px solid #ddd;"
              title="Ingrese nota"
              :key="'nota-pri-tri'+index"
            >
              <formativa-nota
                v-if="notasAlumnos.length > 0"
                :nombre_tipo_evaluacion="title.label"
                :notas_alumnos="notasAlumnos"
                :id_guia="title.idGuia"
                :id_asignatura="title.idAsignatura"
                :id_periodo="id_periodo"
                :id_curso="title.idCurso"
                :id_alumnos="item.idAlumnos"
                :id_alumnos_actual="item.idAlumnosActual"
                :id_evaluacion="Number(id_evaluacion)"
              />
            </b-th>

            <b-th
              v-for="(title, index) in colEvaluacionSegundoTri"
              class="text-center"
              style="border-left: 1px solid #ddd;"
              title="Ingrese nota"
              :key="'nota-seg-tri'+index"
            >
              <formativa-nota
                v-if="notasAlumnos.length > 0"
                :nombre_tipo_evaluacion="title.label"
                :notas_alumnos="notasAlumnos"
                :id_guia="title.idGuia"
                :id_asignatura="title.idAsignatura"
                :id_periodo="id_periodo"
                :id_curso="title.idCurso"
                :id_alumnos="item.idAlumnos"
                :id_alumnos_actual="item.idAlumnosActual"
                :id_evaluacion="Number(id_evaluacion)"
              />
            </b-th>

            <b-th
              v-for="(title, index) in colEvaluacionTercerTri"
              class="text-center"
              style="border-left: 1px solid #ddd;"
              title="Ingrese nota"
              :key="'nota-ter-tri'+index"
            >
              <formativa-nota
                v-if="notasAlumnos.length > 0"
                :nombre_tipo_evaluacion="title.label"
                :notas_alumnos="notasAlumnos"
                :id_guia="title.idGuia"
                :id_asignatura="title.idAsignatura"
                :id_periodo="id_periodo"
                :id_curso="title.idCurso"
                :id_alumnos="item.idAlumnos"
                :id_alumnos_actual="item.idAlumnosActual"
                :id_evaluacion="Number(id_evaluacion)"
              />
            </b-th>

            <b-th
              class="text-center"
              style="border-left: 1px solid #ddd; background: #f3f3f3;"
              title="Promedio I Trimestre"
            >
              <formativa-promedio
                v-if="notasAlumnos && colEvaluacionPrimerTri && tiempo_nota == 3"
                :id_alumnos="item.idAlumnos"
                :evaluaciones.sync="colEvaluacionPrimerTri"
                :id_curso="id_curso"
                :id_periodo="id_periodo"
                :id_evaluacion="id_evaluacion"
              />
              <formativa-promedio
                v-if="notasAlumnos && colEvaluacionSegundoTri && tiempo_nota == 4"
                :id_alumnos="item.idAlumnos"
                :evaluaciones.sync="colEvaluacionSegundoTri"
                :id_curso="id_curso"
                :id_periodo="id_periodo"
                :id_evaluacion="id_evaluacion"
              />
              <formativa-promedio
                v-if="notasAlumnos && colEvaluacionTercerTri && tiempo_nota == 5"
                :id_alumnos="item.idAlumnos"
                :evaluaciones.sync="colEvaluacionTercerTri"
                :id_curso="id_curso"
                :id_periodo="id_periodo"
                :id_evaluacion="id_evaluacion"
              />
            </b-th>
          </b-tr>
        </b-tbody>

      </b-table-simple>
    </div>

    <div
      v-else-if="typeof countEvaluacionesTri === 'number' && countEvaluacionesTri == 0"
    >
      <b-alert
        class="mt-4 mb-4 text-center"
        variant="warning"
        show
      >
        No existen evaluaciones Formativas creadas.<br>
        Para crear una nueva evaluación Formativa, da click en el botón verde
        "Crear Evaluación Formativa".
      </b-alert>
    </div>

    <div
      v-else-if="typeof countEvaluacionesTri === 'object' && notasAlumnos.length == 0 "
      class="text-center"
    >
      <b-spinner
        label="Spinning"
        variant="primary"
        class="mt-5 mb-5"
      ></b-spinner>
    </div>
  </div>

</div>
`,
  data() {
    return {
      isBusy: true,
      tiempo_nota: null,
      autoevaluacion: [],
      formativas: [],
      sumativa: [],
      guiasAlumnos: [],
      items: [],
      colModalidad: [],
      colEvaluacionPrimerTri: [],
      colEvaluacionSegundoTri: [],
      colEvaluacionTercerTri: [],
      countEvaluacionesTri: [],
      colPromedios: [],
      evaluaciones: [],
      notasAlumnos: [],
    }
  },
  props: {
    alumnos_curso: {
      type: Array,
      required: true,
    },
    id_asignatura_selected: {
      type: Number,
      required: true,
    },
    id_tipo_evaluacion: {
      type: Number,
      required: true,
    },
    id_asignatura: {
      type: Number,
      required: true,
    },
    id_periodo: {
      type: Number,
      required: true,
    },
    id_curso: {
      type: Number,
      required: true,
    },
    id_evaluacion: {
      type: Number,
      required: true,
    },
    nombre_asignatura: {
      type: String,
      required: true,
    },
    nombre_nota: {
      type: String,
      required: true,
    },
    nombre_contenido: {
      type: String,
      required: true,
    },
  },
  computed: {
    getGuiasFormativaCurso: {
      get() {
        return guias.getters.getGuiasFormativaCurso
      }
    },
    getNotasFormativas: {
      get() {
        return notas.getters.getNotasFormativas
      }
    },
    getEvaluacionesCurso: {
      get() {
        return evaluaciones.getters.getEvaluacionesCurso
      }
    },
  },
  watch: {
    getGuiasFormativaCurso() {
      this.reset()
      this.guias = this.getGuiasFormativaCurso.filter(ge => ge.idAsignatura === this.id_asignatura)
      if (this.tiempo_nota !== null) {
        this.setColumnas(this.guias)
      }
    },
    getNotasFormativas() {
      if (this.tiempo_nota !== null) {
        this.setNotas(this.getNotasFormativas)
      }
    },
    getEvaluacionesCurso() {
      const findEvaluacion = this.getEvaluacionesCurso.find(ge => ge.idEvaluacion === this.id_evaluacion)
      this.tiempo_nota = findEvaluacion.tiempo
    },
    tiempo_nota() {
      if (typeof this.guias !== 'undefined' && this.tiempo_nota !== null) {
        this.setNotas(this.getNotasFormativas)
        this.setColumnas(this.guias)
      }
    },
  },
  mounted() {
    this.setItems(this.alumnos_curso)
  },
  methods: {
    // ...Vuex.mapActions([{ fetchNotas: 'notas/fetchNotas' }]),
    setNotas(notas) {
      this.notasAlumnos = notas
    },
    changePorcentaje(keyCol) {
    },
    setItems(alumnos) {
      alumnos.forEach(alumno => {
        const nombreAlumno = `${alumno.apaterno} ${alumno.amaterno} ${alumno.nombres}`
        this.items.push({
          'alumnos': nombreAlumno,
          'idAlumnos': alumno.idAlumnos,
          'idAlumnosActual': alumno.idAlumnosActual,
        })

      });
    },
    setTipoEvaluaciones(guias) {
      this.autoevaluacion = guias.filter(ae => ae.tipoGuia === '1')
      this.formativas = guias.filter(f => f.tipoGuia === '2')
      this.sumativa = guias.filter(s => s.tipoGuia === '3')
    },
    setColumnas(guias) {
      this.setTipoEvaluaciones(guias)
      this.countEvaluacionesTri = this.autoevaluacion.length + this.formativas.length + this.sumativa.length

      if (this.countEvaluacionesTri > 0) {


        if (this.id_tipo_evaluacion === 1) {

          // this.colEvaluacion.push(
          //   { key: 'priAutoevaluacion', label: 'Autoevaluación', variant: '' },
          //   { key: 'priPromFormativa', label: 'Formativa', variant: '' },
          //   { key: 'priSumativa', label: 'Sumativa', variant: '' },
          // )

          // this.fields.push(
          //   { key: 'segundoSem', label: 'I Sem', variant: '' },
          //   { key: 'segundoSem', label: 'II Sem', variant: '' },
          //   { key: 'promedioFinal', label: 'Final', variant: 'success'},
          // )
        } else if (this.id_tipo_evaluacion === 2) {
          this.setHeaderTrimestres(guias)
        }
      }
    },
    reset() {
      this.colEvaluacionPrimerTri = []
      this.colEvaluacionSegundoTri = []
      this.colEvaluacionTercerTri = []
      this.countEvaluacionesTri = []
      this.colPromedios = []
      this.guias = []
    },
    setHeaderTrimestres(guias) {
      if (typeof this.tiempo_nota !== 'undefined') {

        guias.forEach(guia => {
          const nombgreGuia = guia.nombreguia.length > 16
            ? guia.nombreguia.substr(0, 16)+'...'
            : guia.nombreguia

          if (guia.tiempoGuia === 3 && this.tiempo_nota === 3) {
            this.colEvaluacionPrimerTri.push({
              key: 'priPromFormativa',
              label: 'Formativa',
              variant: 'warning',
              idGuia: guia.idGuia,
              idCurso: guia.idCursos,
              idAsignatura: guia.idAsignatura,
              contenido: nombgreGuia,
              contenidoCompleto: guia.nombreguia,
              porcentaje: guia.porcentajeGuia,
            })
          } else if (guia.tiempoGuia === 4 && this.tiempo_nota === 4) {
            this.colEvaluacionSegundoTri.push({
              key: 'segPromFormativa',
              label: 'Formativa',
              variant: 'success',
              idGuia: guia.idGuia,
              idCurso: guia.idCursos,
              idAsignatura: guia.idAsignatura,
              contenido: nombgreGuia,
              contenidoCompleto: guia.nombreguia,
              porcentaje: guia.porcentajeGuia,
            })
          } else if (guia.tiempoGuia === 5 && this.tiempo_nota === 5) {
            this.colEvaluacionTercerTri.push({
              key: 'terAutoevaluacion',
              label: 'Formativa',
              variant: 'info',
              idGuia: guia.idGuia,
              idCurso: guia.idCursos,
              idAsignatura: guia.idAsignatura,
              contenido: nombgreGuia,
              contenidoCompleto: guia.nombreguia,
              porcentaje: guia.porcentajeGuia,
            })
          }
        })

        this.colPromedios.push(
          { key: 'nombre_nota', label: this.nombre_nota, variant: 'dark' },
        )
      }
    },
  },
});