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

const buscarSocio = async (req, res) => {
  const { documento } = req.body;

  try {
    const sqlSocio = `
      SELECT s.Nombre, s.Apellido, p.Descripcion AS Plan,
             COALESCE(c.vencimiento, 'Sin cobro') AS vencimiento,
             datetime('now', 'localtime') AS horaEntrada,
             CASE
               WHEN c.vencimiento IS NULL THEN 'Inhabilitado'
               WHEN c.vencimiento < date('now', 'localtime') THEN 'Inhabilitado'
               WHEN COALESCE(d.total_deuda, 0) > 0 THEN 'Habilitado con deuda'
               ELSE 'Habilitado'
             END AS estado
      FROM socios s
      LEFT JOIN planes p ON s.id_plan = p.id_plan
      LEFT JOIN (
          SELECT id_socio, MAX(vencimiento) AS vencimiento FROM cobros GROUP BY id_socio
      ) c ON s.id_socio = c.id_socio
      LEFT JOIN (
          SELECT id_socio, SUM(monto) AS total_deuda FROM deudas GROUP BY id_socio
      ) d ON s.id_socio = d.id_socio
      WHERE s.Documento = ?;
    `;

    const socio = await dbGet(sqlSocio, [documento]);

    if (!socio) {
      return res.status(404).json({ mensaje: "Socio no encontrado" });
    }

    // Contar accesos hoy con date('now','localtime')
    const sqlAccesos = `
      SELECT COUNT(*) AS conteo FROM accesos 
      WHERE Documento = ? 
        AND date(HoraEntrada) = date('now', 'localtime')
    `;

    const accesos = await dbGet(sqlAccesos, [documento]);
    const yaIngreso = accesos.conteo > 0;

    if (
      (socio.estado === "Habilitado" ||
        socio.estado === "Habilitado con deuda") &&
      !yaIngreso
    ) {
      const sqlInsert = `INSERT INTO accesos (Documento, HoraEntrada) VALUES (?, datetime('now', 'localtime'))`;
      await dbRun(sqlInsert, [documento]);
    }

    res.json({ ...socio, yaIngreso });
  } catch (error) {
    console.error("Error al buscar socio:", error);
    res.status(500).json({ mensaje: "Error del servidor" });
  }
};

module.exports = { buscarSocio };
