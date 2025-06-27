const db = require("../config/db"); // conexión mysql2 con .promise()

const registroSocio = async (req, res) => {
  const datos = req.body;

  if (!datos.Documento || !datos.Apellido || !datos.Nombre || !datos.id_plan) {
    return res.status(400).json({
      success: false,
      error: "Documento, Apellido, Nombre e id_plan son obligatorios",
    });
  }

  try {
    const sql = `
      INSERT INTO socios (
        Documento, Apellido, Nombre, FechaNac, Sexo,
        Domicilio, Localidad, Telefono, TelefonoUrgencia, Info,
        Alergia, Medicacion, id_plan, Habilitado, FechaIngreso
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      datos.Documento,
      datos.Apellido,
      datos.Nombre,
      datos.FechaNac || null,
      datos.Sexo,
      datos.Domicilio || null,
      datos.Localidad || null,
      datos.Telefono || null,
      datos.TelefonoUrgencia || null,
      datos.Info || null,
      datos.Alergia || null,
      datos.Medicacion || null,
      datos.id_plan,
      1, // Habilitado
      new Date().toISOString().split("T")[0], // FechaIngreso
    ];

    const [result] = await db.query(sql, values);

    res.status(200).json({
      success: true,
      message: "Socio registrado correctamente",
      insertId: result.insertId,
    });
  } catch (err) {
    console.error("❌ Error al registrar socio:", err);

    if (err.code === "ER_DUP_ENTRY") {
      return res.status(200).json({
        success: false,
        error: "El documento ya está registrado",
      });
    }

    res.status(500).json({
      success: false,
      error: "Error al registrar socio",
    });
  }
};

module.exports = { registroSocio };
