const db = require("../config/db");

exports.getSocios = async (req, res) => {
  try {
    const [results] = await db.query(`
      SELECT s.id_socio,
             CONCAT(s.Nombre, ' ', s.Apellido) AS nombre_completo,
             s.Documento,
             d.id_deuda,
             DATE_FORMAT(d.fecha, '%d-%m-%Y') AS fecha,
             d.monto,
             d.detalles
      FROM socios s
      LEFT JOIN (
          SELECT * FROM deudas d1
          WHERE d1.id_deuda = (
              SELECT MAX(d2.id_deuda)
              FROM deudas d2
              WHERE d2.id_socio = d1.id_socio
          )
      ) d ON s.id_socio = d.id_socio
      ORDER BY s.id_socio DESC
    `);
    res.json(results);
  } catch (err) {
    console.error("Error al obtener socios:", err);
    res.status(500).json({ error: err.message });
  }
};

exports.getDeudasPorSocio = async (req, res) => {
  const { id } = req.params;
  try {
    const [results] = await db.query(
      "SELECT * FROM deudas WHERE id_socio = ?",
      [id]
    );
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.agregarDeuda = async (req, res) => {
  const { id_socio, fecha, monto, detalles } = req.body;
  try {
    const [result] = await db.query(
      "INSERT INTO deudas (id_socio, fecha, monto, detalles) VALUES (?, ?, ?, ?)",
      [id_socio, fecha, monto, detalles]
    );

    res.json({
      message: "Deuda agregada",
      id_deuda: result.insertId,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.editarDeuda = async (req, res) => {
  const { id_deuda, fecha, monto, detalles } = req.body;
  try {
    const [result] = await db.query(
      "UPDATE deudas SET fecha = ?, monto = ?, detalles = ? WHERE id_deuda = ?",
      [fecha, monto, detalles, id_deuda]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Deuda no encontrada" });
    }

    res.json({ message: "Deuda actualizada" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.eliminarDeuda = async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await db.query("DELETE FROM deudas WHERE id_deuda = ?", [
      id,
    ]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Deuda no encontrada" });
    }
    res.json({ message: "Deuda eliminada" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.pagarDeuda = async (req, res) => {
  const { id_deuda, monto_pagado } = req.body;

  try {
    const [[deuda]] = await db.query(
      "SELECT * FROM deudas WHERE id_deuda = ?",
      [id_deuda]
    );
    if (!deuda) return res.status(404).json({ error: "Deuda no encontrada" });

    if (parseFloat(monto_pagado) >= parseFloat(deuda.monto)) {
      await db.query("DELETE FROM deudas WHERE id_deuda = ?", [id_deuda]);
    } else {
      const nuevoMonto = deuda.monto - monto_pagado;
      await db.query("UPDATE deudas SET monto = ? WHERE id_deuda = ?", [
        nuevoMonto,
        id_deuda,
      ]);
    }

    res.json({ message: "Pago registrado" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
