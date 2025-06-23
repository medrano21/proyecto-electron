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

// PLANES
const obtenerPlanes = async (req, res) => {
  try {
    const rows = await dbAll("SELECT * FROM planes");
    res.json(rows);
  } catch (error) {
    console.error("Error al obtener los planes:", error);
    res.status(500).json({ mensaje: "Error del servidor" });
  }
};

const agregarPlan = async (req, res) => {
  const { Abreviatura, Descripcion, Precio, Clases } = req.body;

  if (!Abreviatura || !Descripcion || isNaN(Precio) || isNaN(Clases)) {
    return res.status(400).json({ mensaje: "Datos inválidos o incompletos." });
  }

  try {
    const sql = `INSERT INTO planes (Abreviatura, Descripcion, Precio, Clases) VALUES (?, ?, ?, ?)`;
    const result = await dbRun(sql, [Abreviatura, Descripcion, Precio, Clases]);
    res.json({ mensaje: "Plan agregado exitosamente", id: result.lastID });
  } catch (error) {
    console.error("Error al agregar plan:", error);
    res.status(500).json({ mensaje: "Error del servidor" });
  }
};

const actualizarPlan = async (req, res) => {
  const { id_plan } = req.params;
  const { Abreviatura, Descripcion, Precio, Clases } = req.body;

  try {
    const sql = `UPDATE planes SET Abreviatura = ?, Descripcion = ?, Precio = ?, Clases = ? WHERE id_plan = ?`;
    const result = await dbRun(sql, [
      Abreviatura,
      Descripcion,
      Precio,
      Clases,
      id_plan,
    ]);
    if (result.changes === 0) {
      return res.status(404).json({ mensaje: "Plan no encontrado" });
    }
    res.json({ mensaje: "Plan actualizado correctamente" });
  } catch (error) {
    console.error("Error al actualizar plan:", error);
    res.status(500).json({ mensaje: "Error del servidor" });
  }
};

const eliminarPlan = async (req, res) => {
  const { id_plan } = req.params;

  try {
    const sql = `DELETE FROM planes WHERE id_plan = ?`;
    const result = await dbRun(sql, [id_plan]);
    if (result.changes === 0) {
      return res.status(404).json({ mensaje: "Plan no encontrado" });
    }
    res.json({ mensaje: "Plan eliminado correctamente" });
  } catch (error) {
    console.error("Error al eliminar plan:", error);
    res.status(500).json({ mensaje: "Error del servidor" });
  }
};

const getPlanes = async (req, res) => {
  try {
    const rows = await dbAll("SELECT id_plan, Descripcion FROM planes");
    res.status(200).json({ success: true, planes: rows });
  } catch (err) {
    console.error("❌ Error al obtener planes:", err);
    res.status(500).json({ success: false, error: "Error al obtener planes" });
  }
};
module.exports = {
  obtenerPlanes,
  agregarPlan,
  actualizarPlan,
  eliminarPlan,
  getPlanes,
};
