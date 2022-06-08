<?php

class Application_Model_DbTable_Pruebas extends Zend_Db_Table_Abstract
{

    protected $_name = 'evaluaciones';


    public function get($id)
    {

        $row = $this->fetchRow('idEvaluacion  = ' . $id);
        if (!$row) {
            throw new Exception("No se Encuentra el dato $id");
        }

        return $row->toArray();
    }

    public function validar($contenido, $tiempo, $fecha, $idcurso, $idasignatura, $idperiodo)
    {
        $select = $this->select();
        $select->setIntegrityCheck(false);
        $select->from(array('a' => 'evaluaciones'), '*');
        $select->where('a.contenido = ?', $contenido);
        $select->where('a.tiempo = ?', $tiempo);
        $select->where('a.fechaEvaluacion = ?', $fecha);
        $select->where('a.idAsignatura = ?', $idasignatura);
        $select->where('a.idCursos = ?', $idcurso);
        $select->where('a.idPeriodo = ?', $idperiodo);
        $stmt = $select->query();
        $result = $stmt->fetchAll();

        if (!$result) {
            return true;
        } else {
            return false;
        }

    }


    public function agregar($contenido, $fecha, $id_curso, $asignatura, $periodo, $usuario, $tiempo, $coef, $tiponota, $criterio, $porcentaje, $publicar,$idguia, $tipoEvaluacion)
    {
        $data = array('contenido' => $contenido, 'fechaEvaluacion' => $fecha, 'idCursos' => $id_curso, 'idAsignatura' => $asignatura, 'idPeriodo' => $periodo, 'idCuenta' => $usuario, 'estadoev' => '0', 'tiempo' => $tiempo, 'coef' => $coef,
            'tipoNota' => $tiponota, 'criterio' => $criterio, 'porcentajeExamen' => $porcentaje,'publicar'=>$publicar,'idGuia'=>$idguia, 'tipoEvaluacion' => $tipoEvaluacion);
        $this->insert($data);


    }

    public function agregarguias($descripcion,$fecha, $id_curso, $asignatura, $periodo, $usuario, $tiempo,$idevaluacion)
    {
        $db = new Zend_Db_Table('guiasevaluacion');
        $data = array('nombreguia' => $descripcion,'fechaGuia'=>$fecha,'idCursos'=>$id_curso,'idAsignatura'=>$asignatura,'idPeriodo'=>$periodo,'idCuenta'=>$usuario,'tiempoGuia'=>$tiempo,'idEvaluacionGuia'=>$idevaluacion);
        $db->insert($data);

    }

    public function agregarguiaschocota(
        $nombreguia,
        $fechaGuia,
        $idCursos,
        $idAsignatura,
        $idPeriodo,
        $idUsuario,
        $tiempoGuia,
        $idEvaluacion,
        $porcentajeGuia,
        $tipoGuia
    ) {
        $db = new Zend_Db_Table('guiasevaluacion');
        $data = array(
            'nombreguia' => $nombreguia,
            'fechaGuia' => $fechaGuia,
            'idCursos' => $idCursos,
            'idAsignatura' => $idAsignatura,
            'idPeriodo' => $idPeriodo,
            'idCuenta' => $idUsuario,
            'tiempoGuia' => $tiempoGuia,
            'idEvaluacionGuia' => $idEvaluacion,
            'porcentajeGuia' => $porcentajeGuia,
            'tipoGuia' => $tipoGuia
        );
        $db->insert($data);

    }



    public function cambiar($id, $contenido, $fecha, $tiempo, $coef)
    {
        $data = array('contenido' => $contenido, 'fechaEvaluacion' => $fecha, 'tiempo' => $tiempo, 'coef' => $coef);

        $this->update($data, 'idEvaluacion = ' . (int)$id);

    }

    public function cambiarexamen($id, $contenido, $tiempo, $criterio, $porcentaje)
    {
        $data = array('contenido' => $contenido, 'tiempo' => $tiempo, 'criterio' => $criterio, 'porcentajeExamen' => $porcentaje);

        $this->update($data, 'idEvaluacion = ' . (int)$id);

    }

    public function cambiarcoef($id, $contenido, $coef)
    {
        $data = array('contenido' => $contenido, 'coef' => $coef);
        $this->update($data, 'idEvaluacion = ' . (int)$id);

    }

    public function actualizaestado($id)
    {
        $data = array('estadoev' => '1');
        $this->update($data, 'idEvaluacion = ' . (int)$id);


    }

    public function actualizarestados($id)
    {
        $data = array('estadoev' => '0');
        $this->update($data, 'idEvaluacion = ' . (int)$id);


    }

    public function actualizaestadoeliminar($id,$estado)
    {
        $data = array('estadoev' => $estado);
        $this->update($data, 'idEvaluacion = ' . (int)$id);


    }

    public function actualizarpublicar($id,$estado)
    {
        $data = array('publicar' => $estado);
        $this->update($data, 'idEvaluacion = ' . (int)$id);


    }

    public function listarbasicauser($rut, $curso, $periodo)
    {
        $select = $this->select();
        $select->setIntegrityCheck(false);
        $select->from(array('a' => 'evaluaciones'), '*');
        $select->join(array('c' => 'cursos'),
            'c.idCursos = a.idCursos');
        $select->join(array('as' => 'asignaturas'),
            'as.idAsignatura = a.idAsignatura');
        $select->where('a.idCuenta = ?', $rut);
        $select->where('c.idCursos = ?', $curso);
        $select->where('a.idPeriodo = ?', $periodo);
        $select->where('as.estado = 1');
        $select->where('a.estadoev != 9');
        $stmt = $select->query();
        $result = $stmt->fetchAll();

        return $result;

    }


    public function getpruebas($curso, $periodo, $asignatura)
    {

        //devuelve todos los registros de la tabla
        $select = $this->select();
        $select->setIntegrityCheck(false);
        $select->from(array('a' => 'evaluaciones'), '*');
        $select->where('a.idCursos = ?', $curso);
        $select->where('a.idPeriodo = ?', $periodo);
        $select->where('a.idAsignatura = ?', $asignatura);
        $select->where('a.estadoev != 9');
        //$select->where('as.estado = 1');
        $stmt = $select->query();
        $result = $stmt->fetchAll();

        return $result;

    }

    public function listapruebas($curso, $periodo)
    {

        $select = $this->select();
        $select->setIntegrityCheck(false);
        $select->from(array('a' => 'evaluaciones'), '*');
        $select->where('a.idCursos = ?', $curso);
        $select->where('a.idPeriodo = ?', $periodo);
        $select->where('a.estadoev != 9');
        //$select->where('a.idAlumnos NOT in (?)', array('1551'));
        //$select->where('a.estadoev = 1' );
        $stmt = $select->query();
        $result = $stmt->fetchAll();

        return $result;

    }

    public function listaradmin($curso, $periodo)
    {
        $select = $this->select();
        $select->setIntegrityCheck(false);
        $select->from(array('a' => 'evaluaciones'), '*');
        $select->join(array('c' => 'cursos'),
            'c.idCursos = a.idCursos');
        $select->join(array('as' => 'asignaturas'),
            'as.idAsignatura = a.idAsignatura');
        $select->where('c.idCursos = ?', $curso);
        $select->where('a.idPeriodo = ?', $periodo);
        $select->where('as.estado = 1');
        $select->where('a.estadoev != 9');
        $stmt = $select->query();
        $result = $stmt->fetchAll();

        return $result;

    }

    public function gettotalpruebascurso($curso, $periodo)
    {

        $select = $this->select();
        $select->setIntegrityCheck(false);
        $select->from(array('a' => 'evaluaciones'), '*');
        $select->where('a.idCursos = ?', $curso);
        $select->where('a.idPeriodo = ?', $periodo);
        $select->where('a.estadoev != 9');
        $select->order('a.fechaEvaluacion');
        $stmt = $select->query();
        $result = $stmt->fetchAll();

        return $result;

    }

    public function gettotalpruebascursocuenta($curso, $periodo, $idcuenta, $idasignatura)
    {

        $select = $this->select();
        $select->setIntegrityCheck(false);
        $select->from(array('a' => 'evaluaciones'), '*');
        $select->where('a.idCursos = ?', $curso);
        $select->where('a.idPeriodo = ?', $periodo);
        $select->where('a.idCuenta = ?', $idcuenta);
        $select->where('a.idAsignatura = ?', $idasignatura);
        $select->where('a.estadoev != 9');
        $select->order('a.fechaEvaluacion');
        $stmt = $select->query();
        $result = $stmt->fetchAll();

        return $result;

    }

    public function getpruebaspre($rut, $curso, $periodo)
    {

        $select = $this->select();
        $select->setIntegrityCheck(false);
        $select->from(array('a' => 'evaluaciones'), '*');
        $select->join(array('c' => 'cursos'), 'c.idCursos = a.idCursos');
        $select->join(array('as' => 'asignaturas'), 'as.idAsignatura = a.idAsignatura', array('idAsignatura', 'nombreAsignatura', 'idNiveles'));

        $select->where('a.idCuenta = ?', $rut);
        $select->where('a.idCursos = ?', $curso);
        $select->where('a.idPeriodo = ?', $periodo);
        $select->where('a.estadoev != 9');
        $stmt = $select->query();
        $result = $stmt->fetchAll();

        return $result;
    }

    public function listapruebasasignatura($idasignatura, $curso, $periodo)
    {

        $examenes= new Zend_Session_Namespace('examen');
        $examen = $examenes->examen;
        if($examen==1){
            $tipos=array(1,2);

        }else{
            $tipos=array(1);
        }

        $select = $this->select();
        $select->setIntegrityCheck(false);
        $select->from(array('a' => 'evaluaciones'), '*');
        $select->where('a.idAsignatura = ?', $idasignatura);
        $select->where('a.idCursos = ?', $curso);
        $select->where('a.idPeriodo = ?', $periodo);
        $select->where('a.tipoNota IN(?)', $tipos);
        $select->where('a.estadoev != 9');
        $select->order("a.tiempo");
        $select->order("a.fechaEvaluacion");
        $select->order("a.idEvaluacion");
        $stmt = $select->query();
        $result = $stmt->fetchAll();

        return $result;

    }


    public function getexamen($curso, $periodo, $asignatura,$segmento)
    {

        //devuelve todos los registros de la tabla
        $select = $this->select();
        $select->setIntegrityCheck(false);
        $select->from(array('a' => 'evaluaciones'), '*');
        $select->where('a.idCursos = ?', $curso);
        $select->where('a.idPeriodo = ?', $periodo);
        $select->where('a.idAsignatura = ?', $asignatura);
        $select->where('a.tiempo = ?', $segmento);
        $select->where('a.estadoev != 9');
        //$select->where('as.estado = 1');
        $select->order('a.idEvaluacion DESC');
        $stmt = $select->query();
        $result = $stmt->fetchAll();

        return $result;

    }


    public function cambiarguia($id, $descripcion)
    {

        $db = new Zend_Db_Table('guiasevaluacion');
        $data = array('nombreguia' => $descripcion);
        $db->update($data, 'idGuia = ' . (int)$id);

    }



    public function listarguias($idasignatura, $curso, $periodo)
    {

        $tipos=array(1);
        $select = $this->select();
        $select->setIntegrityCheck(false);
        $select->from(array('a' => 'evaluaciones'), '*');
        $select->where('a.idAsignatura = ?', $idasignatura);
        $select->where('a.idCursos = ?', $curso);
        $select->where('a.idPeriodo = ?', $periodo);
        $select->where('a.tipoNota IN(?)', $tipos);
        $select->where('a.idGuia >0');
        $select->order("a.tiempo");
        $select->order("a.fechaEvaluacion");
        $select->order("a.idEvaluacion");
        $stmt = $select->query();
        $result = $stmt->fetchAll();

        return $result;

    }

    public function listarguiastiempo(
          $tipoEvaluacion
        , $tiempo
        , $idPeriodo
        , $idAsignatura
        , $idCurso)
    {

        $tipos=array(1);
        $select = $this->select();
        $select->setIntegrityCheck(false);
        $select->from(array('a' => 'evaluaciones'), '*');
        $select->where('a.tipoEvaluacion = ?', $tipoEvaluacion);
        $select->where('a.tiempo = ?', $tiempo);
        $select->where('a.idPeriodo = ?', $idPeriodo);
        $select->where('a.idAsignatura = ?', $idAsignatura);
        $select->where('a.idCursos = ?', $idCurso);
        $select->order("a.tiempo");
        $select->order("a.fechaEvaluacion");
        $select->order("a.idEvaluacion");
        $stmt = $select->query();
        $result = $stmt->fetchAll();

        return $result;

    }

    public function getguia($idevaluacion)
    {

        $select = $this->select();
        $select->setIntegrityCheck(false);
        $select->from(array('a' => 'evaluaciones'), '*');
        $select->where('a.idEvaluacion = ?', $idevaluacion);
        //$select->where('a.idGuia >0');
        $stmt = $select->query();
        $result = $stmt->fetchAll();

        return $result;

    }


    public function agregarevaluacionguia($contenido, $fecha, $id_curso, $asignatura, $periodo, $usuario, $tiempo, $coef, $tiponota, $criterio, $porcentaje, $publicar)
    {
        $data = array('contenido' => $contenido, 'fechaEvaluacion' => $fecha, 'idCursos' => $id_curso, 'idAsignatura' => $asignatura, 'idPeriodo' => $periodo, 'idCuenta' => $usuario, 'estadoev' => '10', 'tiempo' => $tiempo, 'coef' => $coef,
            'tipoNota' => $tiponota, 'criterio' => $criterio, 'porcentajeExamen' => $porcentaje,'publicar'=>$publicar);
        $this->insert($data);


    }



    public function validarpruebaguia($contenido, $tiempo,  $idcurso, $idasignatura, $idperiodo)
    {
        $select = $this->select();
        $select->setIntegrityCheck(false);
        $select->from(array('a' => 'evaluaciones'), '*');
        $select->where('a.contenido = ?', $contenido);
        $select->where('a.tiempo = ?', $tiempo);
        $select->where('a.idAsignatura = ?', $idasignatura);
        $select->where('a.idCursos = ?', $idcurso);
        $select->where('a.idPeriodo = ?', $idperiodo);
        $stmt = $select->query();
        $result = $stmt->fetchAll();

        if (!$result) {
            return false;
        } else {
            return $result;
        }

    }

    public function listarguia($idasignatura, $curso, $periodo, $tiempo)
    {

        $select = $this->select();
        $select->setIntegrityCheck(false);
        $select->from(array('a' => 'guiasevaluacion'), '*');
        $select->where('a.idAsignatura = ?', $idasignatura);
        $select->where('a.idCursos = ?', $curso);
        $select->where('a.idPeriodo = ?', $periodo);
        //$select->where('a.tiempoGuia= ?', $tiempo);
        $select->order("a.tiempoGuia");
        $select->order("a.fechaGuia");
        $select->order("a.idGuia");
        $stmt = $select->query();
        $result = $stmt->fetchAll();

        return $result;

    }

    public function getguiaalumnosegsem($idAsignatura, $idalumno,$idperiodo) {
        $select = $this->select();
        $select->setIntegrityCheck(false);
        $select->from(array('g' => 'guiasevaluacion'), '*');
        $select->join(array('v' => 'valoresGuia'), 'v.idGuia = g.idGuia');
        $select->where('v.idAlumnos = ?', $idalumno);
        $select->where('g.idAsignatura= ?', $idAsignatura);
        $select->where('g.idPeriodo= ?', $idperiodo);
        $select->where('g.tiempoGuia = 2');

        $stmt = $select->query();
        $result = $stmt->fetchAll();

        return $result;
    }
    public function getguiaalumno($idevaluacion,$idalumno,$idperiodo)
    {

        $select = $this->select();
        $select->setIntegrityCheck(false);
        $select->from(array('g' => 'guiasevaluacion'), '*');
        $select->join(array('v' => 'valoresGuia'), 'v.idGuia = g.idGuia');
        $select->where('v.idAlumnos = ?', $idalumno);
        $select->where('g.idPeriodo= ?', $idperiodo);
        $select->where('g.idEvaluacionGuia = ?', $idevaluacion);
        $select->group('g.idGuia');
        $stmt = $select->query();
        $result = $stmt->fetchAll();

        return $result;

    }

    public function getguiaid($id)
    {

        $select = $this->select();
        $select->setIntegrityCheck(false);
        $select->from(array('g' => 'guiasevaluacion'), '*');
        $select->where('g.idGuia = ?', $id);
        //$select->where('a.idGuia >0');
        $stmt = $select->query();
        $result = $stmt->fetchAll();

        return $result;

    }




    public function getguiaidev($idevaluacion)
    {

        $select = $this->select();
        $select->setIntegrityCheck(false);
        $select->from(array('a' => 'guiasevaluacion'), '*');
        $select->where('a.idEvaluacionGuia = ?', $idevaluacion);
        $stmt = $select->query();
        $result = $stmt->fetchAll();
        return $result;

    }

    public function validarpre($tiempo, $idcurso, $idasignatura, $idperiodo)
    {
        $select = $this->select();
        $select->setIntegrityCheck(false);
        $select->from(array('a' => 'evaluaciones'), '*');
        $select->where('a.tiempo = ?', $tiempo);
        $select->where('a.idAsignatura = ?', $idasignatura);
        $select->where('a.idCursos = ?', $idcurso);
        $select->where('a.idPeriodo = ?', $idperiodo);
        $stmt = $select->query();
        $result = $stmt->fetchAll();

        if (!$result) {
            return true;
        } else {
            return false;
        }

    }

    public function listarguiaspre($idasignatura, $curso, $periodo)
    {

        $tipos=array(1);
        $select = $this->select();
        $select->setIntegrityCheck(false);
        $select->from(array('a' => 'evaluaciones'), '*');
        $select->join(array('as' => 'asignaturascursos'), 'as.idAsignatura = a.idAsignatura');
        $select->where('as.idNucleo = ?', $idasignatura);
        $select->where('a.idCursos = ?', $curso);
        $select->where('a.idPeriodo = ?', $periodo);
        $select->where('a.tipoNota IN(?)', $tipos);
        $select->where('a.idGuia >0');
        $select->order("a.tiempo");
        $select->order("a.fechaEvaluacion");
        $select->order("a.idEvaluacion");
        $stmt = $select->query();
        $result = $stmt->fetchAll();

        return $result;

    }

    public function listapruebaschocota($curso, $periodo) {

        $select = $this->select();
        $select->setIntegrityCheck(false);
        $select->from(array('a' => 'evaluaciones'),  array(
            'idEvaluacion',
            'contenido',
            'fechaEvaluacion',
            'idCursos',
            'idAsignatura',
            'idPeriodo',
            'tipoEvaluacion',
            'tiempo',
            'porcentajeExamen'
        ));
        $select->where('a.idCursos = ?', $curso);
        $select->where('a.idPeriodo = ?', $periodo);
        $select->where('a.estadoev != 9');
        $select->order('a.idEvaluacion');
        $stmt = $select->query();
        $result = $stmt->fetchAll();

        return $result;

    }

    public function listaguiaschocota($curso, $periodo, $tipoGuia) {

        $select = $this->select();
        $select->setIntegrityCheck(false);
        $select->from(array('ge' => 'guiasevaluacion'),  array(
            'idGuia',
            'nombreguia',
            'fechaGuia',
            'idCursos',
            'idAsignatura',
            'idPeriodo',
            'tiempoGuia',
            'tipoGuia',
            'porcentajeGuia',
            'idEvaluacionGuia'
        ));
        $select->where('ge.idCursos = ?', $curso);
        $select->where('ge.idPeriodo = ?', $periodo);
        // $select->where('ge.idEvaluacionGuia = ?', $idEvaluacionGuia);
        if ($tipoGuia === 'Formativa') {
            $select->where('ge.tipoGuia = ?', 2);
        }
        $select->order('ge.tipoGuia');
        $stmt = $select->query();
        $result = $stmt->fetchAll();

        return $result;

    }

    // TODO:
    public function updateguiachocota(
        $idGuia,
        $nombreGuia,
        $fechaGuia,
        $tiempoGuia,
        $tipoGuia,
        $porcentajeGuia
    ) {
        $db = new Zend_Db_Table('guiasevaluacion');
        $data = array(
            'nombreguia' => $nombreGuia,
            'fechaGuia' => $fechaGuia,
            'tiempoGuia' => $tiempoGuia,
            'tipoGuia' => $tipoGuia,
            'porcentajeGuia' => $porcentajeGuia,
        );

        $db->update($data, 'idGuia = ' . (int)$idGuia);

    }

    public function updateevaluacionchocota(
        $idEvaluacion,
        $contenido,
        $fecha,
        $tiempo
        // $tipoEvaluacion
    ) {
        $data = array(
            'contenido' => $contenido,
            'fechaEvaluacion' => $fecha,
            'tiempo' => $tiempo,
            // 'tipoEvaluacion' => $tipoEvaluacion
        );

        $this->update($data, 'idEvaluacion = ' . (int)$idEvaluacion);

    }

    public function updateevaluacionformativachocota(
        $idGuia,
        $nombreGuia,
        // $fechaGuia,
        $tiempoGuia
    ) {
        $db = new Zend_Db_Table('guiasevaluacion');
        $data = array(
            'nombreguia' => $nombreGuia,
            // 'fechaGuia' => $fechaGuia,
            'tiempoGuia' => $tiempoGuia
        );

        $db->update($data, 'idGuia = ' . (int)$idGuia);

    }


    public function listapruebachocota($idEvaluacion, $idCurso, $periodo) {
        $select = $this->select();
        $select->setIntegrityCheck(false);
        $select->from(array('ev' => 'evaluaciones'),  array(
            'contenido',
            'idCursos',
            'idAsignatura',
            'tiempo',
        ));
        $select->where('ev.idEvaluacion = ?', $idEvaluacion);
        $select->where('ev.idPeriodo = ?', $periodo);
        $select->where('ev.idCursos = ?', $idCurso);
        $stmt = $select->query();
        $result = $stmt->fetchAll();

        return $result;
    }


    public function listapruebasformativaschocota($curso, $periodo) {
        $select = $this->select();
        $select->setIntegrityCheck(false);
        $select->from(array('ge' => 'guiasevaluacion'),  array(
            'idGuia',
            'nombreGuia',
            'fechaGuia',
            'idCursos',
            'idAsignatura',
            'idPeriodo',
            'tiempoGuia',
        ));
        $select->joinLeft(array('ev' => 'evaluaciones'),
            'ev.idEvaluacion = ge.idEvaluacionGuia', array(
                'idEvaluacion',
                'tipoEvaluacion',
                'porcentajeExamen'
            )
        );
        $select->where('ge.idCursos = ?', $curso);
        $select->where('ge.idPeriodo = ?', $periodo);
        $select->where('ev.estadoev != 9');
        $select->where('ev.tipoEvaluacion = 2');
        $select->order('ev.tipoEvaluacion');
        $stmt = $select->query();
        $result = $stmt->fetchAll();

        return $result;
    }

    public function getevaluacion(
        $idCurso,
        $idAsignatura,
        $idPeriodo,
        $tipoEvaluacion,
        $tiempo
    ) {
        $select = $this->select();
        $select->setIntegrityCheck(false);
        $select->from(array('evaluaciones'),  array(
            'idEvaluacion',
        ));
        $select->where('idCursos = ?', $idCurso);
        $select->where('idPeriodo = ?', $idPeriodo);
        $select->where('idAsignatura = ?', $idAsignatura);
        $select->where('tipoEvaluacion = ?', $tipoEvaluacion);
        $select->where('tiempo = ?', $tiempo);
        $select->where('estadoev != 9');
        $stmt = $select->query();
        $result = $stmt->fetchAll();

        return $result;
    }


    public function borrar($idEvaluacion)
    {
        $this->delete('idEvaluacion =' . (int)$idEvaluacion);
    }

    public function borrarguia($id)
    {
        $db = new Zend_Db_Table('guiasevaluacion');
        $db->delete('idGuia =' . (int)$id);
    }



    public function borrarguiaidev($id)
    {
        $db = new Zend_Db_Table('guiasevaluacion');
        $db->delete('idEvaluacionGuia =' . (int)$id);
    }

}
