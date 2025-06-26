import { useState, useRef, useEffect } from "react";
import Modal from "../../Components/Modals/Modal";
import { buscarSocio } from "../../Services/accesoSocios";
import './ModalsAcceso.css';
import Button from "../../Components/Button/Button"

const ModalsAcceso = ({ isOpen, onClose }) => {
    const [busqueda, setBusqueda] = useState("");
    const [socio, setSocio] = useState(null);
    const [error, setError] = useState(null);
    const [ultimoDocumento, setUltimoDocumento] = useState("");
    const inputRef = useRef(null);
    const audioRef = useRef(null);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "Enter") {
                const valorActual = busqueda.trim();
                if (valorActual === "") return;

                if (valorActual === ultimoDocumento && audioRef.current) {
                    audioRef.current.pause();
                    audioRef.current.currentTime = 0;
                } else {
                    handleBuscar(valorActual); // pasamos el valor directamente
                }

                setBusqueda("");
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [busqueda, ultimoDocumento]);


    const handleBuscar = async (valor) => {
        try {
            const data = await buscarSocio(valor);
            setSocio(data);
            setError(null);
            setUltimoDocumento(valor);
            reproducirSonido(data.estado, data.yaIngreso);
        } catch (err) {
            setError(err.message);
            setSocio(null);

            // 👇 Reproducir sonido cuando no se encuentra el socio
            const audio = new Audio("sonidos/noencontrado.wav");
            audioRef.current = audio;
            audio.play().catch((error) =>
                console.error("No se pudo reproducir el audio de no encontrado:", error)
            );
        }
    };



    const reproducirSonido = (estado, yaIngreso) => {
        let audio;
        if (yaIngreso) {
            audio = new Audio("sonidos/socioyaingresado.wav");
        } else {
            switch (estado) {
                case "Habilitado":
                    audio = new Audio("sonidos/habilitado.wav");
                    break;
                case "Habilitado con deuda":
                    audio = new Audio("sonidos/habilitadodeuda.wav");
                    break;
                case "Inhabilitado":
                    audio = new Audio("sonidos/sirena.wav");
                    break;
                default:
                    break;
            }
        }

        if (audio) {
            audioRef.current = audio; // Guardar en la referencia
            audio.play().catch((err) =>
                console.error("No se pudo reproducir el audio:", err)
            );
        }
    };


    const getEstadoClass = (estado) => {
        switch (estado) {
            case "Habilitado":
                return "estado-badge estado-habilitado";
            case "Habilitado con deuda":
                return "estado-badge estado-deuda";
            case "Inhabilitado":
                return "estado-badge estado-inhabilitado";
            default:
                return "estado-badge";
        }
    };
    useEffect(() => {
        if (!isOpen) {
            setBusqueda("");
            inputRef.current?.focus();
            setSocio(null);
            setError(null);
        }
    }, [isOpen]);

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="" size="md">
            <div className="modal-acceso-container">
                <div className="search-container">
                    <div className="flex items-center gap-2">
                        <div className="search-box">
                            <input
                                ref={inputRef}
                                type="text"
                                value={busqueda}
                                onChange={(e) => setBusqueda(e.target.value)}
                                placeholder="Buscar socio por documento"
                                className="search-input"
                            />
                            <Button
                                onClick={() => {
                                    if (busqueda.trim() !== "") {
                                        handleBuscar(busqueda.trim());
                                        setBusqueda("");
                                    }
                                }}
                                className="boton-menu"
                            >
                                Buscar
                            </Button>

                        </div>

                    </div>
                </div>

                {error && <div className="error-message">{error}</div>}

                <div className="results-container">
                    {!socio ? (
                        <div className="empty-state">
                            <div className="empty-state-icons">👤❓</div>
                            <p>No se ha buscado un socio aún</p>
                        </div>
                    ) : (
                        <div className="socio-card">
                            <h3 className="text-xl font-bold mb-4">{socio.Nombre} {socio.Apellido}</h3>
                            <div className="socio-info">
                                <p><strong>Plan:</strong> {socio.Plan}</p>
                                <p><strong>Vencimiento:</strong> {socio.vencimiento}</p>
                                <p><strong>Hora de Entrada:</strong> {new Date(socio.horaEntrada).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>

                                <p><strong>Estado:</strong> <span className={getEstadoClass(socio.estado)}>{socio.estado}</span></p>
                                <p><strong>Ya ingresó hoy:</strong> {socio.yaIngreso ? "Sí" : "No"}</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </Modal>
    );
};

export default ModalsAcceso;