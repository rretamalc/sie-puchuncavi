<?php

class AsignaturasController extends Zend_Controller_Action
{

    public function init()
    {
        $this->initView();
        $this->view->baseUrl = $this->_request->getBaseUrl();
    }

    public function indexAction()
    {
        //creo objeto que maneja la tabla Asignaturas
         $table = new Application_Model_DbTable_Nivel();
         
        //obtengo listado de todas las filas de la tabla, y las
        //coloco en la variable datos de la pagina web (de la vista) 
        //que vamos a mostrar
        
         



       $this->view->dato= $table->listar();
    }

     public function asignaturasAction()
    {
        $idnivel = $this->_getParam('id', 0);
        //creo objeto que maneja la tabla Asignaturas
         $table = new Application_Model_DbTable_Asignaturas();
         
        //obtengo listado de todas las filas de la tabla, y las
        //coloco en la variable datos de la pagina web (de la vista) 
        //que vamos a mostrar
        $datos=$table->listar($idnivel);
         

       
       $this->view->title = $datos[0][nombreNiveles];  

       $this->view->dato= $datos;
    }

    public function agregarAction()
    {

        $idnivel = $this->_getParam('id', 0);
        $asignaturas = new Application_Model_DbTable_Asignaturas();

        $datos=$asignaturas->ultimo($idnivel);
        //titulo para la pagina
        $this->view->title = "Agregar Asignatura";
        //valor para <head><title>
        $this->view->headTitle($this->view->title);
        //creo el formulario
        $form = new Application_Form_Asignaturas(array('params' => $idnivel) );
            
        if($idnivel==14 || $idnivel==15){

             //creamos elementos nuevos
        $form->addElement('hidden', 'idNiveles');
        $form->addElement('Text', 'orden',array('order' => 3));
        $form->orden->setLabel('Orden: ')->setRequired(true);
        $form->orden->setDecorators(array(
        'ViewHelper',
        array('Errors'),
        array(array('data' => 'HtmlTag'), array('tag' => 'td', 'class' => 'element')),
        array('Label', array('tag' => 'td')),
        array(array('row' => 'HtmlTag'), array('tag' => 'tr')),
        ));
        

        //valores de los nuevos elementos
        $form->idNiveles->setValue($idnivel);
        $form->orden->setValue($datos[0]['max']+1);
        $form->orden->setAttrib('readonly', 'readonly');

        //cambio el texto del boton submit
        $form->submit->setLabel('Agregar Asignatura');

        }else{
        //creamos elementos nuevos
        $form->addElement('hidden', 'idNiveles');
        $form->addElement('Text', 'orden',array('order' => 2));
        $form->orden->setLabel('Orden: ')->setRequired(true);
        $form->orden->setDecorators(array(
        'ViewHelper',
        array('Errors'),
        array(array('data' => 'HtmlTag'), array('tag' => 'td', 'class' => 'element')),
        array('Label', array('tag' => 'td')),
        array(array('row' => 'HtmlTag'), array('tag' => 'tr')),
        ));
        $form->addElement('radio','promedio',array('order'=>3));
        $form->promedio->setLabel('Incide en Promedio: ')->setRequired(true);
        $form->promedio->addMultiOptions(array(1=>'Si',0=>'No'));
        $form->promedio->setDecorators(array(
        'ViewHelper',
        array('Errors'),
        array(array('data' => 'HtmlTag'), array('tag' => 'td', 'class' => 'element')),
        array('Label', array('tag' => 'td')),
        array(array('row' => 'HtmlTag'), array('tag' => 'tr')),
        ));

        //valores de los nuevos elementos
        $form->idNiveles->setValue($idnivel);
        $form->orden->setValue($datos[0]['max']+1);
        $form->orden->setAttrib('readonly', 'readonly');

        //cambio el texto del boton submit
        $form->submit->setLabel('Agregar Asignatura');
    }
        //lo asigno oa la accion (la pag web que se mostrara)
        $this->view->form = $form;

        
        

        //los formularios envian sus datos a traves de POST
        //si vienen datos de post, es que el usuario ha enviado el formulario
        if ($this->getRequest()->isPost())
        {
            //extrae un arreglo con los datos recibidos por POST
            //es decir, los datos clave=>valor del formulario
            $formData = $this->getRequest()->getPost();

            //isValid() revisa todos los validadores y filtros que le
            //aplicamos a los objetos del formulario: se asegura de que los
            //campos requeridos se hallan llenado, que el formato de la fecha
            //sea el correcto, etc
            if ($form->isValid($formData))
            {
                //aca ya estamos seguros de que los datos son validos
                //ahora los extraemos como se ve abajo
                
                $nombre_asignatura = $form->getValue('nombreAsignatura');
                $nivel=$form->getValue('idNiveles');
                $nucleo=$form->getValue('idNucleo');
                $orden=$form->getValue('orden');
                $promedio=$form->getValue('promedio');

                $ultimoid=$asignaturas->ultimoid();
                $idasignatura=$ultimoid[0]['max']+1;
                 

                //creo objeto Establecimiento que controla la talba asignatura de la base de datos
                $asignaturas = new Application_Model_DbTable_Asignaturas();

                  $db = Zend_Db_Table_Abstract::getDefaultAdapter();
               
               // Iniciamos la transaccion
               $db->beginTransaction();
               //$db->beginTransacction();
               try{
                if($nivel==14 || $nivel==15){
                  //llamo a la funcion agregar, con los datos que recibi del form
                $asignaturas->agregarpre($idasignatura,$nombre_asignatura,$orden,$promedio,$nivel,$nucleo);
                   
                }else{
                  //llamo a la funcion agregar, con los datos que recibi del form
                $asignaturas->agregar($idasignatura,$nombre_asignatura,$orden,$promedio,$nivel);   
                }
               


                // Sino hubo ningun inconveniente hacemos un commit
                       $db->commit();

                //indico que despues de haber agregado la asignatura,
                //me redirija a la accion index de AsignaturaController, es decir,
                //a la pagina que me muestra el listado de Asignaturas
                $this->_helper->redirector('asignaturas','Asignaturas',null,array('id'=>$nivel));
                } catch( Exception $e ) {
                       // Si hubo problemas. Enviamos todo marcha atras
                       $db->rollBack();
                       
                      $messages=$this->_helper->getHelper('FlashMessenger')->addMessage('Hubo un problema al ingresar los datos, intente nuevamente');
                    /// Assign the messages
                    $this->view->assign('messages', $messages);
               }
            }
            //si los datos del formulario no son validos, es decir, falta ingresar
            //algunos o el formato es incorrecto...
            else
            {
                //esta funcion vuelve a cargar el formulario con los datos que se
                //enviaron, Y ADEMAS CON LOS MENSAJES DE ERROR, los que se le mostrarán
                //al usuario
                $form->populate($formData);
            }
        }
    }

    public function editarAction()
    {
        //titulo de la pagina
        $this->view->title = "Modificar Asignatura";
        $this->view->headTitle($this->view->title);
        //creo el formulario
        $form = new Application_Form_Asignaturas();
        $form->addElement('hidden', 'idNiveles');
        
        //le pongo otro texto al boton submit
        $form->submit->setLabel('Modificar Asignatura');
        $this->view->form = $form;

        //si el usuario envia datos del form
        if ($this->getRequest()->isPost())
        {
            $formData = $this->getRequest()->getPost();
            //veo si son validos
            if ($form->isValid($formData))
            {
                //extraigo sus datos
                $idasignaturas = $form->getValue('idAsignatura');
                $nombre_asignatura = $form->getValue('nombreAsignatura');
                $nivel = $form->getValue('idNiveles');
              
              
                
                //creo objeto tabla Asignatura()
                $asignatura= new Application_Model_DbTable_Asignaturas();
                   $db = Zend_Db_Table_Abstract::getDefaultAdapter();
               
               // Iniciamos la transaccion
               $db->beginTransaction();
               //$db->beginTransacction();
               try{
                //LLAMO A FUNCION CAMBIAR, QUE HACE EL UPDATE
                $asignatura->cambiar($idasignaturas,$nombre_asignatura);

                 $db->commit();
                //redirijo a accion index
               $this->_helper->redirector('asignaturas','Asignaturas',null,array('id'=>$nivel));

               } catch( Exception $e ) {
                       // Si hubo problemas. Enviamos todo marcha atras
                       $db->rollBack();
                       
                      $messages=$this->_helper->getHelper('FlashMessenger')->addMessage('Hubo un problema al ingresar los datos, intente nuevamente');
                    /// Assign the messages
                    $this->view->assign('messages', $messages);
               }

            } 
            //si los datos si no son validos, vuelvo a mostrar el form, con 
            //los mensajes de error
            else
            {
                $form->populate($formData);
            }
        }
        //SI LOS DATOS NO VIENEN POR POST, ENTONCES ESTAMOS LLAMANDO A ESTA FUNCION
        //PARA QUE MUESTRE LOS DATOS DE UNA ASIGNATURA
        else
        {
            //DEBE VENIR UN PARAMETRO LLAMADO ID, con el 
            //id de la asignatura que deseo editar
            //si viene un parametro llamado id le asigno su valor a $id; 
            //si no viene, le asigno cero
            //esto es como llamar a $_REQUEST
            $idAsignaturas = $this->_getParam('id', 0);
            //si viene algun id
            if ($idAsignaturas > 0)
            {
               //CREO FORM
                $fasignatura = new Application_Model_DbTable_Asignaturas();
                //extraigo de la talba el periodo idPeriodo= $idPeriodo
                $fasignaturas= $fasignatura->get($idAsignaturas);

                $nombre=$fasignaturas['nombreAsignatura'];
                $length = strlen(utf8_decode($nombre)); 
                $form->nombreAsignatura->setAttrib('size', $length+2);
                
                //populate() toma los datos de $idasignatura y los coloca en el formualrio.
                //PARA QUE ESTO FUNCIONE, EL NOMBRE DE LOS OBJETOS DEL FORM DEBE
                //SER IGUAL AL NOMBRE DE LOS CAMPOS EN LA TABLA!!
                $form->populate($fasignaturas);
            }
        }
    }

    public function eliminarAction()
    {
        //debe venir un parametro, por GET o POST, llamado idasignatura, con el id del Asignatura a borrar
        $idasignatura = $this->_getParam('idAsignaturas', 0);
        //creo objeto tabla Asignaturas
        $tabla = new Application_Model_DbTable_Asignaturas();
        
        //llamo a la funcion borrar
        $tabla->borrar($idasignatura);
        //redirijo a la accion index de este controlador, es decir,
        //al listado de Asignaturas
        $this->_helper->redirector('index');
    }



    public function guardaasignaturaAction()
    {
        
        
    if ($this->getRequest()->isXmlHttpRequest()) { //Detectamos si es una llamada AJAX

        $this->_helper->viewRenderer->setNoRender();
        $this->_helper->layout->disableLayout();
      
       //guardamos los datos en $json recibidos de la funcion ajax
        $json = file_get_contents('php://input');
        //decodificamos los datos en un array($data) php
        
        $data=json_decode($json,true); 

        $tabla = new Application_Model_DbTable_Asignaturas();

        $db = Zend_Db_Table_Abstract::getDefaultAdapter();
               
               // Iniciamos la transaccion
               $db->beginTransaction();
               
               try{
                for($i=0;$i<count($data);$i++){
                    $tabla->cambiarestadoorden($data[$i]['idasignatura'],$i+1,$data[$i]['check'],$data[$i]['mostrar']);
                
       
        }

       $db->commit();
       echo Zend_Json::encode(array('redirect' => '/Asignaturas/asignaturas/id/'.$data[0]['n']));
     
     }catch( Exception $e ){
                  
                       // Si hubo problemas. Enviamos todo marcha atras
                       $db->rollBack();
                       echo Zend_Json::encode(array('response' =>'error')); 
                       
                       
       }
       
  
       } 
      
           
       
    
  }


}






