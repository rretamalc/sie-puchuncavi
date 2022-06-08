Vue.component('formativa-tr',{
template: //html
`
	<tr>

		<!-- NOMBRE COMPLETO ALUMNO -->
		<td>
			<p>
				{{ item.nombres }}
				{{ item.apaterno }}
				{{ item.amaterno }}
			</p>
		</td>

		<!-- GUIAS -->
		<td v-for="formativa in formativas">
			<formativa-td
				:formativa="formativa"
				:getGuiasAlumnos="getGuiasAlumnos"
			/>
		</td>

		<!-- ACCIONES -->
		<template v-if="false">
		</template>
	</tr>
`,
  computed: {
	},
	data() {
		return {
		}
	},
	props: {
		item: {
			type: Object,
			required: true,
		},
		formativas: {
			type: Array,
			required: false,
		},
		getGuiasAlumnos: {
			type: Array,
			required: true,
		}
	},
	watch : {
		item() {
			console.log(this.item)
		}
	},
	methods: {
		saveFruit (fruit) {
			console.log(`Saving fruit: ${fruit}`);
		},
	},
	mounted () {
	}
});