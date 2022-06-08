Vue.component('btn-printformatofirma',{
 	template: //html
 	`
		<div>
			<b-button
				size="sm"
				variant="info"
				class="green"
				title="Este documento sirve como formato para el archivo de firma."
				@click="printFormatoFirma"
			>
				Descargar documento
			</b-button>

			<div id="pdfFormatoFirma" v-show="false">
				<div style="width:100%," class="container">
					<table style="width:100%;">
						<tr>
							<th class="centerText" colspan="2">
							<h2>
								Documento formato de firmas
							</h2>
						</th>
						</tr>
						<tr>
							<td>
								<p>
									<br>Nombre Alumno: _______________
									<br>Fecha: ____/_____/_____
								</p>
							</td>
								<td>
									<!--<img
											class="imgRight"
											v-if="detalleEvaluacion.extension != null || detalleEvaluacion.extension != undefined"
											:src="'../../../application/documentos/logos/'+detalleEvaluacion.extension"
											height="auto"
											width="auto"
									/>-->
								</td>
							</tr>
						</table>
						<table style="width:100%">
							<tr class="mb-4">
								<td>
								</td>
							</tr>
						</table>

					</div>
			</div>
		</div>

	`,
	computed: {
			// ...Vuex.mapState(['detalleEvaluacion', 'preguntas', 'respuestas'])
	},
	// props: ['idEvaluacion', 'revisada', 'evaluacion'],
	data() {
		return {
			style: `
				table, th, td {
					border: 0px;
					border-collapse: collapse;
				}

				th, td {
					padding: 10px;

				}

				.strongLeft {
					margin-left: -17px! important;
				}

				.container {
					font: normal 0.8em/150% 'Arimo', "Trebuchet MS", arial, verdana, sans-serif;
					padding: 10 20 20 20;
				}

				.preCenter {
					font: normal 0.8em/150% 'Arimo', "Trebuchet MS", arial, verdana, sans-serif;
					text-align: center;
					margin-left: auto;
					margin-right: auto;
					width: 83%;
					white-space: -moz-pre-wrap;
					white-space: -pre-wrap;
					white-space: -o-pre-wrap;
					white-space: pre-wrap;
					word-wrap: break-word;
				}

				.preCenterTitulo {
					font: normal 0.9em/150% 'Arimo', "Trebuchet MS", arial, verdana, sans-serif;
					text-align: center;
					margin-left: auto;
					margin-right: auto;
					margin-bottom: -10px;
					width: 83%;
					white-space: -moz-pre-wrap;
					white-space: -pre-wrap;
					white-space: -o-pre-wrap;
					white-space: pre-wrap;
					word-wrap: break-word;
				}

				.prePregunta {
					font: normal 0.9em/150% 'Arimo', "Trebuchet MS", arial, verdana, sans-serif;
					margin-left: auto;
					margin-right: auto;
					margin-bottom: 30px;
					width: 100%;
					white-space: -moz-pre-wrap;
					white-space: -pre-wrap;
					white-space: -o-pre-wrap;
					white-space: pre-wrap;
					word-wrap: break-word;
				}
				.preAlternativas {
					font: normal 0.9em/150% 'Arimo', "Trebuchet MS", arial, verdana, sans-serif;
					margin-left: auto;
					margin-right: auto;
					margin-top: -10px;
					width: 100%;
					white-space: -moz-pre-wrap;
					white-space: -pre-wrap;
					white-space: -o-pre-wrap;
					white-space: pre-wrap;
					word-wrap: break-word;
				}

				.preReCorrecta {
					font: normal 0.9em/150% 'Arimo', "Trebuchet MS", arial, verdana, sans-serif;
					margin-left: -10px;
					margin-right: auto;
					width: 100%;
					white-space: -moz-pre-wrap;
					white-space: -pre-wrap;
					white-space: -o-pre-wrap;
					white-space: pre-wrap;
					word-wrap: break-word;
				}

				.preLeft {
					font: normal 0.9em/150% 'Arimo', "Trebuchet MS", arial, verdana, sans-serif;
					margin-left: auto;
					margin-right: auto;
					width: 100%;
					white-space: -moz-pre-wrap;
					white-space: -pre-wrap;
					white-space: -o-pre-wrap;
					white-space: pre-wrap;
					word-wrap: break-word;
				}


				.mb-3 {margin-bottom: 30px;}
				.mb-4 {margin-bottom: 40px;}
				.mb-5 {margin-bottom: 50px;}
				.mt-3 {margin-top: 30px;}
				.mt-4 {margin-top: 40px;}
				.mt-5 {margin-top: 50px;}

				.imgCenter {display: block; margin-left: auto; margin-right: auto; width: 30%;}
				.imgLeft {display: block; margin-left: 2%; margin-right: auto; width: 30%;}
				.imgRight {display: block; margin-left:auto; margin-right: 2%; width: 30%;}


				.centerText { text-align: center}
				.leftText { text-align: left}
				.rightText { text-align: right}
				.boldText {font-weight: bold;}
			`
		}
	},
	methods: {
		primeraMayus(string) {
			return string.charAt(0).toUpperCase() + string.slice(1);
		},
		soloPrimeraMayus(string) {
			var newString = string.toLowerCase();
			return newString.charAt(0).toUpperCase() + newString.slice(1);
		},
		printFormatoFirma (e) {

			var html = document.getElementById("pdfFormatoFirma").innerHTML;
			// console.log(html);
			// debugger;
			$('<iframe>', {name: 'formatoFirmaImpresion',class: 'printFormatoFirma'})
			.appendTo('body')
			.contents().find('body')
			.append(`
				<style>
						`+this.style+`
				</style>
			` + html);

			window.frames['formatoFirmaImpresion'].focus();
			window.frames['formatoFirmaImpresion'].print();

			setTimeout(() => { $(".printFormatoFirma").remove(); }, 1000);
		},

	},
});
