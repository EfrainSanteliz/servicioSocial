import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock } from '@fortawesome/free-solid-svg-icons';

function CardBlocker({show}) {
    const style = {
        darker: {
            display: 'flex',
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'rgba(0, 0, 0, 0.50)', // Oscurecimiento con un color negro al 50%
            justifyContent: 'center',
            alignText: 'center',
            color: 'white',
            alignItems: 'center',
            flexDirection: 'column-reverse',
        },

        icon: {
            height: '5em',
        }
    };

    return (
        show && (
        <div style={style.darker}>
            <FontAwesomeIcon icon={faLock} style={style.icon} /> {/* Icono de candado */}
            <h1>Bloqueado</h1>
        </div>
        ));
    }

export default CardBlocker;