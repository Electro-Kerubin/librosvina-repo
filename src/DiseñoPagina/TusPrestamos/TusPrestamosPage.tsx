import { Prestamos } from "./Componentes/Prestamos";
import { Historial } from "./Componentes/Historial";
import { useEffect, useRef, useState } from "react";

export const TusPrestamosPage = () => {

    const [historialRender, setHistorialRender] = useState(false);

    return (
        <div className="container">
            <div className="mt-3">
                <nav>
                    <div className="nav nav-tabs" id="nav-tab" role="tablist">
                        <button onClick={() => setHistorialRender(false)} 
                            className="nav-link active"
                            id="nav-prestamos-id"
                            data-bs-toggle="tab"
                            data-bs-target="#nav-prestamos"
                            type="button"
                            role="tab"
                            aria-controls="nav-prestamos"
                            aria-selected="true">
                            Tus Prestamos
                        </button>

                        <button onClick={() => setHistorialRender(true)} 
                            className="nav-link"
                            id="nav-historial-tab"
                            data-bs-toggle="tab"
                            data-bs-target="#nav-historial"
                            type="button"
                            role="tab"
                            aria-controls="nav-prestamos"
                            aria-selected="false">
                            Tu Historia
                        </button>
                    </div>
                </nav>

                <div className="tab-content" id="nav-tab-box">
                    <div className="tab-pane fade show active"
                        id="nav-prestamos"
                        role="tabpanel"
                        aria-labelledby="nav-prestamos-tab">
                        <Prestamos />
                    </div>
                    <div className="tab-pane fade"
                        id="nav-historial"
                        role="tabpanel"
                        aria-labelledby="nav-historial-tab">
                        {historialRender ? <Historial /> : <></>}
                    </div>
                </div>

            </div>
        </div>
    );
}