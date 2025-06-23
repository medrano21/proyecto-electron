import { useNavigate } from 'react-router-dom';
import './Login.css';
import DynamicForm from "../../Components/DynamicForm/DynamicForm";
import { login } from "../../Services/usuarios"
import logo from "../../assets/logo.png"
import LayoutLogin from '../../Components/Estructura/LayoutLogin';

const Login = ({ }) => {
    const navigate = useNavigate();

    const handleLogin = async ({ usuario, pass }) => {
        try {
            const { ok, data } = await login(usuario, pass);

            if (ok) {
                navigate('/menu');
            } else {
                alert(data.message || 'Credenciales incorrectas');
            }
        } catch (err) {
            console.error(err);
            alert('Error al conectar con el servidor');
        }
    };

    const camposLogin = [
        { label: 'Usuario', name: 'usuario', type: 'text' },
        { label: 'Contraseña', name: 'pass', type: 'password' },
    ]
    return (
        <LayoutLogin>
            <div className="login-container">
                <img className="logo" src={logo} alt="Logo" />
                <div className="dynamic-form">
                    <DynamicForm
                        titulo="Iniciar Sesión"
                        campos={camposLogin}
                        onSubmit={handleLogin}
                        botonTexto="Ingresar"
                    />
                </div>
            </div>
        </LayoutLogin>
    );

}

export default Login;
