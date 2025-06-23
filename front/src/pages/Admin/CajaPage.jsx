import React, { useEffect, useState } from "react";
import Layout from "../../Components/Estructura/Layout";
import DynamicTable from "../../Components/DynamicTable/DynamicTable";
import { obtenerMovimientosCaja } from "../../Services/cajaService";
import "./CajaPage.css";

const CajaPage = () => {
    const [movimientos, setMovimientos] = useState([]);
    const [todos, setTodos] = useState([]);
    const [fechaFiltro, setFechaFiltro] = useState("");
    const [mesFiltro, setMesFiltro] = useState("");

    const columnas = [
        { header: "ID", accessor: "id_caja" },
        { header: "Detalle", accessor: "detalle" },
        {
            header: "Monto 💵",
            accessor: "haber", // 👈 importante: directamente "haber", sin función
            Cell: ({ value }) =>
                parseFloat(value).toLocaleString(undefined, {
                    style: "currency",
                    currency: "ARS",
                    minimumFractionDigits: 2,
                }),
        }


    ];

    const cargarMovimientos = async () => {
        try {
            const data = await obtenerMovimientosCaja();
            setTodos(data);
            setMovimientos(data);
        } catch (err) {
            console.error("Error al cargar movimientos de caja:", err);
        }
    };

    const filtrar = () => {
        let filtrados = [...todos];

        if (fechaFiltro) {
            filtrados = filtrados.filter(mov => mov.fecha === fechaFiltro);
        }

        if (mesFiltro) {
            filtrados = filtrados.filter(mov => mov.fecha.startsWith(mesFiltro));
        }

        // Solo ingresos (haber > 0)
        filtrados = filtrados.filter(mov => parseFloat(mov.haber) > 0);

        setMovimientos(filtrados);
    };

    const total = movimientos.reduce(
        (acc, mov) => acc + parseFloat(mov.haber || 0),
        0
    );

    useEffect(() => {
        cargarMovimientos();
    }, []);

    useEffect(() => {
        filtrar();
    }, [fechaFiltro, mesFiltro]);

    return (
        <Layout title="📈 Ganancias del Gimnasio">
            <div style={{ minHeight: "100vh", paddingBottom: "100px" }}>
                <div style={{
                    display: "flex",
                    gap: "50px",
                    marginBottom: "20px",
                    alignItems: "center",
                    justifyContent: "center"
                }}>
                    <div>
                        <label>📅 Caja Diaria:</label>
                        <input
                            type="date"
                            className="border rounded p-1 w-full"
                            value={fechaFiltro}
                            onChange={(e) => {
                                setFechaFiltro(e.target.value);
                                setMesFiltro("");
                            }}
                        />
                    </div>

                    <div>
                        <label>📆 Caja Mensual:</label>
                        <input
                            type="month"
                            className="border rounded p-1 w-full"
                            value={mesFiltro}
                            onChange={(e) => {
                                setMesFiltro(e.target.value);
                                setFechaFiltro("");
                            }}
                        />
                    </div>
                </div>

                <div style={{ height: "45vh", overflow: "auto" }}>
                    <DynamicTable columnas={columnas} datos={movimientos} />
                </div>

                <div className="totales-caja" style={{
                    marginTop: "30px",
                    display: "flex",
                    justifyContent: "center",
                    fontSize: "1.5rem",
                    fontWeight: "bold",
                    color: "green",
                    gap: "10px"
                }}>
                    <span>💰 Total Ganado:</span>
                    <span>
                        {total.toLocaleString(undefined, {
                            style: "currency",
                            currency: "ARS",
                            minimumFractionDigits: 2
                        })}
                    </span>
                </div>
            </div>
        </Layout>
    );
};

export default CajaPage;
