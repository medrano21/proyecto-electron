import React, { useEffect, useState } from "react";
import DynamicTable from "../../Components/DynamicTable/DynamicTable";
import {
    obtenerSocios,
    eliminarSocio,
} from "../../Services/sociosServices";
import Layout from "../../Components/Estructura/Layout";
import Buscador from "../../Components/Buscador/Buscador";

const AdminSocios = () => {
    const [socios, setSocios] = useState([]);
    const [todosLosSocios, setTodosLosSocios] = useState([]); // Nuevo estado

    const columnas = [
        { header: "Nombre", accessor: "Nombre" },
        { header: "Apellido", accessor: "Apellido" },
        { header: "Documento", accessor: "Documento" },
        { header: "Plan", accessor: "Plan" },
    ];

    const acciones = [
        {
            label: "Eliminar",
            onClick: async (socio) => {
                if (window.confirm(`¿Eliminar al socio ${socio.Nombre} ${socio.Apellido}?`)) {
                    try {
                        await eliminarSocio(socio.id_socio);
                        cargarSocios();
                    } catch (err) {
                        alert("Error al eliminar socio");
                        console.error(err);
                    }
                }
            },
        },
    ];

    const cargarSocios = async () => {
        try {
            const data = await obtenerSocios();
            console.log("👀 Socios cargados:", data); // <-- Agregá esto
            setSocios(data);
            setTodosLosSocios(data);
        } catch (error) {
            console.error(error);
        }
    };


    useEffect(() => {
        cargarSocios();
    }, []);

    return (
        <Layout title="GESTIONAR SOCIOS">
            <div style={{
                height: '85vh'
            }}>
                <div style={{ height: '10vh' }}>
                    <Buscador
                        datos={todosLosSocios}
                        campos={["Nombre", "Apellido", "Documento", "Plan"]}
                        onFiltrar={setSocios}
                    />
                </div>

                <div style={{ height: "75vh", overflow: "auto" }}>
                    <DynamicTable
                        columnas={columnas}
                        datos={socios}
                        acciones={acciones}
                    />
                </div>
            </div>
        </Layout>
    );
};

export default AdminSocios;
