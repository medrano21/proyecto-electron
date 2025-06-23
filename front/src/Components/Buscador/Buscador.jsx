import { useState } from 'react';

export default function Buscador({ datos = [], campos = [], onFiltrar }) {
    const [busqueda, setBusqueda] = useState('');

    const handleChange = (e) => {
        const valor = e.target.value.toLowerCase();
        setBusqueda(valor);

        const filtrado = datos.filter(item =>
            campos.some(campo =>
                (item[campo] || '').toString().toLowerCase().includes(valor)
            )
        );

        onFiltrar(filtrado);
    };

    return (
        <div
            style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: '1rem',
                height: '50px', // Altura opcional para alineación vertical local
            }}
        >
            <input
                type="text"
                placeholder="Buscar..."
                value={busqueda}
                onChange={handleChange}
                style={{
                    padding: '0.5rem 1rem',
                    width: '100%',
                    maxWidth: '400px',
                    borderRadius: '8px',
                    border: '1px solid #ccc',
                    fontSize: '14px',
                    boxShadow: '0 2px 5px rgb(255, 0, 0)',
                }}
            />
        </div>
    );
}
