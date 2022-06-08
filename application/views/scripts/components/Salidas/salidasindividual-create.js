Vue.component('salidasindividual-create',{
  template: //html
  `
    <div>
      <salidasindividual-form
        btnText="Crear Salida"
        :salida.sync="salida"
        :cursos="cursos"
        :alumnos="alumnos"
        :apoderados="apoderados"
        @processForm="agregarSalida"
      />
    </div>
  `,
  computed: {
  },
  data() {
    return {
      salida: {
				idCursos: null,
				idAlumno: null,
				fecha: null,
				hora: null,
				horaRegreso: null,
				tipoIdRetira: null,
				idRetira: null,
				firma: null,
				observacion: null,
				apoderado: {
					nombre: null,
					apellidoPaterno: null,
					apellidoMaterno: null,
					rut: null,
					correo: null,
					telefono: null,
				},
			},
      cursos: [],
      alumnos: [],
      apoderados: [],
    }
  },
  watch: {
    getCursos() {
      this.cursos = this.getCursos
    },
    getAlumnos() {
      this.alumnos = this.getAlumnos
    },
    getApoderados() {
      this.apoderados = this.getApoderados
    },
  },
  computed: {
    getCursos: {
      get () {
        return cursos.getters.getCursos
      }
    },
    getAlumnos: {
      get () {
        return alumnos.getters.getAlumnos
      }
    },
    getApoderados: {
      get () {
        return apoderados.getters.getApoderados
      }
    }
  },
  created() {
    cursos.dispatch('fetchCursos')
    alumnos.dispatch('fetchAlumnos')
    apoderados.dispatch('fetchApoderados')
  },
  methods: {
    agregarSalida(salida) {
      salidas.dispatch('addSalida', salida).then(() => {
        const Toast = Swal.mixin({
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 4000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer)
            toast.addEventListener('mouseleave', Swal.resumeTimer)
          }
        })

        const error = salidas.getters.getError.error
        if (!error) {
          Toast.fire({
            icon: 'success',
            title: 'Salida creada con éxito!'
          })

          const { origin } = window.location;
          const url = origin+'/Soft/sie_colegiospuchuncavi3/salidas';
          window.location.href = url;
        } else {
          Toast.fire({
            icon: 'error',
            title: 'Ingreso de datos fraudulento!',
          })
        }
      })
      .catch((resp) => {
        console.log('catch')
        console.log(resp)
      })
    },
  },
});
