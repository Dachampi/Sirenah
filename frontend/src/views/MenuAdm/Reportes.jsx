import AdminSidebar from "../../components/layout/AdminSidebar"
import MiniProfile from "../../components/common/MiniProfile"
import { useState } from "react";
import VentasPorFecha from "../../components/Dashboard/VentasPorFecha";
import IngresosAgrupados from "../../components/Dashboard/IngresosAgrupados";
import ProductosMasVendidos from "../../components/Dashboard/ProductosMasVendidos";
import ProductosBajoStock from "../../components/Dashboard/ProductosBajoStock";
import ValorInventario from "../../components/Dashboard/ValorInventario";
import ComparativoVentas from "../../components/Dashboard/ComparativoVentas";
import CrecimientoMensualVentas from "../../components/Dashboard/CrecimientoMensualVentas";

function Reportes() {
    const [isCollapsed, setIsCollapsed] = useState(false);

    const handleCollapseChange = (collapsed) => {
        setIsCollapsed(collapsed);
      };
    return (
        <div className="Admin-layout">
            
            <div style={{ display: "flex", justifyContent: "flex-end", padding: "10px 20px" }}>
                <MiniProfile />
            </div>
            <AdminSidebar onCollapseChange={handleCollapseChange} />
            <main style={{marginTop:"0px"}} className={`content ${isCollapsed ? 'collapsed' : ''}`}>

                <VentasPorFecha/>
                <IngresosAgrupados/>
                <ProductosMasVendidos />
                <ProductosBajoStock/>
                <ValorInventario/>
                <ComparativoVentas/>
                <CrecimientoMensualVentas/>
            </main>
        </div>
    )
}

export default Reportes
