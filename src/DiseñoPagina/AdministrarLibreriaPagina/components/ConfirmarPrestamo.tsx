import { useOktaAuth } from "@okta/okta-react";
import { useEffect, useState } from "react";
import PrestamosActualesUsuario from "../../../Modelos/PrestamosActualesUsuario";
import { SpinnerLoading } from "../../Utilidad/SpinnerLoading";

export const ConfirmarPrestamos: React.FC<{}> = () => {

    const { authState } = useOktaAuth();
    const [httpError, setHttpError] = useState(null);

    const [prestamosPorConfimar, setPrestamosPorConfirmar] = useState<PrestamosActualesUsuario[]>([]);

    const [prestamosPorConfimarCargados, setPrestamosPorConfirmarCargados] = useState(true);
    //Renderiza la pagina una vez que se realizen las acciones de los opciones de prestamo
    const [renderPaginas, setRenderPaginas] = useState(false);

    //buscador de prestamos por usuario
    const [buscarUsuario, setBuscarUsuario] = useState('');

    const [searchUrl, setSearchUrl] = useState('');

    // Busca los prestamos con estado "Espera"
    useEffect(() => {
        const fetchBuscarPrestamosEnEspera = async () => {

            if (authState && authState.isAuthenticated) {

                const apiUrl = `https://app-biblioteca-libros-vinia-13e40b77ef4a.herokuapp.com/api/admin/confidencial`;

                let finalUrl: string = '';

                if (searchUrl == '') {
                    finalUrl = `${apiUrl}/listaprestamos/confirmar`;
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
                setPrestamosPorConfirmar(buscarPrestamosEnEsperaResponseJson);
            }

            setPrestamosPorConfirmarCargados(false);
        }
        fetchBuscarPrestamosEnEspera().catch((error: any) => {
            setPrestamosPorConfirmarCargados(true);
            setHttpError(error.message);
        })

        window.scrollTo(0, 0);
    }, [authState, renderPaginas, searchUrl]);

    async function confirmarPrestamo(idPrestamo: number) {
        if (authState && authState.isAuthenticated) {
            const apiUrl = `https://app-biblioteca-libros-vinia-13e40b77ef4a.herokuapp.com/api/admin/confidencial/confirmar/prestamo?prestamoId=${idPrestamo}`;
            const peticion = {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${authState.accessToken?.accessToken}`,
                    "Content-Type": "application/json",
                }
            };

            const confirmarPrestamoResponse = await fetch(apiUrl, peticion);

            if (!confirmarPrestamoResponse.ok) {
                throw new Error('ERROR EN FUNCION CONFIRMAR PRESTAMO');
            }
            setBuscarUsuario('');
            setRenderPaginas(!renderPaginas);
        }
    }

    async function cancelarPrestamo(idPrestamo: number) {
        if (authState && authState.isAuthenticated) {
            const apiUrl = `https://app-biblioteca-libros-vinia-13e40b77ef4a.herokuapp.com/api/admin/confidencial/cancelar/prestamo?prestamoId=${idPrestamo}`;
            const peticion = {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${authState.accessToken?.accessToken}`,
                    "Content-Type": "application/json",
                }
            };

            const cancelarPrestamoResponse = await fetch(apiUrl, peticion);

            if (!cancelarPrestamoResponse.ok) {
                throw new Error('ERROR EN FUNCION CONFIRMAR PRESTAMO');
            }

            setBuscarUsuario('');
            setRenderPaginas(!renderPaginas);

        }
    }

    const buscarPrestamoHandle = () => {

        if (buscarUsuario === '') {
            setSearchUrl('');
        } else {
            setSearchUrl(`/listaprestamos/buscar?estado=Espera&correoUsuario=${buscarUsuario}`);
        }
    }

    //spinner
    if (prestamosPorConfimarCargados) {
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
                {prestamosPorConfimar.length > 0 ?
                    <>
                        {prestamosPorConfimar.map(prestamo => (
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
                                            </div>
                                            <div className="mt-3">
                                                <h4>Opciones:</h4>
                                                <button className="btn btn-md btn-success m-1" onClick={() => confirmarPrestamo(prestamo.idPrestamo)}>Confirmar Prestamo</button>
                                                <button className="btn btn-md btn-danger m-1" onClick={() => cancelarPrestamo(prestamo.idPrestamo)}>Cancelar Prestamo</button>
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
                {prestamosPorConfimar.length > 0 ?
                    <>
                        {prestamosPorConfimar.map(prestamo => (
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
                                                <button className="btn btn-md btn-success m-1" onClick={() => confirmarPrestamo(prestamo.idPrestamo)}>Confirmar Prestamo</button>
                                                <button className="btn btn-md btn-danger m-1" onClick={() => cancelarPrestamo(prestamo.idPrestamo)}>Cancelar Prestamo</button>
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
        </div>


    );

}
