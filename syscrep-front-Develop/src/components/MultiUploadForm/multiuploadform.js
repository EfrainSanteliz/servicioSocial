import React from 'react';
import FileUploadButton from '../Uploadbutton/uploadbutton';
import './multiuploadformStyle.css';

function MultiUploadForm() {
    const uploadUrls = [
      "http://localhost/siscrep/upload.php", 
      "http://localhost/siscrep/upload.php", 
      "http://localhost/siscrep/upload.php"
    ];
  
    return (
      <form className="multi-upload-form">
        {uploadUrls.map((url, index) => (
            <div key={index} className="upload-section">
            <label>Subir</label>
              <FileUploadButton uploadUrl={url} uniqueIndex={index} />
              </div>
              ))}
      </form>
    );
  }
  
  export default MultiUploadForm;