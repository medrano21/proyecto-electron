import React from 'react';
import './Layout.css';

const LayoutLogin = ({ children }) => {
    return (
        <div className="estructura-container">
            <div className="estructura-content">
                <div style={{ height: '100vh', overflow: 'hidden' }}>
                    {children}
                </div>
            </div>
        </div>
    );
};

export default LayoutLogin;