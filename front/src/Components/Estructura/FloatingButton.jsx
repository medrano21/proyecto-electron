
function FloatingButton() {
    return (
        <img
            src="/icono.png"
            alt="Botón flotante"
            style={{
                position: 'fixed',
                bottom: '0px',
                right: '0px',
                height: '128px',
                zIndex: 9999,
                cursor: 'pointer',
            }}
            onClick={() => alert('¡Clic en botón flotante!')}
        />
    );
}

export default FloatingButton;