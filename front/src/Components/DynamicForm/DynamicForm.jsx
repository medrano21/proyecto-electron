import React, { useState, forwardRef, useImperativeHandle } from 'react';
import './DynamicForm.css';
import Button from "../../Components/Button/Button";

const DynamicForm = forwardRef(({ titulo, campos, onSubmit, botonTexto, className = '' }, ref) => {
    const [valores, setValores] = useState(
        campos.reduce((acc, campo) => ({
            ...acc,
            [campo.name]: campo.defaultValue || ''
        }), {})
    );

    // Expone la función getFormData al componente padre
    useImperativeHandle(ref, () => ({
        getFormData: () => valores
    }));

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        let finalValue = type === 'checkbox' ? checked : value;

        const campoActual = campos.find(c => c.name === name);
        if (campoActual?.type === 'select') {
            const isNumeric = campoActual.options?.some(opt => typeof opt.value === 'number');
            if (isNumeric) {
                finalValue = Number(finalValue);
            }
        }

        setValores((prev) => ({
            ...prev,
            [name]: finalValue
        }));
    };

    const handleSelectChange = (name, selectedValue) => {
        setValores((prev) => ({ ...prev, [name]: selectedValue }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (onSubmit) onSubmit(valores);
    };

    const renderInput = (campo, id) => {
        switch (campo.type) {
            case 'select':
                return (
                    <select
                        name={campo.name}
                        value={valores[campo.name] || ''}
                        onChange={handleChange}
                        required={campo.required}
                    >
                        {campo.placeholder && <option value="" disabled>{campo.placeholder}</option>}
                        {campo.options.map(option => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                );
            case 'textarea':
                return (
                    <textarea
                        name={campo.name}
                        value={valores[campo.name] || ''}
                        onChange={handleChange}
                        required={campo.required}
                        rows={campo.rows || 3}
                    />
                );
            case 'checkbox':
                return (
                    <input
                        type="checkbox"
                        name={campo.name}
                        checked={valores[campo.name] || false}
                        onChange={handleChange}
                    />
                );
            case 'radio':
                return (
                    <div className="radio-group">
                        {campo.options.map(option => (
                            <label key={option.value}>
                                <input
                                    type="radio"
                                    name={campo.name}
                                    value={option.value}
                                    checked={valores[campo.name] === option.value}
                                    onChange={handleChange}
                                />
                                {option.label}
                            </label>
                        ))}
                    </div>
                );
            case 'file':
                return (
                    <input
                        type="file"
                        name={campo.name}
                        onChange={(e) => {
                            const file = e.target.files[0];
                            setValores(prev => ({ ...prev, [campo.name]: file }));
                        }}
                        accept={campo.accept}
                    />
                );
            default:
                return (
                    <input
                        id={id}
                        type={campo.type}
                        name={campo.name}
                        value={valores[campo.name] || ''}
                        onChange={handleChange}
                        required={campo.required}
                        placeholder={campo.placeholder}
                        min={campo.min}
                        max={campo.max}
                        step={campo.step}
                    />
                );
        }
    };
    useImperativeHandle(ref, () => ({
        getFormData: () => valores,
        resetForm: () => setValores(campos.reduce((acc, campo) => ({
            ...acc,
            [campo.name]: campo.defaultValue || ''
        }), {}))
    }));

    return (
        <div className={`form-container ${className}`}>
            <h2>{titulo}</h2>
            <form onSubmit={handleSubmit}>
                {campos.map((campo) => {
                    const inputId = `input-${campo.name}`;
                    return (
                        <div key={campo.name} className={`form-group ${campo.type === 'checkbox' ? 'checkbox-group' : ''}`}>
                            <label htmlFor={inputId}>
                                {campo.label}
                                {campo.required && <span className="required">*</span>}
                            </label>
                            {renderInput(campo, inputId)}
                            {campo.helpText && <small className="help-text">{campo.helpText}</small>}
                        </div>
                    );
                })}

                <div className="form-button-container">
                    <Button type="submit">{botonTexto}</Button>
                </div>

            </form>
        </div>
    );
});

export default DynamicForm;
