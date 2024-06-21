import "./Styles.css";

import React, { useState, useEffect, useContext, forwardRef, useImperativeHandle } from "react";
import { useForm } from "react-hook-form";
import { Button } from "react-bootstrap";
import axios from "axios";
import Modal from "react-modal";
import { AlumnosContext } from "../../context/AlumnosContext";
import Alumnoinfo from "./alumnoinfo";
import Swal from "sweetalert2";
import { Alert } from "react-bootstrap";

Modal.setAppElement("#root");



const Form = forwardRef((props, ref) => {
  const { register, handleSubmit, getValues, setValue, formState: { errors, isValid, isDirty } } = useForm({ mode: 'onChange' });
  const { alumno, setStatus } = useContext(AlumnosContext);
  const [displayForm, setDisplayForm] = useState({});
  const [isCredencialUploaded, setIsCredencialUploaded] = useState(false);
  const [displayResidences, setDisplayResidences] = useState({});
  //const [residencesProyectid, setResidencesProyectid] = useState(null);
  //const [companyId, setCompanyId] = useState(null);
  //const [residencesLoaded, setResidencesLoaded] = useState(false);
  //const [proyectLoaded, setProyectLoaded] = useState(false);
  //const [displayProyects, setDisplayProyects] = useState({});
  //const [displayCompanys, setDisplayCompanys] = useState({});


  // Función para guardar el progreso del formulario
  const saveForm = async () => {
    const formData = getValues();
    console.log("Guardando formulario:", formData);
    try {
      const response = await axios.put(
        process.env.REACT_APP_API_URL + "student/" + alumno + "/form",
        formData
      );
      if (response.status === 200) {
        Swal.fire("Exito", "Formulario guardado correctamente", "success");
        // Actualizar el estado displayForm aquí con los datos guardados
        setDisplayForm(formData);
      } else {
        console.error("Error al guardar el formulario");
      }
    } catch (error) {
      console.error("Error al guardar el formulario:", error);
      Swal.fire("Error", "Ocurrió un error al guardar el formulario", "error");
    }
  };

  useImperativeHandle(ref, () => ({
    saveForm
  }));

  useEffect(() => {

  }, []);

  const onSubmit = async (data) => {
    if (!isCredencialUploaded) {
      Swal.fire("Error", "Debes cargar la credencial antes de enviar el formulario.", "error");
      return;
    }

    if (Object.keys(errors).length === 0) {
      console.log("Datos recibidos del formulario:", data);
      setStatus(7);
      try {

        console.log("Datos a enviar:");

        const response = await axios.post(
          process.env.REACT_APP_API_URL + "student/" + alumno + "/form"
        );

        if (response.status === 200) {
          saveForm();
          Swal.fire("Exito", "Datos enviados correctamente", "success");
          console.log("Datos enviados correctamente a la API");
        } else {
          console.error("Error al enviar los datos a la API");
        }
      } catch (error) {
        console.error("Error:", error);
        Swal.fire(
          "Error",
          "Ocurrio un error al intentar enviar los datos",
          "error"
        );
      }
    } else {
      Swal.fire("Error", "Por favor, completa todos los campos requeridos.", "error");
    }


  };

  // Llama a ShowForm al montar el componente
  useEffect(() => {
    const cargarDatosFormulario = async () => {
      try {
        const { data } = await axios.get(
          process.env.REACT_APP_API_URL + "student/" + alumno + "/form"
        );
        setDisplayForm(data.data);
        Object.keys(data.data).forEach(key => {
          setValue(key, data.data[key]);
        });
        console.log(data);
      } catch (error) {
        console.error("Error al obtener el formulario:", error);
      }
    }

//este codigo sirve para autorrellenar el formulario cuando el alumno eliga un proyecto 
//de una empresa. para que este codigo funciones correctamente debes comentar la const cargarDatosFormulario
//descomenta setIsCredencialUploaded(true) cuando descomentes este codigo

   // const fetchData = async () => {
      //try {
      //  const residencesResponse = await axios.get(process.env.REACT_APP_API_URL + "residences/" + alumno);
      //  const residencesData = residencesResponse.data.data;
     //   setDisplayResidences(residencesData);

       // await new Promise(resolve => setTimeout(resolve, 500));

       // if (residencesData.proyect.id === null) {
        //  console.log("residencesData.proyect.id es null. Saltando el resto del código.");
        //  setResidencesLoaded(true);
       //   return; // Salir del flujo actual
       // }

      //  const proyectsResponse = await axios.get(process.env.REACT_APP_API_URL + "proyect/" + residencesData.proyect.id + "/proyectId");
      //  const proyectsData = proyectsResponse.data.data;
      //  setDisplayProyects(proyectsData);

       // await new Promise(resolve => setTimeout(resolve, 500));

      //  const companysResponse = await axios.get(process.env.REACT_APP_API_URL + "company/" + proyectsData.company_id);
      //  const companysData = companysResponse.data.data;
     //   setDisplayCompanys(companysData);


     //   if (residencesData.selectedProyect === 0) {
       //   const { data } = await axios.get(process.env.REACT_APP_API_URL + "student/" + alumno + "/form");
       //   setDisplayForm(data.data);
       //   Object.keys(data.data).forEach(key => {
       //     setValue(key, data.data[key]);
       //   });
       //   console.log(data);
       // } else {
       //   await new Promise(resolve => setTimeout(resolve, 500));
       //   const { data } = await axios.get(process.env.REACT_APP_API_URL + "company/data/" + companysData.id + "/" + proyectsData.id);
       //   setDisplayForm(data.data);
       //   Object.keys(data.data).forEach(key => {
       //     setValue(key, data.data[key]);
       //   });
          //console.log(data);
       // }

      //  setResidencesLoaded(true);
     // } catch (error) {
     //   console.error("Error al obtener los datos:", error);
      //}
    //};

    //fetchData();
    const verificarCredencial = async () => {
      try {
        const response = await axios.get(process.env.REACT_APP_API_URL + `IdentStudent/${alumno}`);
        if (response.status === 200) {
          // Si la respuesta es exitosa, asume que la credencial está cargada
          setIsCredencialUploaded(true);
        }
      } catch (error) {
        console.error("Error al verificar la credencial", error);
      }
    };

    //setIsCredencialUploaded(true);
    verificarCredencial();
    cargarDatosFormulario();
  }, [alumno, setValue]); // Asegúrate de incluir setValue y cualquier otra dependencia necesaria


  useEffect(() => {
    const cargarDatosFormulario = async () => {
      try {
        const { data } = await axios.get(
          process.env.REACT_APP_API_URL + "student/" + alumno + "/form"

        );
        setDisplayForm(data.data);
        //setResidencesLoaded(true);

        Object.keys(data.data).forEach(key => {
          setValue(key, data.data[key]);
        });
        console.log(data);
      } catch (error) {
        console.error("Error al obtener el formulario:", error);
        //setResidencesLoaded(true);

      }
    };


    cargarDatosFormulario();
  }, [alumno, setValue]); // Asegúrate de incluir setValue y cualquier otra dependencia necesaria

  return (

    <form className="Formulario" onSubmit={handleSubmit(onSubmit)}>

      <div className="fixed-header"></div>
     {/* {residencesLoaded ? (*/}
        <div>

          <div className="contenedor">
            <div className="Title">
              <p>
                Formulario para la generación de formato de Solicitud De Registro
                de Residencias Profesionales y Carta de Presentación de ITH
              </p>
            </div>
          </div>

          <br />
          <br />
          <div className="contenedor2">
            <div className="Title2">
              El presente formulario se debe llenar en una sola ocasión por el
              estudiante interesado, cuidando que la información completada en
              cada campo sea correcta y actualizada.
            </div>
          </div>
          <br />

          <div className="contenedor4">
            <h2>Informacion del Alumno</h2>
            <br />
            <div className="Title4">
              <Alumnoinfo />
              <br />
              <h4>Informacion adicional del Alumno</h4>
              En este apartado brindas datos personales que serán utilizados
              únicamente para fines académicos y administrativos, derivados del
              procedimiento de residencias profesionales.
              <br />
              <br />
              <br />
              7. Indica calle y numero*
              <br />
              Indicar nombre de calle y número de tu domicilio <br />
              <input
                defaultValue={displayForm.calleyNum || ""} type="text" {...register("calleyNum", { required: true })} />
              {errors.calleyNum && <span>Este campo es obligatorio</span>}
              <br />
              <br />
              8. Indica Colonia
              <br />
              Indicar nombre de la colonia donde vives
              <br />
              <input defaultValue={displayForm.colonia || ""} type="text" {...register("colonia", { required: true })}></input>
              <br />
              <br />
              9. Indica la ciudad donde resides
              <br />
              Indicar nombre de la Ciudad donde vives.
              <br />
              <input defaultValue={displayForm.ciudad || ""} type="text" {...register("ciudad", { required: true })} onChange={(e) => {
                e.target.value = e.target.value.toUpperCase();
              }}></input>
              <br />
              <br />
              10. Indica tu telefono celular
              <br />
              Comparte el número de celular donde podemos contactarte.
              <br />
              <input defaultValue={displayForm.telefonoCelular || ""} type="text" {...register("telefonoCelular", { required: true })}></input>
              <br />
              <br />
              11. Indica tu telefono de casa
              <br />
              Comparte el número de CASA donde podemos contactarte.
              <br />
              <input defaultValue={displayForm.telefonoCasa || ""} type="text" {...register("telefonoCasa", { required: true })}></input>
              <br />
              <br />
              12. Indica tu numero de seguro social
              <br />
              Número de Seguridad Social (Seguro facultativo del IMSS que te
              otorga la escuela UNICAMENTE ), en caso de no tenerlo, favor de
              solicitarlo en Servicios Escolares del ITH.
              <br />
              <input defaultValue={displayForm.nss || ""} type="text" {...register("nss", { required: true })}></input>
              <br />
              <br />
              13. Selecciona tu genero
              <br />
              <select {...register("genero", { required: true })}>
                <option defaultValue=""></option>
                <option defaultValue="Masculino" selected={displayForm.genero === "MASCULINO"}>
                  Masculino
                </option>
                <option defaultValue="Femenino" selected={displayForm.genero === "FEMENINO"}>
                  Femenino
                </option>
                <option defaultValue="Otro" selected={displayForm.genero === "OTRO"}>
                  Otro
                </option>
              </select>
              <br />
              <br />
              14. Indica tu Correo Institucional
              <br />
              Escribe tu correo electrónico que utilizas como estudiante del ITH
              <br />
              <input defaultValue={displayForm.correoInstitucional || ""} type="text" {...register("correoInstitucional", { required: true })}></input>
              <br />
              <br />
              15. Indica tu Correo Personal
              <br />
              Escribe tu correo electrónico que utilizas actualmente, donde
              podemos enviarte en el futuro ofertas de trabajo o información
              relevante para tu desarrollo profesional.
              <br />
              <input defaultValue={displayForm.correoPersonal || ""} type="text" {...register("correoPersonal", { required: true })}></input>
              <br />
              <br />
            </div>
          </div>

          <br />
          <br />

         {/* {displayResidences.selectedProyect !== 0 && (
            <div id="Alerta">
              Algunas de las características se autocompletaron al usted elegir un proyecto.<br />
              No olvides verificar que los datos estén correctos.<br /><br />
            </div>
          )}*/}

          <div className="contenedor4">
            <h2>Informacion de la empresa</h2>
            <br />
            <div className="Title4">
              16. Razón Social de las empresa donde realizaras tus residencias
              <br />
              Se refiere al nombre con el que está dado de alta en Hacienda (SAT){" "}
              <br />
              <input defaultValue={displayForm.razonSocial || ""} type="text" {...register("razonSocial", { required: true })} onChange={(e) => {
                e.target.value = e.target.value.toUpperCase();
              }}></input>
              <br />
              <br />
              17. Nombre comercial de la Empresa
              <br />
              Se refiere al nombre con el que se conoce comercialmente a la
              empresa. Si la empresa tiene diversas sucursales o filiales, favor
              de especificar en qué sucursal o filial estarás haciendo tus
              residencias. <br />
              <input defaultValue={displayForm.nombreEmpresa || ""} type="text" {...register("nombreEmpresa", { required: true })} onChange={(e) => {
                e.target.value = e.target.value.toUpperCase();
              }}></input>
              <br />
              <br />
              18. Rfc de la empresa <br />
              Registro Federal de Contribuyentes <br />
              <input defaultValue={displayForm.rfcEmpresa || ""} type="text" {...register("rfcEmpresa", { required: true })} onChange={(e) => {
                e.target.value = e.target.value.toUpperCase();
              }}></input>
              <br />
              <br />
              19. Misión de la empresa <br />
              Incluye la misión de la empresa (en caso de que la misión tenga más
              de un párrafo, solo incluir el primero). <br />
              <textarea defaultValue={displayForm.misionEmpresa || ""}
                className="custom-input"
                {...register("misionEmpresa", { required: true })}
                type="text"
              ></textarea>
              <br />
              <br />
              20. Dirección de la empresa <br />
              Nombre de la calle, números <br />
              <textarea defaultValue={displayForm.direccionEmpresa || ""}
                className="textarea_direccion"
                {...register("direccionEmpresa", { required: true })}
                type="text"
              ></textarea>
              <br />
              <br />
              21. Colonia en donde se ubica la empresa <br />
              <input defaultValue={displayForm.coloniaEmpresa || ""} type="text" {...register("coloniaEmpresa", { required: true })} onChange={(e) => {
                e.target.value = e.target.value.toUpperCase();
              }}></input>
              <br />
              <br />
              22. Telefóno de la empresa (diferente a la de tu asesor externo){" "}
              <br />
              <input defaultValue={displayForm.telefonoEmpresa || ""} type="text" {...register("telefonoEmpresa", { required: true })} onChange={(e) => {
                e.target.value = e.target.value.toUpperCase();
              }}></input>
              <br />
              <br />
              23. Correo de la empresa (diferente a la de tu asesor externo){" "}
              <br />
              <input defaultValue={displayForm.correoEmpresa || ""} type="text" {...register("correoEmpresa", { required: true })} onChange={(e) => {
                e.target.value = e.target.value.toUpperCase();
              }}></input>
              <br />
              <br />
              24. Ciudad donde se encuentra ubicada la empresa <br />
              <input defaultValue={displayForm.ciudadEmpresa || ""} type="text" {...register("ciudadEmpresa", { required: true })} onChange={(e) => {
                e.target.value = e.target.value.toUpperCase();
              }}></input>
              <br />
              <br />
              25. Código postal de la empresa <br />
              <input defaultValue={displayForm.cpEmpresa || ""} type="text" {...register("cpEmpresa", { required: true })}></input>
              <br />
              <br />
              26. Título de la persona a quien dirigiremos la carta de
              presentacion y agradecimiento <br />
              Es el nombre de la persona a quien dirigiremos el oficio de
              presentacion y agradecieminto, generalmente es el titular de la
              empresa, Director(a), Gerente General, o el nombre que te hayan
              indicado. <br />
              <select {...register("tituloPersonatitular", { required: true })} >
                <option defaultValue=""></option>
                <option value={"ING."} selected={displayForm.tituloPersonatitular === "ING."}> ING.</option>
                <option value={"LIC."} selected={displayForm.tituloPersonatitular === "LIC."}>LIC.</option>
                <option value={"M.C"} selected={displayForm.tituloPersonatitular === "M.C."}>M.C</option>
                <option value={"M.A"} selected={displayForm.tituloPersonatitular === "M.A."}>M.A</option>
                <option value={"DR."} selected={displayForm.tituloPersonatitular === "DR."}>DR.</option>
                <option value={"C."} selected={displayForm.tituloPersonatitular === "C."}>C.</option>
              </select>
              <br />
              <br />
              27. Nombre de la persona a quien dirigiremos el oficio de
              presentacion y agradecimiento <br />
              Es el nombre de la persona a quien dirigiremos el oficio de
              presentacion y agradecimiento, generalmente es el titular de la
              empresa, Director(a), Gerente General, o el nombre que te hayan
              indicado. <br />
              <br />
              Inicia por Nombre(s) - Apellido paterno - Apellido Materno <br />
              <input defaultValue={displayForm.nombrePersonatitular} type="text" {...register("nombrePersonatitular", { required: true })} onChange={(e) => {
                e.target.value = e.target.value.toUpperCase();
              }}></input>
              <br />
              <br />
              28. Cargo/puesto de la persona a quien se dirigue la carta de de
              presentación <br />
              <input defaultValue={displayForm.cargoPersonatitular} type="text" {...register("cargoPersonatitular", { required: true })} onChange={(e) => {
                e.target.value = e.target.value.toUpperCase();
              }}></input>
              <br />
              <br />
              29. Nombre de la persona responsable del programa de residencias
              profesionales en la empresa <br /> <br />
              Inicia por Nombre(s) - Apellido paterno - Apellido Materno <br />
              <input defaultValue={displayForm.reponsableResidencias || ""} type="text" {...register("responsableResidencias", { required: true })} onChange={(e) => {
                e.target.value = e.target.value.toUpperCase();
              }}></input>
              <br />
              <br />
              30. Cargo/puesto de la persona responsable del programa de
              residencias en la empresa <br />
              <input
                defaultValue={displayForm.cargoResponsableResidencias} type="text"
                {...register("cargoResponsableResidencias", { required: true })}
              ></input>
              <br />
              <br />
              31. Selecciona el tamaño de la empresa <br />
              <select {...register("tamañoEmpresa", { required: true })}>
                <option defaultValue=""></option>
                <option value={"GRANDE"} selected={displayForm.tamañoEmpresa === "GRANDE"} >Grande</option>
                <option value={"MEDIANA"} selected={displayForm.tamañoEmpresa === "MEDIANA"}> Mediana</option>
                <option value={"PEQUEÑA"} selected={displayForm.tamañoEmpresa === "PEQUEÑA"}> pequeña</option>
                <option value={"MICRO"} selected={displayForm.tamañoEmpresa === "MICRO"} >Micro</option>
              </select>
              <br />
              <br />
              32. Selecciona el sector de la empresa <br />
              <select {...register("sectorEmpresa", { required: true })}>
                <option defaultValue=""></option>
                <option value={"PRIVADO"} selected={displayForm.sectorEmpresa === "PRIVADO"} >Privado</option>
                <option value={"PUBLICO"} selected={displayForm.sectorEmpresa === "PUBLICO"} >Publico</option>
              </select>
              <br />
              <br />
              33. Selecciona el giro de la empresa <br />
              <select {...register("giroEmpresa", { required: true })}>
                <option defaultValue=""></option>
                <option value={"INDUSTRIAL"} selected={displayForm.giroEmpresa === "INDUSTRIAL"} >Industrial</option>
                <option value={"SERVICIOS"} selected={displayForm.giroEmpresa === "SERVICIOS"} >Servicios</option>
              </select>
              <br />
              <br />
              34. Selecciona si la empresa es una institución académica (Escuela){" "}
              <br />
              <select {...register("EsInstitucionAcademica", { required: true })}>
                <option defaultValue=""></option>
                <option value={"SI"} selected={displayForm.EsInstitucionAcademica === "SI"} >Si</option>
                <option value={"NO"} selected={displayForm.EsInstitucionAcademica === "NO"} >No</option>
              </select>
              <br />
              <br />
              35. Selecciona si la empresa es una empresa social sin fines de
              lucro <br />
              <select {...register("EsEmpresaSinFinesDeLucro", { required: true })}>
                <option defaultValue=""></option>
                <option value={"SI"} selected={displayForm.EsEmpresaSinFinesDeLucro === "SI"} >Si</option>
                <option value={"NO"} selected={displayForm.EsEmpresaSinFinesDeLucro === "NO"} >No</option>
              </select>
              <br />
              <br />
              36. Selecciona la industria a la que pertenece la empresa donde
              harás tus residencias <br />
              <select {...register("Industria", { required: true })}>
                <option defaultValue=""></option>
                <option value="AGRICULTURA; PLANTACIONES, OTROS SECTORES RURALES" selected={displayForm.Industria === "AGRICULTURA; PLANTACIONES, OTROS SECTORES RURALES"}>
                  Agricultura; plantaciones, otros sectores rurales
                </option>
                <option value="ALIMENTACIÓN; BEBIDAS; TABACO" selected={displayForm.Industria === "ALIMENTACIÓN; BEBIDAS; TABACO"}>
                  Alimentación; bebidas; tabaco
                </option>
                <option value="COMERCIO" selected={displayForm.Industria === "COMERCIO"}>Comercio</option>
                <option value="CONSTRUCCION" selected={displayForm.Industria === "CONSTRUCCION"}>Construccion</option>
                <option value="EDUCACIÓN" selected={displayForm.Industria === "EDUCACIÓN"}>Educación</option>
                <option value="FABRICACIÓN DE MATERIAL DE TRANSPORTE" selected={displayForm.Industria === "FABRICACIÓN DE MATERIAL DE TRANSPORTE"}>
                  Fabricación de material de transporte
                </option>
                <option value="FUNCIÓN PÚBLICA" selected={displayForm.Industria === "FUNCIÓN PÚBLICA"}>Función pública</option>
                <option value="HOTELERÍA, RESTAURACIÓN, TURISMO" selected={displayForm.Industria === "HOTELERÍA, RESTAURACIÓN, TURISMO"}>
                  Hotelería, restauración, turismo
                </option>
                <option value="INDUSTRIAS QUÍMICAS" selected={displayForm.Industria === "INDUSTRIAS QUÍMICAS"}>Industrias químicas</option>
                <option value="INGENIERIA MECÁNICA Y ELÉCTRICA" selected={displayForm.Industria === "INGENIERIA MECÁNICA Y ELÉCTRICA"}>
                  Ingenieria mecánica y eléctrica
                </option>
                <option value="MEDIOS DE COMUNICACIÓN; CULTURA; GRÁFICOS" selected={displayForm.Industria === "MEDIOS DE COMUNICACIÓN; CULTURA; GRÁFICOS"}>
                  Medios de comunicación; cultura; gráficos
                </option>
                <option value="MINERÍA (CARBÓN, OTRA MINERÍA)" selected={displayForm.Industria === "MINERÍA (CARBÓN, OTRA MINERÍA)"}>
                  Minería (carbón, otra minería)
                </option>
                <option value="PETROLEO Y PRODUCCIÓN DE GAS; REFINACIÓN DE PETROLEO" selected={displayForm.Industria === "PETROLEO Y PRODUCCIÓN DE GAS; REFINACIÓN DE PETROLEO"}>
                  Petroleo y producción de gas; refinación de petroleo
                </option>
                <option value="PRODUCCIÓN DE METALES BÁSICOS" selected={displayForm.Industria === "PRODUCCIÓN DE METALES BÁSICOS"}>
                  Producción de metales básicos
                </option>
                <option value="SERVICIOS DE CORREOS Y DE TELECOMUNICACIONES" selected={displayForm.Industria === "SERVICIOS DE CORREOS Y DE TELECOMUNICACIONES"}>
                  Servicios de correos y de telecomunicaciones
                </option>
                <option value="SERVICIOS DE SALUD" selected={displayForm.Industria === "SERVICIOS DE SALUD"} >Servicios de salud</option>
                <option value="SERVICIOS FINANCIEROS; SERVICIOS PROFESIONALES" selected={displayForm.Industria === "SERVICIOS FINANCIEROS; SERVICIOS PROFESIONALES"}>
                  Servicios financieros; servicios profesionales
                </option>
                <option value="SERVICIOS PÚBLICOS (AGUA; GAS; ELECTRICIDAD)" selected={displayForm.Industria === "SERVICIOS PÚBLICOS (AGUA; GAS; ELECTRICIDAD)"}>
                  Servicios públicos (agua; gas; electricidad)
                </option>
                <option value="SILVICULTURA; MADERA; CELULOSA; PAPEL" selected={displayForm.Industria === "SILVICULTURA; MADERA; CELULOSA; PAPEL"}>
                  Silvicultura; madera; celulosa; papel
                </option>
                <option value="TEXTILES; VESTIDO; CUERO; CALZADO" selected={displayForm.Industria === "TEXTILES; VESTIDO; CUERO; CALZADO"}>
                  Textiles; vestido; cuero; calzado
                </option>
                <option value="TRANSPORTE (INCLUYENDO AVIACIÓN CIVIL; FERROCARRILES; TRANSPORTE POR CARRETERA)" selected={displayForm.Industria === "TRANSPORTE (INCLUYENDO AVIACIÓN CIVIL; FERROCARRILES; TRANSPORTE POR CARRETERA)"}>
                  Transporte (incluyendo aviación civil; ferrocarriles; transporte
                  por carretera)
                </option>
                <option value="TRANSPORTE MARÍTIMO; PUERTOS; PESCA; TRANSPORTE INTERIOR" selected={displayForm.Industria === "TRANSPORTE MARÍTIMO; PUERTOS; PESCA; TRANSPORTE INTERIOR"}>
                  Transporte marítimo; puertos; pesca; transporte interior
                </option>
              </select>
              <br />
              <br />
            </div>
          </div>
          <br />
          <br />

          <div class="contenedor4">
            <h2>Información del proyecto </h2>

            <div className="Title4">
              37. Selecciona el origen de tu proyecto <br />
              "Trabajador" cuando el proyecto te lo asignó la empresa.
              <br />
              "Banco de proyectos" cuando el proyecto se ofreció a través del
              Departamento de Gestión Tecnológica y Vinculación.
              <br />
              "Propuesta propia" cuando tu has propuesto el proyecto a la empresa.{" "}
              <br />
              <select {...register("OrigenProyecto", { required: true })}>
                <option defaultValue=""></option>
                <option value={"TRABAJADOR"} selected={displayForm.OrigenProyecto === "TRABAJADOR"}>Trabajador</option>
                <option value={"BANCO DE PROYECTOS"} selected={displayForm.OrigenProyecto === "BANCO DE PROYECTOS"}>Banco de Proyectos</option>
                <option value={"PROPUESTA PROPIA"} selected={displayForm.OrigenProyecto === "PROPUESTA PROPIA"}>Propuesta propia</option>
              </select>
              <br />
              <br />
              38. Escribe el nombre completo del proyecto <br />
              Cuida la ortografía, el oficio tendrá este nombre tal y como lo
              escribes <br />
              <textarea
                className="textarea_direccion"
                {...register("nombreProyecto", { required: true })}
                type="text" defaultValue={displayForm.nombreProyecto || ""}
              ></textarea>
              <br />
              <br />
              39. Indica el numero de estudiantes que participarán en el desarollo
              de proyecto (solamente se pueden elegir dos o más cuando el proyecto
              es el mismo, es decir que tiene el mismo nombre). <br />
              <select {...register("numeroEstudiantes", { required: true })}>
                <option defaultValue=""></option>
                <option value={1} selected={displayForm.numeroEstudiantes === "1"}>1</option>
                <option value={2} selected={displayForm.numeroEstudiantes === "2"}>2</option>
                <option value={3} selected={displayForm.numeroEstudiantes === "3"}>3</option>
                <option value={4} selected={displayForm.numeroEstudiantes === "4"}>4</option>
              </select>
              <br />
              <br />
              40. indica la fecha de inicio de tu proyecto
              <br />
              (revisa si en las indicaciones de tu coordinador de residencias te
              indicó una fecha de inicio o si aceptó la que tu habías reportado en
              tu proyecto):
              <br />
              <input defaultValue={displayForm.fechaInicio || " "} type="Date" {...register("fechaInicio", { required: true })}></input>
              <br />
              <br />
              41. Indica la fecha de terminación de tu proyecto. El periodo de tus
              residencias debe coincidir con las autorizadas por tu coordinador de
              residencias. :<br />
              <input defaultValue={displayForm.fechaFin || " "} type="Date" {...register("fechaFin", { required: true })}></input>
              <br />
              <br />
              42. Nombre del Administrador de recidencias :<br /> <br />
              Un administrador de residencias universitarias es una persona encargada de supervisar y gestionar los aspectos 
              operativos y administrativos <br />
              Inicia por Nombre(s) - Apellido paterno - Apellido Materno <br />
              <input defaultValue={displayForm.nombreAdministradorResidencia || " "} type="text" {...register("nombreAdministradorRecidencia", { required: true })} onChange={(e) => {
                e.target.value = e.target.value.toUpperCase();
              }}></input>
              <br />
              <br />
              43. Nombre del asesor interno <br /> <br />
              Asesor interno es la persona que dará seguimiento a tu proyecto de
              residencias dentro del Instituto <br />
              Inicia por Nombre(s) - Apellido paterno - Apellido Materno <br />
              <input defaultValue={displayForm.nombreAsesorInterno || " "} type="text" {...register("nombreAsesorInterno", { required: true })} onChange={(e) => {
                e.target.value = e.target.value.toUpperCase();
              }}></input>
              <br />
              <br />
              44. Nombre del asesor externo <br /> <br />
              Asesor externo es la persona que dará seguimiento a tu proyecto de
              residencias dentro de la empresa, <br />
              Inicia por Nombre(s) - Apellido paterno - Apellido Materno <br />
              <input defaultValue={displayForm.nombreAsesorExterno || " "} type="text" {...register("nombreAsesorExterno", { required: true })} onChange={(e) => {
                e.target.value = e.target.value.toUpperCase();
              }}></input>
              <br />
              <br />
              45. Cargo/puesto del asesor externo <br /> <br />
              <input defaultValue={displayForm.puestoAsesorExterno || " "} type="text" {...register("puestoAsesorExterno", { required: true })} onChange={(e) => {
                e.target.value = e.target.value.toUpperCase();
              }}></input>
              <br />
              <br />
              46. E-mail de tu asesor externo <br /> <br />
              <input defaultValue={displayForm.correoAsesorExterno || " "} type="text" {...register("correoAsesorExterno", { required: true })} onChange={(e) => {
                e.target.value = e.target.value.toUpperCase();
              }}></input>
              <br />
              <br />
              47. Numero de telefono de tu asesor externo <br /> <br />
              <input defaultValue={displayForm.numeroAsesorExterno || " "} type="text" {...register("numeroAsesorExterno", { required: true })}></input>
              <br />
              <br />
              48. Tu asesor externo es egresado del ITH <br />
              <select {...register("AsesorExternoEgresadoITH", { required: true })}>
                <option defaultValue=""></option>
                <option value={"SI"} selected={displayForm.AsesorExternoEgresadoITH === "SI" || ""}>Si</option>
                <option value={"NO"} selected={displayForm.AsesorExternoEgresadoITH === "NO" || ""}>No</option>
                <option value={"LO DESCONOZCO"} selected={displayForm.AsesorExternoEgresadoITH === "LO DESCONOZCO" || ""}>Lo desconozco</option>
              </select>
              <br />
              <br />
            </div>
          </div>
          <br />
          <br />
          {!isCredencialUploaded && <Alert variant="warning">Es necesario enviar la credencial para enviar el formulario. Presione el botón de guardar para guardar el progreso de su formulario, cierre el formulario y envie su credencial.</Alert>}
          <Button
            type="submit"
            className="save-button"
            disabled={!isCredencialUploaded}
          >
            Enviar
          </Button>
        </div>
      {/*]) : (
        <div>Cargando...</div>
      )}*/}
    </form>
  );
});

export default Form;
