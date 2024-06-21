<?php

namespace App\Http\Controllers;

use App\Models\Company;
use App\Http\Requests\StoreCompanyRequest;
use App\Http\Requests\UpdateCompanyRequest;
use App\http\Resources\ProyectResource;
use App\Http\Resources\CompanyResource;
use Illuminate\Support\Facades\Hash;
use Illuminate\Http\Request;
use App\Exceptions\Handler;
use App\Models\Proyect;

class CompanyController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        try {
            $company = Company::all();
            return response()->json(['success' => true, 'data' => CompanyResource::collection($company)]);
        } catch (\Throwable $th) {
            return response()->json(['success' => false, 'message' => $th->getMessage()], 500);
        }
    }


    public function getData($company, $proyect)
    {
        $companyData = Company::find($company);
        $projectData = Proyect::find($proyect);
    
        // Combinar los datos de ambas tablas en un solo array
        $combinedData = [
            'id' => $companyData->id,
            'razonSocial' => $companyData->razonSocial,
            'nombreEmpresa' => $companyData->nombreEmpresa,
            'rfcEmpresa' => $companyData->rfcEmpresa,
            'misionEmpresa' => $companyData->misionEmpresa,
            'direccionEmpresa' => $companyData->direccionEmpresa,
            'coloniaEmpresa' => $companyData->coloniaEmpresa,
            'telefonoEmpresa' => $companyData->telefonoEmpresa,
            'correoEmpresa' => $companyData->correoEmpresa,
            'ciudadEmpresa' => $companyData->ciudadEmpresa,
            'cpEmpresa' => $companyData->cpEmpresa,
            'tituloPersonatitular' => $companyData->tituloPersonatitular,
            'nombrePersonatitular' => $companyData->nombrePersonatitular,
            'cargoPersonatitular' => $companyData->cargoPersonatitular,
            'responsableResidencias' => $companyData->responsableResidencias,
            'cargoResponsableResidencias' => $companyData->cargoResponsableResidencias,
            'tamañoEmpresa' => $companyData->tamañoEmpresa,
            'sectorEmpresa' => $companyData->sectorEmpresa,
            'giroEmpresa' => $companyData->giroEmpresa,
            'EsInstitucionAcademica' => $companyData->EsInstitucionAcademica,
            'EsEmpresaSinFinesDeLucro' => $companyData->EsEmpresaSinFinesDeLucro,
            'Industria' => $companyData->Industria,
            'company_id' => $projectData->company_id,
            'OrigenProyecto' => $projectData->OrigenProyecto,
            'nombreProyecto' => $projectData->nombreProyecto,
            'numeroEstudiantes' => $projectData->numeroEstudiantes,
            'fechaInicio' => $projectData->fechaInicio,
            'fechaFin' => $projectData->fechaFin,
            'nombreAsesorInterno' => $projectData->nombreAsesorInterno,
            'nombreAsesorExterno' => $projectData->nombreAsesorExterno,
            'puestoAsesorExterno' => $projectData->puestoAsesorExterno,
            'correoAsesorExterno' => $projectData->correoAsesorExterno,
            'numeroAsesorExterno' => $projectData->numeroAsesorExterno,
            'AsesorExternoEgresadoITH' => $projectData->AsesorExternoEgresadoITH,
        ];
    
        return response()->json([
            'success' => true,
            'data' => $combinedData
        ]);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \App\Http\Requests\StoreCompanyRequest  $request
     * @return \Illuminate\Http\Response
     */
    public function store(StoreCompanyRequest $request)
    {
        try {
            // Crear una nueva empresa
            $newCompany = Company::create($request->all());
    
            // Validar y guardar el archivo PDF
            $request->validate([
                'document' => 'required|mimes:pdf|max:2048',
            ]);
    
            if ($request->hasFile('document')) {
                $pdfFile = $request->file('document');
                $pdfFileName = time() . '_' . $pdfFile->getClientOriginalName();
                $pdfPath = $pdfFile->storeAs('documents', $pdfFileName);
    
                // Actualizar la columna pdf_document en la tabla companies con la ruta al archivo guardado
                $newCompany->update([
                    'document' => $pdfPath,
                ]);
            }
    
            return response()->json(['success' => true, 'data' => new CompanyResource($newCompany)]);
        } catch (\Throwable $th) {
            // Manejar errores de validación explícitamente
            if ($th instanceof \Illuminate\Validation\ValidationException) {
                return response()->json(['success' => false, 'message' => $th->validator->getMessageBag()]);
            }
            return response()->json(['success' => false, 'message' => $th->getMessage()]);
        }
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Company  $company
     * @return \Illuminate\Http\Response
     */
    public function show(Company $company)
    {
        try {
            return response()->json(['success' => true, 'data' => new CompanyResource($company)]);
        } catch (\Throwable $th) {
            // Handle the error
            return response()->json(['success' => false, 'message' => $th->getMessage()]);
        }
    }


    /**
     * Update the specified resource in storage.
     *
     * @param  \App\Http\Requests\UpdateCompanyRequest  $request
     * @param  \App\Models\Company  $company
     * @return \Illuminate\Http\Response
     */
    public function update(UpdateCompanyRequest $request, Company $company)
    {

          try{
             $company->update($request->all());

      
        return response()->json(['success' => true, 'data' => new CompanyResource($company)]);
    } catch (\Throwable $th) {
        // Manejar el error
        return response()->json(['success' => false, 'message' => $th->getMessage()]);
    }
    }
    
    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Company  $company
     * @return \Illuminate\Http\Response
     */
    public function destroy(Company $company)
    {
        try {
            $company->delete();
            return response()->json(['success' => true, 'message' => 'Compañia Eliminada correctamente']);
        } catch (\Throwable $th) {
            return response()->json(['success' => false, 'message' => 'Error al eliminar la Compañia']);
        }
    }
   
}
