Vue.component('salidasgrupal-form',{
  template: //html
  `
    <div>
      <b-form @submit.prevent="$emit('processForm', salida)">

        <b-row
          class="justify-content-md-center"
        >
          <!-- Field: Curso -->
          <b-col
            cols="8"
            md="8"
          >
            <b-form-group
              label="Curso"
              label-for="curso"
              label-cols="2"
              label-cols-lg="1"
              label-size="sm"
              content-cols-sm
              content-cols-lg="6"
            >
              <v-select
                id="curso"
                v-model="salida.idCursos"
                size="sm"
                label="texto"
                :options="cursoOptions"
                :reduce="option => option.value"
                input-id="idCursos"
                @input="seleccionaCurso()"
              />
            </b-form-group>
          </b-col>
        </b-row>

        <b-row
          class="justify-content-md-center"
          align-h="center"
        >
          <!-- Field: Alumno -->
          <b-col
            cols="8"
            md="8"
          >
            <b-form-group
              label="Alumno"
              label-for="alumno"
              label-cols="2"
              label-cols-lg="1"
              label-size="sm"
              content-cols-sm
              content-cols-lg="2"
            >
              <v-select
                id="alumno"
                v-model="salida.idAlumno"
                size="sm"
                label="texto"
                :options="alumnoOptions"
                :reduce="option => option.value"
                input-id="idAlumno"
                @input="seleccionaAlumno()"
                :disabled="disabledAlumno"
              />
            </b-form-group>
          </b-col>
        </b-row>

        <btn-submit
          v-if="!disabledFirmaObservacion"
          :btnText="btnText"
        />

      </b-form>
    </div>
  `,
  computed: {
  },
  data() {
    return {
      cursoOptions: [{ value: null, texto:'-- Selecciona un curso --' }],
      alumnoOptions: [{ value: null, texto:'-- Selecciona un alumno --' }],
      file: null,
      disabledAlumno: true,
      disabledForm: true,
      disabledFirmaObservacion: true,
      disabledAddApoderadoForm: true,
      apoderadosAlumno: [],
    }
  },
  props: {
    salida: {
      type: Object,
      required: true,
    },
    cursos: {
      type: Array,
      required: true,
    },
    alumnos: {
      type: Array,
      required: true,
    },
    apoderados: {
      type: Array,
      required: true,
    },
    form: {
      type: String,
    },
    processForm: {},
    btnText: {
      type: String,
      default: 'Guardar Salida',
    }
  },
  watch: {
    cursos() {
      this.cursos.forEach(curso => {
        const nombreCurso = `${curso.nombreGrado} ${curso.letra}`
        this.cursoOptions.push({
          value: curso.idCursos,
          texto: nombreCurso,
        });
      })
    },
    alumnos() {
      if (this.form == 'update') {
        this.seleccionaCurso()
      }
    },
  },
  methods: {

    resetForm() {

    },
    setForm () {

    },
    seleccionaCurso () {
      this.setForm();
      let alumnos = this.alumnos.filter(al => al.idCursosActual == this.salida.idCursos)
      alumnos.forEach(alumno => {
        const nombreAlumno = `${alumno.rutAlumno} - ${alumno.nombres} ${alumno.apaterno} ${alumno.amaterno}`
        this.alumnoOptions.push({
          value: alumno.idAlumnos,
          texto: nombreAlumno,
        });
      })
      this.disabledAlumno = false
    },
    seleccionaAlumno () {
      console.log(1)
    },
  },
  mounted() {
    const hoy = new Date();
    const mes = (hoy.getMonth() + 1).toString().length == 1 ? '0' + (hoy.getMonth() + 1): (hoy.getMonth() + 1)
    const dia = (hoy.getDate() + 1).toString().length == 1 ? '0' + hoy.getDate(): hoy.getDate()
    this.salida.fecha =  hoy.getFullYear() + '-' + mes + '-' + dia;
    const minuto = (hoy.getMinutes() + 1).toString().length == 1 ? '0' + hoy.getMinutes(): hoy.getMinutes()
    this.salida.hora = hoy.getHours() + ':' + minuto;
  },
});