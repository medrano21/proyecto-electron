import { useEffect, useState, useRef } from 'react';
import DynamicTabla from '../../Components/DynamicTable/DynamicTable';
import { obtenerCobros, enviarCobro } from '../../Services/registrarCobros';
import DynamicForm from "../../Components/DynamicForm/DynamicForm";
import './RegistroCobros.css';
import Layout from "../../Components/Estructura/Layout";
import Button from '../../Components/Button/Button';
import Buscador from '../../Components/Buscador/Buscador';


const RegistroCobros = ({ }) => {
    const [cobros, setCobros] = useState([]);
    const [loading, setLoading] = useState(true);
    const [socioSeleccionado, setSocioSeleccionado] = useState(null);
    const [busqueda, setBusqueda] = useState('');
    const [cobrosFiltrados, setCobrosFiltrados] = useState([]);
    const formRef = useRef(null);
    const hoy = new Date();
    const unMesDespues = new Date();
    unMesDespues.setMonth(hoy.getMonth() + 1);

    useEffect(() => {
        const fetchCobros = async () => {
            try {
                const data = await obtenerCobros();
                setCobros(data);
                setCobrosFiltrados(data);
            } catch (error) {
                console.error('Error al cargar los registros de cobros:', error);
                alert('Hubo un error al cargar los registros de cobros');
            } finally {
                setLoading(false);
            }
        };

        fetchCobros();
    }, []);

    const datosFiltrados = cobros.filter((item) =>
        item.NombreCompleto.toLowerCase().includes(busqueda.toLowerCase()) ||
        item.Documento.toString().includes(busqueda)
    );

    const columnas = [
        { header: 'Nombre Completo', accessor: 'NombreCompleto' },
        { header: 'Documento', accessor: 'Documento' },
        { header: 'Fecha de Cobro', accessor: 'FechaCobro' },
        { header: 'Vencimiento', accessor: 'Vencimiento' },
        { header: 'Importe Cobrado', accessor: 'ImporteCobrado' },
        { header: 'Saldo', accessor: 'Saldo' },
        { header: 'Descuento', accessor: 'Descuento' },
        { header: 'Motivo Descuento', accessor: 'MotivoDto' },
        { header: "Tipo de Pago", accessor: "TipoPago" },
    ];

    const formatoFecha = (fecha) => {
        const offset = fecha.getTimezoneOffset();
        const localDate = new Date(fecha.getTime() - offset * 60 * 1000);
        return localDate.toISOString().split('T')[0];
    };

    const camposFormulario = [
        {
            name: 'FechaCobro',
            label: 'Fecha de Cobro',
            type: 'date',
            defaultValue: formatoFecha(hoy)
        },
        {
            name: 'Vencimiento',
            label: 'Vencimiento',
            type: 'date',
            defaultValue: formatoFecha(unMesDespues)
        },
        {
            name: 'ImporteCobrado',
            label: 'Importe Cobrado',
            type: 'number',
            defaultValue: socioSeleccionado?.ValorPlan || 0
        },
        {
            name: 'Saldo',
            label: 'Saldo',
            type: 'number',
            defaultValue: 0
        },
        {
            name: 'Descuento',
            label: 'Descuento',
            type: 'number',
            defaultValue: 0
        },
        {
            name: 'MotivoDto',
            label: 'Motivo Descuento',
            type: 'text'
        },
        {
            name: 'TipoPago',
            label: 'Tipo de pago',
            type: 'select',
            options: [
                { value: 'Efectivo', label: 'Efectivo' },
                { value: 'Transferencia', label: 'Transferencia' },
                { value: 'Débito', label: 'Débito' },
                { value: 'Credito', label: 'Credito' }
            ],
            defaultValue: 'Efectivo'
        }
    ];

    const handleSubmitCobro = async () => {
        console.log('handleSubmitCobro ejecutado');
        if (!socioSeleccionado) {
            console.log('No hay socio seleccionado');
            return;
        }
        if (!formRef.current) {
            console.log('formRef.current es null');
            return;
        }
        if (!socioSeleccionado || !formRef.current) return;
        const formData = formRef.current.getFormData();
        console.log('formData:', formData);
        const datosFinales = {
            id_socio: socioSeleccionado.id_socio,
            fecha_cobro: formData.FechaCobro,
            vencimiento: formData.Vencimiento,
            importe: formData.ImporteCobrado,
            saldo: formData.Saldo || 0,
            descuento: formData.Descuento || 0,
            motivo_descuento: formData.MotivoDto || '',
            tipo_pago: formData.TipoPago || 'Efectivo',
        };

        try {
            const respuesta = await enviarCobro(datosFinales);
            console.log('Respuesta de enviarCobro:', respuesta);
            alert('Cobro registrado con éxito');

            // Actualizar la tabla
            const nuevosDatos = await obtenerCobros();
            setCobros(nuevosDatos);
            setSocioSeleccionado(null);
        } catch (error) {
            console.error('Error al enviar el cobro:', error);
            alert('Error al registrar el cobro');
        }
    };

    return (
        <Layout title="REGISTRAR COBROS">
            <div className='fondo' style={{
                height: '85vh',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden'
            }}>
                <Buscador
                    datos={cobros}
                    campos={['NombreCompleto', 'Documento']}
                    onFiltrar={(filtrados) => setCobrosFiltrados(filtrados)}
                />


                <div style={{
                    flex: 1,
                    display: 'flex',
                    gap: '20px',
                    overflow: 'hidden',
                    padding: '10px',
                    color: "black",
                }}>
                    <div style={{
                        flex: 1,
                        overflow: 'auto',
                        border: 'none',
                        borderRadius: '8px',
                        padding: '15px',
                        color: "black"
                    }}>
                        {loading ? (
                            <div style={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                height: '100%',
                            }}>
                                <p>Cargando cobros...</p>
                            </div>
                        ) : (
                            <DynamicTabla
                                columnas={columnas}
                                datos={cobrosFiltrados}
                                acciones={[{
                                    label: 'Seleccionar',
                                    onClick: (fila) => setSocioSeleccionado(fila)
                                }]}
                            />

                        )}
                    </div>

                    {socioSeleccionado && (
                        <div style={{
                            width: '40%',
                            minWidth: '300px',
                            maxWidth: '400px',
                            overflow: 'auto',
                            border: 'none',
                            borderRadius: '8px',
                            padding: '20px',
                            backgroundColor: 'rgb(129, 129, 129)',
                        }}>
                            <div style={{ position: 'relative' }}>
                                <Button
                                    className="btn-cerrar"
                                    style={{ position: 'absolute', top: 10, right: 10 }}
                                    onClick={() => setSocioSeleccionado(null)}
                                >
                                    Cerrar
                                </Button>
                            </div>
                            <h3 style={{ marginTop: 0 }}>Socio Seleccionado</h3>
                            <div style={{ marginBottom: '20px' }}>
                                <p><strong>{socioSeleccionado.NombreCompleto}</strong></p>
                                <p>DNI: {socioSeleccionado.Documento}</p>
                                <p>Último Pago: {socioSeleccionado.FechaCobro}</p>
                            </div>

                            <DynamicForm
                                ref={formRef}
                                campos={camposFormulario}
                                onSubmit={handleSubmitCobro}
                                botonTexto="Cobrar"
                            />
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
}

export default RegistroCobros;