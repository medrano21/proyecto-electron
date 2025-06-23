import React from 'react';
import Header from '../Header/Header';
import './Layout.css';

const Layout = ({ children, title }) => {
    return (
        <div className="estructura-container">
            <div style={{ height: "15vh", overflow: 'hidden' }}>
                <Header title={title} />
            </div>

            <div style={{ height: '85vh', overflow: 'hidden' }}>
                {children}
            </div>

        </div>
    );
};

export default Layout;