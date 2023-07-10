import { useOktaAuth } from "@okta/okta-react";
import { useEffect, useState } from "react";
import PrestamosActualesUsuario from "../../../Modelos/PrestamosActualesUsuario";
import { SpinnerLoading } from "../../Utilidad/SpinnerLoading";
import { Link } from "react-router-dom";

export const Prestamos = () => {

    const { authState } = useOktaAuth();
    const [httpError, setHttpError] = useState(null);

    // Prestamos presentes del usuario
    const [prestamosActualesUsuario, setPrestamosActualesUsuario] = useState<PrestamosActualesUsuario[]>([]);
    const [prestamosActualesUsuarioCargados, setPrestamosActualesUsuarioCargados] = useState(true);

    //Renderiza la pagina una vez que se realizen las acciones de los opciones de prestamo
    const [renderPaginas, setRenderPaginas] = useState(false);

    // Busca los prestamos presentes o actuales que tiene el usuario
    useEffect(() => {
        const fetchPrestamosActualesUsuario = async () => {

            if (authState && authState.isAuthenticated) {
                const apiUrl = `https://app-biblioteca-libros-vinia-13e40b77ef4a.herokuapp.com/api/libroes/confidencial/listaprestamos`;
                const peticion = {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${authState.accessToken?.accessToken}`,
                        "Content-Type": "application/json",
                    }
                };

                const prestamosActualesUsuarioResponse = await fetch(apiUrl, peticion);

                if (!prestamosActualesUsuarioResponse.ok) {
                    throw new Error('Error en fetchPrestamosActualesUsuario realizando la peticion a la API');
                }

                const prestamosActualesUsuarioResponseJson = await prestamosActualesUsuarioResponse.json();
                setPrestamosActualesUsuario(prestamosActualesUsuarioResponseJson);
            }

            setPrestamosActualesUsuarioCargados(false);

        }
        fetchPrestamosActualesUsuario().catch((error: any) => {
            setPrestamosActualesUsuarioCargados(false);
            setHttpError(error.message);
        })

        window.scrollTo(0, 0);
    }, [authState, renderPaginas]);

    // Spinner
    if (prestamosActualesUsuarioCargados) {
        return (
            <SpinnerLoading />
        );
    }

    if (httpError) {
        return (
            <div className="container m-5">
                <p>
                    {httpError}
                </p>
            </div>
        );
    }

    async function retornarLibro(libroId: number) {
        const urlApi = `https://app-biblioteca-libros-vinia-13e40b77ef4a.herokuapp.com/api/libroes/confidencial/retorna/libro/?libroId=${libroId}`;
        const peticion = {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${authState?.accessToken?.accessToken}`,
                "Content-Type": "application/json",
            }
        };

        const retornarLibroResponse = await fetch(urlApi, peticion);

        if (!retornarLibroResponse.ok) {
            throw new Error("Error en el request retornarLibro");
        }

        // trigger para volver a ejecutar el fetch
        setRenderPaginas(!renderPaginas);
    }

    async function renovarPrestamo(libroId: number) {
        const urlApi = `https://app-biblioteca-libros-vinia-13e40b77ef4a.herokuapp.com/api/libroes/confidencial/renovar/prestamo/?libroId=${libroId}`;
        const peticion = {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${authState?.accessToken?.accessToken}`,
                "Content-Type": "application/json",
            }
        };

        const renovarResponse = await fetch(urlApi, peticion);

        if (!renovarResponse.ok) {
            throw new Error('Error en el request de la funcion renovarPrestamo')
        }

        // trigger para volver a ejecutar el fetch
        setRenderPaginas(!renderPaginas);

    }

    return (
        <div>
            {/* Escritorio d-none d-lg-block mt-2 */}
            <div className="d-none d-lg-block mt-2">
                {prestamosActualesUsuario.length > 0 ?
                    <>
                        <h5>Tus prestamos</h5>

                        {prestamosActualesUsuario.map(prestamo => (
                            <div key={prestamo.libro.id}>
                                <div className="row mt-3 mb-3">
                                    <div className="container col-4 col-md-4">
                                        {prestamo.libro?.img ?
                                            <img src={prestamo.libro?.img} width='226' height='349' />
                                            :
                                            <img src={require('./../../../ImagenesWeb/Libros/rubius.jpg')} />
                                        }
                                    </div>
                                    <div className="container card col-3 col-md-3 d-flex">
                                        <div className="card-body">
                                            <div className="mt-3">
                                                <h4>Opciones</h4>
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

                                                <div className="list-group mt-3">
                                                    <button className="list-group-item list-group-item-action" aria-current='true'
                                                        data-bs-toggle='modal' data-bs-target={`#modal${prestamo.libro.id}`}>
                                                        Ver opciones
                                                    </button>
                                                    <Link to={'buscar'} className="list-group-item list-group-item-action">
                                                        Ver mas libros
                                                    </Link>
                                                </div>
                                            </div>
                                            <hr />
                                            <p className="mt-3"></p>
                                            <Link className="btn btn-primary" to={`/info/${prestamo.libro.id}`}>
                                                Ir al libro
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                                <hr />
                                {/* Modal */}

                                <div className='modal fade' id={`modal${prestamo.libro.id}`} data-bs-backdrop='static' data-bs-keyboard='false'
                                    aria-labelledby='staticBackdropLabel' aria-hidden='true' key={prestamo.libro.id}>
                                    <div className="modal-dialog">
                                        {/* Content */}
                                        <div className="modal-content">
                                            <div className="modal-header">
                                                <h5 className="modal-title" id='staticBackdropLabel'>Tus Prestamos</h5>
                                                <button type="button" className="btn" data-bs-dismiss='modal' aria-label='Close'>
                                                    <span aria-hidden="true">X</span>
                                                </button>
                                            </div>


                                            {/* Body */}

                                            <div className='modal-body'>
                                                <div className='container'>
                                                    <div className='mt-3'>
                                                        <div className='row'>

                                                            <div className="col-2">
                                                                {prestamo.libro?.img ?
                                                                    <img src={prestamo.libro.img} width='56' height='87' alt='libro' />
                                                                    :
                                                                    <img src={require('./../../../ImagenesWeb/Libros/rubius.jpg')} width='56' height='87' alt='libro' />
                                                                }
                                                            </div>
                                                            <div className="col-10">
                                                                <h6>{prestamo.libro.titulo}</h6>
                                                                <h4>{prestamo.libro.descripcion}</h4>
                                                            </div>

                                                        </div>
                                                        <hr />

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

                                                        <div className='list-group mt-3'>

                                                            <button onClick={() => retornarLibro(prestamo.libro.id)}
                                                                className='list-group-item list-group-item-action btn'
                                                                data-bs-dismiss='modal'>
                                                                {prestamo.diasAlquilerRestantes < 0 ? 'Retornar Libro' : 'Retornar Libro'}
                                                            </button>

                                                            <button onClick={() => renovarPrestamo(prestamo.libro.id)}
                                                                className={prestamo.diasAlquilerRestantes < 0 ? 'list-group-item list-group-item-action desactivar-button' : 'list-group-item list-group-item-action btn'}
                                                                data-bs-dismiss='modal'>
                                                                {prestamo.diasAlquilerRestantes < 0 ? 'No puedes renovar el prestamo' : 'Renovar prestamo'}
                                                            </button>

                                                        </div>
                                                    </div>
                                                </div>
                                            </div>



                                            {/* Footer */}
                                            <div className="modal-footer">
                                                <button type="button" className="btn btn-secondary" data-bs-dismiss='modal'>Cerrar</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </>
                    :
                    <>
                        <h3 className="mt-3">
                            Actualemte no posees ningun prestamo de algun libro.
                        </h3>
                        <Link className="btn btn-primary" to={`buscar`}>
                            Buscar libros
                        </Link>
                    </>
                }

            </div>

            {/* Movile */}
            <div className="container d-lg-none mt-2">
                {prestamosActualesUsuario.length > 0 ?
                    <>
                        <h5 className="mb-3">Tus prestamos</h5>

                        {prestamosActualesUsuario.map(prestamo => (
                            <div key={prestamo.libro.id}>

                                <div className="d-flex justify-content-center align-items-center">
                                    {prestamo.libro?.img ?
                                        <img src={prestamo.libro?.img} width='226' height='349' />
                                        :
                                        <img src={require('./../../../ImagenesWeb/Libros/rubius.jpg')} />
                                    }
                                </div>
                                <div className="card d-flex mt-5 mb-3">
                                    <div className="card-body">
                                        <div className="mt-3">
                                            <h4>Opciones</h4>

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

                                            <div className="list-group mt-3">
                                                <button className="list-group-item list-group-item-action" aria-current='true'
                                                    data-bs-toggle='modal' data-bs-target={`#mobilemodal${prestamo.libro.id}`}>
                                                    Opciones
                                                </button>
                                                <Link to={'buscar'} className="list-group-item list-group-item-action">
                                                    Ver mas libros
                                                </Link>
                                            </div>
                                        </div>
                                        <hr />
                                        <p className="mt-3"></p>
                                        <Link className="btn btn-primary" to={`/info/${prestamo.libro.id}`}>
                                            Ir al libro
                                        </Link>
                                    </div>
                                </div>
                                <hr />
                                {/* Modal */}

                                <div className='modal fade' id={`mobilemodal${prestamo.libro.id}`} data-bs-backdrop='static' data-bs-keyboard='false'
                                    aria-labelledby='staticBackdropLabel' aria-hidden='true' key={prestamo.libro.id}>
                                    <div className="modal-dialog">
                                        {/* Content */}
                                        <div className="modal-content">
                                            <div className="modal-header">
                                                <h5 className="modal-title" id='staticBackdropLabel'>Tus Prestamos</h5>
                                                <button type="button" className="btn" data-bs-dismiss='modal' aria-label='Close'>
                                                    <span aria-hidden="true">X</span>
                                                </button>
                                            </div>


                                            {/* Body */}

                                            <div className='modal-body'>
                                                <div className='container'>
                                                    <div className='mt-3'>
                                                        <div className='row'>

                                                            <div className="col-2">
                                                                {prestamo.libro?.img ?
                                                                    <img src={prestamo.libro.img} width='56' height='87' alt='libro' />
                                                                    :
                                                                    <img src={require('./../../../ImagenesWeb/Libros/rubius.jpg')} width='56' height='87' alt='libro' />
                                                                }
                                                            </div>
                                                            <div className="col-10">
                                                                <h6>{prestamo.libro.titulo}</h6>
                                                                <h4>{prestamo.libro.descripcion}</h4>
                                                            </div>

                                                        </div>
                                                        <hr />

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

                                                        <div className='list-group mt-3'>

                                                            <button onClick={() => retornarLibro(prestamo.libro.id)}
                                                                className='list-group-item list-group-item-action btn'
                                                                data-bs-dismiss='modal'>
                                                                {prestamo.diasAlquilerRestantes < 0 ? 'Retornar Libro' : 'Retornar Libro'}
                                                            </button>

                                                            <button onClick={() => renovarPrestamo(prestamo.libro.id)}
                                                                className={prestamo.diasAlquilerRestantes < 0 ? 'list-group-item list-group-item-action desactivar-button' : 'list-group-item list-group-item-action btn'}
                                                                data-bs-dismiss='modal'>
                                                                {prestamo.diasAlquilerRestantes < 0 ? 'No puedes renovar el prestamo' : 'Renovar prestamo'}
                                                            </button>

                                                        </div>
                                                    </div>
                                                </div>
                                            </div>



                                            {/* Footer */}
                                            <div className="modal-footer">
                                                <button type="button" className="btn btn-secondary" data-bs-dismiss='modal'>Cerrar</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        ))}
                    </>
                    :
                    <>
                        <h3 className="mt-3">
                            Actualemte no posees ningun prestamo de algun libro.
                        </h3>
                        <Link className="btn btn-primary" to={`buscar`}>
                            Buscar libros
                        </Link>
                    </>
                }

            </div>

        </div>
    );
}