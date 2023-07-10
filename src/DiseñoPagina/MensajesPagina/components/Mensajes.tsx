import { useOktaAuth } from '@okta/okta-react';
import { useEffect, useState } from 'react';
import MensajesModelo from '../../../Modelos/MensajesModelo';
import { SpinnerLoading } from '../../Utilidad/SpinnerLoading';
import { Paginador } from '../../Utilidad/Paginador';

export const Mensajes = () => {

    const { authState } = useOktaAuth();

    const [httpError, setHttpError] = useState(null);

    const [mensajes, setMensajes] = useState<MensajesModelo[]>([]);
    const [mensajesCargados, setMensajesCargados] = useState(true);

    //Paginador
    const [mensajesPorPagina, setMensajesPorPagina] = useState(0);
    const [paginaActual, setPaginaActual] = useState(1);
    const [totalPaginas, setTotalPaginas] = useState(0);

    // FETCH PARA BUSCAR TODOS LOS MENSAJES
    useEffect(() => {
        const fetchMensajes = async () => {
            if (authState && authState?.isAuthenticated) {
                const apiUrl = `http://localhost:8080/api/mensajeses/search/findMensajesByUsuarioEmail/?usuarioEmail=${authState?.accessToken?.claims.sub}&page=${paginaActual - 1}&size=${mensajesPorPagina}`;
                const peticion = {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${authState?.accessToken?.accessToken}`,
                        'Content-type': 'application/json'
                    }
                };
                
                const fetchMensajesResponse = await fetch(apiUrl, peticion);

                if (!fetchMensajesResponse.ok) {
                    throw new Error('Problemas en fetchMensajes');
                }

                const fetchMensajesResponseJson = await fetchMensajesResponse.json();
                setMensajes(fetchMensajesResponseJson._embedded.mensajeses);
                setTotalPaginas(fetchMensajesResponseJson.page.totalPages);
            }

            setMensajesCargados(false);
        }
        fetchMensajes().catch((error: any) => {
            setMensajesCargados(false);
            setHttpError(error.value);
        })


    }, [authState, paginaActual])

    if (mensajesCargados) {
        return (
            <SpinnerLoading />
        );
    }

    if (httpError) {
        return (
            <div className='container m-5'>
                <p>{httpError}</p>
            </div>
        );
    }

    const paginador = (numPag: number) => setPaginaActual(numPag);

    return (

        <div className='mt-2'>
            {mensajes.length > 0 ?
                <>
                    <h5>Preguntas:</h5>
                    {mensajes.map(mensaje => (
                        <div className="card mt-2 shadow p-3 bg-body rounded">
                            <h5>Pregunta #{mensaje.id}</h5>
                            <h6>{mensaje.usuarioEmail}</h6>
                            <p>{mensaje.pregunta}</p>
                            <hr />
                            <div>
                                <h5>Respuesta:</h5>
                                {mensaje.respuesta && mensaje.adminEmail ?
                                    <>
                                        <h6>{mensaje.adminEmail}</h6>
                                        <p>{mensaje.respuesta}</p>
                                    </>
                                    :
                                    <p><i>Esta pendiente la respuesta del administrador, porfavor ser paciente.</i></p>
                                }
                            </div>
                        </div>
                    ))}
                </>
                :
                <h5>Todas las preguntas se mostraran aquí.</h5>
            }
            {totalPaginas > 1 && <Paginador paginaActual={paginaActual} totalPaginas={totalPaginas} paginador={paginador}  />}
        </div>
    );
}