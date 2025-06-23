import { useEffect, useState } from 'react';
import {
  PieChart, Pie, Cell,
  BarChart, Bar, XAxis, YAxis, Tooltip,
  LineChart, Line, CartesianGrid, Legend
} from 'recharts';
import { obtenerSociosPorSexo, obtenerSociosPorPlan, obtenerSociosPorMes } from '../../Services/estadisticasService';
import './EstadisticasSocios.css';
import Layout from '../../Components/Estructura/Layout';

const EstadisticasSocios = () => {
  const [sexoData, setSexoData] = useState([]);
  const [planData, setPlanData] = useState([]);
  const [mensualData, setMensualData] = useState([]);

  useEffect(() => {
    const loadDatos = async () => {
      try {
        const sexo = await obtenerSociosPorSexo();
        const plan = await obtenerSociosPorPlan();
        const mensual = await obtenerSociosPorMes();

        setSexoData(sexo);
        setPlanData(Array.isArray(plan[0]) ? plan[0] : plan);
        setMensualData(Array.isArray(mensual[0]) ? mensual[0] : mensual);
      } catch (error) {
        console.error("Error cargando estadísticas:", error);
      }
    };

    loadDatos();
  }, []);

  const COLORS = ["#0088FE", "#FF8042", "#00C49F", "#FFBB28", "#FF4560"];

  return (
    <Layout title={"GRÁFICOS ESTADÍSTICOS"}>
      <div className="estadisticas-container">
        {/* Socios por Sexo */}
        <section className="chart-card">
          <h3>Socios por Sexo</h3>
          <PieChart width={300} height={320}>
            <Pie
              data={sexoData}
              dataKey="cantidad"
              nameKey="Sexo"
              cx="50%"
              cy="40%"
              outerRadius={100}
              labelLine={false}
            >
              {sexoData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend
              layout="horizontal"
              verticalAlign="bottom"
              align="center"
              payload={sexoData.map((entry, index) => ({
                value: `${entry.Sexo}: ${entry.cantidad}`,
                type: "square",
                id: entry.Sexo,
                color: COLORS[index % COLORS.length],
              }))}
            />

          </PieChart>
        </section>


        {/* Socios por Plan */}
        <section className="chart-card">
          <h3>Socios por Plan</h3>
          <BarChart width={250} height={300} data={planData}>
            <XAxis dataKey="Descripcion" tick={{ fontSize: 15, fill: '#ccc' }} />
            <YAxis />
            <Tooltip />
            <Bar dataKey="cantidad" fill="#82ca9d" radius={[10, 10, 0, 0]} />
          </BarChart>
        </section>

        {/* Altas por Mes */}
        <section className="chart-card">
          <h3>Altas por Mes</h3>
          <LineChart width={250} height={280} data={mensualData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="mes" tick={{ fontSize: 12, fill: '#ccc' }} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="cantidad" stroke="#8884d8" strokeWidth={3} dot={{ r: 4 }} />
          </LineChart>
        </section>
      </div>
    </Layout>
  );
};

export default EstadisticasSocios;
