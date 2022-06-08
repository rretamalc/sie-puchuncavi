Vue.component('nota',{
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
              rowspan="5"
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
              style="border: 1px solid #ddd;"
              variant="primary"
              colspan="4"
              rowspan="3"
            >
              Promedios
            </b-th>
          </b-tr>

          <!-- BTN
          <b-tr>
            <b-th
              v-for="(title, key) in colEvaluacionPrimerTri"
              class="text-center"
              colspan="1"
              style="width: 130px !important; border-left: 1px solid #ddd;"
              :key="'head-btn-eval-pri-tri'+key"
              :variant="title.variant"
            >
              <b-button
                class="btn-sm blue mt-1 mb-1"
                :title="'Ir a Evaluaciones de Nota '+Number(key+1)"
                @click="goToGuias(title.idEvaluacion, key)"
                >
                <i class="icon-hand-up"></i> Evaluaciones
              </b-button>
            </b-th>
            <b-th
              v-for="(title, key) in colEvaluacionSegundoTri"
              class="text-center"
              style="width: 130px !important; border-left: 1px solid #ddd;"
              colspan="1"
              :key="'head-btn-eval-seg-tri'+key"
              :variant="title.variant"
            >
              <b-button
                class="btn-sm blue mt-1 mb-1"
                :title="'Ir a Evaluaciones de Nota '+Number(key+1)"
                @click="goToGuias(title.idEvaluacion, key)"
              >
                <i class="icon-hand-up"></i> Evaluaciones
              </b-button>
            </b-th>
            <b-th
              v-for="(title, key) in colEvaluacionTercerTri"
              class="text-center"
              style="width: 130px !important; border-left: 1px solid #ddd;"
              colspan="1"
              :key="'head-btn-eval-ter-tri'+key"
              :variant="title.variant"
            >
              <b-button
                class="btn-sm blue mt-1 mb-1"
                :title="'Ir a Evaluaciones de Nota '+Number(key+1)"
                @click="goToGuias(title.idEvaluacion, key)"
              >
                <i class="icon-hand-up"></i> Evaluaciones
              </b-button>
            </b-th>
          </b-tr>-->



          <!-- BTN EDITAR-->
          <b-tr>
            <b-th
              v-for="(title, key) in colEvaluacionPrimerTri"
              class="text-center"
              colspan="1"
              style="width: 130px !important; border-left: 1px solid #ddd;"
              :key="'head-btn-eval-pri-tri'+key"
              :variant="title.variant"
            >
              <nota-update
                v-if="id_asignatura_selected !== null"
                modulo="Nota"
                :evaluaciones="evaluaciones"
                :id_evaluacion="title.idEvaluacion"
                :nombre_modal="'modal-primer-tri-'+title.idEvaluacion"
                :id_tipo_evaluacion="id_tipo_evaluacion"
                :id_asignatura_selected="id_asignatura_selected"
                :id_curso="id_curso"
                :nombre_asignatura="nombre_asignatura"
                :id_periodo="id_periodo"
              />
              <btn-modal
                v-if="title.label !== 'Formativas'"
                :nombre_modal="'modal-primer-tri-'+title.idEvaluacion"
                clases="btn-sm blue"
                tipo="Editar"
                texto="Evaluación"
              />
              <div
                v-else
              >
                Promedio
              </div>
            </b-th>
            <b-th
              v-for="(title, key) in colEvaluacionSegundoTri"
              class="text-center"
              style="width: 130px !important; border-left: 1px solid #ddd;"
              colspan="1"
              :key="'head-btn-eval-seg-tri'+key"
              :variant="title.variant"
            >
              <nota-update
                v-if="id_asignatura_selected !== null && title.label !== 'Formativas'"
                modulo="Nota"
                :evaluaciones="evaluaciones"
                :id_evaluacion="title.idEvaluacion"
                :nombre_modal="'modal-segundo-tri-'+title.idEvaluacion"
                :id_tipo_evaluacion="id_tipo_evaluacion"
                :id_asignatura_selected="id_asignatura_selected"
                :id_curso="id_curso"
                :nombre_asignatura="nombre_asignatura"
                :id_periodo="id_periodo"
                />
              <btn-modal
                v-if="title.label !== 'Formativas'"
                :nombre_modal="'modal-segundo-tri-'+title.idEvaluacion"
                clases="btn-sm blue"
                tipo="Editar"
                texto="Evaluación"
              />
              <div
                v-else
              >
                Promedio
              </div>

            </b-th>
            <b-th
              v-for="(title, key) in colEvaluacionTercerTri"
              class="text-center"
              style="width: 130px !important; border-left: 1px solid #ddd;"
              colspan="1"
              :key="'head-btn-eval-ter-tri'+key"
              :variant="title.variant"
            >
              <nota-update
                v-if="id_asignatura_selected !== null && title.label !== 'Formativas'"
                modulo="Notas"
                :evaluaciones="evaluaciones"
                :id_evaluacion="title.idEvaluacion"
                :nombre_modal="'modal-tercer-tri-'+title.idEvaluacion"
                :id_tipo_evaluacion="id_tipo_evaluacion"
                :id_asignatura_selected="id_asignatura_selected"
                :id_curso="id_curso"
                :nombre_asignatura="nombre_asignatura"
                :id_periodo="id_periodo"
              />
              <btn-modal
                v-if="title.label !== 'Formativas'"
                :nombre_modal="'modal-tercer-tri-'+title.idEvaluacion"
                clases="btn-sm blue"
                tipo="Editar"
                texto="Evaluación"
              />
              <div
                v-else
              >
                Promedio
              </div>
            </b-th>
          </b-tr>

          <!-- TIPO EVALUACIÓN -->
          <b-tr>
            <b-th
              v-for="(title, index) in colEvaluacionPrimerTri"
              class="text-center"
              style="width: 130px !important; border-left: 1px solid #ddd;"
              :key="'eval-pri-tri'+index"
              :variant="title.variant"
              :rowspan="title.contenido === 'Formativas' ? 2 : 1"
            >
            {{ title.contenido === 'Formativas' ? 'Evaluaciones Formativas' : 'Evaluación Sumativa' }}
            </b-th>

            <b-th
              v-for="(title, index) in colEvaluacionSegundoTri"
              class="text-center"
              style="width: 130px !important; border-left: 1px solid #ddd;"
              :key="'eval-seg-tri'+index"
              :variant="title.variant"
              :rowspan="title.contenido === 'Formativas' ? 2 : 1"
            >
            {{ title.contenido === 'Formativas' ? 'Evaluaciones Formativas' : 'Evaluación Sumativa' }}
            </b-th>

            <b-th
              v-for="(title, index) in colEvaluacionTercerTri"
              class="text-center"
              style="width: 130px !important; border-left: 1px solid #ddd;"
              :key="'eval-ter-tri'+index"
              :variant="title.variant"
              :rowspan="title.contenido === 'Formativas' ? 2 : 1"
            >
            {{ title.contenido === 'Formativas' ? 'Evaluaciones Formativas' : 'Evaluación Sumativa' }}
            </b-th>

          </b-tr>


          <!-- CONTENIDO -->
          <b-tr>
            <b-th
              v-if="title.contenido !== 'Formativas'"
              v-for="(title, index) in colEvaluacionPrimerTri"
              class="text-center"
              style="width: 130px !important; border-left: 1px solid #ddd;"
              :title="title.contenido !== 'Formativas'
                ? 'Contenido: '+title.label
                : 'Promedio por alumno de evaluaciones formativas.'"
              :key="'eval-pri-tri'+index"
              :variant="title.variant"

            >
            {{ title.contenido }}
            </b-th>

            <b-th
              v-if="title.contenido !== 'Formativas'"
              v-for="(title, index) in colEvaluacionSegundoTri"
              class="text-center"
              style="width: 130px !important; border-left: 1px solid #ddd;"
              :title="title.contenido !== 'Formativas'
                ? 'Contenido: '+title.label
                : 'Promedio por alumno de evaluaciones formativas.'"
              :key="'eval-seg-tri'+index"
              :variant="title.variant"
            >
            {{ title.contenido }}
            </b-th>

            <b-th
              v-if="title.contenido !== 'Formativas'"
              v-for="(title, index) in colEvaluacionTercerTri"
              class="text-center"
              style="width: 130px !important; border-left: 1px solid #ddd;"
              :title="title.contenido !== 'Formativas'
                ? 'Contenido: '+title.label
                : 'Promedio por alumno de evaluaciones formativas.'"
              :key="'eval-ter-tri'+index"
              :variant="title.variant"
            >
            {{ title.contenido }}
            </b-th>
            <b-th
              v-for="(title, index) in colPromediosUp"
              class="text-center"
              style="width: 60px !important; border-left: 1px solid #ddd;"
              :key="'promedio'+index"
              :variant="title.variant"
            >
            {{ title.label }}
            </b-th>
          </b-tr>

          <!-- NOTA -->
          <b-tr>
            <b-th
              v-for="(title, index) in colEvaluacionPrimerTri"
              class="text-center"
              style="width: 130px !important; border-left: 1px solid #ddd;"
              :title="'Nota '+ Number(index + 1)"
              :key="'eval-pri-tri'+index"
              :variant="title.variant"
            >
            N{{ index + 1 }}
            </b-th>

            <b-th
              v-for="(title, index) in colEvaluacionSegundoTri"
              class="text-center"
              style="width: 130px !important; border-left: 1px solid #ddd;"
              :title="'Nota '+ Number(index + 1)"
              :key="'eval-seg-tri'+index"
              :variant="title.variant"
            >
            N{{ index + 1 }}
            </b-th>

            <b-th
              v-for="(title, index) in colEvaluacionTercerTri"
              class="text-center"
              style="width: 130px !important; border-left: 1px solid #ddd;"
              :title="'Nota '+ Number(index + 1)"
              :key="'eval-ter-tri'+index"
              :variant="title.variant"
            >
            N{{ index + 1 }}
            </b-th>

            <b-th
              v-for="(title, index) in colPromedios"
              class="text-center"
              style="width: 60px !important; border-left: 1px solid #ddd;"
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
              title="Nota"
              :key="'nota-pri-tri'+index"
            >
              <!--<nota-alumno
                v-if="notasAlumnos.length > 0"
                :nombre_tipo_evaluacion="title.label"
                :notas_alumnos="notasAlumnos"
                :id_evaluacion="title.idEvaluacion"
                :id_asignatura="title.idAsignatura"
                :id_periodo="id_periodo"
                :id_curso="title.idCurso"
                :id_alumnos="item.idAlumnos"
                :id_alumnos_actual="item.idAlumnosActual"
              />
              <nota-alumno-primer
                v-if="notasAlumnos.length > 0"
                :nombre_tipo_evaluacion="title.label"
                :notas_alumnos="notasAlumnos"
                :id_evaluacion="title.idEvaluacion"
                :id_asignatura="title.idAsignatura"
                :id_periodo="id_periodo"
                :id_curso="title.idCurso"
                :id_alumnos="item.idAlumnos"
                :id_alumnos_actual="item.idAlumnosActual"
              />-->

              <!-- <nota-alumno
                v-if="notasAlumnos.length > 0"
                :nombre_tipo_evaluacion="title.label"
                :notas_alumnos="notasAlumnos"
                :id_evaluacion="title.idEvaluacion"
                :id_asignatura="title.idAsignatura"
                :id_periodo="id_periodo"
                :id_curso="title.idCurso"
                :id_alumnos="item.idAlumnos"
                :id_alumnos_actual="item.idAlumnosActual"
              /> -->

              <nota-alumno
                v-if="notasAlumnos.length > 0"
                :nombre_tipo_evaluacion="title.label"
                :notas_alumnos="notasAlumnos"
                :id_guia="title.idGuia"
                :id_evaluacion="title.idEvaluacion"
                :id_asignatura="title.idAsignatura"
                :id_periodo="id_periodo"
                :id_curso="title.idCurso"
                :id_alumnos="item.idAlumnos"
                :id_alumnos_actual="item.idAlumnosActual"
              />

              <b-spinner
                v-else
                label="Spinning"
                variant="primary"
                class="mt-5 mb-5"
                small
              ></b-spinner>
            </b-th>

            <b-th
              v-for="(title, index) in colEvaluacionSegundoTri"
              class="text-center"
              style="border-left: 1px solid #ddd;"
              title="Nota"
              :key="'nota-seg-tri'+index"
            >
              <!-- <nota-alumno
                v-if="notasAlumnos.length > 0"
                :nombre_tipo_evaluacion="title.label"
                :notas_alumnos="notasAlumnos"
                :id_evaluacion="title.idEvaluacion"
                :id_asignatura="title.idAsignatura"
                :id_periodo="id_periodo"
                :id_curso="title.idCurso"
                :id_alumnos="item.idAlumnos"
                :id_alumnos_actual="item.idAlumnosActual"
              /> -->
              <nota-alumno
                v-if="notasAlumnos.length > 0"
                :nombre_tipo_evaluacion="title.label"
                :notas_alumnos="notasAlumnos"
                :id_guia="title.idGuia"
                :id_evaluacion="title.idEvaluacion"
                :id_asignatura="title.idAsignatura"
                :id_periodo="id_periodo"
                :id_curso="title.idCurso"
                :id_alumnos="item.idAlumnos"
                :id_alumnos_actual="item.idAlumnosActual"
              />
              <b-spinner
                v-else
                label="Spinning"
                variant="primary"
                class="mt-5 mb-5"
                small
              ></b-spinner>
            </b-th>

            <b-th
              v-for="(title, index) in colEvaluacionTercerTri"
              class="text-center"
              style="border-left: 1px solid #ddd;"
              title="Nota"
              :key="'nota-ter-tri'+index"
            >
            <!-- <nota-alumno
                v-if="notasAlumnos.length > 0"
                :nombre_tipo_evaluacion="title.label"
                :notas_alumnos="notasAlumnos"
                :id_evaluacion="title.idEvaluacion"
                :id_asignatura="title.idAsignatura"
                :id_periodo="id_periodo"
                :id_curso="title.idCurso"
                :id_alumnos="item.idAlumnos"
                :id_alumnos_actual="item.idAlumnosActual"
              /> -->
            <nota-alumno
              v-if="notasAlumnos.length > 0"
              :nombre_tipo_evaluacion="title.label"
              :notas_alumnos="notasAlumnos"
              :id_guia="title.idGuia"
              :id_evaluacion="title.idEvaluacion"
              :id_asignatura="title.idAsignatura"
              :id_periodo="id_periodo"
              :id_curso="title.idCurso"
              :id_alumnos="item.idAlumnos"
              :id_alumnos_actual="item.idAlumnosActual"
            />
            <!-- :id_evaluacion="Number(id_evaluacion)" -->

              <b-spinner
                v-else
                label="Spinning"
                variant="primary"
                class="mt-5 mb-5"
                small
              ></b-spinner>
            </b-th>

            <b-th
              class="text-center"
              style="border-left: 1px solid #ddd; background: #f3f3f3;"
              title="Promedio I Trimestre"
            >
              <nota-promedio
                v-if="notasAlumnos && colEvaluacionPrimerTri"
                :id_alumnos="item.idAlumnos"
                :tiempo="Number(3)"
                :notas_alumnos.sync="notasAlumnos"
                :evaluaciones.sync="colEvaluacionPrimerTri"
                :id_asignatura_selected.sync="id_asignatura_selected"
              />
            </b-th>
            <b-th
              class="text-center"
              style="border-left: 1px solid #ddd; background: #f3f3f3;"
              title="Promedio II Trimestre"
            >
              <nota-promedio
                v-if="notasAlumnos && colEvaluacionSegundoTri"
                :id_alumnos="item.idAlumnos"
                :tiempo="Number(4)"
                :notas_alumnos.sync="notasAlumnos"
                :evaluaciones.sync="colEvaluacionSegundoTri"
                :id_asignatura_selected.sync="id_asignatura_selected"
              />
            </b-th>
            <b-th
              class="text-center"
              style="border-left: 1px solid #ddd; background: #f3f3f3;"
              title="Promedio III Trimestre"
            >
              <nota-promedio
                v-if="notasAlumnos && colEvaluacionTercerTri"
                :id_alumnos="item.idAlumnos"
                :tiempo="Number(5)"
                :notas_alumnos.sync="notasAlumnos"
                :evaluaciones.sync="colEvaluacionTercerTri"
                :id_asignatura_selected.sync="id_asignatura_selected"
              />
            </b-th>
            <b-th
              class="text-center"
              style="border-left: 1px solid #ddd; border-right: 1px solid #ddd; background: #efefef;"
              title="Promedio Final"
            >
              <nota-promedio-final
                v-if="notasAlumnos && colEvaluacionTercerTri"
                :id_alumnos="item.idAlumnos"
                :notas_alumnos.sync="notasAlumnos"
                :evaluaciones_primer_tri.sync="colEvaluacionPrimerTri"
                :evaluaciones_segundo_tri.sync="colEvaluacionSegundoTri"
                :evaluaciones_tercer_tri.sync="colEvaluacionTercerTri"
                :id_asignatura_selected.sync="id_asignatura_selected"
              />
            </b-th>
          </b-tr>
        </b-tbody>

      </b-table-simple>
    </div>
    <div
      v-else-if="typeof countEvaluacionesTri === 'number' && countEvaluacionesTri == 0"
    >
      <b-alert show variant="primary" class="pt-4 pb-5  text-center">
        <h4 class="alert-heading " style="font-size: 18px !important;">
          No existen evaluaciones creadas!
        </h4>
        <br></br>
        <h7 style="font-size: 15px !important;">
          Para crear una nueva Evaluación Sumativa,<br> selecciona la asignatura en la cual
          deseas trabajar y da click en "Crear Evaluación Sumativa".
        </h7>
        <hr>
        <h7 style="font-size: 15px !important;">
          Para crear una nueva Evaluación Formativa,<br> selecciona la asignatura en la cual
          deseas trabajar y da click en "Evaluaciones Formativas".
        </h7>
      </b-alert>

    </div>
    <div
      v-else-if="typeof countEvaluacionesTri === 'object' && notasAlumnos.length === 0"
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
      guiasAlumnos: [],
      items: [],
      colModalidad: [],
      colEvaluacionPrimerTri: [],
      colEvaluacionSegundoTri: [],
      colEvaluacionTercerTri: [],
      countEvaluacionesTri: [],
      colPromedios: [],
      colPromediosUp: [],
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
    nombre_asignatura: {
      type: String,
      required: true,
    },
  },
  computed: {
    promedioFinalTrim() {
      return 69
    },
    getEvaluacionesCurso: {
      get() {
        return evaluaciones.getters.getEvaluacionesCurso
      }
    },
    getNotas: {
      get() {
        return notas.getters.getNotas
      }
    },
  },
  watch: {
    getEvaluacionesCurso() {
      this.reset()
      this.evaluaciones = this.getEvaluacionesCurso.filter(ge => ge.idAsignatura === this.id_asignatura)
      this.setColumnas(this.evaluaciones)
    },
    getNotas() {
      this.setNotas(this.getNotas)
    },
  },
  mounted() {
    this.setItems(this.alumnos_curso)
  },
  methods: {
    setNotas(notas) {
      this.notasAlumnos = notas
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
    setColumnas(evaluaciones) {
      this.countEvaluacionesTri = evaluaciones.length
      if (this.countEvaluacionesTri > 0) {
        if (this.id_tipo_evaluacion === 1) {
          // this.setHeaderSemestres(evaluaciones)
        } else if (this.id_tipo_evaluacion === 2) {
          this.setHeaderTrimestres(evaluaciones)
        }
      }
    },
    goToGuias(idEvaluacion, key) {
      const baseUrl = index.getters.api
      const numeroNota = Number(key) + Number(1)
      const data = `?idEvaluacion=${idEvaluacion}&nombreNota=N${numeroNota}`
      window.location.href = baseUrl+'Monitoreo/chocotaabrirevaluaciones/'+data;
    },
    reset() {
      this.colEvaluacionPrimerTri = []
      this.colEvaluacionSegundoTri = []
      this.colEvaluacionTercerTri = []
      this.countEvaluacionesTri = []
      this.colPromedios = []
      this.colPromediosUp = []
      this.evaluaciones = []
    },
    setHeaderTrimestres(evaluaciones) {
      evaluaciones.forEach(evaluacion => {
        const contenido = evaluacion.contenido.length > 15
          ? evaluacion.contenido.substr(0, 15)+'...'
          : evaluacion.contenido

        if (evaluacion.tiempo === 3) {
          this.colEvaluacionPrimerTri.push({
            key: `notaPri-${evaluacion.contenido}`,
            label: evaluacion.contenido,
            variant: 'warning',
            idEvaluacion: evaluacion.idEvaluacion,
            idCurso: evaluacion.idCursos,
            idAsignatura: evaluacion.idAsignatura,
            contenido: contenido,
            contenidoCompleto: evaluacion.contenido,
            porcentaje: evaluacion.porcentajeExamen,
          })
        } else if (evaluacion.tiempo === 4) {
          this.colEvaluacionSegundoTri.push({
            key: `notaSeg-${evaluacion.contenido}`,
            label: evaluacion.contenido,
            variant: 'success',
            idEvaluacion: evaluacion.idEvaluacion,
            idCurso: evaluacion.idCursos,
            idAsignatura: evaluacion.idAsignatura,
            contenido: contenido,
            contenidoCompleto: evaluacion.contenido,
            porcentaje: evaluacion.porcentajeExamen,
          })
        } else if (evaluacion.tiempo === 5) {
          this.colEvaluacionTercerTri.push({
            key: `notaSeg-${evaluacion.contenido}`,
            label: evaluacion.contenido,
            variant: 'info',
            idEvaluacion: evaluacion.idEvaluacion,
            idCurso: evaluacion.idCursos,
            idAsignatura: evaluacion.idAsignatura,
            contenido: contenido,
            contenidoCompleto: evaluacion.contenido,
            porcentaje: evaluacion.porcentajeExamen,
          })
        }
      })

      this.colPromediosUp.push(
        { key: 'primerTrim', label: 'Trim', variant: 'dark' },
        { key: 'segundoTrim', label: 'Trim', variant: 'dark' },
        { key: 'tercerTrim', label: 'Trim', variant: 'dark' },
        { key: 'promedioFinal', label: 'Prom', variant: 'dark' },
      )
      this.colPromedios.push(
        { key: 'primerTrim', label: 'I', variant: 'dark' },
        { key: 'segundoTrim', label: 'II', variant: 'dark' },
        { key: 'tercerTrim', label: 'III', variant: 'dark' },
        { key: 'promedioFinal', label: 'Anual', variant: 'dark' },
      )
    },
  },
});
