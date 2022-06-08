<?php

class SostenedorController extends Zend_Controller_Action
{

    public function init()
    {
         $this->initView();
         $this->view->baseUrl = $this->_request->getBaseUrl();
    }

    public function indexAction()
    {
        //creo objeto que maneja la tabla Asignaturas
        $table = new Application_Model_DbTable_Sostenedor();
        //obtengo listado de todas las filas de la tabla, y las
        //coloco en la variable datos de la pagina web (de la vista) 
        //que vamos a mostrar

       $this->view->dato= $table->listar();
    }

   public function agregarAction()
    {
        //titulo para la pagina
        $this->view->title = "Agregar Sostenedor";
        //valor para <head><title>
        $this->view->headTitle($this->view->title);
        //creo el formulario
        $form = new Application_Form_Sostenedor();
        //cambio el texto del boton submit
        $form->submit->setLabel('Agregar Sostenedor');
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
                $rutsostenedor = $form->getValue('rutSostenedor');
                $nombre = $form->getValue('nombreSostenedor');
                $direccion = $form->getValue('direccion');
                $telefono = $form->getValue('telefono');
                $comuna = $form->getValue('comuna');
                $correo = $form->getValue('correo');
                
                
               //creo objeto Sostenedor que controla la talba sostenedor de la base de datos
                $sostenedor = new Application_Model_DbTable_Sostenedor();
                
               $db = Zend_Db_Table_Abstract::getDefaultAdapter();
               
               // Iniciamos la transaccion
               $db->beginTransaction();
               //$db->beginTransacction();
               try{
                       //llamo a la funcion agregar, con los datos que recibi del form
                $sostenedor->agregar($rutsostenedor,$nombre,$direccion,$telefono,$comuna,$correo);

                       
                       // Sino hubo ningun inconveniente hacemos un commit
                       $db->commit();
                       $this->_helper->redirector('index');
                       //indico que despues de haber agregado el sostenedor,
                //me redirija a la accion index de SostenedorController, es decir,
                //a la pagina que me muestra el listado de Sostenedores
               } catch( Exception $e ) {
                       // Si hubo problemas. Enviamos todo marcha atras
                       $db->rollBack();
                       echo $e;
               }
                

                
               
                
                
            }
            //si los datos del formulario no son validos, es decir, falta ingresar
            //algunos o el formato es incorrecto...
            else
            {
                //esta funcion vuelve a cargar el formulario con los datos que se
                //enviaron, Y ADEMAS CON LOS MENSAJES DE ERROR, los que se le mostrarán
                //al usuario
                //carga la provincia y la comuna seleccionada anteriormente y la carga en el formulario con los errores
                $comuna = new Application_Model_DbTable_Comuna();
                $rowset = $comuna->getAsKeyValue($this->_request->getParam('provincia'));
                $provincia= new Application_Model_DbTable_Provincia();
                $rowsetprovincia = $provincia->getAsKeyValue($this->_request->getParam('region'));
                //var_dump($rowsetprovincia);
                $form->provincia->clearMultiOptions();
                $form->provincia->addMultiOptions($rowsetprovincia);
                $form->comuna->clearMultiOptions();
                $form->comuna->addMultiOptions($rowset);
                //var_dump($formData);
               $this->view->form = $form;
                $form->populate($formData);
            }
        }
    }

    public function editarAction()
    {
        //titulo de la pagina
        $this->view->title = "Modificar Sostenedor";
        $this->view->headTitle($this->view->title);
        //creo el formulario
        $form = new Application_Form_Sostenedor();
        
        //le pongo otro texto al boton submit
        $form->submit->setLabel('Modificar Sostenedor');
        $this->view->form = $form;

        //si el usuario envia datos del form
        if ($this->getRequest()->isPost())
        {
            $formData = $this->getRequest()->getPost();
            //veo si son validos
            if ($form->isValid($formData))
            {
                //extraigo sus datos
                $idsostenedor = $form->getValue('idSostenedor');
                $rutsostenedor = $form->getValue('rutSostenedor');
                $nombre = $form->getValue('nombreSostenedor');
                $direccion = $form->getValue('direccion');
                $telefono = $form->getValue('telefono');
                $comuna = $form->getValue('comuna');
                $correo = $form->getValue('correo');
                
        
                             
                //creo objeto tabla Sostenedor()
                $sostenedor= new Application_Model_DbTable_Sostenedor();
                
                $db = Zend_Db_Table_Abstract::getDefaultAdapter();
               
               // Iniciamos la transaccion
               $db->beginTransaction();
               //$db->beginTransacction();
               try{
                       //llamo a la funcion agregar, con los datos que recibi del form
                $sostenedor->cambiar($idsostenedor,$rutsostenedor,$nombre,$direccion,$telefono,$comuna,$correo);

                       
                       // Sino hubo ningun inconveniente hacemos un commit
                       $db->commit();
                       $this->_helper->redirector('index');
                       //indico que despues de haber agregado el sostenedor,
                //me redirija a la accion index de SostenedorController, es decir,
                //a la pagina que me muestra el listado de Sostenedores
               } catch( Exception $e ) {
                       // Si hubo problemas. Enviamos todo marcha atras
                       $db->rollBack();
                       echo $e;
               }
                
            } 
            //si los datos si no son validos, vuelvo a mostrar el form, con 
            //los mensajes de error
            else
            {
                //carga la provincia y la comuna seleccionada anteriormente y la carga en el formulario con los errores
                $comuna = new Application_Model_DbTable_Comuna();
                $rowset = $comuna->getAsKeyValue($this->_request->getParam('provincia'));
                $form->comuna->clearMultiOptions();
                $form->comuna->addMultiOptions($rowset);
                $this->view->form = $form;
                $form->populate($formData);
            }
        }
        //SI LOS DATOS NO VIENEN POR POST, ENTONCES ESTAMOS LLAMANDO A ESTA FUNCION
        //PARA QUE MUESTRE LOS DATOS DEL SOSTENDOR
        else
        {
            //DEBE VENIR UN PARAMETRO LLAMADO Rut_sostenedor, con el 
            //rut del sostenedor que deseo editar
            //si viene un parametro llamado Rut_sostenedor le asigno su valor a $rutsostenedor; 
            //si no viene, le asigno cero
            //esto es como llamar a $_REQUEST
            $rutsostenedor = $this->_getParam('idSostenedor', 0);
           
            //si viene algun Rut_sostenedor
            if ($rutsostenedor > 0)
            {
               //CREO FORM
                $fsostenedor = new Application_Model_DbTable_Sostenedor();
                //extraigo de la tabla el sostenedor Rut_sostenedor= $rutsostenedor
                $fsostenedores= $fsostenedor->get($rutsostenedor);
                //populate() toma los datos de $rutsostenedor y los coloca en el formualrio.
                //PARA QUE ESTO FUNCIONE, EL NOMBRE DE LOS OBJETOS DEL FORM DEBE
                //SER IGUAL AL NOMBRE DE LOS CAMPOS EN LA TABLA!!
                //carga la provincia y la comuna 
                
               
                $comuna = new Application_Model_DbTable_Comuna();
                $rowset = $comuna->getcomuna($fsostenedores['comuna']);

                $rowsetcom = $comuna->getAsKeyValue($rowset[0][idProvincia]);
                $provincia= new Application_Model_DbTable_Provincia();
                $rowsetprovincia = $provincia->getAsKeyValue($rowset[0][idRegion]);
                
                $form->provincia->clearMultiOptions();
                $form->provincia->addMultiOptions($rowsetprovincia);
                $form->provincia->setValue($rowset[0][idProvincia]);
                $form->comuna->clearMultiOptions();
                $form->comuna->addMultiOptions($rowsetcom);
                $form->region->setValue($rowset[0][idRegion]);
               
                
                $this->view->form = $form;
                
                $form->populate($fsostenedores);
                
            }
        }
    }

    public function eliminarAction()
    {
        //debe venir un parametro, por GET o POST, llamado idasignatura, con el id del Asignatura a borrar
        $rutsostenedor = $this->_getParam('idSostenedor', 0);
        //creo objeto tabla Sostenedor
        $tabla = new Application_Model_DbTable_Sostenedor();
        
          $db = Zend_Db_Table_Abstract::getDefaultAdapter();
               
               // Iniciamos la transaccion
               $db->beginTransaction();
               //$db->beginTransacction();
               try{
        //llamo a la funcion borrar
        $tabla->borrar($rutsostenedor);
        //redirijo a la accion index de este controlador, es decir,
        //al listado de Sostenedores
        $db->commit();
        $this->_helper->redirector('index');
         } catch( Exception $e ) {
                       // Si hubo problemas. Enviamos todo marcha atras
                       $db->rollBack();
                       $messages=$this->_helper->getHelper('FlashMessenger')->addMessage('No se puede eliminar este registro, posee datos asociados');
                   
                    $this->view->assign('messages', $messages);
               }
    }

    
     public function getprovinciaAction()
    {
      $modelModelo = new Application_Model_DbTable_Provincia();
      $results = $modelModelo->getAsKeyValueJSON($this->_getParam('id'));
      $this->_helper->json($results);
    }

    public function getcomunaAction()
    {
      $modelModelo = new Application_Model_DbTable_Comuna();
      $results = $modelModelo->getAsKeyValueJSON($this->_getParam('id'));
      $this->_helper->json($results);
    }

}







