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
        { header: "Fecha Nac", accessor: "FechaNac" },
        { header: "Domicilio", accessor: "Domicilio" },
        { header: "Localidad", accessor: "Localidad" },
        { header: "Telefono", accessor: "Telefono" },
        { header: "Tel Urgencia", accessor: "TelefonoUrgencia" },
        { header: "Info", accessor: "Info" },
        { header: "Alergia", accessor: "Alergia" },
        { header: "Medicacion", accessor: "Medicacion" },
        { header: "Plan", accessor: "Plan" },
    ];
    const formatearFecha = (fechaISO) => {
        if (!fechaISO) return "";
        const fecha = new Date(fechaISO);
        const dia = String(fecha.getDate()).padStart(2, "0");
        const mes = String(fecha.getMonth() + 1).padStart(2, "0");
        const año = fecha.getFullYear();
        return `${dia}/${mes}/${año}`;
    };

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

            const dataFormateada = data.map((s) => ({
                ...s,
                FechaNac: formatearFecha(s.FechaNac),
            }));

            setSocios(dataFormateada);
            setTodosLosSocios(dataFormateada);
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
