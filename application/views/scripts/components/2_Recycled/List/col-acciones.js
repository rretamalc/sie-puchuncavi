
Vue.component('col-acciones',{
	template: //html
	`
		<div>
			<a
				size="sm"
				title="editar"
				@click="$emit( 'pdf' , data )"
				class="button small mr-1 blue"
			>
				pdf
			</a>
			<a
				size="sm"
				title="editar"
				@click="$emit( 'goToUpdate' , data )"
				class="button small mr-1 green"
			>
				Editar
			</a>
			<a
				size="sm"
				title="eliminar"
				@click="$emit('processRemove', data.item.id)"
				class="button small red"
			>
				Eliminar
			</a>
		</div>
	`,
	computed: {
	},
	props: {
		data: {
			type: Object,
			required: true,
		},

	},
	data() {
		return {
		}
	},
	mounted() {
		this.porPage = this.perPage
		this.paginaOptions = this.pageOptions
	},
	methods: {
				test() {
					console.log(1)
				},
		sendPage() {
			this.$emit('update:perPage', this.porPage)
			this.$emit('update:pageOptions', this.paginaOptions)
		},
	},
});
