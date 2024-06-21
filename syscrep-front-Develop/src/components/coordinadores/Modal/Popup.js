import React, { useState } from 'react'
import { Modal, Button } from 'react-bootstrap'


function Popup({ nombre, Contenido, openFunc, children }) {
    const [show, setShow] = useState(false)

    const handleClose = () => setShow(false);

    const handleOpen = () => {
        openFunc()
        setShow(true);
    }

    return (
        <div>
            <Button onClick={handleOpen}>{nombre}</Button>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{nombre}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Contenido />
                </Modal.Body>
                <Modal.Footer>
                    {children(handleClose) /*Pasar la funcion de cerrado a los botones personalizados*/}
                </Modal.Footer>
            </Modal>
        </div>
    )
}

export default Popup