import MensajesModelo from "../../../Modelos/MensajesModelo";
import { useState } from "react";

export const ResponderMensajesForm: React.FC<{
    mensaje: MensajesModelo,
    enviarRespuesta: any
}> = (props, key) => {

    const [formWarning, setFormWarning] = useState(false);
    const [respuesta, setRespuesta] = useState('');

    function enviarRespuestaButton() {
        if (props.mensaje.id !== null && respuesta !== '') {
            props.enviarRespuesta(props.mensaje.id, respuesta);
            setFormWarning(false);
        } else {
            setFormWarning(true);
        }
    }

    return (
        <div key={props.mensaje.id}>
            <div className="card mt-2 shadow p-3 bg-body rounded">
                <h5>Pregunta #{props.mensaje.id}: {props.mensaje.titulo}</h5>
                <h6>{props.mensaje.usuarioEmail}</h6>
                <p>{props.mensaje.pregunta}</p>
                <hr />
                <div>
                    <h5>Respuesta: </h5>
                    <form action="PUT">
                        {formWarning &&
                            <div className="alert alert-danger" role="alert">
                                Todos los campos deben estar completos
                            </div>
                        }
                        <div className="col-md-12 mb-3">
                            <label className="form-label">Descripción</label>
                            <textarea className="form-control" id="respuesta-textarea-id" rows={3}
                                onChange={e => setRespuesta(e.target.value)} value={respuesta} />
                        </div>
                        <div>
                            <button type="button" className="btn btn-primary mt-3"
                                data-toggle="modal" data-target="#targetModal"
                                onClick={enviarRespuestaButton}>
                                Enviar Respuesta
                            </button>

                            <div className="modal fade" id="targetModal" tabIndex={-1} role="dialog"
                                aria-labelledby="targetModalLabel" aria-hidden="true">
                                <div className="modal-dialog" role="document">
                                    <div className="modal-content">
                                        <div className="modal-header">
                                            <div className="modal-title" id="targetModalLabel">¡Respuesta enviada con Exito!</div>
                                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                                <span aria-hidden="true">&times;</span>
                                            </button>
                                        </div>
                                        <div className="modal-body">
                                            <h4>¡Respuesta enviada con Exito!</h4>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}