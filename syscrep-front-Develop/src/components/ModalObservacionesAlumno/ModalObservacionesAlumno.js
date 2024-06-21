import React, { useState } from 'react'
import Modal from 'react-bootstrap/Modal'
import { Table } from 'react-bootstrap'
import { format } from 'date-fns'

function ModalObservacionesAlumno(props) {
    const styles = {
        row: {
            display: 'flex',
            flexDirection: 'row',
        },
        num: {
            flex: .5
        },
        desc: {
            flex: 8
        },
        date: {
            flex: 1
        }
    }

    return (
        <Modal show={props.show} onHide={props.onHide}
            size="lg"
            animation="slide"
            aria-labelledby="contained-modal-title-vcenter"
            centered>
            <Modal.Header closeButton>
                <Modal.Title>
                    Historial de observaciones
                </Modal.Title>
            </Modal.Header>

            <Modal.Body>
                {props.observations.length == 0 ?
                    (<p>Sin Observaciones</p>) :
                    (
                        <Table bordered>
                            <tr style={styles.row}>
                                <th style={styles.num}>#</th>
                                <th style={styles.desc}>Observación</th>
                                <th style={styles.date}>Fecha</th>
                            </tr>

                            {props.observations.map((observation, idx) =>
                                <tr style={styles.row}>
                                    <td style={styles.num}>{props.observations.length - idx}</td>
                                    <td style={styles.desc}>{observation.observations}</td>
                                    <td style={styles.date}>{format(new Date(observation.created_at), 'dd/MM/yyyy HH:mm')}</td>
                                </tr>
                            )}

                        </Table>
                    )}

            </Modal.Body>
        </Modal>
    )
}

export default ModalObservacionesAlumno