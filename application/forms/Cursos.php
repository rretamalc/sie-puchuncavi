<?php

class Application_Form_Cursos extends Zend_Form
{

    public function init()
    {

           //recuperamos el nombre del usuario que esta en sesion
      $usuario= new Zend_Session_Namespace('establecimiento');
      //
      $establecimiento= $usuario->establecimiento;

       //recuperamos el nombre del usuario que esta en sesion
      $cargo= new Zend_Session_Namespace('cargo');
      //
      $rol= $cargo->cargo;

        $this->setName('Cursos');

        // form decorators
        $this->setDecorators(array(
        'FormElements',
        array('HtmlTag',array('tag' => 'table')),
        'Form'
        ));

      $nivel = new Zend_Form_Element_Select('idNiveles');
      $nivel->setDecorators(array(
        'ViewHelper',
        array('Errors'),
        array(array('data' => 'HtmlTag'), array('tag' => 'td', 'class' => 'element')),
        array('Label', array('tag' => 'td')),
        array(array('row' => 'HtmlTag'), array('tag' => 'tr')),
        ));
      $nivel->setLabel('Seleccione Nivel: ')->setRequired(true);
      $nivel->setAttrib('id', 'nivel');
      $nivel->addMultiOptions(array(
        "" => "Seleccione Nivel"
    ));

      $nivelModel = new Application_Model_DbTable_Nivel();
      $rowsetnivel = $nivelModel->listarnivel();
      foreach($rowsetnivel as $row){
         $nivel->addMultiOption($row->idNiveles, $row->nombreNiveles);
      }

        //campo <input hidden> para guardar idPeriodo
        $idcurso = new Zend_Form_Element_Hidden('idCursos');
        $idcurso->addValidator('digits');


        //creamos <input text> para escribir fecha periodo

        $nombrecurso = new Zend_Form_Element_Text('nombreCursos');
        $nombrecurso->setLabel('Nombre Curso:')->setRequired(true);
        $nombrecurso->setDecorators(array(
        'ViewHelper',
        array('Errors'),
        array(array('data' => 'HtmlTag'), array('tag' => 'td', 'class' => 'element')),
        array('Label', array('tag' => 'td')),
        array(array('row' => 'HtmlTag'), array('tag' => 'tr')),
        ));

        $cantidad = new Zend_Form_Element_Text('cantidad');
        $cantidad->setLabel('Cantidad Alumnos:')->setRequired(true);
        $cantidad->setDecorators(array(
        'ViewHelper',
        array('Errors'),
        array(array('data' => 'HtmlTag'), array('tag' => 'td', 'class' => 'element')),
        array('Label', array('tag' => 'td')),
        array(array('row' => 'HtmlTag'), array('tag' => 'tr')),
        ));

           //creamos select donde se carga la lista de asignaturas
      $establecimientoSelect = new Zend_Form_Element_Select('idEstablecimiento');
      $establecimientoSelect->setDecorators(array(
    'ViewHelper',
     array('Errors'),
    array(array('data' => 'HtmlTag'), array('tag' => 'td', 'class' => 'element')),
    array('Label', array('tag' => 'td')),
    array(array('row' => 'HtmlTag'), array('tag' => 'tr')),
));
      $establecimientoSelect->setLabel('Establecimiento: ');
      $establecimientoSelect->setAttrib('id', 'establecimiento');

      $asignaturaModel = new Application_Model_DbTable_Establecimiento();
       if($rol=='4' || $rol=='3' || $rol=='6'){
        $establecimientoSelect->addMultiOptions(array(
        "" => "Seleccione Establecimiento"
    ));
        foreach ($asignaturaModel->listarestablecimiento($establecimiento) as $c)
        {


            $establecimientoSelect->addMultiOption($c->idEstablecimiento,$c->nombreEstablecimiento);
        }
        }

          if($rol=='1'){
        $establecimientoSelect->addMultiOptions(array(
        "" => "Seleccione Establecimiento"
    ));
        foreach ($asignaturaModel->listar() as $c)
        {


            $establecimientoSelect->addMultiOption($c->idEstablecimiento,$c->nombreEstablecimiento);
        }
        }

        //boton para enviar formulario
        $submit = new Zend_Form_Element_Submit('submit');
        $submit->setAttrib('idcurso', 'submitbutton');
        $submit->setDecorators(array(
        'ViewHelper',
        array('Errors'),
        array(array('data' => 'HtmlTag'), array('tag' => 'td', 'class' => 'element')),
        array('Label', array('tag' => 'td')),
        array(array('row' => 'HtmlTag'), array('tag' => 'tr')),
        ));

        //boton volver
        $join = new Zend_Form_Element_Button('join');
        $join->setDecorators(array(
        'ViewHelper',
        array('Errors'),
        array(array('data' => 'HtmlTag'), array('tag' => 'td', 'class' => 'element')),
        array('Label', array('tag' => 'td')),
        array(array('row' => 'HtmlTag'), array('tag' => 'tr')),
        ));
        $join->setLabel('Volver')
            ->setAttrib('onclick','window.location =\''.$this->getView()->url(array('controller'=>'Cursos','action'=>'index'),null, TRUE).'\' ');

        //agrego los objetos creados al formulario
        $this->addElements(array($idcurso,$nombrecurso,$cantidad,$establecimientoSelect,$nivel,$submit));
        $this->addElements(array($join));
    }




}

