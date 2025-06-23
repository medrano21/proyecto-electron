const db = require("../config/db");
const util = require("util");

// Promisificamos los métodos para usar async/await
const dbGet = util.promisify(db.get).bind(db);
const dbAll = util.promisify(db.all).bind(db);
const dbRun = util.promisify(db.run).bind(db);
exports.login = async (req, res) => {
  const { usuario, pass } = req.body;

  if (!usuario || !pass) {
    return res.status(400).json({ message: "Faltan datos" });
  }

  try {
    const query = "SELECT * FROM roles WHERE usuario = ? AND pass = ?";
    const results = await dbAll(query, [usuario, pass]);

    if (results.length > 0) {
      return res.status(200).json({ message: "Login exitoso" });
    } else {
      return res.status(401).json({ message: "Credenciales incorrectas" });
    }
  } catch (err) {
    console.error("Error en la consulta:", err);
    return res.status(500).json({ message: "Error en el servidor" });
  }
};
