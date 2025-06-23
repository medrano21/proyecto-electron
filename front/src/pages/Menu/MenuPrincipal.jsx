import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from "../../Components/Button/Button";
import './MenuPrincipal.css';
import gymImage from '../../assets/logo.png'; // Asegúrate que la ruta sea correcta
import ModalAcceso from '../AccesoSocios/ModalsAcceso';
import Layout from "../../Components/Estructura/Layout";

const MenuPrincipal = ({ }) => {
    const navigate = useNavigate();
    const [mostrarModal, setMostrarModal] = useState(false);

    return (
        <Layout title="MENU PRINCIPAL">
            <div className="menu-container">
                <div className="menu-content">
                    <div className="menu-buttons">
                        <Button className='boton-menu' onClick={() => navigate('/registro_socios')}>REGISTRAR SOCIOS</Button>
                        <Button className='boton-menu' onClick={() => navigate('/registro_cobros')}>REGISTRAR COBROS</Button>
                        <Button className='boton-menu' onClick={() => setMostrarModal(true)}>ACCESO SOCIOS</Button>
                        <Button className='boton-menu' onClick={() => navigate('/historial')}>HISTORIAL DE COBROS</Button>
                        <Button className='boton-menu' onClick={() => navigate('/estado')}>CONSULTAR ESTADO DE LOS SOCIOS</Button>
                        <Button className='boton-menu' onClick={() => navigate('/caja')}>CONSULTAR CAJA</Button>
                        <Button className='boton-menu' onClick={() => navigate('/deudas')}>REGISTRAR DEUDAS</Button>
                    </div>
                </div>

                <div className="menu-image">
                    <img src={gymImage} alt="Imagen decorativa" />
                </div>

                <ModalAcceso isOpen={mostrarModal} onClose={() => setMostrarModal(false)} />
            </div>
        </Layout>
    );
}

export default MenuPrincipal;
