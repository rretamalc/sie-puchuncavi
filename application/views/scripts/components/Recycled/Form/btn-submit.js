Vue.component('btn-submit',{
	template: //html
	`
		<div
			class="d-flex align-items-center justify-content-left"
		>
			<b-button
				type="submit"
				variant="primary"
				size="sm"
				class="btn-sm blue"
			>
				{{ btnText }}
			</b-button>
		</div>
	`,
	computed: {
	},
	props: {
		btnText: {
			type: String,
			required: true,
		},
		processSubmit: {},
	},
 });
