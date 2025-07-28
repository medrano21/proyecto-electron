import { useState, useRef, useEffect } from "react";
import Modal from "../../Components/Modals/Modal";
import { buscarSocio } from "../../Services/accesoSocios";
import './ModalsAcceso.css';
import Button from "../../Components/Button/Button";

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
                    handleBuscar(valorActual);
                }

                setBusqueda("");
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [busqueda, ultimoDocumento]);

    const handleBuscar = async (valor) => {
        console.time("BuscarSocioTotal");

        try {
            console.time("API fetch");
            const data = await buscarSocio(valor);
            console.timeEnd("API fetch");

            console.time("Set state");
            setSocio({
                nombre: data.Nombre,
                apellido: data.Apellido,
                plan: data.Plan,
                vencimiento: data.vencimiento,
                estado: data.estado,
                horaEntrada: data.horaEntrada,
                yaIngreso: data.yaIngreso,
                timestamp: Date.now()
            });
            console.timeEnd("Set state");

            setError(null);
            setUltimoDocumento(valor);

            console.time("Audio");
            reproducirSonido(data.estado, data.yaIngreso);
            console.timeEnd("Audio");
        } catch (err) {
            console.error("Error al buscar socio:", err.message);
            setError(err.message);
            setSocio(null);

            const audio = new Audio("sonidos/noencontrado.wav");
            audioRef.current = audio;
            audio.play().catch((error) =>
                console.error("No se pudo reproducir el audio de no encontrado:", error)
            );
        } finally {
            setBusqueda("");
            console.timeEnd("BuscarSocioTotal");
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
            audioRef.current = audio;
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
            setSocio(null);
            setError(null);
            setUltimoDocumento("");
            inputRef.current?.focus();
        }
    }, [isOpen]);

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="" size="xl">
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
                    {socio ? (
                        <div className="socio-card" key={socio.timestamp}>
                            <h3>{socio.nombre} {socio.apellido}</h3>
                            <div className="socio-info">
                                <p><strong>Vencimiento:</strong> {socio.vencimiento}</p>
                                <p><strong>Estado:</strong> <span className={getEstadoClass(socio.estado)}>{socio.estado}</span></p>
                                <p><strong>Plan:</strong> {socio.plan}</p>
                                <p><strong>Hora de entrada:</strong> {new Date(socio.horaEntrada).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                <p><strong>Ya ingresó hoy:</strong> {socio.yaIngreso ? "Sí" : "No"}</p>
                            </div>
                        </div>
                    ) : (
                        <div className="empty-state">
                            <div className="empty-state-icons">👤❓</div>
                            <p>No se ha buscado un socio aún</p>
                        </div>
                    )}

                </div>
            </div>
        </Modal>
    );
};

export default ModalsAcceso;
