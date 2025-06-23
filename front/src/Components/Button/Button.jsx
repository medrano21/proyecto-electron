import React from 'react';
import './Button.css';

const Button = ({
    type = 'button',
    onClick,
    children,
    className = '',
    disabled = false,
}) => {
    return (
        <button
            type={type}
            onClick={onClick}
            className={`custom-button ${className}`}
            disabled={disabled}
        >
            {children}
        </button>
    );
};

export default Button;
