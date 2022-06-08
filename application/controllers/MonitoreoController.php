<?php

class MonitoreoController extends Zend_Controller_Action
{

    public function init()
    {
        $this->initView();
        $this->view->baseUrl = $this->_request->getBaseUrl();
    }

    public function indexAction()
    {
      $this->_helper->viewRenderer->setNoRender();
      $this->_helper->layout->disableLayout();
    }

    public function chocotagetevaluacionescursoAction() {
      $this->_helper->viewRenderer->setNoRender();
      $this->_helper->layout->disableLayout();

      $idPeriodo = $this->_getParam('idPeriodo', 0);
      $idCurso = $this->_getParam('idCurso', 1);



      $pruebas = new Application_Model_DbTable_Pruebas();
      $evaluaciones = $pruebas->listapruebaschocota($idCurso, $idPeriodo);

      $evaluacionesArray = array();

      foreach ($evaluaciones as $key => $evaluacion) {
        array_push($evaluacionesArray, $evaluacion);
      }
      $this->_helper->json($evaluacionesArray);

    }

    public function chocotagetguiascursoAction() {
      $this->_helper->viewRenderer->setNoRender();
      $this->_helper->layout->disableLayout();

      $idPeriodo = $this->_getParam('idPeriodo', 0);
      $idCurso = $this->_getParam('idCurso', 1);
      $idEvaluacion = $this->_getParam('idEvaluacion', 2);

      $pruebas = new Application_Model_DbTable_Pruebas();
      $evaluaciones = $pruebas->listaguiaschocota(
        $idCurso,
        $idPeriodo,
        $idEvaluacion,
        null
      );

      $evaluacionesArray = array();

      foreach ($evaluaciones as $key => $evaluacion) {
        array_push($evaluacionesArray, $evaluacion);
      }
      $this->_helper->json($evaluacionesArray);

    }

    public function chocotagetguiasformativascursoAction() {
      $this->_helper->viewRenderer->setNoRender();
      $this->_helper->layout->disableLayout();

      $idPeriodo = $this->_getParam('idPeriodo', 0);
      $idCurso = $this->_getParam('idCurso', 1);
      // $idEvaluacion = $this->_getParam('idEvaluacion', 2);

      $pruebas = new Application_Model_DbTable_Pruebas();
      $evaluaciones = $pruebas->listaguiaschocota(
        $idCurso,
        $idPeriodo,
        // $idEvaluacion,
        'Formativa'
      );

      $evaluacionesArray = array();

      foreach ($evaluaciones as $key => $evaluacion) {
        array_push($evaluacionesArray, $evaluacion);
      }
      $this->_helper->json($evaluacionesArray);

    }


    public function chocotagetnotascursoAction() {
      $this->_helper->viewRenderer->setNoRender();
      $this->_helper->layout->disableLayout();

      $idPeriodo = $this->_getParam('idPeriodo', 0);
      $idCurso = $this->_getParam('idCurso', 1);

      $modelonotas = new Application_Model_DbTable_Notas();
      $notas = $modelonotas->getnotaschocota($idCurso, $idPeriodo);

      $this->_helper->json($notas);

    }

    // TODO:
    public function chocotagetnotasguiasAction() {
      $this->_helper->viewRenderer->setNoRender();
      $this->_helper->layout->disableLayout();

      $idPeriodo = $this->_getParam('idPeriodo', 0);
      $idCurso = $this->_getParam('idCurso', 1);
      $idEvaluacion = $this->_getParam('idEvaluacion', 2);

      $modelonotas = new Application_Model_DbTable_Notas();
      $notas = $modelonotas->getnotasguiaschocota(
        $idCurso,
        $idPeriodo,
        $idEvaluacion,
        Null
      );

      // SOP 36

      // $modelonotas->agregarnotaguia(
      //   $listaalumnos[$i]['idAlumnos'],
      //   $idAsignatura,
      //   $idCurso,
      //   0,
      //   $usuario,
      //   $idprueba,
      //   $fechacreacion,
      //   $idPeriodo,
      //   null,
      //   0
      // );


      // $alumnos = new Application_Model_DbTable_Alumnosactual();
      // $listaalumnos = $alumnos->listaralumnoscurso($idCurso, $idPeriodo);



      $this->_helper->json($notas);




      foreach ($notas as $a => $nota) {
        if ($nota['idAlumnos'] == 4509) {
        }
      }


      // $this->_helper->json($notas);

    }

    public function chocotagetnotasformativacursoAction()
    {
      $this->_helper->viewRenderer->setNoRender();
      $this->_helper->layout->disableLayout();

      $idPeriodo = $this->_getParam('idPeriodo', 0);
      $idCurso = $this->_getParam('idCurso', 1);
      $idAsignatura = $this->_getParam('idAsignatura', 2);
      $tiempoNota = $this->_getParam('tiempoNota', 3);
      // if ($tiempoNota !== 'undefined') {
        $modelonotas = new Application_Model_DbTable_Notas();
        $notas = $modelonotas->getnotasguiaschocota(
          $idCurso,
          $idPeriodo,
          $idAsignatura,
          $tiempoNota,
          'Formativa'
        );
        // $notas = $modelonotas->getnotasformativaschocota($idCurso, $idPeriodo);

        $this->_helper->json($notas);
      // }
    }

    public function chocotaupdatenotasguiasAction() {
      $this->_helper->viewRenderer->setNoRender();
      $this->_helper->layout->disableLayout();

      $json = file_get_contents('php://input');
      $notaJson = json_decode($json, true);
      $modelonotas = new Application_Model_DbTable_Notas();

      $idcurso = new Zend_Session_Namespace('id_curso');
      $idCurso = $idcurso->id_curso;

      $periodo = new Zend_Session_Namespace('periodo');
      $idPeriodo = $periodo->periodo;

      $rutusuario = new Zend_Session_Namespace('id');
      $idUsuario = $rutusuario->id;
      try {

        // SOP 36
        if (is_null($notaJson['idNotasGuia'])) {
          $pruebas = new Application_Model_DbTable_Pruebas();

          $guias = $pruebas->getguiaidev($notaJson['idEvaluacion']);

          // $this->_helper->json($notaJson);
          $date = new DateTime;
          $fechacreacion = $date->format('Y-m-d H:i:s');

          $modelonotas->addnotasguia(
            0,
            $fechacreacion,
            $idPeriodo,
            $notaJson['idAlumnos'],
            $idUsuario,
            $guias[0]['idAsignatura'],
            $idCurso,
            $notaJson['idGuia'],
            0
          );
          // $modelonotas->agregarnotaguia(
          //   $notaJson['idAlumnos'],
          //   $guias[0]['idAsignatura'],
          //   $idCurso,
          //   0,
          //   $idUsuario,
          //   $notaJson['idGuia'],
          //   $fechacreacion,
          //   $idPeriodo,
          //   null,
          //   0
          // );

          $notaJson['idNotasGuia'] = intval($modelonotas->getAdapter()->lastInsertId());
        }
        // $this->_helper->json($notaJson);
        $modelonotas->updatenotaguiachocota(
          $notaJson['idNotasGuia'],
          $notaJson['nota_1']
        );


        $notas = $modelonotas->getnotasguiaalumnochocota(
          $notaJson['idEvaluacion'],
          $notaJson['idAlumnos'],
          null
        );

        $promedio = 0;
        $contador = 0;
        $promedioFormativa = false;
        foreach ($notas as $key => $nota) {
          if ($nota['tipoGuia'] !== '2') {

            $notaPorcentaje = $nota['nota_1'];
            $promedio = $promedio + $notaPorcentaje;
            if ($notaPorcentaje != 0) {
              $contador = $contador + 1;
            }
          } else if ($promedioFormativa === false) {

            $notasFormativas = $modelonotas->getnotasguiaalumnochocota(
              $notaJson['idEvaluacion'],
              $notaJson['idAlumnos'],
              'Formativa'
            );

            $sumaFormativa = 0;
            $divisorFormativa = 0;
            foreach ($notasFormativas as $key => $notaFormativa) {
              if ($notaFormativa['nota_1'] > 0 && $notaFormativa['nota_1'] !== null) {
                $sumaFormativa = $notaFormativa['nota_1'] + $sumaFormativa;
                $divisorFormativa = $divisorFormativa + 1;
              }
            }

            if ($sumaFormativa !== 0) {
              $promedioFormativa = $sumaFormativa / $divisorFormativa;
              $notaPorcentaje = $promedioFormativa;
              if ($notaPorcentaje != 0) {
                $contador = $contador + 1;
              }
              $promedio = $promedio + $notaPorcentaje;


              $promedioFormativa = true;
            }
          }
        }

        $idNota = $modelonotas->getidnotasevaluacionchocota(
          $notaJson['idEvaluacion'],
          $notaJson['idAlumnos']
        );

        $notaPromedio = substr(str_replace( ".", "", $promedio / $contador), 0, 2);
        $modelonotas->updatenotachocota(
          $idNota[0]['idNotas'],
          $notaPromedio
        );


      } catch (\Throwable $th) {
        $this->_helper->json($th);
      }
    }

    public function chocotaupdatenotasAction() {
      $this->_helper->viewRenderer->setNoRender();
      $this->_helper->layout->disableLayout();

      $json = file_get_contents('php://input');
      $notaJson = json_decode($json, true);
      $modelonotas = new Application_Model_DbTable_Notas();

      $idcurso = new Zend_Session_Namespace('id_curso');
      $idCurso = $idcurso->id_curso;

      $periodo = new Zend_Session_Namespace('periodo');
      $idPeriodo = $periodo->periodo;

      $nota = intval($notaJson['nota']);
      try {
        $modelonotas->updatenotachocota(
          $notaJson['idNotas'],
          $nota
        );

      } catch (\Throwable $th) {
        $this->_helper->json($th);
      }
    }

    public function chocotaupdateguiaAction() {
      $this->_helper->viewRenderer->setNoRender();
      $this->_helper->layout->disableLayout();

      $json = file_get_contents('php://input');
      $evaluacion = json_decode($json, true);

      $pruebas = new Application_Model_DbTable_Pruebas();

      $db = Zend_Db_Table_Abstract::getDefaultAdapter();

      $db->beginTransaction();

      try {
        $pruebas->updateguiachocota(
          $evaluacion['idGuia'],
          $evaluacion['nombreGuia'],
          $evaluacion['fechaGuia'],
          $evaluacion['modalidad'],
          $evaluacion['tipoGuia'],
          $evaluacion['porcentajeGuia']
        );

        $db->commit();
        $this->_helper->json('success');
      } catch (\Throwable $th) {
        $db->rollBack();
        $this->_helper->json($th);
      }
    }

    public function chocotaupdateevaluacionAction() {
      $this->_helper->viewRenderer->setNoRender();
      $this->_helper->layout->disableLayout();

      $json = file_get_contents('php://input');
      $evaluacion = json_decode($json, true);

      $pruebas = new Application_Model_DbTable_Pruebas();

      $db = Zend_Db_Table_Abstract::getDefaultAdapter();

      $db->beginTransaction();

      try {

        $pruebas->updateevaluacionchocota(
          $evaluacion['idEvaluacion'],
          $evaluacion['contenido'],
          $evaluacion['fecha'],
          $evaluacion['modalidad'],
          $evaluacion['tipoEvaluacion']
        );

        $db->commit();
        $this->_helper->json('success');
      } catch (\Throwable $th) {
        $db->rollBack();
        $this->_helper->json($th);
      }
    }



    public function chocotaupdateevaluacionformativaAction() {
      $this->_helper->viewRenderer->setNoRender();
      $this->_helper->layout->disableLayout();

      $json = file_get_contents('php://input');
      $evaluacion = json_decode($json, true);

      $pruebas = new Application_Model_DbTable_Pruebas();

      $db = Zend_Db_Table_Abstract::getDefaultAdapter();

      $db->beginTransaction();
      $date = new DateTime;
      $fechacreacion = $date->format('Y-m-d H:i:s');
      $fecha = $fechacreacion;
      try {
        $pruebas->updateevaluacionformativachocota(
          $evaluacion['idGuia'],
          $evaluacion['nombreGuia'],
          // $evaluacion['fecha'],
          $evaluacion['modalidad'],
          $evaluacion['tipoEvaluacion']
        );

        $db->commit();
        $this->_helper->json('success');
      } catch (\Throwable $th) {
        $db->rollBack();
        $this->_helper->json($th);
      }
    }



    public function chocotaaddevaluacionAction() {
      $this->_helper->viewRenderer->setNoRender();
      $this->_helper->layout->disableLayout();

      $json = file_get_contents('php://input');
      $evaluacion = json_decode($json, true);

      $pruebas = new Application_Model_DbTable_Pruebas();
      $modelonotas = new Application_Model_DbTable_Notas();
      $alumnos = new Application_Model_DbTable_Alumnosactual();

      $periodo = new Zend_Session_Namespace('periodo');
      $idPeriodo = $periodo->periodo;

      $rutusuario = new Zend_Session_Namespace('id');
      $usuario = $rutusuario->id;

      $db = Zend_Db_Table_Abstract::getDefaultAdapter();

      // Iniciamos la transaccion
      $db->beginTransaction();

      try {


        $coef = 1;
        $tipoNota = 1;
        $publicar = 0;
        $idCurso = $evaluacion['idCurso'];
        $idAsignatura = $evaluacion['idAsignatura'];
        $tiempo = $evaluacion['modalidad'];
        $fecha = $evaluacion['fecha'];
        $contenido = $evaluacion['contenido'];
        $tipoEvaluacion = $evaluacion['tipoEvaluacion'];

        if (is_null($fecha)) {
          $date = new DateTime;
          $fechacreacion = $date->format('Y-m-d H:i:s');
          $fecha = $fechacreacion;
        }

        $pruebas->agregar(
            $contenido,
            $fecha,
            $idCurso,
            $idAsignatura,
            $idPeriodo,
            $usuario,
            $tiempo,
            $coef,
            $tipoNota,
            Null,
            Null,
            $publicar,
            Null,
            $tipoEvaluacion
          );
        $idprueba = $pruebas->getAdapter()->lastInsertId();

        $listaalumnos = $alumnos->listaralumnoscurso($idCurso, $idPeriodo);
        for ($i = 0; $i < count($listaalumnos); $i++) {
          $modelonotas->agregarnotaguia(
              $listaalumnos[$i]['idAlumnos'],
              $idAsignatura,
              $idCurso,
              0,
              $usuario,
              $idprueba,
              $fechacreacion,
              $idPeriodo,
              null,
              0
            );

          $idnota = $modelonotas->getAdapter()->lastInsertId();
        }

        $db->commit();
        $this->_helper->json('success');
      } catch (\Throwable $th) {
        $db->rollBack();
        $this->_helper->json($th);
      }
    }

    public function chocotaaddguiaAction() {
      $this->_helper->viewRenderer->setNoRender();
      $this->_helper->layout->disableLayout();

      $json       = file_get_contents('php://input');
      $guia = json_decode($json, true);

      $pruebas     = new Application_Model_DbTable_Pruebas();
      $modelonotas = new Application_Model_DbTable_Notas();
      $alumnos     = new Application_Model_DbTable_Alumnosactual();

      $periodo     = new Zend_Session_Namespace('periodo');
      $idPeriodo   = $periodo->periodo;

      $rutusuario  = new Zend_Session_Namespace('id');
      $idUsuario   = $rutusuario->id;

      $db = Zend_Db_Table_Abstract::getDefaultAdapter();

      // Iniciamos la transaccion
      $db->beginTransaction();
      try {

        $idPeriodo      = $guia['idPeriodo'];
        $nombreGuia     = $guia['nombreGuia'];
        $fechaGuia      = $guia['fechaGuia'];
        $idCurso        = $guia['idCurso'];
        $idAsignatura   = $guia['idAsignatura'];
        $tiempoGuia     = $guia['modalidad'];
        $tipoGuia       = $guia['tipoGuia'];
        $coef = 1;
        $tipoNota = 1;
        $publicar = 0;


        $evaluacion = $pruebas->listarguiastiempo(
                          $tipoGuia
                        , $tiempoGuia
                        , $idPeriodo
                        , $idAsignatura
                        , $idCurso
                      );

        $countEvaluacion = count($evaluacion);
        if ($countEvaluacion == 0) {
          $date = new DateTime;
          $fechacreacion = $date->format('Y-m-d H:i:s');
          $fecha = $fechacreacion;

          $pruebas->agregar(
            'Formativas',
            $fecha,
            $idCurso,
            $idAsignatura,
            $idPeriodo,
            $idUsuario,
            $tiempoGuia,
            $coef,
            $tipoNota,
            Null,
            Null,
            $publicar,
            Null,
            $tipoGuia
          );

          $idEvaluacion = $pruebas->getAdapter()->lastInsertId();

          $listaalumnos = $alumnos->listaralumnoscurso($idCurso, $idPeriodo);
          for ($i = 0; $i < count($listaalumnos); $i++) {
            $modelonotas->agregarnotaguia(
                $listaalumnos[$i]['idAlumnos'],
                $idAsignatura,
                $idCurso,
                0,
                $idUsuario,
                $idEvaluacion,
                $fechacreacion,
                $idPeriodo,
                null,
                0
              );

            $idnota = $modelonotas->getAdapter()->lastInsertId();
          }
        } else {
          $idEvaluacion = $evaluacion[0]["idEvaluacion"];
        }

        if ($tipoGuia !== 2) {
          $porcentajeGuia = $guia['porcentajeGuia'];
        } else {
          $porcentajeGuia = 40;
        }

        if (is_null($fechaGuia)) {
          $date          = new DateTime;
          $fechacreacion = $date->format('Y-m-d H:i:s');
          $fechaGuia     = $fechacreacion;
        }

        $pruebas->agregarguiaschocota(
          $nombreGuia,
          $fechaGuia,
          $idCurso,
          $idAsignatura,
          $idPeriodo,
          $idUsuario,
          $tiempoGuia,
          $idEvaluacion,
          $porcentajeGuia,
          $tipoGuia
        );
        $idGuia = $pruebas->getAdapter()->lastInsertId();

        $listaalumnos = $alumnos->listaralumnoscurso($idCurso, $idPeriodo);
        for ($i = 0; $i < count($listaalumnos); $i++) {

          $modelonotas->addnotasguia(
            0,
            $fechacreacion,
            $idPeriodo,
            $listaalumnos[$i]['idAlumnos'],
            $idUsuario,
            $idAsignatura,
            $idCurso,
            $idGuia,
            0
          );
        }

        $db->commit();
        $this->_helper->json('success');
      } catch (\Throwable $th) {
        $db->rollBack();
        $this->_helper->json($th);
      }
    }

    public function chocotaremoveguiaAction() {
      $cargo = new Zend_Session_Namespace('cargo');
      $rol = $cargo->cargo;
      if ($rol == '2') {
        $json       = file_get_contents('php://input');
        $evaluacion = json_decode($json, true);
        $idGuia     = $evaluacion['idGuia'];

        $modelonotas = new Application_Model_DbTable_Notas();
        $pruebas = new Application_Model_DbTable_Pruebas();
        // Si es la última guia asociada a su Evaluación, borrar evaluación

        $guia = $pruebas->getguiaid($idGuia);
        $idEvaluacion = $guia[0]['idEvaluacionGuia'];
        $guias = $pruebas->getguiaidev($idEvaluacion);
        $cantidadGuias = count($guias);

        $modelonotas->borrarnotasguia($idGuia);
        $pruebas->borrarguia($idGuia);
        if ($cantidadGuias === 1) {
          // Borrar evaluación y notas de evaluación
          $modelonotas->borrar($idEvaluacion);
          $pruebas->borrar($idEvaluacion);
        }

        $this->_helper->json('success');
      }
    }

    public function chocotaremoveevaluacionAction() {
      $cargo = new Zend_Session_Namespace('cargo');
      $rol = $cargo->cargo;
      if ($rol == '2') {
        $json       = file_get_contents('php://input');
        $evaluacion = json_decode($json, true);
        $idEvaluacion     = $evaluacion['idEvaluacion'];

        $modelonotas = new Application_Model_DbTable_Notas();
        $pruebas = new Application_Model_DbTable_Pruebas();

        $guias = $pruebas->getguiaidev($idEvaluacion);
        try {
          foreach ($guias as $key => $guia) {
            $modelonotas->borrarnotasguia($guia['idGuia']);
          }
          $pruebas->borrarguiaidev($idEvaluacion);

          $modelonotas->borrar($idEvaluacion);
          $pruebas->borrar($idEvaluacion);

          $this->_helper->json('success');
        } catch (\Throwable $th) {
          $this->_helper->json('error');
        }

      }
    }

    public function chocotaabrirevaluacionesAction() {
      $idEvaluacion = $this->_getParam('idEvaluacion', 0);
      $nombreNota = $this->_getParam('nombreNota', 1);

      $periodo = new Zend_Session_Namespace('periodo');
      $idPeriodo = $periodo->periodo;

      $curso = new Zend_Session_Namespace('id_curso');
      $idCurso = $curso->id_curso;

      $usuario = new Zend_Session_Namespace('id');
      $idUsuario = $usuario->id;

      $modelalumnosactual = new Application_Model_DbTable_Alumnosactual();
      $modelcurso = new Application_Model_DbTable_Cursos();
      $pruebas = new Application_Model_DbTable_Pruebas();

      $this->view->nombre_nota = $nombreNota;
      $this->view->id_evaluacion = $idEvaluacion;
      $this->view->evaluacion = $pruebas->listapruebachocota(
                                  $idEvaluacion,
                                  $idCurso,
                                  $idPeriodo
                                );

      $this->view->alumnos =  $modelalumnosactual->listaralumnoscursoactual(
                                $idCurso,
                                $idPeriodo
                              );

      $this->view->listaasignatura =  $modelcurso->getasignaturashorario(
                                        $idCurso,
                                        $idPeriodo,
                                        $idUsuario
                                      );

    }

    // TODO:
    public function chocotaabrirformativaAction() {
      $idAsignaturaSelected = $this->_getParam('idAsignaturaSelected', 0);
      $nombreAsignaturaSelected = $this->_getParam('nombreAsignaturaSelected', 1);

      //Extraemos el periodo
      $periodo = new Zend_Session_Namespace('periodo');
      $idPeriodo = $periodo->periodo;

      $curso = new Zend_Session_Namespace('id_curso');
      $idCurso = $curso->id_curso;

      $usuario = new Zend_Session_Namespace('id');
      $idUsuario = $usuario->id;

      $modelalumnosactual = new Application_Model_DbTable_Alumnosactual();
      $modelcurso = new Application_Model_DbTable_Cursos();
      $pruebas = new Application_Model_DbTable_Pruebas();

      $this->view->nombre_asignatura_selected = $nombreAsignaturaSelected;
      $this->view->id_asignatura_selected = $idAsignaturaSelected;

      // $this->view->evaluacion = $pruebas->listapruebachocota(
      //                             $idEvaluacion,
      //                             $idCurso,
      //                             $idPeriodo
      //                           );

      $this->view->alumnos =  $modelalumnosactual->listaralumnoscursoactual(
                                $idCurso,
                                $idPeriodo
                              );

      $this->view->listaasignatura =  $modelcurso->getasignaturashorario(
                                        $idCurso,
                                        $idPeriodo,
                                        $idUsuario
                                      );
      //Seteamos las opciones del establecimiento
    }


    public function chocotagetevaluacionesformativascursoAction() {
      $this->_helper->viewRenderer->setNoRender();
      $this->_helper->layout->disableLayout();

      $idPeriodo = $this->_getParam('idPeriodo', 0);
      $idCurso = $this->_getParam('idCurso', 1);

      $pruebas = new Application_Model_DbTable_Pruebas();
      $evaluaciones = $pruebas->listapruebasformativaschocota(
                        $idCurso,
                        $idPeriodo
                      );

      $evaluacionesArray = array();

      foreach ($evaluaciones as $key => $evaluacion) {
        if (!is_null($evaluacion['tipoEvaluacion'])) {
          array_push($evaluacionesArray, $evaluacion);
        }
      }
      $this->_helper->json($evaluacionesArray);
    }

    public function chocotaupdatenotasformativasAction() {
      $this->_helper->viewRenderer->setNoRender();
      $this->_helper->layout->disableLayout();

      $json = file_get_contents('php://input');
      $notaFormativaJson = json_decode($json, true);
      $modelonotas = new Application_Model_DbTable_Notas();

      try {
        $notasFormativas = $modelonotas->getnotastrimestrechocota(
          $notaFormativaJson['idNota'],
          $notaFormativaJson['idNotaGuia']
        );

        if (count($notasFormativas) !== 0) {
          $largoNotas = count($notasFormativas);
          $sumaNotas = 0;
          $divisorNotas = 0;
          for ($i = 0; $i < $largoNotas; $i++) {
            $notaFormativa = $notasFormativas[$i];
            if ($notaFormativa['nota_1'] > 0) {
              $sumaNotas = $sumaNotas + $notaFormativa['nota_1'];
              $divisorNotas = $divisorNotas + 1;
            }
          }

          $sumaNotasFinal = $sumaNotas + $notaFormativaJson['nota'];
          $countDivisor = $divisorNotas + 1;
          $promedioFormativa = $sumaNotasFinal / $countDivisor;
        } else {
          $promedioFormativa = $notaFormativaJson['nota'];
        }

        $promedioFormativaSinAproximar = bcdiv($promedioFormativa, '1', 0);
        $modelonotas->updatenotachocota(
          $notaFormativaJson['idNota'],
          $promedioFormativaSinAproximar
        );
        $modelonotas->updatenotaguiachocota(
          $notaFormativaJson['idNotaGuia'],
          $notaFormativaJson['nota']
        );

        $this->_helper->json('success');
      } catch (\Throwable $th) {
        $this->_helper->json($th);
      }
    }
}
