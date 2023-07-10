import { useOktaAuth } from "@okta/okta-react";
import { useState } from "react";
import MensajesModelo from "../../../Modelos/MensajesModelo";

export const EnviarNuevoMensaje = () => {

    const { authState } = useOktaAuth();

    const [titulo, setTitulo] = useState('');

    const [pregunta, setPregunta] = useState('');

    const [mostrarAdvertencia, setMostrarAdvertencia] = useState(false);
    const [mostrarExito, setMostrarExito] = useState(false);

    async function enviarNuevaPregunta() {
        const apiUrl = `https://app-biblioteca-libros-vinia-13e40b77ef4a.herokuapp.com/api/mensajeses/confidencial/enviar/mensaje`;

        if (authState?.isAuthenticated && titulo !== '' && pregunta !== '') {

            const mensajeObj: MensajesModelo = new MensajesModelo(titulo, pregunta);

            const peticion = {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${authState?.accessToken?.accessToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(mensajeObj)
            };

            const enviarNuevaPreguntaResponse = await fetch(apiUrl, peticion);

            if (!enviarNuevaPreguntaResponse.ok) {
                throw new Error("Error en enviarNuevaPregunta");
            }

            setTitulo('');
            setPregunta('');
            setMostrarAdvertencia(false);
            setMostrarExito(true);
        } else {
            setMostrarAdvertencia(true);
            setMostrarExito(false);
        }
    }


    return (
        <div className="card mt-3">

            <div className="card-header">
                Escribenos tus dudas
            </div>

            <div className="card-body">
                <form action="" method="POST">
                    {mostrarAdvertencia &&
                        <div className="alert alert-danger" role="alert">
                            Todos los campos deben estar completados.
                        </div>
                    }
                    {mostrarExito &&
                        <div className="alert alert-success" role="alert">
                            Pregunta enviada exitosamente!
                        </div>
                    }
                    <div className="mb-3">
                        <label className="form-label">
                            Titulo
                        </label>
                        <input type="text" className="form-control" id="input-titulo-id"
                            placeholder="Titulo" onChange={e => setTitulo(e.target.value)} value={titulo} />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">
                            Pregunta
                        </label>
                        <textarea className="form-control" id="text-pregunta-id" rows={8}
                            onChange={e => setPregunta(e.target.value)} value={pregunta}>
                        </textarea>
                    </div>
                    <div>
                        <button
                            type="button"
                            className="btn btn-secondary mt-3"
                            onClick={enviarNuevaPregunta}>
                            Enviar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}