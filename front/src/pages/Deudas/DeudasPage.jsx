import { useEffect, useState } from 'react';
import {
    getSocios,
    agregarDeuda,
    editarDeuda,
    eliminarDeuda
} from '../../Services/deudasServices';
import DynamicTable from "../../Components/DynamicTable/DynamicTable";
import Layout from "../../Components/Estructura/Layout";
import DynamicForm from '../../Components/DynamicForm/DynamicForm';
import Buscador from '../../Components/Buscador/Buscador';
import './DeudasPage.css';

const DeudaPage = ({ }) => {
    const emptyForm = { id_socio: null, id_deuda: null, fecha: '', monto: '', detalles: '' };
    const [socios, setSocios] = useState([]);
    const [deudas, setDeudas] = useState([]);
    const [form, setForm] = useState(emptyForm);
    const [sociosFiltrados, setSociosFiltrados] = useState([]);

    useEffect(() => {
        loadSocios();
    }, []);

    const loadSocios = async () => {
        const data = await getSocios();
        setSocios(data);
        setSociosFiltrados(data); // inicializar también los filtrados
    };


    const handleSubmit = async (data) => {
        if (!data.id_socio || !data.fecha || !data.monto || data.monto <= 0) {
            return alert('Faltan datos o el monto es inválido');
        }

        if (data.id_deuda) {
            await editarDeuda(data);
            setDeudas(prev => prev.map(d => d.id_deuda === data.id_deuda ? data : d));
        } else {
            const respuesta = await agregarDeuda(data);
            if (respuesta?.id_deuda) {
                setDeudas(prev => [...prev, { ...data, id_deuda: respuesta.id_deuda }]);
            } else {
                return alert("Error al agregar deuda");
            }
        }

        await loadSocios();
        setForm(emptyForm);
    };

    const handleEdit = (socio) => {
        const formatFecha = (fechaString) => {
            if (!fechaString) return '';

            const [dia, mes, anio] = fechaString.split('-');
            return `${anio}-${mes.padStart(2, '0')}-${dia.padStart(2, '0')}`;
        };

        setForm({
            id_socio: socio.id_socio,
            id_deuda: socio.id_deuda || null,
            fecha: formatFecha(socio.fecha),
            monto: socio.monto || '',
            detalles: socio.detalles || ''
        });
    };

    const handleDelete = async (socio) => {
        if (!socio.id_deuda) return;

        await eliminarDeuda(socio.id_deuda);
        await loadSocios();

        if (form.id_deuda === socio.id_deuda) {
            setForm(emptyForm);
        }
    };

    const handleAgregarDeuda = async (socio) => {
        setForm({
            ...emptyForm,
            id_socio: socio.id_socio
        });
    };

    const columnas = [
        { header: 'Documento', accessor: 'Documento' },
        { header: 'Nombre', accessor: 'nombre_completo' },
        { header: 'Fecha', accessor: 'fecha' },
        { header: 'Monto', accessor: 'monto' },
        { header: 'Detalles', accessor: 'detalles' }
    ];

    const acciones = [
        { label: 'Editar', onClick: handleEdit },
        { label: 'Eliminar', onClick: handleDelete },
        { label: 'Agregar', onClick: handleAgregarDeuda }
    ];

    const camposForm = [
        {
            name: 'fecha',
            label: 'Fecha',
            type: 'date',
            required: true,
            disabled: !form.id_socio
        },
        {
            name: 'monto',
            label: 'Monto',
            type: 'number',
            required: true,
            min: 0,
            placeholder: 'Ingrese el monto',
            disabled: !form.id_socio
        },
        {
            name: 'detalles',
            label: 'Detalles',
            type: 'text',
            placeholder: 'Opcional',
            disabled: !form.id_socio
        }
    ];

    return (
        <Layout title="REGISTRAR DEUDAS">
            <div style={{ height: "85vh" }}>

                <div style={{ height: "10vh" }}>
                    <Buscador
                        datos={socios}
                        campos={['nombre_completo', 'Documento']}
                        onFiltrar={(filtrados) => setSociosFiltrados(filtrados)}
                    />
                </div>
                <div style={{ flex: 1, display: "flex", gap: "1rem", overflow: "hidden", height: "75vh" }}>

                    <div style={{ flex: 3, overflow: "auto" }}>
                        <DynamicTable columnas={columnas} datos={sociosFiltrados} acciones={acciones} />
                    </div>

                    <div className="deuda-form-container">
                        <div style={{ marginBottom: "0.5rem" }}>
                            <p>Documento: {socios.find(s => s.id_socio === form.id_socio)?.Documento}</p>
                            <p>Socio: {socios.find(s => s.id_socio === form.id_socio)?.nombre_completo}</p>
                        </div>

                        <div className="deuda-form-content">
                            <DynamicForm
                                key={form.id_deuda || `new-${form.id_socio}`}
                                campos={camposForm.map(c => ({
                                    ...c,
                                    defaultValue: form[c.name],
                                    labelClassName: "deuda-form-label", // <- Aplica color negro a labels
                                }))}
                                botonTexto={form.id_deuda ? 'Actualizar' : 'Agregar'}
                                onSubmit={(valores) => {
                                    const data = {
                                        id_socio: form.id_socio,
                                        id_deuda: form.id_deuda,
                                        ...valores
                                    };
                                    handleSubmit(data);
                                }}
                            />
                        </div>
                    </div>


                </div>
            </div>
        </Layout>

    );
}
export default DeudaPage;