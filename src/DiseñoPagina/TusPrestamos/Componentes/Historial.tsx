import { useOktaAuth } from "@okta/okta-react";
import { useEffect, useState } from 'react';
import HistorialModel from "../../../Modelos/HistorialModel";
import { SpinnerLoading } from "../../Utilidad/SpinnerLoading";
import { Link } from "react-router-dom";
import { Paginador } from "../../Utilidad/Paginador";

export const Historial = () => {

    const { authState } = useOktaAuth();

    const [httpError, setHttpError] = useState(null);

    const [historial, setHistorial] = useState<HistorialModel[]>([]);
    const [historialCargado, setHistorialCargado] = useState(true);

    //Paginador
    const [paginaActual, setPaginaActual] = useState(1);
    const [totalPaginas, setTotalPaginas] = useState(0);

    useEffect(() => {
        const fetchHistorial = async () => {
            if (authState && authState.isAuthenticated) {
                const urlApi = `https://app-biblioteca-libros-vinia-13e40b77ef4a.herokuapp.com/api/historials/search/findLibrosByUsuarioEmail/?usuarioEmail=${authState.accessToken?.claims.sub}&page=${paginaActual - 1}&size=5`

                const peticion = {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                };

                const historialResponse = await fetch(urlApi, peticion);

                if (!historialResponse.ok) {
                    throw new Error('Error en el historialResponse ');
                }

                const historialResponseJson = await historialResponse.json();

                setHistorial(historialResponseJson._embedded.historials);
                setTotalPaginas(historialResponseJson.page.totalPages);


            }

            setHistorialCargado(false);
        }

        fetchHistorial().catch((error: any) => {
            setHistorialCargado(false);
            setHttpError(error.message);
        })
    }, [authState, paginaActual]);

    if (historialCargado) {
        return (
            <SpinnerLoading />
        )
    }

    if (httpError) {
        return (
            <div className="container m-5">
                {httpError}
            </div>
        );
    }

    const paginador = (numPag: number) => setPaginaActual(numPag);

    return (
        <div>
            {historial.length > 0 ?
                <>
                    <h5>Historial de prestamos:</h5>
                    {historial.map(historiaPrestamo => (
                        <div key={historiaPrestamo.id}>
                            <div className="card mt-3 shadow p-3 mb-3 bg-body rounded">
                                <div className="row g-0">
                                    <div className="col-md-2">

                                        {/* Escritorio */}
                                        <div className="d-none d-lg-block">
                                            {historiaPrestamo.img ?
                                                <img src={historiaPrestamo.img} width='123' height='196' alt="libro" />
                                                :
                                                <img src={require("./../../../ImagenesWeb/Libros/rubius.jpg")} width='123' height='196' alt="libro" />
                                            }
                                        </div>

                                        {/* Mobile */}
                                        <div className="d-lg-none d-flex justify-content-center align-items-center">
                                            {historiaPrestamo.img ?
                                                <img src={historiaPrestamo.img} width='123' height='196' alt="libro" />
                                                :
                                                <img src={require("./../../../ImagenesWeb/Libros/rubius.jpg")} width='123' height='196' alt="libro" />
                                            }
                                        </div>
                                    </div>

                                    <div className="col">
                                        <div className="card-body">
                                            <h5 className="card-title">{historiaPrestamo.autor}</h5>
                                            <h4>{historiaPrestamo.titulo}</h4>
                                            <hr />
                                            <p className="card-text">{historiaPrestamo.descripcion}</p>
                                            <hr />
                                            <p className="card-text">Fecha de alquiler: {historiaPrestamo.fechaPrestamo}</p>
                                            <p className="card-text">Fecha de retorno: {historiaPrestamo.fechaRetorno}</p>

                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </>
                :
                <>
                    <h3 className="mt-3">No has alquilado ninguna libro por lo tanto no hay registro de historial</h3>
                    <Link className="btn btn-primary" to={'/buscar'}>Alquila libros</Link>
                </>
            }

            {totalPaginas > 1 && <Paginador paginaActual={paginaActual} totalPaginas={totalPaginas} paginador={paginador} />}
        </div>
    );
}