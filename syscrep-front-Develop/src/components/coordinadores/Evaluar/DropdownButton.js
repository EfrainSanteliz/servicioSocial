
import React ,{useState} from 'react';
import { Dropdown } from 'react-bootstrap';

function DropdownButton({ onSeleccion }) {

  const[selectedOpcion,setselectedopcion] = useState('Estado');


    const handleOpcionSeleccionada = (opcion) => {
      setselectedopcion(opcion);
        onSeleccion(opcion); // Llama a la función de manejo de eventos de Evaluar
      };
  return (
    <Dropdown>
      <Dropdown.Toggle variant="primary" id="dropdown-basic">
      {selectedOpcion}
      </Dropdown.Toggle>
      <Dropdown.Menu>
        <Dropdown.Item onClick={() => handleOpcionSeleccionada('Aceptado')}>Aceptado</Dropdown.Item>
        <Dropdown.Item onClick={() => handleOpcionSeleccionada('En proceso')}>En proceso</Dropdown.Item>
        <Dropdown.Item onClick={() => handleOpcionSeleccionada('Denegado')}>Denegado</Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
}

export default DropdownButton;