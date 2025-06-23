const db = require("../config/db");
const util = require("util");

const dbGet = util.promisify(db.get).bind(db);
const dbAll = util.promisify(db.all).bind(db);
const dbRun = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) {
        reject(err);
      } else {
        resolve({
          lastID: this.lastID,
          changes: this.changes,
        });
      }
    });
  });
};

// ---------- CAJA ----------

async function getSaldoActual() {
  const row = await dbGet(
    "SELECT saldo FROM caja ORDER BY id_caja DESC LIMIT 1"
  );
  return row ? row.saldo : 0;
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

    // Si es tipo deuda, no insertamos en caja:
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
      VALUES (?, ?, ?, ?, ?, date('now', 'localtime'), time('now', 'localtime'), ?, ?, ?, ?)
    `;

    await dbRun(sqlInsert, [
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
    const rows = await dbAll(`
      SELECT * FROM caja 
      WHERE tipo_movimiento = 'COBRO' OR tipo_movimiento = 'PAGO_DEUDA'
      ORDER BY fecha DESC, hora DESC
    `);

    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: "Error al obtener movimientos" });
  }
};
