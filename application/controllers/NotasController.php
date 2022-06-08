<?php namespace App\Http\Controllers;

use App\Querys;
use Illuminate\Support\Facades\DB;
use Zend_Session_Namespace;


class NotasController extends Controller
{

    private $mantencion=false;

    public function index()
    {
        //$notas = Notas::all();
        //return response()->json($notas, 200);
        //return response()->json("hola", 200);
    }

    public function getNotas($id,$device, \Illuminate\Http\Request $request)
    {
        $db = app('db');

        if($this->mantencion){

            $res['success'] = true;
            $res['message'] = 'maintenance';
            return response($res);
            exit();

        }

        // Obtenemos los datos del alumno
        $alumno = DB::table('users')->where('user', '=', $id)->get();
        $alumnos = DB::table('user_det')->where('identificador', $device)->where('id', $alumno[0]['id'])->first();
        $nombrebase = $alumno[0]['idDb'];
        $idperiodo = $alumno[0]['idPeriodo'];
        $idcurso = $alumno[0]['idCursos'];


        //Obtenemos el Token que utiliza el usuario y lo comparamos si corresponde.
        $token = $header = $request->header('Acceso');


        if ($token === $alumnos['remember_token']) {

            $users = $db->connection($nombrebase)->table('alumnos')->where('rutAlumno', '=', $id)->get();
            $idalumno = $users[0]['idAlumnos'];
            //$datosnotas=$db->connection($nombrebase)->table('notas')->where('idAlumnos','=',$idalumno)->where('idPeriodo','=',$idperiodo)->where('idCursos','=',$idcurso)->get();
            //Creamos las  query a utilizar
            $agregadecimas = false;

            $listadealumnos = $db->connection($nombrebase)->table('AlumnosActual')
                ->join('alumnos', 'alumnos.idAlumnos', '=', 'AlumnosActual.idAlumnos')->select('alumnos.idAlumnos', 'rutAlumno', 'nombres', 'apaterno', 'amaterno', 'idAlumnosActual', 'idEstadoActual', 'idCursosActual', 'idPeriodoActual')
                ->where('AlumnosActual.idAlumnos', '=', $idalumno)
                ->where('AlumnosActual.idPeriodoActual', '=', $idperiodo)->get();
            $listadealumnos = collect($listadealumnos)->toArray();

            $idcursoactual = $listadealumnos[0]['idCursosActual'];

            //var_dump($listadealumnos);


            //return response(($datosnotas));

            //Inicio
            $listaasignatura = $db->connection($nombrebase)->table('asignaturascursos')
                ->join('asignaturas', 'asignaturas.idAsignatura', '=', 'asignaturascursos.idAsignatura')
                ->where('.asignaturascursos.estado', '=', '1')
                ->where('.asignaturascursos.idPeriodo', '=', $idperiodo)
                ->where('.asignaturascursos.idCursos', '=', $idcurso)
                ->where('.asignaturascursos.promedio', '=', '1')
                ->WhereIn('.asignaturascursos.tipoAsignatura', [1, 3])->get();
            $listaasignatura = collect($listaasignatura)->toArray();


            $listaasignaturaconcepto = $db->connection($nombrebase)->table('asignaturascursos')
                ->where('estado', '=', '1')
                ->where('idPeriodo', '=', $idperiodo)
                ->where('idCursos', '=', $idcurso)
                ->where('promedio', '=', '1')
                ->WhereIn('tipoAsignatura', [5])->get();

            $datosasignaturascombinada = $db->connection($nombrebase)->table('asignaturascursos')
                ->join('asignaturas', 'asignaturas.idAsignatura', '=', 'asignaturascursos.idAsignatura')
                ->join('configuraciondependencia', 'configuraciondependencia.idAsignaturaCurso', '=', 'asignaturascursos.idAsignaturaCurso')
                ->where('asignaturascursos.estado', '=', '1')
                ->where('asignaturascursos.idPeriodo', '=', $idperiodo)
                ->where('asignaturascursos.idCursos', '=', $idcurso)
                ->WhereIn('asignaturascursos.tipoAsignatura', [3])->get();
            $datosasignaturascombinada = collect($datosasignaturascombinada)->toArray();

            $largocombinada = count($datosasignaturascombinada);


            $detalleest = $db->connection($nombrebase)->table('cursosactual')
                ->join('establecimiento', 'establecimiento.idEstablecimiento', '=', 'cursosactual.idEstablecimiento')
                ->join('establecimientoConfiguracion', 'establecimientoConfiguracion.idEstablecimiento', '=', 'establecimiento.idEstablecimiento')
                ->join('comuna', 'comuna.idComuna', '=', 'establecimiento.comuna')
                ->join('codigotipoensenanza', 'codigotipoensenanza.idCodigoTipo', '=', 'cursosactual.idCodigoTipo')
                ->join('codigogrados', 'codigogrados.idCodigoGrado', '=', 'cursosactual.idCodigoGrado')
                ->where('cursosactual.idCursos', '=', $idcurso)
                ->where('establecimientoConfiguracion.idPeriodo', '=', $idperiodo)->get();
            $detalleest = collect($detalleest)->toArray();


            //Configuracion de agregar 2 decimas a curso desde 5 a 4to medio cuando el promedio final es mayor o igual a 6
            if (($detalleest[0]['rbd'] == 1863 || $detalleest[0]['rbd'] == 1864) && (($detalleest[0]['idCodigo'] == 110 && $detalleest[0]['idGrado'] > 4) || $detalleest[0]['idCodigo'] == 310 || $detalleest[0]['idCodigo'] == 363 || $detalleest[0]['idCodigo'] == 410 || $detalleest[0]['idCodigo'] == 510 || $detalleest[0]['idCodigo'] == 610)) {
                $agregadecimas = true;
            }

            $Profesorjefe = $db->connection($nombrebase)->table('cuentasUsuario')
                ->join('cuentaRoles', 'cuentaRoles.idCuenta', '=', 'cuentasUsuario.idCuenta')
                ->join('roles', 'roles.idRoles', '=', 'cuentaRoles.idRol')
                ->where('cuentasUsuario.idCuenta', '=', $detalleest[0]['idCuentaJefe'])
                ->where('cuentaRoles.idPeriodo', '=', $idperiodo)->get(['cuentasUsuario.idCuenta', 'cuentasUsuario.nombrescuenta', 'cuentasUsuario.paternocuenta', 'cuentasUsuario.maternocuenta']);


            $director = $db->connection($nombrebase)->table('cuentasUsuario')
                ->where('cuentasUsuario.idCuenta', '=', $detalleest[0]['idDirector'])->get();


            $largoalumnos = count($listadealumnos);
            $largoasignatura = count($listaasignatura);


            //Si la configuracion indica que se utiliza examen
            if ($detalleest[0]['examen'] == 1) {
                $datosexamenalumno = array();
                //Veficiamos que las asignaturas posean examen
                for ($i = 0; $i < $largoasignatura; $i++) {

                    $datosexamenes = Querys::getexamen($db, $nombrebase, $detalleest[0]['idCursos'], $idperiodo, $listaasignatura[$i]['idAsignatura'], 6);
                    if (count($datosexamenes) > 0) {

                        $datosalumnosexamen = Querys::getnotasexamenalumno($db, $nombrebase, $datosexamenes[0]['idEvaluacion'], $detalleest[0]['idCursos'], $listaasignatura[$i]['idAsignatura'], $idperiodo, 6, $listadealumnos[0]['idAlumnos']);
                        if (count($datosalumnosexamen) > 0) {
                            if ($datosalumnosexamen[0]['nota'] > 0) {
                                $datosexamenalumno[] = $datosalumnosexamen;
                            }
                        }
                    }
                }

            }


            $niveleducacion = $detalleest[0]['idCodigoTipo'];
            $grado = $detalleest[0]['idGrado'];


            $taller = array();
            $combinada = array();
            for ($y = 0; $y < $largoalumnos; $y++) {
                $respuesta;
                $tablanotas = array();
                $tablanotas2 = array();
                $tablanotas2segundo = array();
                $alumnoactual = array();
                $verifica = array();
                $cuenta = 0;
                $promedio = 0;
                $cuenta1 = array();
                $cuentan = 0;
                $promedion = 0;
                $promediof = 0;
                $promediofn = 0;
                $cuenta2 = array();
                $promedioparcial = 0;
                $contadorparcial = 0;


                $idalumnoactual = $listadealumnos[$y]['idAlumnos'];
                $tablanotas = Querys::generasolonotas($db, $nombrebase, $idalumnoactual, $idcursoactual, $idperiodo);

                if(count($tablanotas)==0){
                    $res['success'] = true;
                    $res['message'] = 'no-data';
                    return response($res);



                }
                $tablanotas2 = Querys::generasolonotasperiodo($db, $nombrebase, $idalumnoactual, 1, 0, $idperiodo, $idcursoactual);
                $tablanotas2segundo = Querys::generasolonotasperiodo($db, $nombrebase, $idalumnoactual, 2, 0, $idperiodo, $idcursoactual);



                $largotablanota2 = count($tablanotas2);
                $largotablaaux = count($tablanotas);
                $largotablanota2segundo = count($tablanotas2segundo);


                $datostallersem = Querys::gettaller($db, $nombrebase, $idcursoactual, $idperiodo, array(1, 2), 1, array(1, 2));
                $datostalleranual = Querys::gettalleranual($db, $nombrebase, $idcursoactual, $idperiodo, array(1), 1);
                $datostallersin = Querys::gettallersin($db, $nombrebase, $idcursoactual, $idperiodo);
                $listastalleres = array_merge($datostalleranual, $datostallersem);
                $listaasignaturanoinciden = array_merge($listastalleres, $datostallersin);





                //Notas de talleres

                //Configuraciones de Taller

                //Configuracion de Taller Buscamos si existen configuraciones por ;
                //Obtiene los Talleres que son Semestrales Tiempo=2.
                $datostalleres = Querys::gettaller($db, $nombrebase, $idcursoactual, $idperiodo, array(1, 2), 1, array(1, 2));



                if (count($datostalleres) > 0) {
                    for ($i = 0; $i < count($datostalleres); $i++) {
                        $detalletaller = Querys::gettallersegmento($db, $nombrebase, $datostalleres[$i]['idConfiguracionTaller'], array(1, 2), $idalumnoactual);


                        if ($detalletaller) {

                            $listaasignaturanoinciden[] = $detalletaller[0];
                        }

                    }


                }
                $largoasignaturanoincide = count($listaasignaturanoinciden);






                //Notas de talleres

                if ($largoasignaturanoincide != 0) {

                    for ($i = 0; $i < $largoasignaturanoincide; $i++) {

                        $auxtexto = '';

                        //Configuracion de Taller
                        if ($listaasignaturanoinciden[$i]["tipoAjuste"] == 2) {

                            $promediotaller['idAsignatura'] = $detalletaller[0]['idAsignaturaDestino'];


                        } else {
                            $promediotaller['idAsignatura'] = $listaasignaturanoinciden[$i]["idAsignaturaTaller"];
                        }

                        $promedion = 0;
                        $cuentan = 0;
                        $promedionsegundo = 0;
                        $cuentansegundo = 0;


                        //Primer Semestre
                        if ($listaasignaturanoinciden[$i]["tiempoOpcion"] == 1) {
                            for ($j = 0; $j < $largotablanota2; $j++) {
                                if ($listaasignaturanoinciden[$i]["idAsignatura"] == $tablanotas2[$j]["idAsignatura"]) {
                                    if ($tablanotas2[$j]['coef'] == 2) {
                                        if ($tablanotas2[$j]['nota'] != '0') {

                                            $promedion = $promedion + ($tablanotas2[$j]['nota'] + $tablanotas2[$j]['nota']);
                                            $cuentan = $cuentan + 2;

                                        }


                                    } else {

                                        if ($tablanotas2[$j]['nota'] != '0') {
                                            $promedion = $promedion + $tablanotas2[$j]['nota'];
                                            $cuentan = $cuentan + 1;

                                        }


                                    }

                                }

                            }
                        }





                        //Segundo Semestre
                        if ($listaasignaturanoinciden[$i]["tiempoOpcion"] == 2) {
                            for ($j = 0; $j < $largotablanota2segundo; $j++) {
                                if ($listaasignaturanoinciden[$i]["idAsignatura"] == $tablanotas2segundo[$j]["idAsignatura"]) {
                                    if ($tablanotas2segundo[$j]['coef'] == 2) {
                                        if ($tablanotas2segundo[$j]['nota'] != '0') {
                                            $promedionsegundo += ($tablanotas2segundo[$j]['nota'] + $tablanotas2segundo[$j]['nota']);
                                            $cuentansegundo += 2;

                                        }


                                    } else {

                                        if ($tablanotas2segundo[$j]['nota'] != '0') {

                                            $promedionsegundo += $tablanotas2segundo[$j]['nota'];
                                            $cuentansegundo += 1;

                                        }


                                    }

                                }

                            }
                        }


                        //sacamos el promedio de la asignatura


                        if ($promedion > 0 || $cuentan > 0) {


                            if ($detalleest[0]['aproxAsignatura'] == 1) {
                                $promediofn = round($promedion / $cuentan);
                                $promediotaller['nota'] = $promediofn;
                                $promediotaller['coef'] = 1;
                                $promediotaller['tiempo'] = 1;
                                $promediotaller['idAsignatura'] = $listaasignaturanoinciden[$i]["idAsignaturaTaller"];
                                $promediotaller['forma'] = $listaasignaturanoinciden[$i]["forma"];
                                $promediotaller['porcentaje'] = $listaasignaturanoinciden[$i]["porcentaje"];
                                $promediotaller['tipoAjuste'] = $listaasignaturanoinciden[$i]["tipoAjuste"];
                                $promediotaller['idConfiguracionTaller'] = $listaasignaturanoinciden[$i]["idConfiguracionTaller"];
                                $promediotaller['tipoAsignatura'] = $listaasignaturanoinciden[$i]["tipoAsignatura"];

                            } else {
                                $promediofn = intval($promedion / $cuentan);
                                $promediotaller['nota'] = $promediofn;
                                $promediotaller['coef'] = 1;
                                $promediotaller['tiempo'] = 1;
                                $promediotaller['forma'] = $listaasignaturanoinciden[$i]["forma"];
                                $promediotaller['porcentaje'] = $listaasignaturanoinciden[$i]["porcentaje"];
                                $promediotaller['tipoAjuste'] = $listaasignaturanoinciden[$i]["tipoAjuste"];
                                $promediotaller['idConfiguracionTaller'] = $listaasignaturanoinciden[$i]["idConfiguracionTaller"];
                                $promediotaller['tipoAsignatura'] = $listaasignaturanoinciden[$i]["tipoAsignatura"];

                            }


                        } else {
                            $promediotaller['nota'] = 0;
                            $promediotaller['coef'] = 1;
                            $promediotaller['tiempo'] = 1;
                            $promediotaller['forma'] = $listaasignaturanoinciden[$i]["forma"];
                            $promediotaller['porcentaje'] = $listaasignaturanoinciden[$i]["porcentaje"];
                            $promediotaller['tipoAjuste'] = $listaasignaturanoinciden[$i]["tipoAjuste"];
                            $promediotaller['idConfiguracionTaller'] = $listaasignaturanoinciden[$i]["idConfiguracionTaller"];
                            $promediotaller['idAsignatura'] = $listaasignaturanoinciden[$i]["idAsignaturaTaller"];
                            $promediotaller['tipoAsignatura'] = $listaasignaturanoinciden[$i]["tipoAsignatura"];

                        }

                        //Segundo Semestre

                        if ($promedionsegundo > 0 || $cuentansegundo > 0) {

                            if ($detalleest[0]['aproxAsignatura'] == 1) {
                                $promediofns = round($promedionsegundo / $cuentansegundo);
                                $promediotallers['nota'] = $promediofns;
                                $promediotallers['coef'] = 1;
                                $promediotallers['tiempo'] = 2;
                                $promediotallers['idAsignatura'] = $listaasignaturanoinciden[$i]["idAsignaturaTaller"];
                                $promediotallers['forma'] = $listaasignaturanoinciden[$i]["forma"];
                                $promediotallers['porcentaje'] = $listaasignaturanoinciden[$i]["porcentaje"];

                            } else {
                                $promediofns = intval($promedionsegundo / $cuentansegundo);
                                $promediotallers['nota'] = $promediofns;
                                $promediotallers['coef'] = 1;
                                $promediotallers['tiempo'] = 2;
                                $promediotallers['idAsignatura'] = $listaasignaturanoinciden[$i]["idAsignaturaTaller"];
                                $promediotallers['forma'] = $listaasignaturanoinciden[$i]["forma"];
                                $promediotallers['porcentaje'] = $listaasignaturanoinciden[$i]["porcentaje"];

                            }


                        } else {
                            $promediotallers['nota'] = 0;
                            $promediotallers['coef'] = 1;
                            $promediotallers['tiempo'] = 2;
                            $promediotallers['idAsignatura'] = $listaasignaturanoinciden[$i]["idAsignaturaTaller"];
                            $promediotallers['forma'] = $listaasignaturanoinciden[$i]["forma"];
                            $promediotallers['porcentaje'] = $listaasignaturanoinciden[$i]["porcentaje"];
                            $promediofns = 0;
                        }

                        //Promedio Final Taller
                        if ($promediofn != 0 && $promediofns != 0) {
                            if ($detalleest[0]['aproxAnual'] == 1) {
                                $promediofnfinal = round(($promediofn + $promediofns) / 2);
                            } else {
                                $promediofnfinal = intval(($promediofn + $promediofns) / 2);
                            }

                        }
                        if ($promediofn == 0 && $promediofns != 0) {
                            $promediofnfinal = $promediofns;
                        }
                        if ($promediofn != 0 && $promediofns == 0) {
                            $promediofnfinal = $promediofn;
                        }
                        if ($promediofn == 0 && $promediofns == 0) {
                            $promediofnfinal = 0;
                        }
                        if ($promediofnfinal != 0) {
                            $promediocortado = str_split($promediofnfinal);
                            //$taller[$y] .= "<td>" . $promediocortado[0] . ',' . $promediocortado[1] . "</td>";
                        } else {
                            //$taller[$y] .= "<td>-</td>";
                        }

                        //$taller[$y] .= "</tr>";

                        //Cechekeamos a que tipo pertenece la asignatura de destino del taller
                        if (!empty($listaasignaturanoinciden[$i]["idAsignaturaTaller"])) {
                            $datosdestino = Querys::getdestino($db, $nombrebase, $listaasignaturanoinciden[$i]["idAsignaturaTaller"]);

                            if ($datosdestino[0]['tipoAsignatura'] == 4) {

                                $tablanotas2[] = $promediotaller;
                                $tablanotas2segundo[] = $promediotallers;
                            } else {

                                if($promediotaller['nota']!=0){
                                    $tablanotas[] = $promediotaller;
                                }

                                if($promediotallers['nota']!=0){
                                    $tablanotas[] = $promediotallers;
                                }

                            }
                        }
                    }

                }




                //Notas de Asignaturas que pertenecen a una combinada

                if ($largocombinada != 0) {
                    $largotablanota2 = count($tablanotas2);
                    $largotablanota2segundo = count($tablanotas2segundo);


                    for ($i = 0; $i < $largocombinada; $i++) {

                        $setasignatura = unserialize($datosasignaturascombinada[$i]['asignaturas']);
                        for ($k = 0; $k < count($setasignatura); $k++) {
                            $cuentan = 0;
                            $promedion = 0;
                            $cuentansegundo = 0;
                            $promedionsegundo = 0;
                            $notatallercom = 0;
                            $porcentajetallercom = 0;
                            $notatallercomsegundo = 0;
                            $porcentajetallercomsegundo = 0;
                            $cuenta2 = array();
                            $datocombinada = Querys::getnombre($db, $nombrebase, $setasignatura[$k]);


                            //$combinada[$y] .= "<tr><td class='celda'>" . $datocombinada[0]["nombreAsignatura"] . "</td>";

                            //Primer Semestre
                            for ($j = 0; $j < $largotablanota2; $j++) {
                                if ($datocombinada[0]["idAsignatura"] == $tablanotas2[$j]["idAsignatura"]) {
                                    if ($tablanotas2[$j]['coef'] == 2) {
                                        if ($tablanotas2[$j]['nota'] != '0') {
                                            $promedion = $promedion + ($tablanotas2[$j]['nota'] + $tablanotas2[$j]['nota']);
                                            $cuentan = $cuentan + 2;

                                        }

                                    } else {


                                        if ($tablanotas2[$j]['nota'] != '0') {

                                            if (empty($tablanotas2[$j]['forma'])) {
                                                $promedion += $tablanotas2[$j]['nota'];
                                                $cuentan += 1;
                                            } else {

                                                if ($tablanotas2[$j]['forma'] == 1) {
                                                    $promedion += $tablanotas2[$j]['nota'];
                                                    $cuentan += 1;
                                                }
                                                if ($tablanotas2[$j]['forma'] == 2) {
                                                    $porcentajetallercom = $tablanotas2[$j]['porcentaje'];
                                                    $notatallercom = $tablanotas2[$j]['nota'];
                                                }
                                            }


                                        } else {
                                            if (empty($tablanotas2[$j]['forma'])) {

                                            } else {
                                                if ($tablanotas2[$j]['forma'] == 2) {
                                                    $porcentajetallercom = $tablanotas2[$j]['porcentaje'];
                                                    $notatallercom = 0;
                                                }


                                            }
                                        }


                                    }

                                }

                            }

                            //Segundo Semestre
                            for ($j = 0; $j < $largotablanota2segundo; $j++) {
                                if ($datocombinada[0]["idAsignatura"] == $tablanotas2segundo[$j]["idAsignatura"]) {
                                    if ($tablanotas2segundo[$j]['coef'] == 2) {
                                        if ($tablanotas2segundo[$j]['nota'] != '0') {
                                            $promedionsegundo += ($tablanotas2segundo[$j]['nota'] + $tablanotas2segundo[$j]['nota']);
                                            $cuentansegundo += 2;

                                        }


                                    } else {


                                        if ($tablanotas2segundo[$j]['nota'] != '0') {

                                            if (empty($tablanotas2segundo[$j]['forma'])) {
                                                $promedionsegundo += $tablanotas2segundo[$j]['nota'];
                                                $cuentansegundo += 1;
                                            } else {

                                                if ($tablanotas2segundo[$j]['forma'] == 1) {
                                                    $promedionsegundo += $tablanotas2segundo[$j]['nota'];
                                                    $cuentansegundo += 1;
                                                }
                                                if ($tablanotas2segundo[$j]['forma'] == 2) {
                                                    $porcentajetallercomsegundo = $tablanotas2segundo[$j]['porcentaje'];
                                                    $notatallercomsegundo = $tablanotas2segundo[$j]['nota'];
                                                }
                                            }


                                        } else {
                                            if (empty($tablanotas2segundo[$j]['forma'])) {

                                            } else {
                                                if ($tablanotas2segundo[$j]['forma'] == 2) {
                                                    $porcentajetallercomsegundo = $tablanotas2segundo[$j]['porcentaje'];
                                                    $notatallercomsegundo = 0;
                                                }


                                            }
                                        }


                                    }

                                }

                            }


                            //sacamos el promedio de la asignatura Primer Semestre


                            if ($promedion > 0 || $cuentan > 0) {
                                if ($detalleest[0]['aproxAsignatura'] == 1) {
                                    //nuevo Promedio con taller
                                    if (empty($notatallercom)) {
                                        $promediofn = round($promedion / $cuentan);

                                    } else {
                                        $porcentajecom = 100 - $porcentajetallercom;
                                        $promediofn = (round($promedion / $cuentan)) * ($porcentajecom / 100) + ($notatallercom * ($porcentajetallercom / 100));
                                        $promediofn = round($promediofn);

                                    }


                                    //Fin Taller
                                    $promediocombinada['nota'] = $promediofn;
                                    $promediocombinada['coef'] = 1;
                                    $promediocombinada['tiempo'] = 1;
                                    $datoasignatura = Querys::getnombre($db, $nombrebase, $datosasignaturascombinada[$i]["idAsignaturaCurso"]);
                                    $promediocombinada['idAsignatura'] = $datoasignatura[0]["idAsignatura"];


                                } else {

                                    //Nuevo Promedio con Taller
                                    if (empty($notatallercom)) {
                                        $promediofn = intval($promedion / $cuentan);
                                    } else {
                                        $porcentajecom = 100 - $porcentajetallercom;
                                        $promediofn = (round($promedion / $cuentan)) * ($porcentajecom / 100) + ($notatallercom * ($porcentajetallercom / 100));
                                        $promediofn = intval($promediofn);
                                    }
                                    //Fin Taller
                                    $promediocombinada['nota'] = $promediofn;
                                    $promediocombinada['coef'] = 1;
                                    $promediocombinada['tiempo'] = 1;
                                    $datoasignatura = Querys::getnombre($db, $nombrebase, $datosasignaturascombinada[$i]["idAsignaturaCurso"]);
                                    $promediocombinada['idAsignatura'] = $datoasignatura[0]["idAsignatura"];


                                }
                                //$combinada[$y] .= "<td class='prom'>" . $promediofn . "</td></tr>";


                            } else {
                                $promediocombinada['nota'] = 0;
                                $promediocombinada['coef'] = 1;
                                $promediocombinada['tiempo'] = 1;
                                $datoasignatura = Querys::getnombre($db, $nombrebase, $datosasignaturascombinada[$i]["idAsignaturaCurso"]);
                                $promediocombinada['idAsignatura'] = $datoasignatura[0]["idAsignatura"];

                            }

                            //sacamos el promedio de la asignatura Segundo Semestre


                            if ($promedionsegundo > 0 || $cuentansegundo > 0) {


                                if ($detalleest[0]['aproxAsignatura'] == 1) {
                                    //nuevo Promedio con taller
                                    if (empty($notatallercomsegundo)) {
                                        $promediofnsegundo = round($promedionsegundo / $cuentansegundo);

                                    } else {
                                        $porcentajecomsegundo = 100 - $porcentajetallercomsegundo;
                                        $promediofnsegundo = (round($promedionsegundo / $cuentansegundo)) * ($porcentajecomsegundo / 100) + ($notatallercomsegundo * ($porcentajetallercomsegundo / 100));
                                        $promediofnsegundo = round($promediofnsegundo);

                                    }


                                    //Fin Taller
                                    $promediocombinadasegundo['nota'] = $promediofnsegundo;
                                    $promediocombinadasegundo['coef'] = 1;
                                    $promediocombinadasegundo['tiempo'] = 2;
                                    $datoasignatura = Querys::getnombre($db, $nombrebase, $datosasignaturascombinada[$i]["idAsignaturaCurso"]);
                                    $promediocombinadasegundo['idAsignatura'] = $datoasignatura[0]["idAsignatura"];


                                } else {

                                    //Nuevo Promedio con Taller
                                    if (empty($notatallercomsegundo)) {
                                        $promediofnsegundo = intval($promedionsegundo / $cuentansegundo);
                                    } else {
                                        $porcentajecomsegundo = 100 - $porcentajetallercomsegundo;
                                        $promediofnsegundo = (round($promedionsegundo / $cuentansegundo)) * ($porcentajecomsegundo / 100) + ($notatallercomsegundo * ($porcentajetallercomsegundo / 100));
                                        $promediofnsegundo = intval($promediofnsegundo);
                                    }
                                    //Fin Taller
                                    $promediocombinadasegundo['nota'] = $promediofnsegundo;
                                    $promediocombinadasegundo['coef'] = 1;
                                    $promediocombinadasegundo['tiempo'] = 2;
                                    $datoasignatura = Querys::getnombre($db, $nombrebase, $datosasignaturascombinada[$i]["idAsignaturaCurso"]);
                                    $promediocombinadasegundo['idAsignatura'] = $datoasignatura[0]["idAsignatura"];


                                }
                                //$combinada[$y] .= "<td class='prom'>" . $promediofn . "</td></tr>";


                            } else {
                                $promediocombinada['nota'] = 0;
                                $promediocombinada['coef'] = 1;
                                $promediocombinada['tiempo'] = 1;
                                $datoasignatura = Querys::getnombre($db, $nombrebase, $datosasignaturascombinada[$i]["idAsignaturaCurso"]);
                                $promediocombinada['idAsignatura'] = $datoasignatura[0]["idAsignatura"];

                            }
                            //Promedio Final Asignatura Combinada
                            if ($promediofn != 0 && $promediofnsegundo != 0) {
                                if ($detalleest[0]['aproxAnual'] == 1) {
                                    $promediofnfinal = round(($promediofn + $promediofnsegundo) / 2);
                                } else {
                                    $promediofnfinal = intval(($promediofn + $promediofnsegundo) / 2);
                                }

                            }
                            if ($promediofn == 0 && $promediofnsegundo != 0) {
                                $promediofnfinal = $promediofnsegundo;
                            }
                            if ($promediofn != 0 && $promediofnsegundo == 0) {
                                $promediofnfinal = $promediofn;
                            }
                            if ($promediofn == 0 && $promediofnsegundo == 0) {
                                $promediofnfinal = 0;
                            }
                            if ($promediofnfinal != 0) {
                                $promediocortado = str_split($promediofnfinal);
                                //$combinada[$y] .= "<td>" . $promediocortado[0] . ',' . $promediocortado[1] . "</td>";
                            } else {

                                //$combinada[$y] .= "<td>-</td>";
                            }

                            //$combinada[$y] .= "</tr>";

                            $tablanotas[] = $promediocombinada;
                            $tablanotas[] = $promediocombinadasegundo;

                        }
                    }


                }


                $largotablanota = count($tablanotas);


                if ($largotablaaux < 1) {
                    //Error no existen notas
                    $res['success'] = true;
                    $res['message'] = 'no-data';
                    return response($res);
                    exit();
                } else {


                    $contadorparcial = 0;
                    for ($i = 0; $i < $largoasignatura; $i++) {


                        $cuenta1[$i] = 0;
                        $promedio = 0;
                        $cuenta = 0;
                        $promedios = 0;
                        $cuentas = 0;
                        $respuesta[] = array('nombreAsignatura' => $listaasignatura[$i]["nombreAsignatura"]);

                        //Primer Semestre
                        for ($j = 0; $j < $largotablanota; $j++) {
                            if ($listaasignatura[$i]["idAsignatura"] == $tablanotas[$j]["idAsignatura"]) {


                                if ($tablanotas[$j]['coef'] == 2 && $tablanotas[$j]['tiempo'] == 1) {
                                    if ($tablanotas[$j]['nota'] != '0') {
                                        $respuesta[$i]['notas']['primero'][] = array('nota' => $tablanotas[$j]['nota'], 'coef' => $tablanotas[$j]['coef'], 'tiempo' => $tablanotas[$j]['tiempo']);
                                        $respuesta[$i]['notas']['primero'][] = array('nota' => $tablanotas[$j]['nota'], 'coef' => $tablanotas[$j]['coef'], 'tiempo' => $tablanotas[$j]['tiempo']);
                                        //$respuesta[$i]['notas'][] = $tablanotas[$j];
                                        $promedio += ($tablanotas[$j]['nota'] + $tablanotas[$j]['nota']);
                                        $cuenta += 2;

                                    } else {
                                        $respuesta[$i]['notas']['primero'][] = array('nota' => '0', 'coef' => $tablanotas[$j]['coef'], 'tiempo' => $tablanotas[$j]['tiempo']);
                                        $respuesta[$i]['notas']['primero'][] = array('nota' => '0', 'coef' => $tablanotas[$j]['coef'], 'tiempo' => $tablanotas[$j]['tiempo']);

                                    }
                                    $cuenta1[$i] += 2;

                                }
                                if ($tablanotas[$j]['coef'] < 2 && $tablanotas[$j]['tiempo'] == 1) {

                                    if ($tablanotas[$j]['nota'] != '0') {


                                        if (empty($tablanotas[$j]['forma']) && $tablanotas[$j]['tiempo'] == 1) {
                                            $respuesta[$i]['notas']['primero'][] = array('nota' => $tablanotas[$j]['nota'], 'coef' => $tablanotas[$j]['coef'], 'tiempo' => $tablanotas[$j]['tiempo']);
                                            $promedio += $tablanotas[$j]['nota'];
                                            $cuenta += 1;
                                            $porcentajetaller = array();
                                            $notataller = array();
                                        } else {

                                            if ($tablanotas[$j]['forma'] == 1 && $tablanotas[$j]['tiempo'] == 1) {
                                                $respuesta[$i]['notas']['primero'][] = array('nota' => $tablanotas[$j]['nota'], 'coef' => $tablanotas[$j]['coef'], 'tiempo' => $tablanotas[$j]['tiempo']);
                                                $promedio += $tablanotas[$j]['nota'];
                                                $cuenta += 1;
                                                $porcentajetaller = array();
                                                $notataller = array();
                                            }
                                            if ($tablanotas[$j]['forma'] == 2 && $tablanotas[$j]['tiempo'] == 1) {
                                                $respuesta[$i]['notas']['primero'][] = array('nota' => $tablanotas[$j]['nota'], 'coef' => $tablanotas[$j]['coef'], 'tiempo' => $tablanotas[$j]['tiempo']);
                                                $porcentajetaller[] = $tablanotas[$j]['porcentaje'];
                                                $notataller[] = $tablanotas[$j]['nota'];
                                            }
                                        }


                                    } else {
                                        $respuesta[$i]['notas']['primero'][] = array('nota' => '0', 'coef' => $tablanotas[$j]['coef'], 'tiempo' => $tablanotas[$j]['tiempo']);
                                    }

                                    $cuenta1[$i] += 1;

                                }

                                //Segundo Semestre
                                if ($tablanotas[$j]['coef'] == 2 && $tablanotas[$j]['tiempo'] == 2) {

                                    if ($tablanotas[$j]['nota'] != '0') {
                                        $respuesta[$i]['notas']['segundo'][] = array('nota' => $tablanotas[$j]['nota'], 'coef' => $tablanotas[$j]['coef'], 'tiempo' => $tablanotas[$j]['tiempo']);
                                        $respuesta[$i]['notas']['segundo'][] = array('nota' => $tablanotas[$j]['nota'], 'coef' => $tablanotas[$j]['coef'], 'tiempo' => $tablanotas[$j]['tiempo']);

                                        $promedios += ($tablanotas[$j]['nota'] + $tablanotas[$j]['nota']);
                                        $cuentas += 2;

                                    } else {
                                        $respuesta[$i]['notas']['segundo'][] = array('nota' => '0', 'coef' => $tablanotas[$j]['coef'], 'tiempo' => $tablanotas[$j]['tiempo']);
                                        $respuesta[$i]['notas']['segundo'][] = array('nota' => '0', 'coef' => $tablanotas[$j]['coef'], 'tiempo' => $tablanotas[$j]['tiempo']);
                                    }
                                    $cuenta1[$i] += 2;

                                }
                                if ($tablanotas[$j]['coef'] < 2 && $tablanotas[$j]['tiempo'] == 2) {

                                    if ($tablanotas[$j]['nota'] != '0') {

                                        if (empty($tablanotas[$j]['forma']) && $tablanotas[$j]['tiempo'] == 2) {
                                            $respuesta[$i]['notas']['segundo'][] = array('nota' => $tablanotas[$j]['nota'], 'coef' => $tablanotas[$j]['coef'], 'tiempo' => $tablanotas[$j]['tiempo']);
                                            $promedios += $tablanotas[$j]['nota'];
                                            $cuentas += 1;
                                            $porcentajetallers = array();
                                            $notatallers = array();
                                        } else {

                                            if ($tablanotas[$j]['forma'] == 1 && $tablanotas[$j]['tiempo'] == 2) {
                                                $respuesta[$i]['notas']['segundo'][] = array('nota' => $tablanotas[$j]['nota'], 'coef' => $tablanotas[$j]['coef'], 'tiempo' => $tablanotas[$j]['tiempo']);
                                                $promedios += $tablanotas[$j]['nota'];
                                                $cuentas += 1;
                                                $porcentajetallers = array();
                                                $notatallers = array();
                                            }
                                            if ($tablanotas[$j]['forma'] == 2 && $tablanotas[$j]['tiempo'] == 2) {
                                                $respuesta[$i]['notas']['segundo'][] = array('nota' => $tablanotas[$j]['nota'], 'coef' => $tablanotas[$j]['coef'], 'tiempo' => $tablanotas[$j]['tiempo']);
                                                $porcentajetallers[] = $tablanotas[$j]['porcentaje'];
                                                $notatallers[] = $tablanotas[$j]['nota'];
                                            }
                                        }


                                    } else {
                                        $respuesta[$i]['notas']['segundo'][] = array('nota' => '0', 'coef' => $tablanotas[$j]['coef'], 'tiempo' => $tablanotas[$j]['tiempo']);
                                    }

                                    $cuenta1[$i] += 1;

                                }


                            }

                        }


                        //Primer Semestre
                        //sacamos el promedio de la asignatura

                        if ($promedio > 0 || $cuenta > 0) {


                            // si es 1 Aproxima, si es 2 no Aproxima
                            if ($detalleest[0]['aproxAsignatura'] == 1) {
                                if (empty($notataller)) {
                                    $promediof = round($promedio / $cuenta);
                                } else {
                                    $porcentaje = 100;
                                    $resultadoauxtaller = 0;
                                    if (count($notataller) > 1) {
                                        for ($t = 0; $t < count($notataller); $t++) {
                                            $porcentaje = $porcentaje - $porcentajetaller[$t];
                                            $resultadoauxtaller += ($notataller[$t] * ($porcentajetaller[$t] / 100));

                                        }
                                        $promediof = (round($promedio / $cuenta)) * ($porcentaje / 100) + $resultadoauxtaller;

                                    } else {
                                        $porcentaje = $porcentaje - $porcentajetaller[0];
                                        $promediof = (round($promedio / $cuenta)) * ($porcentaje / 100) + ($notataller[0] * ($porcentajetaller[0] / 100));
                                        $promediof = round($promediof);
                                    }


                                }


                            } else {
                                if (empty($notataller)) {
                                    $promediof = intval($promedio / $cuenta);
                                } else {
                                    $porcentaje = 100;
                                    $resultadoauxtaller = 0;
                                    if (count($notataller) > 1) {
                                        for ($t = 0; $t < count($notataller); $t++) {
                                            $porcentaje = $porcentaje - $porcentajetaller[$t];
                                            $resultadoauxtaller += ($notataller[$t] * ($porcentajetaller[$t] / 100));

                                        }
                                        $promediof = (round($promedio / $cuenta)) * ($porcentaje / 100) + $resultadoauxtaller;
                                        $promediof = intval($promediof);
                                    } else {
                                        $porcentaje = $porcentaje - $porcentajetaller[0];
                                        $promediof = (round($promedio / $cuenta)) * ($porcentaje / 100) + ($notataller[0] * ($porcentajetaller[0] / 100));
                                        $promediof = intval($promediof);
                                    }
                                }


                            }

                            $promediocortado = str_split($promediof);
                            $respuesta[$i]['primer'] = $promediof;


                        } else {

                            $promediof = 0;
                            //$respuesta[$i]['promedio'][2]=$promediof;
                            $respuesta[$i]['primer'] = $promediof;

                        }

                        //Segundo Semestre

                        if ($promedios > 0 || $cuentas > 0) {


                            // si es 1 Aproxima, si es 2 no Aproxima
                            if ($detalleest[0]['aproxAsignatura'] == 1) {
                                if (empty($notatallers)) {
                                    $promediofs = round($promedios / $cuentas);
                                } else {
                                    $porcentajes = 100;
                                    $resultadoauxtallers = 0;
                                    if (count($notatallers) > 1) {
                                        for ($t = 0; $t < count($notatallers); $t++) {
                                            $porcentajes = $porcentajes - $porcentajetallers[$t];
                                            $resultadoauxtallers += ($notatallers[$t] * ($porcentajetallers[$t] / 100));

                                        }
                                        $promediofs = (round($promedios / $cuentas)) * ($porcentajes / 100) + $resultadoauxtallers;

                                    } else {
                                        $porcentajes = $porcentajes - $porcentajetallers[0];
                                        $promediofs = (round($promedios / $cuentas)) * ($porcentajes / 100) + ($notatallers[0] * ($porcentajetallers[0] / 100));
                                        $promediofs = round($promediofs);
                                    }


                                }

                            } else {
                                if (empty($notatallers)) {
                                    $promediofs = intval($promedios / $cuentas);
                                } else {
                                    $porcentajes = 100;
                                    $resultadoauxtallers = 0;
                                    if (count($notatallers) > 1) {
                                        for ($t = 0; $t < count($notatallers); $t++) {
                                            $porcentajes = $porcentajes - $porcentajetallers[$t];
                                            $resultadoauxtallers += ($notatallers[$t] * ($porcentajetallers[$t] / 100));

                                        }
                                        $promediofs = (round($promedios / $cuentas)) * ($porcentajes / 100) + $resultadoauxtallers;
                                        $promediofs = intval($promediofs);
                                    } else {
                                        $porcentajes = $porcentajes - $porcentajetallers[0];
                                        $promediofs = (round($promedios / $cuentas)) * ($porcentajes / 100) + ($notatallers[0] * ($porcentajetallers[0] / 100));
                                        $promediofs = intval($promediofs);
                                    }
                                }


                            }

                            $promediocortados = str_split($promediofs);
                            $respuesta[$i]['segundo'] = $promediofs;


                        } else {
                            $promediofs = 0;
                            $respuesta[$i]['segundo'] = $promediofs;

                        }


                        //Promedio Final
                        if ($promediof != 0 && $promediofs != 0) {

                            if ($detalleest[0]['aproxAnual'] == 1) {
                                $promedioffinal = round(($promediof + $promediofs) / 2);
                                $contadorparcial += 1;
                            } else {
                                $promedioffinal = intval(($promediof + $promediofs) / 2);
                                $contadorparcial += 1;
                            }

                        }
                        if ($promediof == 0 && $promediofs != 0) {
                            $promedioffinal = $promediofs;
                            $contadorparcial += 1;
                        }
                        if ($promediof != 0 && $promediofs == 0) {
                            $promedioffinal = $promediof;
                            $contadorparcial += 1;
                        }
                        if ($promediof == 0 && $promediofs == 0) {
                            $promedioffinal = 0;
                        }
                        if ($promedioffinal == 0) {
                            //$html[$y] .= "<td class='prom'>-</td>";
                        } else {

                            if ($agregadecimas) {
                                if ($promedioffinal >= 60) {
                                    $promedioffinal += 2;
                                    if ($promedioffinal > 70) {
                                        $promedioffinal = 70;

                                    }

                                }
                            }

                        }


                        $promedioparcial += $promedioffinal;
                        $respuesta[$i]['finala'] = $promedioffinal;


                    }//Fin asignaturas

                    $promedioparcialfinal = 0;

                    if ($promedioparcial > 0 && $contadorparcial > 0) {

                        // si es 1 Aproxima,si es 2 no Aproxima
                        if ($detalleest[0]['aproxFinal'] == 1) {
                            $promedioparcialfinal = round($promedioparcial / $contadorparcial);
                        } else {
                            $promedioparcialfinal = intval($promedioparcial / $contadorparcial);
                        }

                     }




                }




            } //fin largo alumnos



            $encabezado=[];
            if(($promedioparcialfinal>0 || $promedioparcialfinal!=null || $promedioparcialfinal!='' || count($encabezado)>0)){

                //Creamos el encabezado del Promedio Final
                $encabezado['nombreAsignatura']='Promedio Final';
                $encabezado['notas']['primero']=[];
                $encabezado['notas']['segundo']=[];
                $encabezado['primer']=0;
                $encabezado['segundo']=0;
                $encabezado['finala']=intval($promedioparcialfinal);
                $encabezado['max']=0;

            }else{
                $encabezado['nombreAsignatura']='Promedio Final';
                $encabezado['notas']['primero']=[];
                $encabezado['notas']['segundo']=[];
                $encabezado['primer']=0;
                $encabezado['segundo']=0;
                $encabezado['finala']=0;
                $encabezado['max']=0;
            }




            if ($respuesta) {

                if (count($cuenta1) > 0) {
                    for ($i = 0; $i < $largoasignatura; $i++) {

                        if(!isset($respuesta[$i]['notas']['primero'])){
                            $respuesta[$i]['notas']['primero']=[];

                        }

                        if(!isset($respuesta[$i]['notas']['segundo'])){
                            $respuesta[$i]['notas']['segundo']=[];

                        }

                            $largoprimero=count($respuesta[$i]['notas']['primero']);
                            $largosegundo=count($respuesta[$i]['notas']['segundo']);


                            $max = max($largoprimero,$largosegundo);




                            $respuesta[$i]['max'] = $max;
                            $largoaux = count($respuesta[$i]['notas']['primero']);
                            $largoauxs = count($respuesta[$i]['notas']['segundo']);
                            if ($largoaux != $max) {
                                $largoagrega = $max - $largoaux;
                                for ($j = 0; $j < $largoagrega; $j++) {
                                    if ($max != count($respuesta[$i]['notas']['primero'])) {
                                        $respuesta[$i]['notas']['primero'][] = array('nota' => "");
                                    }


                                }

                            }
                            else if ($largoauxs != $max) {
                                $largoagrega = $max - $largoauxs;
                                for ($j = 0; $j < $largoagrega; $j++) {
                                    if ($max != count($respuesta[$i]['notas']['segundo'])) {
                                        $respuesta[$i]['notas']['segundo'][] = array('nota' => "");
                                    }


                                }

                            }




                        //Agregamos el Promedio Final

                    }

                }

                //Agregamos el encabezado al principio del array
                array_unshift($respuesta,$encabezado);


                return response()->json($respuesta, 200);

            }else{
                $res['success'] = true;
                $res['message'] = 'no-data';
                return response($res);
            }


            //Fin
            //var_dump($datosnotas);
        } else {
            $res['success'] = true;
            $res['message'] = 'expired';
            return response($res);
        }


        //var_dump($datosnotas);
        //$users = DB::connection('mysql');
        //var_dump($users);
        //Obtenemos las Asignaturas del Alumnos por id de curso
        //$asignaturas=DB::table('asignaturasapoderado')->where('idCursos','=',$alumno[0]->idCursos)->get();

        //$notas = DB::table('notasapoderado')
        //  ->where('idAlumnos', '=', $alumno[0]->id)
        //->get();

        //$collection = collect($notas)->map(function($x){ return (array) $x; })->toArray();

//        $datos[0]=array($alumno[0]->nombres,$alumno[0]->paterno,$alumno[0]->materno,$alumno[0]->rut,$alumno[0]->nombreGrado.' '.$alumno[0]->letra);
//        for ($i=0;$i<count($asignaturas);$i++){
//            $datosnotas[$i]=array('nombreasignatura'=>$asignaturas[$i]->nombreAsignatura,'id'=>$asignaturas[$i]->idAsignatura);
//            for ($j=0;$j<count($notas);$j++){
//                if($asignaturas[$i]->idAsignatura==$notas[$j]->idAsignatura){
//                    $datosnotas[$i]['notas'][]=$notas[$j]->nota;
//                }
//
//            }
//        }


//        $datos[0][]=$datosnotas;
//		if($datos)
//		{
//			return response()->json($datos, 200);
//		}
        //return response()->json($users, 200);

        //return response()->json(["Notas no encontradas"], 404);

    }

    public function getInfo($id,$device, \Illuminate\Http\Request $request)
    {
        $db = app('db');

        if($this->mantencion){

            $res['success'] = true;
            $res['message'] = 'maintenance';
            return response($res);
            exit();

        }

        //sleep(400);

        // Obtenemos los datos del alumno
        $alumno = DB::table('users')->where('user', '=', $id)->get();
        $alumnos = DB::table('user_det')->where('identificador', $device)->where('id', $alumno[0]['id'])->first();

        //Obtenemos el token del dispositivo

        $nombrebase = $alumno[0]['idDb'];
        $idperiodo = $alumno[0]['idPeriodo'];
        $idcurso = $alumno[0]['idCursos'];


        //Obtenemos el Token que utiliza el usuario y lo comparamos si corresponde.
        $token = $header = $request->header('Acceso');


        if ($token === $alumnos['remember_token']) {

            $users = $db->connection($nombrebase)->table('alumnos')->where('rutAlumno', '=', $id)->get();
            $idalumno = $users[0]['idAlumnos'];


            $listadealumnos = $db->connection($nombrebase)->table('AlumnosActual')
                ->join('alumnos', 'alumnos.idAlumnos', '=', 'AlumnosActual.idAlumnos')->select('alumnos.idAlumnos', 'rutAlumno', 'nombres', 'apaterno', 'amaterno', 'idAlumnosActual', 'idEstadoActual', 'idCursosActual', 'idPeriodoActual')
                ->where('AlumnosActual.idAlumnos', '=', $idalumno)
                ->where('AlumnosActual.idPeriodoActual', '=', $idperiodo)->get();
            $listadealumnos = collect($listadealumnos)->toArray();


            $detalleest = $db->connection($nombrebase)->table('cursosactual')
                ->join('establecimiento', 'establecimiento.idEstablecimiento', '=', 'cursosactual.idEstablecimiento')
                ->join('establecimientoConfiguracion', 'establecimientoConfiguracion.idEstablecimiento', '=', 'establecimiento.idEstablecimiento')
                ->join('comuna', 'comuna.idComuna', '=', 'establecimiento.comuna')
                ->join('codigotipoensenanza', 'codigotipoensenanza.idCodigoTipo', '=', 'cursosactual.idCodigoTipo')
                ->join('codigogrados', 'codigogrados.idCodigoGrado', '=', 'cursosactual.idCodigoGrado')
                ->where('cursosactual.idCursos', '=', $idcurso)
                ->where('establecimientoConfiguracion.idPeriodo', '=', $idperiodo)->get();
            $detalleest = collect($detalleest)->toArray();


            $Profesorjefe = $db->connection($nombrebase)->table('cuentasUsuario')
                ->join('cuentaRoles', 'cuentaRoles.idCuenta', '=', 'cuentasUsuario.idCuenta')
                ->join('roles', 'roles.idRoles', '=', 'cuentaRoles.idRol')
                ->where('cuentasUsuario.idCuenta', '=', $detalleest[0]['idCuentaJefe'])
                ->where('cuentaRoles.idPeriodo', '=', $idperiodo)->get(['cuentasUsuario.idCuenta', 'cuentasUsuario.nombrescuenta', 'cuentasUsuario.paternocuenta', 'cuentasUsuario.maternocuenta']);


            $director = $db->connection($nombrebase)->table('cuentasUsuario')
                ->where('cuentasUsuario.idCuenta', '=', $detalleest[0]['idDirector'])->get();
            $respuesta = array();
            $respuesta['nombreAlumno'] = mb_convert_case($listadealumnos[0]['nombres'] . " " . $listadealumnos[0]['apaterno'] . " " . $listadealumnos[0]['amaterno'], MB_CASE_TITLE, "UTF-8");


            if (count($detalleest) > 0) {
                $respuesta['nombreEstablecimiento'] = mb_convert_case($detalleest[0]['nombreEstablecimiento'], MB_CASE_TITLE, "UTF-8");
                $respuesta['nombreCurso'] = $detalleest[0]['nombreGrado'] . " " . $detalleest[0]['letra'];
                $respuesta['nombreTipoEnsenanza'] = $detalleest[0]['nombreTipoEnsenanza'];
                $respuesta['nombreComuna'] = $detalleest[0]['nombreComuna'];
            } else {
                $respuesta['nombreEstablecimiento'] = "Sin Información";
                $respuesta['nombreCurso'] = "Sin Información";
                $respuesta['nombreTipoEnsenanza'] = "Sin Información";
                $respuesta['nombreComuna'] = "Sin Información";
            }


            if (count($Profesorjefe) > 0) {
                $respuesta['nombreDocente'] = mb_convert_case($Profesorjefe[0]['nombrescuenta'] . " " . $Profesorjefe[0]['paternocuenta'] . " " . $Profesorjefe[0]['maternocuenta'], MB_CASE_TITLE, "UTF-8");

            } else {
                $respuesta['nombreDocente'] = "Sin Información";

            }

            if (count($director) > 0) {
                $respuesta['nombreDirector'] = mb_convert_case($director[0]['nombrescuenta'] . " " . $director[0]['paternocuenta'] . " " . $director[0]['maternocuenta'], MB_CASE_TITLE, "UTF-8");

            } else {
                $respuesta['nombreDirector'] = "Sin Información";

            }


            if ($respuesta) {
                return response()->json($respuesta, 200);

            }


        } else {

            $res['success'] = true;
            $res['message'] = 'expired';
            return response($res);
        }


    }

    public function getAsistencia($id,$device, \Illuminate\Http\Request $request)
    {
        $db = app('db');

        if($this->mantencion){

            $res['success'] = true;
            $res['message'] = 'maintenance';
            return response($res);
            exit();

        }
        //sleep(400);

        // Obtenemos los datos del alumno
        $alumno = DB::table('users')->where('user', '=', $id)->get();
        $alumnos = DB::table('user_det')->where('identificador', $device)->where('id', $alumno[0]['id'])->first();
        $nombrebase = $alumno[0]['idDb'];
        $idperiodo = $alumno[0]['idPeriodo'];
        $idcurso = $alumno[0]['idCursos'];

        //Obtenemos el Token que utiliza el usuario y lo comparamos si corresponde.
        $token = $header = $request->header('Acceso');


        if ($token === $alumnos['remember_token']) {


            $users = $db->connection($nombrebase)->table('alumnos')->where('rutAlumno', '=', $id)->get();
            $idalumno = $users[0]['idAlumnos'];





            $listaasistencia = $db->connection($nombrebase)->table('asistencia')
                ->leftJoin('asistenciavalores', 'asistenciavalores.idAsistencia', '=', 'asistencia.idAsistencia')
                ->where('asistencia.idCursos', '=', $idcurso)
                ->where('asistencia.idPeriodo', '=', $idperiodo)
                ->where('asistenciavalores.idAlumnos', '=', $idalumno)
                ->orderBy('asistencia.fechaAsistencia', 'ASC')->get();
            $datosasistencia = collect($listaasistencia)->toArray();

            $largoasistenciatotal=count($listaasistencia);

            if($largoasistenciatotal>0){

                $totalasistencia=0;
                $totalinasistencia=0;

                setlocale(LC_TIME, 'es_CL.UTF-8');
                for ($i = 13; $i > 1; $i--) {
                    $diasas = 0;
                    $diasinasistencia = 0;
                    $inasistencia = "";
                    $largoasistencia[$i] = 0;

                    foreach ($datosasistencia as $a) {
                        $mes = date("n", strtotime($a['fechaAsistencia']));
                        if ($mes == $i) {
                            if ($a['valor'] == 2) { //Presente

                                $diasas += 1;
                                $totalasistencia +=1;

                            } else {
                                $diasinasistencia += 1;
                                $totalinasistencia +=1;
                                $inasistencia .= date_parse_from_format('Y-m-d', $a['fechaAsistencia'])['day']."-";
                            }
                            $largoasistencia[$i]++;

                        }

                    }


                    $nombremes = mb_convert_case(strftime('%B', mktime(0, 0, 0, $i)), MB_CASE_TITLE, "UTF-8");


                    if (($diasas > 0 || $diasinasistencia > 0 ) && $largoasistencia > 0) {

                        $inasistencia=mb_substr($inasistencia, 0, -1);

                        $respuesta[] = array("nombreMes" => $nombremes, "diasAsistencia" => $diasas, "diasInasistencia" => $diasinasistencia, "porcentajeAsistencia" => round(($diasas * 100) / $largoasistencia[$i]), "porcentajeInasistencia" => round(($diasinasistencia * 100) / $largoasistencia[$i]), "dias" => $inasistencia);
                    }


                }

                $asistencia=round(($totalasistencia * 100) / $largoasistenciatotal);
                $inasistencia=round(($totalinasistencia * 100) / $largoasistenciatotal);

                if($asistencia>0 || $inasistencia>0){
                    array_unshift($respuesta,array("nombreMes" => "Asistencia Total", "diasAsistencia" => $totalasistencia, "diasInasistencia" => $totalinasistencia, "porcentajeAsistencia" => $asistencia, "porcentajeInasistencia" => $inasistencia, "dias" => []));

                }




            }else{
                $res['success'] = true;
                $res['message'] = 'no-data';
                return response($res);
                //$respuesta[0] = array("nombreMes" => "Total", "diasAsistencia" => "Sin Datos", "diasInasistencia" => "Sin Datos", "porcentajeAsistencia" => 0, "porcentajeInasistencia" => 0, "dias" => []);

            }

            if ($respuesta) {
                return response()->json($respuesta, 200);

            }




        } else {
            $res['success'] = true;
            $res['message'] = 'expired';
            return response($res);
        }


    }

    public function getObservaciones($id,$device, \Illuminate\Http\Request $request)
    {
        $db = app('db');

        if($this->mantencion){

            $res['success'] = true;
            $res['message'] = 'maintenance';
            return response($res);
            exit();

        }
        //sleep(400);

        // Obtenemos los datos del alumno
        $alumno = DB::table('users')->where('user', '=', $id)->get();
        $alumnos = DB::table('user_det')->where('identificador', $device)->where('id', $alumno[0]['id'])->first();
        $nombrebase = $alumno[0]['idDb'];
        $idperiodo = $alumno[0]['idPeriodo'];
        $idcurso = $alumno[0]['idCursos'];

        //Obtenemos el Token que utiliza el usuario y lo comparamos si corresponde.
        $token = $header = $request->header('Acceso');


        if ($token === $alumnos['remember_token']) {


            $users = $db->connection($nombrebase)->table('alumnos')->where('rutAlumno', '=', $id)->get();
            $idalumno = $users[0]['idAlumnos'];



            $listaobservaciones = $db->connection($nombrebase)->table('observaciones')
                //->select('idObservaciones')
                //->leftJoin('asignaturascursos', 'asignaturascursos.idAsignaturaCurso', '=', 'observaciones.idAsignatura')
                //->leftJoin('asignaturas', 'asignaturas.idAsignatura', '=', 'observaciones.idAsignatura')
                ->where('observaciones.idPeriodo', '=', $idperiodo)
                ->where('observaciones.idCursos', '=', $idcurso)
                ->where('observaciones.idAlumnos', '=', $idalumno)
                //->groupBy('idObservaciones')
                ->orderBy('observaciones.fechaObservacion', 'ASC')->get();
            $datosasistencia = collect($listaobservaciones)->toArray();
            $largo=count($listaobservaciones);
            if($largo>0){
                setlocale(LC_TIME, 'es_CL.UTF-8');

                    foreach ($datosasistencia as $a) {

                        if($a['idAsignatura']=='D'){

                            $respuesta[]=array('fechaObservacion'=>ucwords(strftime("%A, %d de %B del %Y", strtotime($a['fechaObservacion']))),'nombreAsignatura'=>'Dirección','observacion'=>$a['observacion']);


                        }elseif ($a['idAsignatura']=='I'){
                            $respuesta[]=array('fechaObservacion'=>ucwords(strftime("%A, %d de %B del %Y", strtotime($a['fechaObservacion']))),'nombreAsignatura'=>'Inspectoria','observacion'=>$a['observacion']);


                        }else{
                            $nombreAsignatura=$db->connection($nombrebase)->table('asignaturas')->where('idAsignatura','=',$a['idAsignatura'])->get();
                            $respuesta[]=array('fechaObservacion'=>ucwords(strftime("%A, %d de %B del %Y", strtotime($a['fechaObservacion']))),'nombreAsignatura'=>$nombreAsignatura[0]['nombreAsignatura'],'observacion'=>$a['observacion']);
                        }


                    }

                return response()->json($respuesta, 200);


            }else{

                $res['success'] = true;
                $res['message'] = 'no-data';
                return response($res);

            }

        } else {
            $res['success'] = true;
            $res['message'] = 'expired';
            return response($res);

        }


    }

    public function getalumnos($id,$idDb,$idcurso,$idperiodo, \Illuminate\Http\Request $request)
    {

        // Obtenemos los datos del usuario master
        $alumno = DB::table('users')->where('user', '=', $id)->get();

        //Obtenemos el Token que utiliza el usuario y lo comparamos si corresponde.
        $token = $header = $request->header('Acceso');


        if ($token === $alumno[0]['remember_token']) {

            $listadealumnos = DB::table('users')
                ->where('idDb', '=', $idDb)
                ->where('idPeriodo','=',$idperiodo)
                ->where('idCursos','=',$idcurso)
                ->whereNotNull('identificador')->get();
            $listadealumnos= collect($listadealumnos)->toArray();


            if (count($listadealumnos)>0) {


                for($i=0;$i<count($listadealumnos);$i++){
                    $respuesta[]=array("idAlumno"=>$listadealumnos[$i]['idAlumno'],"id"=>$listadealumnos[$i]['identificador']);

                }
                return response()->json($respuesta, 200);

            }else{
                $res['success'] = false;
                return response()->json($res, 200);

            }


        } else {
            return response()->json(["Token no Válido"], 404);
        }


    }


}
