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

const obtenerSocios = async (req, res) => {
  try {
    const rows = await dbAll(`
      SELECT 
        s.*, 
        p.Descripcion AS Plan 
      FROM 
        socios s
      LEFT JOIN 
        planes p ON s.id_plan = p.id_plan
    `);
    res.json(rows);
  } catch (error) {
    console.error("Error al obtener socios:", error);
    res.status(500).json({ mensaje: "Error al obtener los socios" });
  }
};
const eliminarSocio = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await dbRun("DELETE FROM socios WHERE id_socio = ?", [id]);
    if (result.changes === 0) {
      return res.status(404).json({ mensaje: "Socio no encontrado" });
    }
    res.json({ mensaje: "Socio eliminado correctamente" });
  } catch (error) {
    console.error("Error al eliminar socio:", error);
    res.status(500).json({ mensaje: "Error al eliminar el socio" });
  }
};

const buscarSocios = async (req, res) => {
  const { termino } = req.query;
  try {
    const rows = await dbAll(
      `SELECT * FROM socios WHERE Nombre LIKE ? OR Apellido LIKE ? OR Documento LIKE ?`,
      [`%${termino}%`, `%${termino}%`, `%${termino}%`]
    );
    res.json(rows);
  } catch (error) {
    console.error("Error al buscar socios:", error);
    res.status(500).json({ mensaje: "Error al buscar socios" });
  }
};

const getSociosPorSexo = async (req, res) => {
  try {
    const result = await dbAll(`
      SELECT Sexo, COUNT(*) AS cantidad
      FROM socios
      GROUP BY Sexo
    `);
    res.json(result);
  } catch (error) {
    console.error("Error al obtener socios por sexo:", error);
    res.status(500).json({ mensaje: "Error al obtener socios por sexo" });
  }
};

const getSociosPorPlan = async (req, res) => {
  try {
    const result = await dbAll(`
      SELECT p.Descripcion, COUNT(*) AS cantidad
      FROM socios s
      JOIN planes p ON s.id_plan = p.id_plan
      GROUP BY p.Descripcion
    `);
    res.json(result);
  } catch (error) {
    console.error("Error al obtener socios por plan:", error);
    res.status(500).json({ mensaje: "Error al obtener socios por plan" });
  }
};

const getSociosPorMes = async (req, res) => {
  try {
    const result = await dbAll(`
      SELECT 
        strftime('%Y-%m', FechaIngreso) AS mes,
        COUNT(*) AS cantidad
      FROM socios
      GROUP BY mes
      ORDER BY mes
    `);
    res.json(result);
  } catch (error) {
    console.error("Error al obtener socios por mes:", error);
    res.status(500).json({ mensaje: "Error al obtener socios por mes" });
  }
};

const getSociosByEstado = async (req, res) => {
  const { filtro } = req.query;
  let query = "";

  switch (filtro) {
    case "habilitados":
      query = "SELECT * FROM socios WHERE Habilitado = 1";
      break;
    case "inhabilitados":
      query = "SELECT * FROM socios WHERE Habilitado = 0";
      break;
    case "con_deuda":
      query = `
        SELECT s.* FROM socios s
        WHERE s.Habilitado = 1
        AND EXISTS (
          SELECT 1 FROM deudas d WHERE d.id_socio = s.id_socio
        )
      `;
      break;
    case "todos":
    default:
      query = "SELECT * FROM socios";
      break;
  }

  try {
    const rows = await dbAll(query);
    res.json(rows);
  } catch (error) {
    console.error("Error al obtener socios:", error);
    res.status(500).json({ error: "Error al obtener socios" });
  }
};
module.exports = {
  obtenerSocios,
  eliminarSocio,
  buscarSocios,
  getSociosPorSexo,
  getSociosPorPlan,
  getSociosPorMes,
  getSociosByEstado,
};
