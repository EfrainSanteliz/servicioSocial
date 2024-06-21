<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\StudentController;
use App\Http\Controllers\CoordinatorController;
use App\Http\Controllers\ResidenceController;
use App\Http\Controllers\ObservationController;
use Illuminate\Support\Facades\Storage;
use PHPUnit\TextUI\XmlConfiguration\Group;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UpdateExcelController;



/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::get('/test', function(){
    return response()->json(['data'=>'Hola mundo'],200);
});


Route::middleware('auth:coordinator')->prefix('/students')->group(function(){
    Route::get('/','App\Http\Controllers\StudentController@index');
    Route::post('/add','App\Http\Controllers\StudentController@store');
    Route::delete('delete/{student}','App\Http\Controllers\StudentController@destroy');


    Route::prefix('/{students}')->group(function(){
        Route::get('/','App\Http\Controllers\StudentController@show');
        Route::put('/{student}','App\Http\Controllers\StudentController@update');

    });

});


Route::prefix('/student')->group(function() {
    Route::get('/','App\Http\Controllers\StudentController@index');

    Route::post('login', 'App\Http\Controllers\AuthController@StudentLogin');
    Route::get('me', 'App\Http\Controllers\AuthController@studentMe');
    Route::post('logout', 'App\Http\Controllers\AuthController@studentLogout');
    Route::get('information','App\Http\Controllers\StudentController@studentInfo');
    // Route::post('/','App\Http\Controllers\StudentController@storeInCoordinator');
    Route::get('/{controlNumber}', 'App\Http\Controllers\StudentController@sendForm');
    Route::post('/{controlNumber}/form', 'App\Http\Controllers\StudentController@storeForm');
    Route::get('/{controlNumber}/document', 'App\Http\Controllers\StudentController@generarCartaDePresentacion');
    Route::get('/{controlNumber}/document2', 'App\Http\Controllers\StudentController@generarHojaMembretada');
    Route::post('/{controlNumber}/remplazar', 'App\Http\Controllers\StudentController@remplazarHojaMembretada');
    Route::put('/{student}', 'App\Http\Controllers\StudentController@update');
    Route::get('/{controlNumber}/form', 'App\Http\Controllers\StudentController@showForm');
    Route::post('/generate', 'App\Http\Controllers\StudentController@generateFormsForStudentsWithStatusSeven');
    Route::get('/generate-forms', 'StudentController@generateFormsForStudentsWithStatusSeven');
    Route::delete('/{controlNumber}/form', 'App\Http\Controllers\StudentController@deleteForm');
    Route::put('/{controlNumber}/form', 'App\Http\Controllers\StudentController@saveOrUpdateFormProgress');
    Route::get('status/{id}', [StudentController::class, 'getStatus']);
    Route::put('status/{id}', [StudentController::class, 'updateStatus']);
    Route::get('/', 'App\Http\Controllers\StudentController@index');
    Route::put('change-password/{control_number}', 'App\Http\Controllers\StudentController@changePassword');

});
Route::prefix('/coordinators')->group(function(){
    Route::post('login', 'App\Http\Controllers\AuthController@CoordinatorLogin');
    Route::get('me', 'App\Http\Controllers\AuthController@CoordinatorMe');
    Route::post('logout', 'App\Http\Controllers\AuthController@CoordinatorLogout');

});
Route::middleware('auth:coordinator')->prefix('/coordinators')->group(function () {
    Route::get('/', 'App\Http\Controllers\CoordinatorController@index');
    Route::get('careers/{id}', 'App\Http\Controllers\CoordinatorController@get_careers');
    Route::post('Assign', 'App\Http\Controllers\CoordinatorController@assignCareerToCoordinator');
    Route::post('Move', 'App\Http\Controllers\CoordinatorController@moveCoordinatorToAnotherCareer');
    Route::post('Remove', 'App\Http\Controllers\CoordinatorController@removeCoordinatorFromCareer');
    Route::put('change-password/{no_employed}', 'App\Http\Controllers\CoordinatorController@changePassword');




    Route::post('import-students', 'App\Http\Controllers\UpdateExcelController@importStudents');



});


Route::prefix('/advisers')->group(function(){
    Route::get('/','App\Http\Controllers\AdviserController@index');
    Route::post('/add','App\Http\Controllers\AdviserController@store');

});
Route::prefix('/company')->group(function(){

    Route::get('/','App\Http\Controllers\CompanyController@index');
    Route::post('/','App\Http\Controllers\CompanyController@store');
    Route::delete('/{company}', 'App\Http\Controllers\CompanyController@destroy'); // Corregir la ruta para eliminar
    Route::get('/{company}', 'App\Http\Controllers\CompanyController@show');
    Route::put('/{company}', 'App\Http\Controllers\CompanyController@update');
    Route::get('/search', 'App\Http\Controllers\CompanyController@search');
    Route::get('data/{company}/{proyect}', 'App\Http\Controllers\CompanyController@getData');

});
Route::prefix('/proyect')->group(function(){
    Route::get('/', 'App\Http\Controllers\ProyectController@index'); // Ruta para listar todos los proyectos
    Route::post('/', 'App\Http\Controllers\ProyectController@store'); // Ruta para almacenar un nuevo proyecto
    Route::get('/{company_id}', 'App\Http\Controllers\ProyectController@show');
    Route::delete('/{proyect}', 'App\Http\Controllers\ProyectController@destroy'); // Corregir la ruta para eliminar
    Route::put('/{proyect}', 'App\Http\Controllers\ProyectController@update'); // Corregir la ruta para eliminar
    Route::get('/{proyect}/proyectId', 'App\Http\Controllers\ProyectController@showbyProyectId');

});

Route::get('/proyects/{company_id}', 'ProyectController@showByCompany');


Route::prefix('/residences')->group(function(){
    Route::get('/','App\Http\Controllers\ResidenceController@index');
    Route::get('/filter',[ResidenceController::class, 'filter']);
    Route::get('/list',[ResidenceController::class, 'list']);
    Route::get('{controlNumber}', [ResidenceController::class, 'showByControlNumber']);
    Route::post('/{id}', [ResidenceController::class, 'edit']);
    Route::post('/{id}/editProyect_id', [ResidenceController::class, 'editProyect_id']);
    Route::put('/{id}/editProyect_id', [ResidenceController::class, 'editProyect_id']);
    Route::prefix('/status')->group(function(){
        Route::get('/{control_number}',[ResidenceController::class, 'getStatus']);
        Route::put('/{control_number}',[ResidenceController::class, 'updateStatus']);

        Route::middleware('auth:coordinator')->group(function () {
            Route::post('/revert/{control_number}',[ResidenceController::class, 'revertStatus']);
        });
    });

    Route::middleware('auth:coordinator')->prefix('/observations')->group(function(){
        Route::post('/{residence_id}',[ObservationController::class, 'create']);
        Route::get('/{residence_id}',[ObservationController::class, 'show']);
        Route::put('/edit/{observation_id}', [ObservationController::class, 'edit']);
        Route::put('/deshabilitar/{observation_id}', [ObservationController::class, 'deshabilitar']);
    });

    Route::prefix('/observations')->group(function(){
        Route::get('/historic/{residence_student_id}', [ObservationController::class, 'getObservationsByStudentId']);
    });

    Route::prefix('/advisers')->group(function(){
        Route::put('/change/{control_number}', [ResidenceController::class, 'changeAdviser']);
    });
});

Route::prefix('/preliminars')->group(function(){
    Route::get('/{no_control}',[ResidenceController::class, 'getPreliminar']);
    Route::get('/{id}','App\Http\Controllers\UploadController@show');
});

Route::prefix('/preliminarsStudents')->group(function(){
    Route::get('/{no_control}',[ResidenceController::class, 'getPreliminarStudent']);

});

Route::prefix('/kardexStudents')->group(function(){
    Route::get('/{no_control}',[ResidenceController::class, 'getKardexStudent']);

});

Route::prefix('/ObservationsStudent')->group(function(){
    Route::get('/{no_control}',[ResidenceController::class, 'getObservationsStudent']);

});

Route::prefix('/IdentStudent')->group(function(){
    Route::get('/{no_control}',[ResidenceController::class, 'getIdentStudent']);

});

Route::prefix('/StatusExpediente')->group(function () {
    Route::post('/{controlNumber}', 'App\Http\Controllers\StudentController@updateStatusExpediente');
    Route::get('/{control_number}/status', 'App\Http\Controllers\StudentController@getStatusExpediente');
});

Route::prefix('/careers')->group(function(){
    Route::get('/','App\Http\Controllers\CareerController@index');
});

Route::post('/upload', 'App\Http\Controllers\UploadController@store');

Route::get('/getDocuments', 'App\Http\Controllers\ResidenceController@getDocuments');

Route::prefix('/download')->group(function(){
    Route::get('/aceptacion/{id}','App\Http\Controllers\UploadController@downloadAceptacion');
    Route::get('/presentacion/{id}','App\Http\Controllers\UploadController@downloadPresentacion');
    Route::get('/comunicado/{path}','App\Http\Controllers\NoticeController@download');
    Route::get('/pcomunicado/{path}','App\Http\Controllers\PnoticeController@download');
});

Route::prefix('/notices')->group(function(){
    Route::post('/{career_id}','App\Http\Controllers\NoticeController@create');
    Route::get('/{career_id}','App\Http\Controllers\NoticeController@show');
    Route::delete('/{career_id}','App\Http\Controllers\NoticeController@destroy');
});

Route::prefix('/pnotices')->group(function(){
    Route::post('/{student_id}','App\Http\Controllers\PnoticeController@create');
    Route::get('/{student_id}','App\Http\Controllers\PnoticeController@show');
    Route::delete('/{student_id}','App\Http\Controllers\PnoticeController@destroy');
});


Route::prefix('/period')->group(function(){
    Route::get('/', 'App\Http\Controllers\PeriodController@index');
    Route::get('/current', 'App\Http\Controllers\PeriodController@get_current');
});