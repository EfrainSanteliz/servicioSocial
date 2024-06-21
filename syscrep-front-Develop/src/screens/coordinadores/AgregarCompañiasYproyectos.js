import Bancodeproyectos2 from "../../components/Bancodeproyectos2/Bancodeproyectos2";
import Sidebar from "../../components/Sidebar/Sidebar";
import Navbar from "../../components/Navbar/navbar";
import './Styles.css';

function AgregarCompañiasYproyectos() {
  return (
    <div className="main-container">
    <div className="sidebarACP">
      <Sidebar />
    </div>
    <div className="content-wrapper">
      <Navbar user_type={"coordinators"} />
      <div className="content">
        <Bancodeproyectos2 />
      </div>
    </div>
  </div>
  );
}
export default AgregarCompañiasYproyectos;
