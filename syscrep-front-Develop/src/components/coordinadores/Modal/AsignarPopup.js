import React,{useState} from "react"

const BotonAsignar = ({ closeFunc, func }) => { //Boton para realizar una accion y despues cerrar el popup

    const click = () => {
        closeFunc()
        func()
    }

    return (
        <Button onClick={click}>Asignar</Button>
    )
}

//id: Id del elemento en la fila
//func: funcion a ejecutar recien abierto el modal
//btnFunc: Funcion a ejecutar cuando se presiona el boton
//data: datos utilizados para llenar el contenido
const BotonPopup = ({ id, func, btnFunc, data }) => { //Boton para abrir el popup.

    const ContenidoModal = () => {

        return (
            <FormSelect onChange={(value) => console.log(value)}>
                {
                    data.map((adviser) => (
                        <option key={adviser.id} value={adviser.id}>{adviser.name}</option>
                    ))
                }
            </FormSelect>
        );
    }

    return (
        <Popup nombre='Asignar' Contenido={ContenidoModal} openFunc={() => func(id)}>
            {(handleClose) => (<BotonAsignar closeFunc={handleClose} func={btnFunc} />)}
        </Popup>
    )
};

export default BotonPopup;