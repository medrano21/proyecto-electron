import React, { useRef } from 'react';
import { QRCodeCanvas } from 'qrcode.react';

const QrGenerator = ({ value, filename = 'qr.png' }) => {
    const qrRef = useRef();

    const descargarImagen = () => {
        const canvas = qrRef.current.querySelector('canvas');
        const url = canvas.toDataURL('image/png');

        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div>
            <div ref={qrRef}>
                <QRCodeCanvas value={value} size={200} />
            </div>
            <button onClick={descargarImagen}>Descargar QR</button>
        </div>
    );
};

export default QrGenerator;
