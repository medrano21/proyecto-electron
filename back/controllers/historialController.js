const db = require("../config/db");
const util = require("util");

// Promisificamos los métodos para usar async/await
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
exports.obtenerHistorial = async (req, res) => {
  try {
    const sql = `
      SELECT 
        c.id_cobro, s.Nombre, s.Apellido, 
        strftime('%d-%m-%Y', c.fecha_cobro) AS fecha_cobro,
        strftime('%d-%m-%Y', c.vencimiento) AS vencimiento,
        c.importe, c.saldo, c.descuento, c.motivo_descuento, c.tipo_pago
      FROM cobros c
      JOIN socios s ON c.id_socio = s.id_socio
    `;
    const rows = await dbAll(sql);
    res.json(rows);
  } catch (error) {
    console.error("Error al obtener historial:", error);
    res.status(500).json({ mensaje: "Error del servidor" });
  }
};

exports.filtrarPorMesAnio = async (req, res) => {
  const { mes, anio } = req.query;
  try {
    const sql = `
      SELECT 
        c.id_cobro, s.Nombre, s.Apellido, 
        strftime('%d-%m-%Y', c.fecha_cobro) AS fecha_cobro,
        strftime('%d-%m-%Y', c.vencimiento) AS vencimiento,
        c.importe, c.saldo, c.descuento, c.motivo_descuento, c.tipo_pago
      FROM cobros c
      JOIN socios s ON c.id_socio = s.id_socio
      WHERE strftime('%m', c.fecha_cobro) = ? AND strftime('%Y', c.fecha_cobro) = ?
    `;
    const rows = await dbAll(sql, [mes.padStart(2, "0"), anio]);
    res.json(rows);
  } catch (error) {
    console.error("Error filtrando por mes y año:", error);
    res.status(500).json({ mensaje: "Error del servidor" });
  }
};

exports.filtrarPorDia = async (req, res) => {
  const { fecha } = req.query;
  try {
    const sql = `
      SELECT 
        c.id_cobro, s.Nombre, s.Apellido, 
        strftime('%d-%m-%Y', c.fecha_cobro) AS fecha_cobro,
        strftime('%d-%m-%Y', c.vencimiento) AS vencimiento,
        c.importe, c.saldo, c.descuento, c.motivo_descuento, c.tipo_pago
      FROM cobros c
      JOIN socios s ON c.id_socio = s.id_socio
      WHERE date(c.fecha_cobro) = date(?)
    `;
    const rows = await dbAll(sql, [fecha]);
    res.json(rows);
  } catch (error) {
    console.error("Error filtrando por día:", error);
    res.status(500).json({ mensaje: "Error del servidor" });
  }
};
