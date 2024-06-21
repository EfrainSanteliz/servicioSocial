import React, { useState } from 'react';
import Modal from 'react-modal';

// Establecer la aplicación root para el modal
Modal.setAppElement('#root');

const CustomModal = ({ isOpen, closeModal, content }) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={closeModal}
      contentLabel="Modal"
    >
      <div>
        <h2>Registrar Compañias</h2>
        <p>{content}</p>
        <button onClick={closeModal}>Cerrar</button>
      </div>
    </Modal>
  );
};

export default CustomModal;