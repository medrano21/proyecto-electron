const db = require("../config/db");

async function getSaldoActual() {
  const [rows] = await db.query(
    "SELECT saldo FROM caja ORDER BY id_caja DESC LIMIT 1"
  );
  return rows.length > 0 ? rows[0].saldo : 0;
}

exports.insertarMovimiento = async (req, res) => {
  try {
    const {
      id_cobro,
      tipo_movimiento,
      detalle,
      socio_nombre,
      dni,
      tipo_pago,
      debe,
      haber,
    } = req.body;

    if (tipo_movimiento === "DEUDA") {
      return res
        .status(400)
        .json({ error: "No se insertan movimientos de tipo DEUDA en caja." });
    }

    const saldoAnterior = await getSaldoActual();
    const nuevoSaldo = saldoAnterior + (parseFloat(haber) - parseFloat(debe));

    const sqlInsert = `
      INSERT INTO caja 
      (id_cobro, tipo_movimiento, detalle, socio_nombre, dni, fecha, hora, tipo_pago, debe, haber, saldo)
      VALUES (?, ?, ?, ?, ?, CURDATE(), CURTIME(), ?, ?, ?, ?)
    `;

    await db.query(sqlInsert, [
      id_cobro || null,
      tipo_movimiento,
      detalle,
      socio_nombre,
      dni,
      tipo_pago || null,
      debe,
      haber,
      nuevoSaldo,
    ]);

    res.json({ success: true });
  } catch (err) {
    console.error("Error al insertar en caja:", err);
    res.status(500).json({ error: "Error interno" });
  }
};

exports.obtenerMovimientos = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT * FROM caja 
      WHERE tipo_movimiento = 'COBRO' OR tipo_movimiento = 'PAGO_DEUDA'
      ORDER BY fecha DESC, hora DESC
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: "Error al obtener movimientos" });
  }
};
