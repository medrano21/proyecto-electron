import React, { useState, useEffect, useRef } from "react";
import DynamicForm from "../../Components/DynamicForm/DynamicForm";
import { registrarSocio } from "../../Services/registrarSocios";
import { obtenerPlanes } from "../../Services/planesServices";
import Layout from "../../Components/Estructura/Layout"
import "./RegistroSocios.css"

const RegistroSocio = () => {
    const [planes, setPlanes] = useState([]);
    const [mensaje, setMensaje] = useState("");
    const formRef = useRef();

    useEffect(() => {
        const cargarPlanes = async () => {
            try {
                const data = await obtenerPlanes();
                const opciones = data.map(plan => ({
                    value: plan.id_plan,
                    label: plan.Descripcion,
                }));
                setPlanes(opciones);
            } catch (error) {
                console.error(error);
                setMensaje("❌ No se pudieron cargar los planes");
            }
        };

        cargarPlanes();
    }, []);

    const campos = [
        { name: "Documento", label: "Documento", type: "number", required: true },
        { name: "Apellido", label: "Apellido", type: "text", required: true },
        { name: "Nombre", label: "Nombre", type: "text", required: true },
        { name: "FechaNac", label: "Fecha de Nacimiento", type: "date" },
        { name: "Domicilio", label: "Domicilio", type: "text" },
        { name: "Localidad", label: "Localidad", type: "text" },
        { name: "Telefono", label: "Teléfono", type: "text" },
        { name: "TelefonoUrgencia", label: "Teléfono de Urgencia", type: "text" },
        { name: "Info", label: "Información Adicional", type: "textarea" },
        { name: "Alergia", label: "Alergia", type: "text" },
        { name: "Medicacion", label: "Medicación", type: "text" },
        {
            name: "Sexo", label: "Sexo", type: "select", required: true,
            options: [
                { value: "MASCULINO", label: "MASCULINO" },
                { value: "FEMENINO", label: "FEMENINO" },
            ],
            placeholder: "Seleccione sexo"
        },
        {
            name: "id_plan", label: "Plan", type: "select", required: true,
            options: planes,
            placeholder: "Seleccione un plan"
        },
    ];

    const handleSubmit = async (valores) => {
        setMensaje("");

        try {
            await registrarSocio(valores);
            setMensaje("✅ Socio registrado correctamente");

            // ✅ Limpiar el formulario si el registro fue exitoso
            if (formRef.current) {
                formRef.current.resetForm();
            }

        } catch (err) {
            console.error(err);
            setMensaje(`❌ ${err.message}`);
        }
    };


    return (
        <Layout title="REGISTRAR SOCIOS">
            <div style={{
                height: '85vh'
            }}>
                <div className="form-wrapper">
                    <DynamicForm
                        ref={formRef}
                        campos={campos}
                        onSubmit={handleSubmit}
                        botonTexto="Registrar"
                    />

                </div>
            </div>
        </Layout>
    );
};

export default RegistroSocio;
