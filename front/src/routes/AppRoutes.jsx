import { Router, Routes, Route } from 'react-router-dom';
import { HashRouter } from 'react-router-dom';
import Login from '../pages/Login/Login';
import MenuPrincipal from "../pages/Menu/MenuPrincipal"
import RegistroSocios from "../pages/RegistrarSocios/RegistroSocios"
import RegistroCobros from "../pages/RegistrarCobros/RegistroCobros"
import AccesoSocios from "../pages/AccesoSocios/ModalsAcceso"
import Planes from "../pages/Admin/AdminPlanes"
import AdminSocios from '../pages/Admin/AdminSocios';
import Historial from '../pages/Historial/Historial';
import DeudasPage from '../pages/Deudas/DeudasPage';
import EstadisticasSocios from '../pages/GraficosEstadisticos/EstadisticasSocios';
import SociosEstado from '../pages/EstadoSocios/SociosEstado';
import CajaPage from '../pages/Admin/CajaPage';
function AppRoutes() {
    return (
        <HashRouter>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/menu" element={<MenuPrincipal />} />
                <Route path="/registro_socios" element={<RegistroSocios />} />
                <Route path="/registro_cobros" element={<RegistroCobros />} />
                <Route path="/acceso_socios" element={<AccesoSocios />} />
                <Route path="/planes" element={<Planes />} />
                <Route path="/socios" element={<AdminSocios />} />
                <Route path="/historial" element={<Historial />} />
                <Route path="/deudas" element={<DeudasPage />} />
                <Route path="/estado" element={<SociosEstado />} />
                <Route path="/caja" element={<CajaPage />} />
                <Route path="/estadisticas" element={<EstadisticasSocios />} />
            </Routes>
        </HashRouter>
    );
}

export default AppRoutes;
