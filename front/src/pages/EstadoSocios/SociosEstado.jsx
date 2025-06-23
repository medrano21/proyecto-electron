import { useEffect, useState } from 'react';
import { getSociosPorEstado } from '../../Services/sociosServices';
import DynamicTable from '../../Components/DynamicTable/DynamicTable';
import Buscador from '../../Components/Buscador/Buscador';
import Layout from '../../Components/Estructura/Layout';


const SociosEstado = ({ }) => {
    const [filtro, setFiltro] = useState('todos');
    const [socios, setSocios] = useState([]);
    const [filtrados, setFiltrados] = useState([]);

    useEffect(() => {
        getSociosPorEstado(filtro)
            .then(data => {
                setSocios(data);
                setFiltrados(formatearDatos(data));
            })
            .catch(err => console.error(err));
    }, [filtro]);

    const formatearDatos = (data) =>
        data.map(s => ({
            ...s,
            Habilitado: s.Habilitado ? 'Sí' : 'No',
        }));

    const columnas = [
        { header: 'Documento', accessor: 'Documento' },
        { header: 'Nombre', accessor: 'Nombre' },
        { header: 'Apellido', accessor: 'Apellido' },
        { header: 'Habilitado', accessor: 'Habilitado' },
    ];

    return (
        <Layout title={"ESTADO DE LOS SOCIOS"}>
            <div style={{ height: "85vh" }}>
                <div style={{ height: "10vh" }}>
                    <Buscador
                        datos={formatearDatos(socios)}
                        campos={['Nombre', 'Apellido', 'Documento']}
                        onFiltrar={setFiltrados}
                    />
                </div>

                <div style={{ display: "flex", gap: "100px", marginBottom: "20px", alignItems: "center", justifyContent: "center", height: "10vh" }}>
                    <label>
                        <input
                            type="radio"
                            value="todos"
                            checked={filtro === 'todos'}
                            onChange={e => setFiltro(e.target.value)}
                        />
                        Todos
                    </label>
                    <label>
                        <input
                            type="radio"
                            value="habilitados"
                            checked={filtro === 'habilitados'}
                            onChange={e => setFiltro(e.target.value)}
                        />
                        Habilitados
                    </label>
                    <label>
                        <input
                            type="radio"
                            value="inhabilitados"
                            checked={filtro === 'inhabilitados'}
                            onChange={e => setFiltro(e.target.value)}
                        />
                        Inhabilitados
                    </label>
                    <label>
                        <input
                            type="radio"
                            value="con_deuda"
                            checked={filtro === 'con_deuda'}
                            onChange={e => setFiltro(e.target.value)}
                        />
                        Habilitados con deuda
                    </label>

                </div>

                <div style={{ height: "65vh", overflow: "auto" }}>

                    <DynamicTable columnas={columnas} datos={filtrados} />
                </div>
            </div>
        </Layout>
    );
}
export default SociosEstado