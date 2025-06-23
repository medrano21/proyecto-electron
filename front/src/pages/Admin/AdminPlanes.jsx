import React, { useEffect, useState, useRef } from 'react';
import DynamicTable from '../../Components/DynamicTable/DynamicTable';
import Button from '../../Components/Button/Button';
import {
    obtenerPlanes,
    agregarPlan,
    actualizarPlan,
    eliminarPlan,
} from '../../Services/planesServices';
import Layout from '../../Components/Estructura/Layout';
import Buscador from "../../Components/Buscador/Buscador"
import DynamicForm from '../../Components/DynamicForm/DynamicForm';
import AlertError from "../../Components/Alerts/AlertErrores"

const AdminPlanes = () => {
    const [planes, setPlanes] = useState([]);
    const [formData, setFormData] = useState({
        Abreviatura: '',
        Descripcion: '',
        Precio: '',
        Clases: '',
    });
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [busqueda, setBusqueda] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [alertOpen, setAlertOpen] = useState(false);
    const [alertMsg, setAlertMsg] = useState("");
    const formRef = useRef();

    const cargarPlanes = async () => {
        try {
            const data = await obtenerPlanes();
            setPlanes(data);
        } catch (error) {
            setAlertMsg("Error al cargar los planes");
            setAlertOpen(true);
            console.error(error);
        }
    };

    useEffect(() => {
        cargarPlanes();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleAgregar = async () => {
        const valores = formRef.current.getFormData();

        const { Abreviatura, Descripcion, Precio, Clases } = valores;

        if (!Abreviatura || !Descripcion || Precio === '' || Clases === '') {
            setAlertMsg("Por favor completa todos los campos.");
            setAlertOpen(true);
            return;
        }

        const precioFloat = parseFloat(Precio);
        const clasesInt = parseInt(Clases);

        if (isNaN(precioFloat) || isNaN(clasesInt)) {
            setAlertMsg("Precio y Clases deben ser números válidos.");
            setAlertOpen(true);
            return;
        }

        try {
            setIsLoading(true);
            await agregarPlan({
                Abreviatura,
                Descripcion,
                Precio: precioFloat,
                Clases: clasesInt,
            });
            await cargarPlanes();
            limpiarFormulario();
        } catch (error) {
            setAlertMsg("Error al agregar el plan");
            setAlertOpen(true);
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };



    const planesFiltrados = planes.filter(plan =>
        Object.values(plan).some(valor =>
            String(valor).toLowerCase().includes(busqueda.toLowerCase())
        )
    );
    const handleEditar = async () => {
        if (!selectedPlan) return;

        const valores = formRef.current.getFormData();
        const { Abreviatura, Descripcion, Precio, Clases } = valores;

        if (!Abreviatura || !Descripcion || Precio === '' || Clases === '') {
            setAlertMsg("Por favor completa todos los campos.");
            setAlertOpen(true);
            return;
        }

        const precioFloat = parseFloat(Precio);
        const clasesInt = parseInt(Clases);

        if (isNaN(precioFloat) || isNaN(clasesInt)) {
            setAlertMsg("Precio y Clases deben ser números válidos.");
            setAlertOpen(true);
            return;
        }

        try {
            setIsLoading(true);
            await actualizarPlan(selectedPlan.id_plan, {
                Abreviatura,
                Descripcion,
                Precio: precioFloat,
                Clases: clasesInt,
            });
            await cargarPlanes();
            limpiarFormulario();
        } catch (error) {
            setAlertMsg("Error al editar el plan");
            setAlertOpen(true);
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };


    const handleEliminar = async () => {
        if (!selectedPlan) return;
        const confirm = window.confirm('¿Estás seguro de que deseas eliminar este plan?');
        if (!confirm) return;

        try {
            setIsLoading(true);
            await eliminarPlan(selectedPlan.id_plan);
            await cargarPlanes();
            limpiarFormulario();
        } catch (error) {
            setAlertMsg("Error al eliminar el plan");
            setAlertOpen(true);

        } finally {
            setIsLoading(false);
        }
    };

    const handleSeleccionar = (plan) => {
        const datos = {
            Abreviatura: plan.Abreviatura ?? '',
            Descripcion: plan.Descripcion ?? '',
            Precio: plan.Precio ?? '',
            Clases: plan.Clases ?? '',
        };
        console.log("📥 Plan seleccionado:", datos);
        setSelectedPlan(plan);
        setFormData(datos);
    };



    const limpiarFormulario = () => {
        setFormData({
            Abreviatura: '',
            Descripcion: '',
            Precio: '',
            Clases: '',
        });
        setSelectedPlan(null);
    };

    const columnas = [
        { header: 'Abreviatura', accessor: 'Abreviatura' },
        { header: 'Descripción', accessor: 'Descripcion' },
        { header: 'Precio', accessor: 'Precio' },
        { header: 'Clases', accessor: 'Clases' },
    ];
    const camposFormulario = [
        {
            name: 'Abreviatura',
            label: 'Abreviatura',
            type: 'text',
            placeholder: 'Abreviatura',
            required: true,
        },
        {
            name: 'Descripcion',
            label: 'Descripción',
            type: 'text',
            placeholder: 'Descripción del plan',
            required: true,
        },
        {
            name: 'Precio',
            label: 'Precio',
            type: 'number',
            placeholder: 'Precio del plan',
            required: true,
        },
        {
            name: 'Clases',
            label: 'Cantidad de clases',
            type: 'number',
            placeholder: 'Número de clases',
            required: true,
        },
    ];
    /*  const handleSubmit = (e) => {
         e.preventDefault();
         onSubmit(valores);
     }; */

    return (
        <Layout title="GESTIONAR PLANES">
            <div style={{ height: '85vh' }}>
                <div style={{ height: "10vh" }}>
                    <Buscador onSearch={(valor) => setBusqueda(valor)} />
                </div>

                <div style={{ flex: 1, display: "flex", gap: "1rem", overflow: "hidden", height: "75vh" }}>

                    <div style={{ flex: 3, overflow: "auto" }}>
                        <DynamicTable
                            columnas={columnas}
                            datos={planesFiltrados}
                            acciones={[{
                                label: 'Seleccionar',
                                onClick: handleSeleccionar,
                            }]}
                        />
                    </div>

                    <div className="deuda-form-container">
                        <div className="deuda-form-content">

                            <DynamicForm
                                ref={formRef}
                                key={selectedPlan ? selectedPlan.id_plan : 'nuevo'}
                                titulo={selectedPlan ? "Editar Plan" : "Agregar Plan"}
                                campos={camposFormulario.map(campo => ({
                                    ...campo,
                                    defaultValue: formData[campo.name],
                                }))}
                                botonTexto={selectedPlan ? "Editar" : "Agregar"}
                                onSubmit={selectedPlan ? handleEditar : handleAgregar}
                            />



                            {selectedPlan && (
                                <div style={{ marginLeft: '1rem' }}>
                                    <Button onClick={handleEliminar} disabled={isLoading}>
                                        {isLoading ? 'Eliminando...' : 'Eliminar'}
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <AlertError
                isOpen={alertOpen}
                setIsOpen={setAlertOpen}
                message={alertMsg}
            />

        </Layout>
    );

};

export default AdminPlanes;
