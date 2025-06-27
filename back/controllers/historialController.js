const db = require("../config/db");

exports.obtenerHistorial = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        c.id_cobro, s.Nombre, s.Apellido, 
        DATE_FORMAT(c.fecha_cobro, '%d-%m-%Y') AS fecha_cobro,
        DATE_FORMAT(c.vencimiento, '%d-%m-%Y') AS vencimiento,
        c.importe, c.saldo, c.descuento, c.motivo_descuento, c.tipo_pago
      FROM cobros c
      JOIN socios s ON c.id_socio = s.id_socio
    `);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ mensaje: "Error del servidor" });
  }
};

exports.filtrarPorMesAnio = async (req, res) => {
  const { mes, anio } = req.query;
  try {
    const [rows] = await db.query(
      `
      SELECT 
        c.id_cobro, s.Nombre, s.Apellido, 
        DATE_FORMAT(c.fecha_cobro, '%d-%m-%Y') AS fecha_cobro,
        DATE_FORMAT(c.vencimiento, '%d-%m-%Y') AS vencimiento,
        c.importe, c.saldo, c.descuento, c.motivo_descuento, c.tipo_pago
      FROM cobros c
      JOIN socios s ON c.id_socio = s.id_socio
      WHERE MONTH(c.fecha_cobro) = ? AND YEAR(c.fecha_cobro) = ?
    `,
      [mes, anio]
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ mensaje: "Error del servidor" });
  }
};

exports.filtrarPorDia = async (req, res) => {
  const { fecha } = req.query;
  try {
    const [rows] = await db.query(
      `
      SELECT 
        c.id_cobro, s.Nombre, s.Apellido, 
        DATE_FORMAT(c.fecha_cobro, '%d-%m-%Y') AS fecha_cobro,
        DATE_FORMAT(c.vencimiento, '%d-%m-%Y') AS vencimiento,
        c.importe, c.saldo, c.descuento, c.motivo_descuento, c.tipo_pago
      FROM cobros c
      JOIN socios s ON c.id_socio = s.id_socio
      WHERE DATE(c.fecha_cobro) = DATE(?)
    `,
      [fecha]
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ mensaje: "Error del servidor" });
  }
};
