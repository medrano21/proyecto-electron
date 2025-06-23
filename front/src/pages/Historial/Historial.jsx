import { useEffect, useState } from "react";
import DynamicTable from "../../Components/DynamicTable/DynamicTable";
import Layout from "../../Components/Estructura/Layout";
import "./Historial.css"
import {
    obtenerHistorial,
    filtrarPorMesAnio,
    filtrarPorDia,
} from "../../Services/historialServices";
import Buscador from '../../Components/Buscador/Buscador';

const Historial = ({ }) => {
    const [datos, setDatos] = useState([]);
    const [busqueda, setBusqueda] = useState('');
    const [filtroTodos, setFiltroTodos] = useState(true);
    const [filtroMesAnio, setFiltroMesAnio] = useState(false);
    const [filtroDia, setFiltroDia] = useState(false);
    const [anio, setAnio] = useState("");
    const [mes, setMes] = useState("");
    const [fechaDia, setFechaDia] = useState("");
    const [datosFiltrados, setDatosFiltrados] = useState([]);

    const anios = ["2023", "2024", "2025"];
    const meses = [
        { value: "01", label: "Enero" },
        { value: "02", label: "Febrero" },
        { value: "03", label: "Marzo" },
        { value: "04", label: "Abril" },
        { value: "05", label: "Mayo" },
        { value: "06", label: "Junio" },
        { value: "07", label: "Julio" },
        { value: "08", label: "Agosto" },
        { value: "09", label: "Septiembre" },
        { value: "10", label: "Octubre" },
        { value: "11", label: "Noviembre" },
        { value: "12", label: "Diciembre" },
    ];

    useEffect(() => {
        cargarCobros();
    }, [filtroTodos, filtroMesAnio, filtroDia, anio, mes, fechaDia]);

    const cargarCobros = async () => {
        try {
            let data = [];
            if (filtroTodos) {
                data = await obtenerHistorial();
            } else if (filtroMesAnio && mes && anio) {
                data = await filtrarPorMesAnio(mes, anio);
            } else if (filtroDia && fechaDia) {
                data = await filtrarPorDia(fechaDia);
            }
            setDatos(data);
            setDatosFiltrados(data); // reinicia búsqueda con el resultado actual
        } catch (error) {
            alert("Error al obtener los cobros");
            console.error(error);
        }
    };

    const columnas = [
        { header: "Nombre", accessor: "Nombre" },
        { header: "Apellido", accessor: "Apellido" },
        { header: "Fecha Cobro", accessor: "fecha_cobro" },
        { header: "Vencimiento", accessor: "vencimiento" },
        { header: "Importe", accessor: "importe" },
        { header: "Saldo", accessor: "saldo" },
        { header: "Descuento", accessor: "descuento" },
        { header: "Motivo Descuento", accessor: "motivo_descuento" },
        { header: "Tipo de Pago", accessor: "tipo_pago" },
    ];

    return (
        <Layout title="HISTORIAL DE COBROS">
            <div style={{ height: "85vh" }}>

                <div style={{ marginBottom: "10x", height: "5vh" }}>
                    <Buscador
                        datos={datos}
                        campos={['Nombre', 'Apellido']}
                        onFiltrar={(resultados) => setDatosFiltrados(resultados)}
                    />
                </div>

                <div style={{ display: "flex", gap: "100px", marginBottom: "20px", alignItems: "center", justifyContent: "center", height: "10vh" }}>
                    <label>
                        <input
                            type="checkbox"
                            checked={filtroTodos}
                            onChange={() => {
                                setFiltroTodos(true);
                                setFiltroMesAnio(false);
                                setFiltroDia(false);
                                setAnio("");
                                setMes("");
                                setFechaDia("");
                            }}
                        />
                        Todos
                    </label>

                    <label>
                        <input
                            type="checkbox"
                            checked={filtroMesAnio}
                            onChange={() => {
                                setFiltroTodos(false);
                                setFiltroMesAnio(true);
                                setFiltroDia(false);
                                setFechaDia("");
                            }}
                        />
                        Por período mensual
                    </label>

                    {filtroMesAnio && (
                        <>
                            <select value={anio} onChange={(e) => setAnio(e.target.value)}>
                                <option value="">Año</option>
                                {anios.map((a) => (
                                    <option key={a} value={a}>{a}</option>
                                ))}
                            </select>
                            <select value={mes} onChange={(e) => setMes(e.target.value)}>
                                <option value="">Mes</option>
                                {meses.map((m) => (
                                    <option key={m.value} value={m.value}>{m.label}</option>
                                ))}
                            </select>
                        </>
                    )}

                    <label>
                        <input
                            type="checkbox"
                            checked={filtroDia}
                            onChange={() => {
                                setFiltroTodos(false);
                                setFiltroMesAnio(false);
                                setFiltroDia(true);
                                setAnio("");
                                setMes("");
                            }}
                        />
                        Por día
                    </label>

                    {filtroDia && (
                        <input
                            type="date"
                            value={fechaDia}
                            onChange={(e) => setFechaDia(e.target.value)}
                        />
                    )}
                </div>
                <div style={{ height: "65vh", overflow: "auto" }}>

                    <DynamicTable columnas={columnas} datos={datosFiltrados} />
                </div>
            </div>
        </Layout>
    );
}

export default Historial;
