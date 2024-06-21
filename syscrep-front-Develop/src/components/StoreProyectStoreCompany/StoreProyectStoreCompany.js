import { useState } from "react";
import axios from "axios"; // No olvides importar axios

const endpointCompany = 'http://localhost:8000/api/company';
const endpointProyect = 'http://localhost:8000/api/proyect';

function StoreProyectStoreCompany({ updateCompanys, updateProyects }) {
  const [name, setNameCompany] = useState('');
  const [nameProyect, setNameProyect] = useState('');
  const [description, setDescription] = useState('');
  const [requirements, setRequirements] = useState('');
  const [offer, setOffer] = useState('');
  const [expiration, setExpiration] = useState('');
  const [remuneration, setRemuneration] = useState('');
  const [resident_number, setResident_number] = useState('');
  const [email, setEmail] = useState('');
  const [phone_number, setPhone_number] = useState('');

  const storecompany = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(endpointCompany, { name });
      // Llama a la función de actualización proporcionada por el padre
      updateCompanys(response.data.data);
    } catch (error) {
      console.error('Error al crear la empresa:', error);
    }
  };

  const storeproyect = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(endpointProyect, {
        nameProyect,
        description,
        requirements,
        offer,
        expiration,
        remuneration,
        resident_number,
        email,
        phone_number,
      });
      // Llama a la función de actualización proporcionada por el padre
      updateProyects(response.data.data);
    } catch (error) {
      console.error('Error al crear el proyecto:', error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    storecompany(e);
    storeproyect(e);
  };

  return (
    <div>
      <h3>Create Company and Project</h3>
      <form onSubmit={handleSubmit}>
        <div className='mb-3'>
          <label className='form-label'>Company Name</label>
          <input
            value={name}
            onChange={(e) => setNameCompany(e.target.value)}
            type='text'
            className='form-control'
          />
        </div>
        <div className='mb-3'>
          <label className='form-label'>Project Name</label>
          <input
            value={nameProyect}
            onChange={(e) => setNameProyect(e.target.value)}
            type='text'
            className='form-control'
          />
        </div>
        <div className='mb-3'>
          <label className='form-label'>Description</label>
          <input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            type='text'
            className='form-control'
          />
        </div>
        <div className='mb-3'>
          <label className='form-label'>Requirements</label>
          <input
            value={requirements}
            onChange={(e) => setRequirements(e.target.value)}
            type='text'
            className='form-control'
          />
        </div>
        <div className='mb-3'>
          <label className='form-label'>Offer</label>
          <input
            value={offer}
            onChange={(e) => setOffer(e.target.value)}
            type='text'
            className='form-control'
          />
        </div>
        <div className='mb-3'>
          <label className='form-label'>Expiration</label>
          <input
            value={expiration}
            onChange={(e) => setExpiration(e.target.value)}
            type='text'
            className='form-control'
          />
        </div>
        <div className='mb-3'>
          <label className='form-label'>Remuneration</label>
          <input
            value={remuneration}
            onChange={(e) => setRemuneration(e.target.value)}
            type='text'
            className='form-control'
          />
        </div>
        <div className='mb-3'>
          <label className='form-label'>Resident Number</label>
          <input
            value={resident_number}
            onChange={(e) => setResident_number(e.target.value)}
            type='text'
            className='form-control'
          />
        </div>
        <div className='mb-3'>
          <label className='form-label'>Email</label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type='text'
            className='form-control'
          />
        </div>
        <div className='mb-3'>
          <label className='form-label'>Phone Number</label>
          <input
            value={phone_number}
            onChange={(e) => setPhone_number(e.target.value)}
            type='text'
            className='form-control'
          />
        </div>
        <button type='submit' className='btn btn-primary'>
          Store
        </button>
      </form>
    </div>
  );
}

export default StoreProyectStoreCompany;