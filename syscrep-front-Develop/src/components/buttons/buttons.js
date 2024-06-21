import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import { Row , Col, Container} from 'react-bootstrap';
import './buttons.css';

import DownloadReportForm from '../DowloadReportForm/downloadportform';
import ReportUploadForm from '../UploadReportForm/uploadreportform';

function Buttons({uploadUrl, studentId}) {
  return (


    <Tabs
      defaultActiveKey="Inicio"
      id="fill-tab-example"
      className="mb-3"
      fill
    >
      <Tab eventKey="Inicio" title="Inicio">
       Tab content for Profile
      </Tab>

      <Tab eventKey="Paso 1" title="Paso 1">
        <div id='downloadcard'>
          <DownloadReportForm/>
        </div>
      </Tab>

      <Tab eventKey="Paso 2" title="Paso 2">
        <div id='uploadcard'>
          <ReportUploadForm uploadUrl={uploadUrl} studentId={studentId} />
        </div>
      </Tab>

      <Tab eventKey="Paso 3" title="paso 3" disabled>
        Tab content for Contact
      </Tab>

    </Tabs>
  );
}

export default Buttons;