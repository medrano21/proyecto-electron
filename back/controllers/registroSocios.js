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

// SOCIOS
const registroSocio = async (req, res) => {
  const datos = req.body;

  if (!datos.Documento || !datos.Apellido || !datos.Nombre) {
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
      1,
      new Date().toISOString().split("T")[0],
    ];

    const result = await dbRun(sql, values);

    res.status(200).json({
      success: true,
      message: "Socio registrado correctamente",
      insertId: result.lastID,
    });
  } catch (err) {
    console.error("❌ Error al registrar socio:", err);

    if (err.message.includes("UNIQUE constraint failed")) {
      return res.status(400).json({
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
