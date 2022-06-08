Vue.component('monitoreo',{
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
              rowspan="4"
              class="text-center"
              style="border: 1px solid #ddd; "
              variant="secondary"
            >
              Alumnos
            </b-th>
            <b-th
              v-if="colEvaluacionPrimerTri.length"
              class="text-center"
              style="border-left: 1px solid #ddd;"
              variant="warning"
              :colspan="colEvaluacionPrimerTri.length"
            >
              I Trimestre
            </b-th>
            <b-th
              v-if="colEvaluacionSegundoTri.length"
              class="text-center"
              style="border-left: 1px solid #ddd;"
              variant="success"
              :colspan="colEvaluacionSegundoTri.length"
            >
              II Trimestre
            </b-th>
            <b-th
              v-if="colEvaluacionTercerTri.length"
              class="text-center"
              style="border-left: 1px solid #ddd;"
              variant="info"
              :colspan="colEvaluacionTercerTri.length"
            >
              III Trimestre
            </b-th>
            <b-th
              class="text-center"
              style="border: 1px solid #ddd; width: 100px !important; max-width: 100px !important;"
              variant="primary"
              colspan="1"
              rowspan="3"
            >
              {{ nombre_contenido }}
            </b-th>
          </b-tr>

          <!-- BTN -->
          <b-tr>
            <b-th
              v-for="(title, index) in colEvaluacionPrimerTri"
              class="text-center"
              colspan="1"
              style="border-left: 1px solid #ddd;"
              :key="'head-btn-eval-pri-tri'+index"
              :variant="title.variant"
            >
              <evaluacion-update
                v-if="id_asignatura_selected !== null"
                modulo="Evaluación"
                :guias="guias"
                :id_guia="title.idGuia"
                :nombre_modal="'modal-primer-tri-'+title.idGuia"
                :id_tipo_evaluacion="id_tipo_evaluacion"
                :id_asignatura_selected="id_asignatura_selected"
                :id_curso="id_curso"
                :nombre_asignatura="nombre_asignatura"
                :id_periodo="id_periodo"
                :id_evaluacion="Number(id_evaluacion)"
                :tiempo_nota="tiempo_nota"
              />
              <btn-modal
                v-if="title.label != 'Formativa'"
                :nombre_modal="'modal-primer-tri-'+title.idGuia"
                clases="btn-sm blue"
                tipo="Editar"
                texto="Evaluación"
              />
            </b-th>
            <b-th
              v-for="(title, index) in colEvaluacionSegundoTri"
              class="text-center"
              colspan="1"
              style="border-left: 1px solid #ddd;"
              :key="'head-btn-eval-seg-tri'+index"
              :variant="title.variant"
            >

              <evaluacion-update
                v-if="id_asignatura_selected !== null"
                modulo="Evaluación"
                :guias="guias"
                :id_guia="title.idGuia"
                :nombre_modal="'modal-segundo-tri-'+title.idGuia"
                :id_tipo_evaluacion="id_tipo_evaluacion"
                :id_asignatura_selected="id_asignatura_selected"
                :id_curso="id_curso"
                :nombre_asignatura="nombre_asignatura"
                :id_periodo="id_periodo"
                :id_evaluacion="Number(id_evaluacion)"
                :tiempo_nota="tiempo_nota"
              />
              <btn-modal
                v-if="title.label != 'Formativa'"
                :nombre_modal="'modal-segundo-tri-'+title.idGuia"
                clases="btn-sm blue"
                tipo="Editar"
                texto="Evaluación"
              />
            </b-th>
            <b-th
              v-for="(title, index) in colEvaluacionTercerTri"
              class="text-center"
              colspan="1"
              style="border-left: 1px solid #ddd;"
              :key="'head-btn-eval-ter-tri'+index"
              :variant="title.variant"
            >
              <evaluacion-update
                v-if="id_asignatura_selected !== null"
                modulo="Evaluación"
                :guias="guias"
                :id_guia="title.idGuia"
                :nombre_modal="'modal-tercer-tri-'+title.idGuia"
                :id_tipo_evaluacion="id_tipo_evaluacion"
                :id_asignatura_selected="id_asignatura_selected"
                :id_curso="id_curso"
                :nombre_asignatura="nombre_asignatura"
                :id_periodo="id_periodo"
                :id_evaluacion="Number(id_evaluacion)"
                :tiempo_nota="tiempo_nota"
              />
              <btn-modal
                v-if="title.label != 'Formativa'"
                :nombre_modal="'modal-tercer-tri-'+title.idGuia"
                clases="btn-sm blue"
                tipo="Editar"
                texto="Evaluación"
              />
            </b-th>
          </b-tr>

          <!-- PORCENTAJE
          <b-tr>
            <b-th
              v-for="(title, index) in colEvaluacionPrimerTri"
              :key="'head-eval-pri-tri'+index"
              style="border-left: 1px solid #ddd;"
              colspan="1"
              :variant="title.variant"
            >
              <b-input-group size="sm" prepend="%">
                <b-form-input
                  :id="title.key + '-input'"
                  type="number"
                  style="width:10px;"
                  :value="title.porcentaje"
                  :disabled="true"
                  @change="changePorcentaje(title.key)"
                />
              </b-input-group>
            </b-th>

            <b-th
              v-for="(title, index) in colEvaluacionSegundoTri"
              :key="'head-eval-seg-tri'+index"
              style="border-left: 1px solid #ddd;"
              colspan="1"
              :variant="title.variant"
            >
              <b-input-group size="sm" prepend="%">
                <b-form-input
                  :id="title.key + '-input'"
                  type="number"
                  style="width:10px;"
                  :value="title.porcentaje"
                  :disabled="true"
                  @change="changePorcentaje(title.key)"
                />
              </b-input-group>
            </b-th>

            <b-th
              v-for="(title, index) in colEvaluacionTercerTri"
              :key="'head-eval-ter-tri'+index"
              style="border-left: 1px solid #ddd;"
              colspan="1"
              :variant="title.variant"
            >
              <b-input-group size="sm" prepend="%">
                <b-form-input
                  :id="title.key + '-input'"
                  type="number"
                  style="width:10px;"
                  :value="title.porcentaje"
                  :disabled="true"
                  @change="changePorcentaje(title.key)"
                />
              </b-input-group>
            </b-th>
          </b-tr>
           -->

          <!-- TIPO EVALUACIÓN -->
          <b-tr>
            <b-th
              v-for="(title, index) in colEvaluacionPrimerTri"
              class="text-center"
              style="min-width: 150px !important; border-left: 1px solid #ddd;"
              :key="'eval-pri-tri'+index"
              :variant="title.variant"
            >
            {{ title.label }}
            </b-th>

            <b-th
              v-for="(title, index) in colEvaluacionSegundoTri"
              class="text-center"
              style="min-width: 150px !important; border-left: 1px solid #ddd;"
              :key="'eval-seg-tri'+index"
              :variant="title.variant"
            >
            {{ title.label }}
            </b-th>

            <b-th
              v-for="(title, index) in colEvaluacionTercerTri"
              class="text-center"
              style="min-width: 150px !important; border-left: 1px solid #ddd;"
              :key="'eval-ter-tri'+index"
              :variant="title.variant"
            >
            {{ title.label }}
            </b-th>
          </b-tr>

          <!-- CONTENIDO -->
          <b-tr>
            <b-th
              v-for="(title, index) in colEvaluacionPrimerTri"
              class="text-center"
              style="border-left: 1px solid #ddd;"
              :title="title.label != 'Formativa'
                ? title.contenidoCompleto
                : 'Promedio de evaluaciones formativas'"
              :key="'eval-pri-tri'+index"
              :variant="title.variant"
            >
            {{ title.contenido }}
            </b-th>

            <b-th
              v-for="(title, index) in colEvaluacionSegundoTri"
              class="text-center"
              style="border-left: 1px solid #ddd;"
              :title="title.label != 'Formativa'
                ? title.contenidoCompleto
                : 'Promedio de evaluaciones formativas'"
              :key="'eval-seg-tri'+index"
              :variant="title.variant"
            >
            {{ title.contenido }}
            </b-th>

            <b-th
              v-for="(title, index) in colEvaluacionTercerTri"
              class="text-center"
              style="border-left: 1px solid #ddd;"
              :title="title.label != 'Formativa'
                ? title.contenidoCompleto
                : 'Promedio de evaluaciones formativas'"
              :key="'eval-ter-tri'+index"
              :variant="title.variant"
            >
            {{ title.contenido }}
            </b-th>

            <b-th
              v-for="(title, index) in colPromedios"
              class="text-center"
              style="border-left: 1px solid #ddd;"
              :key="'promedio'+index"
              :variant="title.variant"
            >
            {{ title.label }}
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
              :title="title.label != 'Formativa'
                ? 'Ingrese nota'
                : 'Promedio de evaluación formativa'"
              :key="'nota-pri-tri'+index"
            >
              <monitoreo-nota
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
              :title="title.label != 'Formativa'
                ? 'Ingrese nota'
                : 'Promedio de evaluación formativa'"
              :key="'nota-seg-tri'+index"
            >
              <monitoreo-nota
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
              :title="title.label != 'Formativa'
                ? 'Ingrese nota'
                : 'Promedio de evaluación formativa'"
              :key="'nota-ter-tri'+index"
            >
              <monitoreo-nota
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
              <monitoreo-promedio
                v-if="notasAlumnos && colEvaluacionPrimerTri && tiempo_nota == 3"
                :id_alumnos="item.idAlumnos"
                :id_curso="id_curso"
                :id_periodo="id_periodo"
                :evaluaciones.sync="colEvaluacionPrimerTri"
                :id_evaluacion="id_evaluacion"
              />
              <monitoreo-promedio
                v-if="notasAlumnos && colEvaluacionSegundoTri && tiempo_nota == 4"
                :id_alumnos="item.idAlumnos"
                :id_curso="id_curso"
                :id_periodo="id_periodo"
                :evaluaciones.sync="colEvaluacionSegundoTri"
                :id_evaluacion="id_evaluacion"
              />

              <monitoreo-promedio
                v-if="notasAlumnos && colEvaluacionTercerTri && tiempo_nota == 5"
                :id_alumnos="item.idAlumnos"
                :id_curso="id_curso"
                :id_periodo="id_periodo"
                :evaluaciones.sync="colEvaluacionTercerTri"
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
        variant="info"
        show
      >
        No existen evaluaciones creadas.<br>
        Para crear una nueva evaluación, da click en el botón verde
        "Nueva Evaluación Autoevaluación - Sumativa".
        Para crear evaluaciones Formativas, da click en el botón azul
        "Evaluaciones Formativas".
      </b-alert>

    </div>
    <div
      v-else-if="typeof countEvaluacionesTri === 'object' && notasAlumnos.length == 0"
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
      guias: [],
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
    getGuiasCurso: {
      get() {
        return guias.getters.getGuiasCurso
      }
    },
    getNotasGuias: {
      get() {
        return notas.getters.getNotasGuias
      }
    },
    getEvaluacionesCurso: {
      get() {
        return evaluaciones.getters.getEvaluacionesCurso
      }
    },
  },
  watch: {
    getGuiasCurso() {
      this.reset()
      this.guias = this.getGuiasCurso.filter(ge => ge.idAsignatura === this.id_asignatura)
      if (this.tiempo_nota !== null) {
        this.setColumnas(this.guias)
      }
    },
    getNotasGuias() {
      if (this.tiempo_nota !== null) {
        this.setNotas(this.getNotasGuias)
      }
    },
    getEvaluacionesCurso() {
      const findEvaluacion = this.getEvaluacionesCurso.find(ge => ge.idEvaluacion === this.id_evaluacion)
      this.tiempo_nota = findEvaluacion.tiempo
    },
    tiempo_nota() {
      if (this.tiempo_nota !== null && this.guias !== 'undefined') {
        this.setNotas(this.getNotasGuias)
        this.setColumnas(this.guias)
      }
    },
  },
  mounted() {
    this.setItems(this.alumnos_curso)
  },
  methods: {
    // ...Vuex.mapActions([{ fetchNotas: 'notas/fetchNotas' }]),
    // ...Vuex.mapActions([{ fetchNotasGuias: 'notas/fetchNotasGuias' }]),
    setNotas(getNotas) {
      this.notasAlumnos = getNotas
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
    findFormativaHeader() {
      let findFormativa = ''
      if (this.tiempo_nota === 3) {
        findFormativa = this.colEvaluacionPrimerTri.find(cp => cp.key === 'priPromFormativa')
      } else if (this.tiempo_nota === 4) {
        findFormativa = this.colEvaluacionSegundoTri.find(cp => cp.key === 'segPromFormativa')
      } else if (this.tiempo_nota === 5) {
        findFormativa = this.colEvaluacionTercerTri.find(cp => cp.key === 'terPromFormativa')
      }
      return findFormativa
    },
    setHeaderTrimestres(guias) {

      if (typeof this.tiempo_nota !== 'undefined') {
        let findFormativa = ''
        guias.forEach(guia => {
          const nombreguia = guia.nombreguia.length > 19
            ? guia.nombreguia.substr(0, 19)+'...'
            : guia.nombreguia

          if (guia.tiempoGuia === 3 && this.tiempo_nota === 3) {

            switch (guia.tipoGuia) {
              case '1':
                this.colEvaluacionPrimerTri.push({
                  key: 'priAutoevaluacion',
                  label: 'Autoevaluación',
                  variant: 'warning',
                  idGuia: guia.idGuia,
                  idCurso: guia.idCursos,
                  idAsignatura: guia.idAsignatura,
                  contenido: nombreguia,
                  contenidoCompleto: guia.nombreguia,
                  porcentaje: guia.porcentajeGuia,
                })
                break;
              case '2':
                // verificar si ya existe una formativa
                findFormativa = this.findFormativaHeader()
                if (typeof findFormativa === 'undefined') {
                  this.colEvaluacionPrimerTri.push({
                    key: 'priPromFormativa',
                    label: 'Formativa',
                    variant: 'warning',
                    idGuia: guia.idGuia,
                    idCurso: guia.idCursos,
                    idAsignatura: guia.idAsignatura,
                    contenido: 'Promedios',
                    contenidoCompleto: guia.nombreguia,
                    porcentaje: guia.porcentajeGuia,
                  })
                }
                break;
              case '3':
                this.colEvaluacionPrimerTri.push({
                  key: 'priSumativa',
                  label: 'Sumativa',
                  variant: 'warning',
                  idGuia: guia.idGuia,
                  idCurso: guia.idCursos,
                  idAsignatura: guia.idAsignatura,
                  contenido: nombreguia,
                  contenidoCompleto: guia.nombreguia,
                  porcentaje: guia.porcentajeGuia,
                })
                break;

              default:
                break;
            }
          } else if (guia.tiempoGuia === 4 && this.tiempo_nota === 4) {
            switch (guia.tipoGuia) {
              case '1':
                this.colEvaluacionSegundoTri.push({
                  key: 'segAutoevaluacion',
                  label: 'Autoevaluación',
                  variant: 'success',
                  idGuia: guia.idGuia,
                  idCurso: guia.idCursos,
                  idAsignatura: guia.idAsignatura,
                  contenido: nombreguia,
                  contenidoCompleto: guia.nombreguia,
                  porcentaje: guia.porcentajeGuia,
                })
                break;
              case '2':
                // verificar si ya existe una formativa

                findFormativa = this.findFormativaHeader()
                if (typeof findFormativa === 'undefined') {
                  this.colEvaluacionSegundoTri.push({
                    key: 'segPromFormativa',
                    label: 'Formativa',
                    variant: 'success',
                    idGuia: guia.idGuia,
                    idCurso: guia.idCursos,
                    idAsignatura: guia.idAsignatura,
                    contenido: 'Promedios',
                    contenidoCompleto: guia.nombreguia,
                    porcentaje: guia.porcentajeGuia,
                  })
                }
                break;
              case '3':
                this.colEvaluacionSegundoTri.push({
                  key: 'segSumativa',
                  label: 'Sumativa',
                  variant: 'success',
                  idGuia: guia.idGuia,
                  idCurso: guia.idCursos,
                  idAsignatura: guia.idAsignatura,
                  contenido: nombreguia,
                  contenidoCompleto: guia.nombreguia,
                  porcentaje: guia.porcentajeGuia,
                })
                break;

              default:
                break;
            }
          } else if (guia.tiempoGuia === 5 && this.tiempo_nota === 5) {
            switch (guia.tipoGuia) {
              case '1':
                this.colEvaluacionTercerTri.push({
                  key: 'terAutoevaluacion',
                  label: 'Autoevaluación',
                  variant: 'info',
                  idGuia: guia.idGuia,
                  idCurso: guia.idCursos,
                  idAsignatura: guia.idAsignatura,
                  contenido: nombreguia,
                  contenidoCompleto: guia.nombreguia,
                  porcentaje: guia.porcentajeGuia,
                })
                break;
              case '2':
                // verificar si ya existe una formativa
                findFormativa = this.findFormativaHeader()
                if (typeof findFormativa === 'undefined') {
                  this.colEvaluacionTercerTri.push({
                    key: 'terPromFormativa',
                    label: 'Formativa',
                    variant: 'info',
                    idGuia: guia.idGuia,
                    idCurso: guia.idCursos,
                    idAsignatura: guia.idAsignatura,
                    contenido: 'Promedios',
                    contenidoCompleto: guia.nombreguia,
                    porcentaje: guia.porcentajeGuia,
                  })
                }
                break;
              case '3':
                this.colEvaluacionTercerTri.push({
                  key: 'terSumativa',
                  label: 'Sumativa',
                  variant: 'info',
                  idGuia: guia.idGuia,
                  idCurso: guia.idCursos,
                  idAsignatura: guia.idAsignatura,
                  contenido: nombreguia,
                  contenidoCompleto: guia.nombreguia,
                  porcentaje: guia.porcentajeGuia,
                })
                break;

              default:
                break;
            }
          }
        })

        this.colPromedios.push(
          { key: 'nombre_nota', label: this.nombre_nota, variant: 'dark' },
        )
      }
    },
  },
});