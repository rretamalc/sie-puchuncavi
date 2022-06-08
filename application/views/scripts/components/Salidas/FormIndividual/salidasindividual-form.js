Vue.component('salidasindividual-form',{
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

        <div
          v-if="!disabledForm"
        >

          <b-row
            class="justify-content-md-center"
            align-h="center"
          >
            <!-- Field: Fecha -->
            <b-col
              cols="8"
              md="8"
            >
              <b-form-group
                label="Fecha"
                label-for="fecha"
                label-cols="2"
                label-cols-lg="1"
                label-size="sm"
                content-cols-sm
                content-cols-lg="2"
              >
                <!--<b-form-datepicker id="fecha" v-model="salida.fecha" class="mb-2"></b-form-datepicker>-->
                <b-form-input
                  id="fecha"
                  v-model="salida.fecha"
                  type="date"
                  size="sm"
                  class="mb-2"
                />
              </b-form-group>
            </b-col>
          </b-row>

          <b-row
            class="justify-content-md-center"
            align-h="center"
          >
            <!-- Field: Hora -->
            <b-col
              cols="4"
              md="4"
            >
              <b-form-group
                label="Hora salida"
                label-for="hora"
                label-cols="2"
                label-cols-lg="2"
                label-size="sm"
                content-cols-sm
                content-cols-lg="2"
              >
                <b-form-input
                  id="hora"
                  v-model="salida.hora"
                  type="time"
                  size="sm"
                  class="mb-2"
                  style="margin-left: 2px;"
                />
              </b-form-group>
            </b-col>

            <!-- Field: Hora Regreso -->
            <b-col
              cols="4"
              md="4"
            >
              <b-form-group
                label="Hora regreso"
                label-for="horaRegreso"
                label-cols="2"
                label-cols-lg="2"
                label-size="sm"
                content-cols-sm
                content-cols-lg="2"
              >
                <b-form-input
                  id="horaRegreso"
                  v-model="salida.horaRegreso"
                  type="time"
                  size="sm"
                  class="mb-2"
                />
              </b-form-group>
            </b-col>

          </b-row>

          <!-- Field: Hora Persona que retira -->
          <personaretira-form
            :salida="salida"
            :apoderadosAlumno="apoderadosAlumno"
            @apoderadoNull="apoderadoNull"
            @seleccionaPersonaRetira="seleccionaPersonaRetira"
          />

          <addapoderado-form
            v-if="!disabledAddApoderadoForm"
            class="mt-5"
            :salida="salida"
          />



          <b-row
            v-if="!disabledFirmaObservacion"
            class="justify-content-md-center mt-5"
            align-h="center"
          >
            <b-col
              cols="8"
              md="8"
            >
              <b-form-group
                label="Formato firma"
                label-for="firma"
                label-cols="2"
                label-cols-lg="1"
                label-size="sm"
                content-cols-sm
                content-cols-lg="2"
              >
                <btn-printformatofirma />
              </b-form-group>
            </b-col>


            <!-- Field: Firma -->
            <b-col
              cols="8"
              md="8"
            >
              <b-form-group
                label="Firma"
                label-for="firma"
                label-cols="2"
                label-cols-lg="1"
                label-size="sm"
                content-cols-sm
                content-cols-lg="2"
              >

                <b-form-file
                  id="firma"
                  v-model="salida.firma"
                  :state="Boolean(file)"
                  accept=".jpeg,.jpg,.png"
                  placeholder="Selecciona una imágen o arrastrala hasta aquí..."
                  drop-placeholder="Drop file here..."
                ></b-form-file>


              </b-form-group>
            </b-col>

            <!-- Field: observaciones -->
            <b-col
              cols="8"
              md="8"
            >
              <b-form-group
                label="Observación"
                label-for="observacion"
                label-cols="2"
                label-cols-lg="1"
                label-size="sm"
                content-cols-sm
                content-cols-lg="2"
              >
              <b-form-textarea
                id="hora"
                v-model="salida.observacion"
                placeholder="Ingresa una observación..."
                rows="3"
                max-rows="6"
              ></b-form-textarea>
              </b-form-group>
            </b-col>
          </b-row>
        </div>

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
    apoderadoCreado() {
      this.$emit('update:apoderadoRetira', this.apoderadoCreado)
    },
    alumnos() {
      if (this.form == 'update') {
        this.seleccionaCurso()
      }
    },
    apoderados() {
      if (this.form == 'update') {
        this.seleccionaAlumno()
        this.seleccionaPersonaRetira(this.salida.tipoIdRetira)
      }
    },
  },
  methods: {
    apoderadoNull() {
			this.salida.apoderado.nombre = null
			this.salida.apoderado.apellidoPaterno = null
			this.salida.apoderado.apellidoMaterno = null
			this.salida.apoderado.rut = null
			this.salida.apoderado.correo = null
			this.salida.apoderado.telefono = null
		},
    resetForm() {
      this.salida.idAlumno = null
      this.salida.idRetira = null
      this.salida.observacion = null
      this.salida.tipoIdRetira = null
      this.apoderadoNull()
    },
    setForm () {
      if (this.form !== 'update') {
        this.salida.idAlumno = null;
      }
      this.disabledAlumno = true;
      this.disabledForm = true;
      this.disabledFirmaObservacion = true;
      this.disabledAddApoderadoForm = true;
      this.alumnoOptions = [{ value: null, texto:'-- Selecciona un alumno --' }];
    },
    seleccionaCurso () {
      this.setForm();
      if (this.salida.idCursos == null) {
        this.resetForm()
      }
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
      if (this.salida.idAlumno == null) {
        this.resetForm()
      }
      this.disabledForm = false;
      this.disabledFirmaObservacion = true;
      const apoderadosAlumno = this.apoderados.filter(apo => apo.idAlumnos == this.salida.idAlumno)
      this.apoderadosAlumno = apoderadosAlumno
    },
    seleccionaPersonaRetira(selectedRadio) {
      if (selectedRadio != 'createApoderado') {
        this.disabledFirmaObservacion = false
        this.disabledAddApoderadoForm = true
      } else {
        this.addApoderado()
      }
    },
    addApoderado() {
      this.disabledAddApoderadoForm = false
      this.disabledFirmaObservacion = false
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