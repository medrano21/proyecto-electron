const db = require("../config/db");
const util = require("util");

// Métodos de consulta
const dbGet = util.promisify(db.get).bind(db);
const dbAll = util.promisify(db.all).bind(db);

// Método dbRun corregido
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

// Obtener socios con su última deuda (si existe)
exports.getSocios = async (req, res) => {
  try {
    const sql = `
      SELECT s.id_socio,
             s.Nombre || ' ' || s.Apellido AS nombre_completo,
             s.Documento,
             d.id_deuda,
             strftime('%d-%m-%Y', d.fecha) AS fecha,
             d.monto,
             d.detalles
      FROM socios s
      LEFT JOIN (
          SELECT *
          FROM deudas d1
          WHERE d1.id_deuda = (
              SELECT MAX(d2.id_deuda)
              FROM deudas d2
              WHERE d2.id_socio = d1.id_socio
          )
      ) d ON s.id_socio = d.id_socio
      ORDER BY s.id_socio DESC
    `;
    const results = await dbAll(sql);
    return res.json(results);
  } catch (err) {
    console.error("Error al obtener socios:", err);
    return res.status(500).json({ error: err.message });
  }
};

// Obtener todas las deudas de un socio
exports.getDeudasPorSocio = async (req, res) => {
  const { id } = req.params;
  try {
    const results = await dbAll("SELECT * FROM deudas WHERE id_socio = ?", [
      id,
    ]);
    return res.json(results);
  } catch (err) {
    console.error("Error al obtener deudas:", err);
    return res.status(500).json({ error: err.message });
  }
};

exports.agregarDeuda = async (req, res) => {
  const { id_socio, fecha, monto, detalles } = req.body;

  try {
    const result = await dbRun(
      "INSERT INTO deudas (id_socio, fecha, monto, detalles) VALUES (?, ?, ?, ?)",
      [id_socio, fecha, monto, detalles]
    );

    const socio = await dbGet(
      "SELECT Nombre, Apellido, Documento FROM socios WHERE id_socio = ?",
      [id_socio]
    );

    if (!socio) {
      return res.status(404).json({ error: "Socio no encontrado" });
    }

    return res.json({
      message: "Deuda agregada",
      id_deuda: result.lastID,
    });
  } catch (err) {
    console.error("Error al agregar deuda:", err);
    return res
      .status(500)
      .json({ error: err.message || "Error al agregar deuda" });
  }
};

// Editar deuda existente
exports.editarDeuda = async (req, res) => {
  const { id_deuda, fecha, monto, detalles } = req.body;
  try {
    const result = await dbRun(
      "UPDATE deudas SET fecha = ?, monto = ?, detalles = ? WHERE id_deuda = ?",
      [fecha, monto, detalles, id_deuda]
    );

    if (result.changes === 0) {
      return res.status(404).json({ message: "Deuda no encontrada" });
    }

    return res.json({ message: "Deuda actualizada" });
  } catch (err) {
    console.error("Error al editar deuda:", err);
    return res.status(500).json({ error: err.message });
  }
};

// Eliminar deuda
exports.eliminarDeuda = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await dbRun("DELETE FROM deudas WHERE id_deuda = ?", [id]);

    if (result.changes === 0) {
      return res.status(404).json({ message: "Deuda no encontrada" });
    }

    return res.json({ message: "Deuda eliminada" });
  } catch (err) {
    console.error("Error al eliminar deuda:", err);
    return res.status(500).json({ error: err.message });
  }
};

exports.pagarDeuda = async (req, res) => {
  const { id_deuda, monto_pagado } = req.body;

  try {
    const deuda = await dbGet("SELECT * FROM deudas WHERE id_deuda = ?", [
      id_deuda,
    ]);

    if (!deuda) {
      return res.status(404).json({ error: "Deuda no encontrada" });
    }

    const socio = await dbGet(
      "SELECT Nombre, Apellido, Documento FROM socios WHERE id_socio = ?",
      [deuda.id_socio]
    );

    if (!socio) {
      return res.status(404).json({ error: "Socio no encontrado" });
    }

    if (parseFloat(monto_pagado) >= parseFloat(deuda.monto)) {
      await dbRun("DELETE FROM deudas WHERE id_deuda = ?", [id_deuda]);
    } else {
      const nuevoMonto = deuda.monto - monto_pagado;
      await dbRun("UPDATE deudas SET monto = ? WHERE id_deuda = ?", [
        nuevoMonto,
        id_deuda,
      ]);
    }

    return res.json({ message: "Pago registrado" });
  } catch (err) {
    console.error("Error al pagar deuda:", err);
    return res
      .status(500)
      .json({ error: "Error al registrar el pago de deuda" });
  }
};
