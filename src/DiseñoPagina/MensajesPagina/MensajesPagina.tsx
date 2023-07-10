import { useState } from "react";
import { EnviarNuevoMensaje } from "./components/EnviarNuevoMensaje";
import { Mensajes } from "./components/Mensajes";

export const MensajesPagina = () => {

    const [mensajeClick, setMensajeClick] = useState(false);

    window.scrollTo(0,0);

    return (
        <div className="container">

            <div className="mt-3 mb-2">
                <nav>
                    <div className="nav nav-tabs" id="nav-tab" role="tablist">
                        <button onClick={() => setMensajeClick(false)} className="nav-link active"
                            id='nav-enviar-mensaje-tab' data-bs-toggle='tab' data-bs-target='#nav-enviar-mensaje'
                            type="button" role="tab" aria-controls="nav-enviar-mensaje" aria-selected='true'>
                            Enviar Preguntas
                        </button>
                        <button onClick={() => setMensajeClick(true)} className="nav-link"
                            id='nav-respuesta-mensaje-tab' data-bs-toggle='tab' data-bs-target='#nav-respuesta-mensaje'
                            type="button" role="tab" aria-controls="nav-respuesta-mensaje" aria-selected='false'>
                            Ver respuestas administrador
                        </button>
                    </div>
                </nav>
                <div className="tab-content" id="nav-content">
                    <div className="tab-pane fade show active" id="nav-enviar-mensaje" role="tabpanel"
                        aria-labelledby="nav-enviar-mensaje-tab">
                        <EnviarNuevoMensaje />
                    </div>
                    <div className="tab-pane fade" id="nav-respuesta-mensaje" role="tabpanel"
                        aria-labelledby="nav-respuesta-mensaje-tab">
                        {mensajeClick ?
                            <Mensajes />
                            :
                            <></>
                        }
                    </div>
                </div>
            </div>
        </div>
    );
}