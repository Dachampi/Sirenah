import { useState } from "react"
import AdminSidebar from "../../components/layout/AdminSidebar"
import MiniProfile from "../../components/common/MiniProfile"
import VentasPorFecha from "../../components/Dashboard/VentasPorFecha"
import IngresosAgrupados from "../../components/Dashboard/IngresosAgrupados"
import ProductosMasVendidos from "../../components/Dashboard/ProductosMasVendidos"
import ProductosBajoStock from "../../components/Dashboard/ProductosBajoStock"
import ValorInventario from "../../components/Dashboard/ValorInventario"
import ComparativoVentas from "../../components/Dashboard/ComparativoVentas"
import CrecimientoMensualVentas from "../../components/Dashboard/CrecimientoMensualVentas"
import { BarChart, PieChart, TrendingUp, PackageSearch, DollarSign, Activity, ArrowUp } from "lucide-react"
import "../../styles/Dashboard/Reportes.css"

const tabs = [
  { label: "Ventas por Fecha", icon: <BarChart size={16} />, component: <VentasPorFecha /> },
  { label: "Ingresos Agrupados", icon: <DollarSign size={16} />, component: <IngresosAgrupados /> },
  { label: "Más Vendidos", icon: <TrendingUp size={16} />, component: <ProductosMasVendidos /> },
  { label: "Bajo Stock", icon: <PackageSearch size={16} />, component: <ProductosBajoStock /> },
  { label: "Valor Inventario", icon: <PieChart size={16} />, component: <ValorInventario /> },
  { label: "Comparativo Ventas", icon: <Activity size={16} />, component: <ComparativoVentas /> },
  { label: "Crecimiento Mensual", icon: <ArrowUp size={16} />, component: <CrecimientoMensualVentas /> },
]

export default function Reportes() {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [selectedTab, setSelectedTab] = useState(0)

  const handleCollapseChange = (collapsed) => setIsCollapsed(collapsed)

  return (
    <div className="Admin-layout">
      <AdminSidebar onCollapseChange={handleCollapseChange} />
      <main className={`content ${isCollapsed ? "collapsed" : ""}`}>
        <div style={{ display: "flex", justifyContent: "flex-end", padding: "10px 20px" }}>
          <MiniProfile />
        </div>

        <div className="reportes-tab-bar">
          {tabs.map((tab, index) => (
            <button
              key={index}
              className={`report-tab-btn ${selectedTab === index ? "active" : ""}`}
              onClick={() => setSelectedTab(index)}
            >
              {tab.icon}
              <span className="ml-1">{tab.label}</span>
            </button>
          ))}
        </div>

        <div className="reportes-tab-content">{tabs[selectedTab].component}</div>
      </main>
    </div>
  )
}
