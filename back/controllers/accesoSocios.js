const db = require("../config/db");

const buscarSocio = async (req, res) => {
  const { documento } = req.body;

  try {
    const [socios] = await db.query(
      `
      SELECT s.Nombre, s.Apellido, p.Descripcion AS Plan,
             COALESCE(c.vencimiento, 'Sin cobro') AS vencimiento,
             NOW() AS horaEntrada,
             CASE
               WHEN c.vencimiento IS NULL THEN 'Inhabilitado'
               WHEN c.vencimiento < CURDATE() THEN 'Inhabilitado'
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
      WHERE s.Documento = ?
    `,
      [documento]
    );

    const socio = socios[0];

    if (!socio) {
      return res.status(404).json({ mensaje: "Socio no encontrado" });
    }

    const [accesos] = await db.query(
      `
      SELECT COUNT(*) AS conteo FROM accesos 
      WHERE Documento = ? 
        AND DATE(HoraEntrada) = CURDATE()
    `,
      [documento]
    );

    const yaIngreso = accesos[0].conteo > 0;

    if (
      (socio.estado === "Habilitado" ||
        socio.estado === "Habilitado con deuda") &&
      !yaIngreso
    ) {
      await db.query(
        `
        INSERT INTO accesos (Documento, HoraEntrada) 
        VALUES (?, NOW())
      `,
        [documento]
      );
    }

    res.json({ ...socio, yaIngreso });
  } catch (error) {
    console.error("Error al buscar socio:", error);
    res.status(500).json({ mensaje: "Error del servidor" });
  }
};

module.exports = { buscarSocio };
