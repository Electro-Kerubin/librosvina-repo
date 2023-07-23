import { useOktaAuth } from "@okta/okta-react";
import { useState, useEffect } from "react";
import MensajesModelo from "../../../Modelos/MensajesModelo";
import { SpinnerLoading } from "../../Utilidad/SpinnerLoading";
import MensajesAdminRequestModelo from "../../../Modelos/MensajesAdminRequestModelo";
import { ResponderMensajesForm } from "./ResponderMensajesForm";
import { Paginador } from "../../Utilidad/Paginador";

export const MensajesAdmin = () => {

    const { authState } = useOktaAuth();

    const [mensajes, setMensajes] = useState<MensajesModelo[]>([]);
    const [mensajesPorPagina, setMensajesPorPagina] = useState(5);
    const [mensajesCargados, setMensajesCargados] = useState(true);

    const [httpError, setHttpError] = useState(null);

    const [paginaActual, setPaginaActual] = useState(1);
    const [totalPaginas, setTotalPaginas] = useState(0);

    const [formWarning, setFormWarning] = useState(false);
    const [formResponse, setFormResponse] = useState('');

    const [respuestaEnviada, setRespuestaEnviada] = useState(false);



    //
    useEffect(() => {
        const fetchRetornaMensajes = async () => {
            if (authState && authState.isAuthenticated) {
                const apiUrl = `http://localhost:8080/api/mensajeses/search/findByCerrado/?cerrado=false&page=${paginaActual - 1}$size=${mensajesPorPagina}`;
                const peticion = {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${authState.accessToken?.accessToken}`,
                        'Content-Type': 'application/json'
                    }
                };

                const fetchRetornaMensajesResponse = await fetch(apiUrl, peticion);
                if (!fetchRetornaMensajesResponse.ok) {
                    throw new Error('Problemas en fetchRetornaMensajesResponse');
                }

                const fetchRetornaMensajesResponseJson = await fetchRetornaMensajesResponse.json();

                setMensajes(fetchRetornaMensajesResponseJson._embedded.mensajeses);
                setTotalPaginas(fetchRetornaMensajesResponseJson.page.totalPages);
            }

            setMensajesCargados(false);
        }
        fetchRetornaMensajes().catch((error: any) => {
            setMensajesCargados(false);
            setHttpError(error.message);
        })

        window.scrollTo(0, 0);

    }, [authState, paginaActual, respuestaEnviada])

    if (mensajesCargados) {
        return (
            <SpinnerLoading />
        );
    }

    if (httpError) {
        return (
            <div className="container">
                <p>{httpError}</p>
            </div>
        );
    }

    async function enviarRespuesta(id: number, respuesta: string) {
        const apiUrl = `http://localhost:8080/api/mensajeses/confidencial/admin/mensaje`;
        if (authState && authState?.isAuthenticated && id !== null && respuesta !== '') {

            const mensajesAdminRequestModel: MensajesAdminRequestModelo = new MensajesAdminRequestModelo(id, respuesta);
            const peticion = {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${authState?.accessToken?.accessToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(mensajesAdminRequestModel)
            };

            const mensajesAdminRequestModelResponse = await fetch(apiUrl, peticion);
            if (!mensajesAdminRequestModelResponse.ok) {
                throw new Error('Error en mensajesAdminRequestModelResponse');
            }
            setRespuestaEnviada(!respuestaEnviada);
        }
    }

    const paginador = (numPag: number) => setPaginaActual(numPag);

    return (
        <div className="mt-3">
            {mensajes.length > 0 ?
                <>
                    <h5>Preguntas:</h5>
                    {mensajes.map(mensaje => (
                        <ResponderMensajesForm mensaje={mensaje} key={mensaje.id} enviarRespuesta={enviarRespuesta} />
                    ))}
                </>
                :
                <h5>No hay preguntas pendientes.</h5>
            }
            {totalPaginas > 1 && <Paginador paginaActual={paginaActual} totalPaginas={totalPaginas} paginador={paginador} />}
        </div>
    );
}