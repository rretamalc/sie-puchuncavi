Vue.component('addapoderado-form',{
  template: //html
  `
    <div class="">
      <b-card bg-variant="light">
        <b-card-title>
          {{ title }}
        </b-card-title>
        <b-row
          class="justify-content-md-center mt-4"
          align-h="center"
        >
          <!-- Field: Nombre -->
          <b-col
            cols="4"
            md="4"
          >
            <b-form-group
              label="Nombre"
              label-for="nombre"
              label-cols="2"
              label-cols-lg="2"
              label-size="sm"
              content-cols-sm
              content-cols-lg="2"
            >
              <b-form-input
                id="nombre"
                v-model="salida.apoderado.nombre"
                size="sm"
              />
            </b-form-group>
          </b-col>

          <!-- Field: Apellido Paterno -->
          <b-col
            cols="4"
            md="4"
          >
            <b-form-group
              label="Apellido Paterno"
              label-for="apellidoPaterno"
              label-cols="2"
              label-cols-lg="2"
              label-size="sm"
              content-cols-sm
              content-cols-lg="2"
            >
              <b-form-input
                id="apellidoPaterno"
                v-model="salida.apoderado.apellidoPaterno"
                size="sm"
              />
            </b-form-group>
          </b-col>

          <!-- Field: Apellido Materno -->
          <b-col
            cols="4"
            md="4"
          >
            <b-form-group
              label="Apellido Materno"
              label-for="apellidoMaterno"
              label-cols="2"
              label-cols-lg="2"
              label-size="sm"
              content-cols-sm
              content-cols-lg="2"
            >
              <b-form-input
                id="apellidoMaterno"
                v-model="salida.apoderado.apellidoMaterno"
                size="sm"
              />
            </b-form-group>
          </b-col>

          <!-- Field: Rut -->
          <b-col
            cols="4"
            md="4"
          >
            <b-form-group
              label="Rut"
              label-for="rut"
              label-cols="2"
              label-cols-lg="2"
              label-size="sm"
              content-cols-sm
              content-cols-lg="2"
            >
              <b-form-input
                id="rut"
                v-model="salida.apoderado.rut"
                size="sm"
              />
            </b-form-group>
          </b-col>

          <!-- Field: Correo -->
          <b-col
            cols="4"
            md="4"
          >
            <b-form-group
              label="Correo"
              label-for="correo"
              label-cols="2"
              label-cols-lg="2"
              label-size="sm"
              content-cols-sm
              content-cols-lg="2"
            >
              <b-form-input
                id="correo"
                v-model="salida.apoderado.correo"
                size="sm"
              />
            </b-form-group>
          </b-col>

          <!-- Field: Rut -->
          <b-col
            cols="4"
            md="4"
          >
            <b-form-group
              label="Teléfono"
              label-for="telefono"
              label-cols="2"
              label-cols-lg="2"
              label-size="sm"
              content-cols-sm
              content-cols-lg="2"
            >
              <b-form-input
                id="telefono"
                v-model="salida.apoderado.telefono"
                size="sm"
              />
            </b-form-group>
          </b-col>
        </b-row>
      </b-card>
    </div>
  `,
  data() {
    return {
      title: 'Nuevo registro de persona que retira autorizado por apoderado',
    }
  },
  props: {
    salida: {
      type: Object,
      required: true,
    },
  },
});
