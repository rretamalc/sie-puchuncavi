Vue.component('formativa-td',{
template: //html
`
	<div>
		<p>
			{{formativa.nombreGuia}}
			{{formativa.idGuia}}
		</p>
	</div>
`,
  computed: {
	},
	props: {
		formativa: {
			type: Object,
			required: false,
		}
	}
});