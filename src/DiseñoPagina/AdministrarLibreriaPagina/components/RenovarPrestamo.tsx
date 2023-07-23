import { useOktaAuth } from "@okta/okta-react";
import { useEffect, useState } from "react";
import PrestamosActualesUsuario from "../../../Modelos/PrestamosActualesUsuario";
import { SpinnerLoading } from "../../Utilidad/SpinnerLoading";

export const RenovarPrestamo: React.FC<{}> = () => {

    const { authState } = useOktaAuth();
    const [httpError, setHttpError] = useState(null);

    const [prestamosPorRenovar, setPrestamosPorRenovar] = useState<PrestamosActualesUsuario[]>([]);
    const [prestamosPorRenovarCargados, setPrestamosPorRenovarCargados] = useState(true);

    const [renderPaginas, setRenderPaginas] = useState(false);

    const [buscarUsuario, setBuscarUsuario] = useState('');
    const [searchUrl, setSearchUrl] = useState('');

    useEffect(() => {
        const fetchBuscarPrestamosPorRenovar = async () => {

            if (authState && authState.isAuthenticated) {

                const apiUrl = `http://localhost:8080/api/admin/confidencial`;

                let finalUrl: string = '';

                if (searchUrl == '') {
                    finalUrl = `${apiUrl}/prestamo/renovacion/listar`;
                } else {
                    finalUrl = `${apiUrl}${searchUrl}`;
                }

                const peticion = {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${authState.accessToken?.accessToken}`,
                        "Content-Type": "application/json",
                    }
                };

                const buscarPrestamosEnEsperaResponse = await fetch(finalUrl, peticion);

                if (!buscarPrestamosEnEsperaResponse.ok) {
                    throw new Error('Error en fetch fetchBuscarPrestamosEnEspera');
                }

                const buscarPrestamosEnEsperaResponseJson = await buscarPrestamosEnEsperaResponse.json();
                setPrestamosPorRenovar(buscarPrestamosEnEsperaResponseJson);
            }

            setPrestamosPorRenovarCargados(false);
        }
        fetchBuscarPrestamosPorRenovar().catch((error: any) => {
            setPrestamosPorRenovarCargados(true);
            setHttpError(error.message);
        })

        window.scrollTo(0, 0);
    }, [authState, renderPaginas, searchUrl]);

    async function confirmarRenovacion(libroId: number, usuarioCorreo: string) {
        if (authState && authState.isAuthenticated) {
            const apiUrl = `http://localhost:8080/api/admin/confidencial/prestamo/renovacion/confirmar?libroId=${libroId}&usuarioCorreo=${usuarioCorreo}`;
            const peticion = {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${authState.accessToken?.accessToken}`,
                    "Content-Type": "application/json",
                }
            };

            const confirmarRenovacionResponse = await fetch(apiUrl, peticion);

            if (!confirmarRenovacionResponse.ok) {
                throw new Error('ERROR EN FUNCION confirmarRenovacion');
            }
            setBuscarUsuario('');
            setRenderPaginas(!renderPaginas);
        }
    }

    async function cancelarRenovacion(libroId: number, usuarioCorreo: string) {
        if (authState && authState.isAuthenticated) {
            const apiUrl = `http://localhost:8080/api/admin/confidencial/prestamo/renovacion/cancelar?libroId=${libroId}&usuarioCorreo=${usuarioCorreo}`;
            const peticion = {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${authState.accessToken?.accessToken}`,
                    "Content-Type": "application/json",
                }
            };

            const cancelarRenovacionResponse = await fetch(apiUrl, peticion);

            if (!cancelarRenovacionResponse.ok) {
                throw new Error('ERROR EN FUNCION cancelarPrestamo');
            }

            setBuscarUsuario('');
            setRenderPaginas(!renderPaginas);

        }
    }

    const buscarPrestamoHandle = () => {

        if (buscarUsuario === '') {
            setSearchUrl('');
        } else {
            setSearchUrl(`/listaprestamos/buscar?estado=${"Espera Renovacion"}&correoUsuario=${buscarUsuario}`);
        }
    }

    //spinner
    if (prestamosPorRenovarCargados) {
        return (
            <SpinnerLoading />
        );
    }

    return (
        <div className="mt-3">


            <div className="col-6">
                <div className="d-flex">
                    <input className="form-control m-2" type="search"
                        placeholder="Buscar usuario" aria-labelledby="Search"
                        style={{ height: '40px' }}
                        onChange={val => setBuscarUsuario(val.target.value)}
                    />
                    <button className="btn btn-outline-success mt-2"
                        style={{ height: '40px' }}
                        onClick={() => buscarPrestamoHandle()}>
                        Buscar
                    </button>
                </div>
            </div>

            {/* Escritorio */}
            <div className="d-none d-lg-block mt-2">
                {prestamosPorRenovar.length > 0 ?
                    <>
                        {prestamosPorRenovar.map(prestamo => (
                            <div key={prestamo.libro.id}>
                                <div className="row mt-3 mb-3">
                                    <div className="container col-4 col-md-4">
                                        {prestamo.libro?.img ?
                                            <img src={prestamo.libro?.img} width='180' height='290' />
                                            :
                                            <img src={require('./../../../ImagenesWeb/Libros/rubius.jpg')} width='226' height='349' />
                                        }
                                    </div>
                                    <div className="container card col-3 col-md-4 d-flex">
                                        <div className="card-body">
                                            <div className="mt-3">
                                                <h4>Información</h4>
                                                <h6>Usuario: {prestamo.correoUsuario}</h6>
                                                <h6>Titulo: {prestamo.libro.titulo}</h6>
                                                <p>Autor: {prestamo.libro.autor}</p>
                                                {prestamo.diasAlquilerRestantes > 0 &&
                                                    <p>
                                                        El alquiler del libro expira en {prestamo.diasAlquilerRestantes} dias.
                                                    </p>
                                                }

                                                {prestamo.diasAlquilerRestantes === 0 &&
                                                    <p>
                                                        El alquiler del libro expira hoy!
                                                    </p>
                                                }

                                                {prestamo.diasAlquilerRestantes < 0 &&
                                                    <p>
                                                        Tienes un retraso de {prestamo.diasAlquilerRestantes} dias.
                                                    </p>
                                                }
                                            </div>
                                            <div className="mt-3">
                                                <h4>Opciones:</h4>
                                                <button className="btn btn-md btn-success m-1" onClick={() => confirmarRenovacion(prestamo.libro.id, prestamo.correoUsuario)}>Renovar</button>
                                                <button className="btn btn-md btn-danger m-1" onClick={() => cancelarRenovacion(prestamo.libro.id, prestamo.correoUsuario)}>Cancelar Renovación</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </>
                    :
                    <div></div>}
            </div>

            {/* Mobile */}
            <div className="container d-lg-none mt-2">
                {prestamosPorRenovar.length > 0 ?
                    <>
                        {prestamosPorRenovar.map(prestamo => (
                            <div key={prestamo.libro.id}>
                                <div className="row mt-3 mb-3">
                                    <div className="d-flex justify-content-center align-items-center">
                                        {prestamo.libro?.img ?
                                            <img src={prestamo.libro?.img} width='180' height='290' />
                                            :
                                            <img src={require('./../../../ImagenesWeb/Libros/rubius.jpg')} width='226' height='349' />
                                        }
                                    </div>
                                    <div className="card d-flex mt-5 mb-3">
                                        <div className="card-body">
                                            <div className="mt-3">
                                                <h4>Información</h4>
                                                <h6>Usuario: {prestamo.correoUsuario}</h6>
                                                <h6>Titulo: {prestamo.libro.titulo}</h6>
                                                <p>Autor: {prestamo.libro.autor}</p>
                                            </div>
                                            <div className="mt-3">
                                                <h4>Opciones:</h4>
                                                <button className="btn btn-md btn-success m-1" onClick={() => confirmarRenovacion(prestamo.libro.id, prestamo.correoUsuario)}>Renovar</button>
                                                <button className="btn btn-md btn-danger m-1" onClick={() => cancelarRenovacion(prestamo.libro.id, prestamo.correoUsuario)}>Cancelar Renovación</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </>
                    :
                    <div>
                        <h3>No hay ningun prestamo en situación de renovación.</h3>
                    </div>}
            </div>
        </div>
    );

}