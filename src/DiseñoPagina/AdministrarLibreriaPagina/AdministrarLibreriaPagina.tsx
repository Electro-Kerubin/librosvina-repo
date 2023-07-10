import { useOktaAuth } from "@okta/okta-react";
import { useState } from "react";
import { Redirect } from "react-router-dom";
import { MensajesAdmin } from "./components/MensajesAdmin";
import { AnadirLibro } from "./components/AnadirLibro";
import { ActualizarLibros } from "./components/ActualizarLibros";
import { ConfirmarPrestamos } from "./components/ConfirmarPrestamo";
import { RenovarPrestamo } from "./components/RenovarPrestamo";
import { RetornoPrestamo } from "./components/RetornoPrestamo";

export const AdministrarLibreriaPagina = () => {

    const { authState } = useOktaAuth();

    const [cambiarCantidadDeLibroClick, setCambiarCantidadDeLibroClick] = useState(false);
    const [updateConfimarPrestamoClick, setUpdateConfimarPrestamoClick] = useState(false);
    const [updateRenovarPrestamoClick, setUpdateRenovarPrestamoClick] = useState(false);
    const [updateRetornarPrestamoClick, setUpdateRetornarPrestamoClick] = useState(false);

    const [mensajesClick, setMensajesClick] = useState(false);

    function anadirNuevoLibroClick() {
        setCambiarCantidadDeLibroClick(false);
        setMensajesClick(false);
    }

    function actualizarLibroClick() {
        setCambiarCantidadDeLibroClick(true);
        setMensajesClick(false);
    }

    function responderMensajesClick() {
        setCambiarCantidadDeLibroClick(false);
        setMensajesClick(true)
    }

    function confirmarPrestamoClick() {
        setUpdateConfimarPrestamoClick(true);
        setMensajesClick(false);
    }

    function renovarPrestamoClick() {
        setUpdateRenovarPrestamoClick(true);
        setMensajesClick(false);
    }

    function retornarPrestamoClick() {
        setUpdateRetornarPrestamoClick(true);
        setMensajesClick(false);
    }

    // Si el usuarioRol no esta definido se devuelve al home page
    if (authState?.accessToken?.claims.usuarioRol === undefined) {
        return <Redirect to='/home' />
    }

    return (

        <div className="container">
            <div className="mt-3">
                <h3>Administrar Libreria</h3>
                <nav>
                    <div className="nav nav-tabs">
                        <button onClick={anadirNuevoLibroClick} className="nav-link active"
                            id='nav-añadir-libro-tab' data-bs-toggle='tab' data-bs-target='#nav-añadir-libro'
                            type="button" role="tab" aria-controls="nav-añadir-libro" aria-selected='true'>
                            Añadir Nuevo Libro
                        </button>
                        <button onClick={actualizarLibroClick} className="nav-link "
                            id='nav-actualizar-libro-tab' data-bs-toggle='tab' data-bs-target='#nav-actualizar-libro'
                            type="button" role="tab" aria-controls="nav-actualizar-libro" aria-selected='true'>
                            Actualizar Libro
                        </button>
                        <button onClick={responderMensajesClick} className="nav-link "
                            id='nav-enviar-mensaje-tab' data-bs-toggle='tab' data-bs-target='#nav-enviar-mensaje'
                            type="button" role="tab" aria-controls="nav-enviar-mensaje" aria-selected='true'>
                            Responder Mensajes
                        </button>
                        <button onClick={confirmarPrestamoClick} className="nav-link"
                            id='confirmar-prestamo-tab' data-bs-toggle='tab' data-bs-target='#confirmar-prestamo'
                            type="button" role="tab" aria-controls="confirmar-prestamo" aria-selected='true'>
                            Confirmar Prestamos
                        </button>
                        <button onClick={renovarPrestamoClick} className="nav-link"
                            id='renovar-prestamo-tab' data-bs-toggle='tab' data-bs-target='#renovar-prestamo'
                            type="button" role="tab" aria-controls="renovar-prestamo" aria-selected='true'>
                            Renovar Prestamos
                        </button>
                        <button onClick={retornarPrestamoClick} className="nav-link"
                            id='retornar-prestamo-tab' data-bs-toggle='tab' data-bs-target='#retornar-prestamo'
                            type="button" role="tab" aria-controls="retornar-prestamo" aria-selected='true'>
                            Retornar Prestamos
                        </button>
                    </div>
                </nav>
                <div className="tab-content" id="nav-content">
                    <div className="tab-pane fade show active" id="nav-añadir-libro" role="tabpanel"
                        aria-labelledby="nav-añadir-libro-tab">
                        <AnadirLibro />
                    </div>
                    <div className="tab-pane fade show" id="nav-actualizar-libro" role="tabpanel"
                        aria-labelledby="nav-actualizar-libro-tab">
                        {cambiarCantidadDeLibroClick ?
                            <><ActualizarLibros /></>
                            :
                            <></>
                        }
                    </div>
                    <div className="tab-pane fade show" id="nav-enviar-mensaje" role="tabpanel"
                        aria-labelledby="nav-enviar-mensaje-tab">
                        {mensajesClick ?
                            <><MensajesAdmin /></>
                            :
                            <></>
                        }
                    </div>
                    <div className="tab-pane fade show" id="confirmar-prestamo" role="tabpanel"
                        aria-labelledby="confirmar-prestamo-tab">
                        {updateConfimarPrestamoClick ?
                            <><ConfirmarPrestamos /></>
                            :
                            <></>
                        }
                    </div>
                    <div className="tab-pane fade show" id="renovar-prestamo" role="tabpanel"
                        aria-labelledby="renovar-prestamo-tab">
                        {updateRenovarPrestamoClick ?
                            <><RenovarPrestamo /></>
                            :
                            <></>
                        }
                    </div>
                    <div className="tab-pane fade show" id="retornar-prestamo" role="tabpanel"
                        aria-labelledby="retornar-prestamo-tab">
                        {updateRetornarPrestamoClick ?
                            <><RetornoPrestamo /></>
                            :
                            <></>
                        }
                    </div>
                </div>
            </div>
        </div>
    );
}