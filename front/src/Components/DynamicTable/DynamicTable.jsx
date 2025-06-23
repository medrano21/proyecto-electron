import React from 'react';
import './DynamicTable.css';
import Button from '../../Components/Button/Button';

const DynamicTable = ({ columnas, datos, acciones = [], onRowClick }) => {
    return (
        <div className="tabla-container">
            <table className="dynamic-table">
                <thead>
                    <tr>
                        {columnas.map((col) => (
                            <th key={col.accessor}>{col.header}</th>
                        ))}
                        {acciones.length > 0 && <th>Acciones</th>}
                    </tr>
                </thead>
                <tbody>
                    {datos.map((fila, index) => (
                        <tr
                            key={index}
                            onClick={() => onRowClick?.(fila)}
                            style={{ cursor: onRowClick ? 'pointer' : 'default' }}
                        >
                            {columnas.map((col) => (
                                <td key={col.accessor}>{fila[col.accessor]}</td>
                            ))}
                            {acciones.length > 0 && (
                                <td onClick={(e) => e.stopPropagation()}>
                                    {acciones.map((accion, idx) => (
                                        <Button
                                            key={idx}
                                            type="button"
                                            onClick={() => accion.onClick(fila)}
                                        >
                                            {accion.label}
                                        </Button>
                                    ))}
                                </td>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default DynamicTable;
