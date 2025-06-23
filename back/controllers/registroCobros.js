const db = require("../config/db"); // instancia sqlite3.Database
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
// REGISTRO COBROS
const obtenerRegistroCobros = async (req, res) => {
  const sql = `
    SELECT socios.id_socio, 
           socios.Nombre || ' ' || socios.Apellido AS NombreCompleto,
           socios.Documento,
           cobros.fecha_cobro AS FechaCobro,
           cobros.vencimiento AS Vencimiento,
           cobros.importe AS ImporteCobrado,
           cobros.saldo AS Saldo,
           cobros.descuento AS Descuento,
           cobros.motivo_descuento AS MotivoDto,
           cobros.tipo_pago AS TipoPago
    FROM socios
    LEFT JOIN cobros ON socios.id_socio = cobros.id_socio
    ORDER BY cobros.fecha_cobro DESC
  `;

  try {
    const resultados = await dbAll(sql);

    const resultadosFormateados = resultados.map((row) => ({
      ...row,
      FechaCobro: row.FechaCobro ? row.FechaCobro.split("T")[0] : null,
      Vencimiento: row.Vencimiento ? row.Vencimiento.split("T")[0] : null,
    }));

    res.json(resultadosFormateados);
  } catch (err) {
    console.error("Error al obtener los cobros:", err);
    res.status(500).json({ error: "Error en el servidor" });
  }
};

const registrarCobro = async (req, res) => {
  const {
    id_socio,
    fecha_cobro,
    vencimiento,
    importe,
    saldo,
    descuento,
    motivo_descuento,
    tipo_pago,
  } = req.body;

  const sqlCobro = `
    INSERT INTO cobros 
    (id_socio, fecha_cobro, vencimiento, importe, saldo, descuento, motivo_descuento, tipo_pago) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  try {
    const cobroResult = await dbRun(sqlCobro, [
      id_socio,
      fecha_cobro,
      vencimiento,
      importe,
      saldo,
      descuento,
      motivo_descuento,
      tipo_pago,
    ]);

    const id_cobro = cobroResult.lastID;

    const socio = await dbGet(
      "SELECT Nombre, Apellido, Documento FROM socios WHERE id_socio = ?",
      [id_socio]
    );
    const nombreCompleto = `${socio.Nombre} ${socio.Apellido}`;
    const documento = socio.Documento;

    const lastSaldoResult = await dbGet(
      "SELECT saldo FROM caja ORDER BY id_caja DESC LIMIT 1"
    );
    const ultimoSaldo = lastSaldoResult ? lastSaldoResult.saldo : 0;
    const nuevoSaldo = ultimoSaldo + parseFloat(importe);

    const insertCajaSQL = `
      INSERT INTO caja 
      (id_cobro, tipo_movimiento, detalle, socio_nombre, dni, fecha, hora, tipo_pago, debe, haber, saldo)
      VALUES (?, 'COBRO', ?, ?, ?, date('now', 'localtime'), time('now', 'localtime'), ?, 0.00, ?, ?)
    `;

    await dbRun(insertCajaSQL, [
      id_cobro,
      `Cobro del socio ${nombreCompleto}`,
      nombreCompleto,
      documento,
      tipo_pago,
      importe,
      nuevoSaldo,
    ]);

    res.status(201).json({ message: "Cobro y movimiento en caja registrados" });
  } catch (err) {
    console.error("Error al registrar cobro:", err);
    res
      .status(500)
      .json({ error: "Error en el servidor al registrar el cobro" });
  }
};

module.exports = {
  obtenerRegistroCobros,
  registrarCobro,
};
