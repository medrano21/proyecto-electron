import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './Header.css';

const Header = ({ title = "Título por defecto" }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const handleGoBack = () => {
        if (location.pathname === "/menu") {
            navigate("/"); // Volver al login si estás en el menú principal
        } else {
            navigate("/menu"); // Volver al menú desde cualquier otra ruta
        }
    };

    return (
        <header className="app-header">
            <div className="header-left">
                <button className="back-button" onClick={handleGoBack}>
                    &larr; Volver
                </button>
            </div>

            <div className="header-center">
                <h1 className="header-title">{title}</h1>
            </div>

            <nav className="navbar">
                <ul className="nav-list">
                    <li className="nav-item">
                        <Link to="/estadisticas" className="nav-link">Gráficos estadísticos</Link>
                    </li>
                    <li className="nav-item">
                        <Link to="/socios" className="nav-link">Gestionar Socios</Link>
                    </li>
                    <li className="nav-item">
                        <Link to="/planes" className="nav-link">Gestionar Planes</Link>
                    </li>
                </ul>
            </nav>
        </header>
    );
};

export default Header;