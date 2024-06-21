import React, {useState} from 'react'

const TextArea = ( (props) => {

    const [value, setValue] = useState('');

     var row = props.row ? props.row : "3";
     var placeholder = props.placeholder ? props.placeholder : "";

    const handleChange = (e) => {
      setValue(e.target.value);         
    }; 

    return (
      <textarea className='form-control' style={{marginBottom:'15px'}}
        value={value}
        onChange={handleChange}
        rows={row}       
        placeholder={placeholder}
        id={props.id}
      />
    );
  });
  
  export default TextArea;