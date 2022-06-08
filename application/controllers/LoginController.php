<?php

namespace App\Http\Controllers;

use App\User;
use App\UserDet;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class LoginController extends Controller
{
    private $mantencion=false;
    public function index(Request $request)
    {

        $db = app('db');
        //sleep(500);

        if($this->mantencion){

            $res['success'] = true;
            $res['message'] = 'En Mantención';
            return response($res);
            exit();

        }

        $hasher = app()->make('hash');

        $email = $request->input('user');
        $password = $request->input('password');
        $identificador= $request->input('identificador');
        $login = User::where('user', $email)->first();

        if (!$login) {
            $res['success'] = false;
            $res['message'] = 'Usuario o Contraseña Incorrecto ';
            return response($res);
        } else {


            if ($hasher->check($password, $login->password)) {
                $alumno= DB::table('users')->where('user','=',$email)->get();
                $api_token = sha1(time());
                //var_dump($checkdispotivo = UserDet::where('identificador', $identificador)->first());
                //Obatenemos si el dispotivo esta registrado
                $checkdispotivo = UserDet::where('identificador', $identificador)->where('id', $login->id)->first();
                //var_dump($checkdispotivo);
                $create_token=null;
                if(!$checkdispotivo){ //Registramos
                    $create_token=UserDet::create([
                        'remember_token' => $api_token,
                        'identificador' => $identificador,
                        'id' => $login->id
                    ]);

                }else{
                    //Actualizamos
                    $create_token = UserDet::where('identificador', $identificador)->update(['remember_token' => $api_token]);
                }

                //$login->nombre=$alumno[0]->nombres.' '.$alumno[0]->paterno.' '.$alumno[0]->materno;
                //$login->curso=$alumno[0]->nombreGrado.' '.$alumno[0]->letra;
                if ($create_token) {
                    //sleep(15);
                    $res['success'] = true;
                    $res['token'] = $api_token;
                    $res['idAlumno'] = $alumno[0]['user'];
                    return response($res);
                }
            } else {
                $res['success'] = false;
                $res['message'] = 'Usuario o Contraseña Incorrecto ';
                return response($res);
            }
        }
    }

    public function loginmaster(Request $request)
    {

        $db = app('db');

        if($this->mantencion){

            $res['success'] = true;
            $res['message'] = 'En Mantención';
            return response($res);
            exit();

        }
        $hasher = app()->make('hash');
        $email = $request->input('user');
        $password = $request->input('password');
        $login = DB::table('usersoft')->where('user', $email)->first();

        if (!$login) {
            $res['success'] = false;
            $res['message'] = 'Usuario o Contraseña Incorrecto 1 ';
            return response($res);
        } else {


            if ($hasher->check($password, $login['password'])) {
                $alumno = DB::table('usersoft')->where('user', '=', $email)->get();
                $api_token = sha1(time());
                if ($alumno) {
                    //Actualizamos
                    $create_token =  DB::table('usersoft')->where('user', $email)->update(['remember_token' => $api_token]);

                    if ($create_token) {
                        //sleep(15);
                        $res['success'] = true;
                        $res['token'] = $api_token;
                        return response($res);
                    }
                } else {
                    $res['success'] = false;
                    $res['message'] = 'Usuario o Contraseña Incorrecto 2 ';
                    return response($res);
                }
            }
        }

    }

    public function creates(Request $request)
    {
        $user = $request->input('userc');
        $email = $request->input('user');
        $password = $request->input('password');
        $idDb=$request->input('identificador');
        $idcurso=$request->input('idCursos');
        $idalumnos=$request->input('idAlumno');
        $idperiodo=$request->input('idPeriodo');



        $token = $request->header('Acceso');
        $alumno = DB::table('usersoft')->where('user', '=', $user)->get();

        if ($token === $alumno[0]['remember_token']) {

        if(!empty($email) && !empty($password) && !empty($idDb)  && !empty($idcurso) && !empty($idalumnos) && !empty($idperiodo))
        {
            $login = User::where('user', $email)->where('idDb',$idDb)->first();
            if (!$login) {


                    User::create([
                        'user' => $email,
                        'password' => Hash::make($password),
                        'idDb' => $idDb,
                        'idCursos' => $idcurso,
                        'idAlumno' => $idalumnos,
                        'idPeriodo' => $idperiodo
                    ]);
                    $res['success'] = true;
                    $res['message'] = 1;
                    return response($res);



            } else {
                $res['success'] = false;
                $res['message'] = 2;
                return response($res);

//            if ($hasher->check($password, $login->password)) {
//                //$alumno= DB::table('alumnosapoderado')->where('rut','=',$email)->get();
//                $api_token = sha1(time());
//                $create_token = User::where('id', $login->id)->update(['remember_token' => $api_token]);
//                //$login->nombre=$alumno[0]->nombres.' '.$alumno[0]->paterno.' '.$alumno[0]->materno;
//                //$login->curso=$alumno[0]->nombreGrado.' '.$alumno[0]->letra;
//                if ($create_token) {
//                    $res['success'] = true;
//                    $res['api_token'] = $api_token;
//                    //$res['message'] = $login;
//                    return response($res);
//                }
//            } else {
//                $res['success'] = true;
//                $res['message'] = 'Contraseña Incorrecta';
//                return response($res);
//            }
            }
        }else{
            $res['success'] = false;
            $res['message'] = 3;
            return response($res);
        }

        }else{
            return response()->json(["Token no Válido"], 401);
        }






    }

    public function update(Request $request)
    {
        $user = $request->input('userc');
        $email = $request->input('user');
        $idDb=$request->input('identificador');
        $idcurso=$request->input('idCursos');
        $idalumnos=$request->input('idAlumno');
        $idperiodo=$request->input('idPeriodo');

        $token = $request->header('Acceso');
        $alumno = DB::table('users')->where('user', '=', $user)->get();

        if ($token === $alumno[0]['remember_token']) {

            if (!empty($email) && !empty($idDb) && !empty($idcurso) && !empty($idalumnos) && !empty($idperiodo)) {
                $login = User::where('user', $email)->where('idDb', $idDb)->first();
                if ($login) {


                    DB::table('users')->where('user', $email)->update(['idDb' => $idDb, 'idCursos' => $idcurso, 'idAlumno' => $idalumnos, 'idPeriodo' => $idperiodo]);
                    $res['success'] = true;
                    $res['message'] = 'Usuario Actualizado';


//                User::create([
//                    'user' => $email,
//                    'password' => Hash::make($password),
//                    'idDb' => $idDb,
//                    'idCursos' => $idcurso,
//                    'idAlumno' => $idalumnos,
//                    'idPeriodo' => $idperiodo
//                ]);

                    return response($res);
                } else {
                    $res['success'] = false;
                    $res['message'] = 'Usuario No Existe';
                    return response($res);
                }
            } else {
                $res['success'] = false;
                $res['message'] = 'Error';
                return response($res);
            }

        }else{
            return response()->json(["Token no Válido"], 401);
        }




    }

    public function updatedevice(Request $request)
    {

        $usuario = $request->input('user');
        $device= $request->input('device');
        $alumno = DB::table('users')->where('user', '=', $usuario)->get();

        //Obtenemos el Token que utiliza el usuario y lo comparamos si corresponde.
        $token = $request->header('Acceso');
        if ($token === $alumno[0]['remember_token']) {

            if(empty(trim($device)) || $device=="" || $device=="NULL"){
                $device=null;
            }

            DB::table('users')->where('user', $usuario)->update(['identificador' => $device]);
            $res['success'] = true;
            return response()->json($res, 200);

        }else{

            return response()->json(["Token no Válido"], 401);

        }

    }

    public function delete(Request $request) {
        $user = $request->input('userc');
        $email = $request->input('user');
        $id = $request->input('identificador');
        $token = $request->header('Acceso');
        $alumno = DB::table('users')->where('user', '=', $user)->get();

        if ($token === $alumno[0]['remember_token']) {

            $login = User::where('user', $email)->where('idDb',$id)->first();

            if(!empty($login)){
                $login->delete();
                $res['success'] = true;
                $res['message'] = 'Usuario Eliminado';
                return response($res);

            } else {
                $res['success'] = false;
                $res['message'] = 'Usuario no Existe';
            }

        }else{
            return response()->json(["Token no Válido"], 401);
        }

    }
}
