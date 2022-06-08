//si presiona boton guardar
$(document).ready(function () {
    $("#guardaasignatura").live('click', function () {
        var datos = [];
        $("#tblTabla tbody>tr").each(function (index) {

            var campo1, campo2=0, campo3;
            $($(this)).children("td").each(function (index2) {

                switch (index2) {

                    case 1:
                        var valor = $(this).find('input').map(function () {
                            return $(this).val();
                        }).get();
                        campo1 = valor;

                        break;

                    case 4:
                        var valor2 = $(this).find('input').map(function () {
                            return $(this).val();
                        }).get();
                        if(valor2[0]>0 && valor2[0]!=""){
                            campo2 = valor2;
                        }else {
                            valor2[0]="0";
                            campo2 = valor2;
                        }


                        break;

                    case 6:
                        var valores = $(this).find('input').map(function () {
                            if ($(this).is(':checked')) {
                                return 0;
                            }else{
                                return 1
                            }
                            //return $(this).val();
                        }).get();

                        campo3 = valores;

                        break;

                }
            });
            datos[index] = {
                ida: campo1,
                in: campo3,
                hor:campo2

            };
        });
        var n = $('#curso').val();
        var Datos=[];
        for (var i = 0; i < datos.length; i++) {


            Datos[i] = {
                "idasignatura":datos[i].ida[0],
                "curso": n,
                "prioritaria": datos[i].in[0],
                "horas":datos[i].hor[0]

            }
        }

        $.ajax({
            cache: false,
            async: true,
            dataType: 'json',
            type: 'POST',
            contentType: 'application/x-www-form-urlencoded',
            url: '../../guardaasignatura/',
            data: JSON.stringify(Datos),
            beforeSend: function (data) {
                $('#div_cliente').html('<label>Cargando...</label>');
            },
            success: function (data) {
                if (data.response == 'error') {
                    $('#contenido').append('<div class="error mensajes">Se ha producido un error, intente nuevamente</div>');
                    $(document).ready(function () {
                        setTimeout(function () {
                            $(".mensajes").fadeOut(800).fadeIn(800).fadeOut(500).fadeIn(500).fadeOut(300).remove();
                        }, 3000);
                    });
                } else {
                    window.location.replace(data.redirect);
                    //$('#contenido').append('<div class="error mensajes">El registro que intenta insertar, ya existe</div>');
                }
            },
            error: function (requestData, strError, strTipoError) {
                alert('Error ' + strTipoError + ': ' + strError);
            },
            complete: function (requestData, exito) {
            }
        });
    });
});
