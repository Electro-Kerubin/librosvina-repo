import { useOktaAuth } from "@okta/okta-react";
import { useEffect, useState } from "react";
import PrestamosActualesUsuario from "../../../Modelos/PrestamosActualesUsuario";
import { SpinnerLoading } from "../../Utilidad/SpinnerLoading";

export const RetornoPrestamo: React.FC<{}> = () => {

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

                const apiUrl = `https://app-biblioteca-libros-vinia-13e40b77ef4a.herokuapp.com/api/admin/confidencial`;

                let finalUrl: string = '';

                if (searchUrl == '') {
                    finalUrl = `${apiUrl}/prestamo/retornar/listar`;
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
            const apiUrl = `https://app-biblioteca-libros-vinia-13e40b77ef4a.herokuapp.com/api/admin/confidencial/prestamo/renovacion/confirmar?libroId=${libroId}&usuarioCorreo=${usuarioCorreo}`;
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
            const apiUrl = `https://app-biblioteca-libros-vinia-13e40b77ef4a.herokuapp.com/api/admin/confidencial/prestamo/renovacion/cancelar?libroId=${libroId}&usuarioCorreo=${usuarioCorreo}`;
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
            setSearchUrl(`/listaprestamos/buscar?estado=${"Espera Retorno"}&correoUsuario=${buscarUsuario}`);
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
                                            <img src={prestamo.libro?.img} width='190' height='320' />
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
                                                <p>Fecha Inicio: {prestamo.fechaPrestamo}</p>
                                                <p>Fecha Retorno: {prestamo.fechaRetorno}</p>


                                            </div>
                                            <div className="mt-3">
                                                <h4>Opciones:</h4>
                                                {/* Button */}
                                                <button className="btn btn-md btn-success m-1" aria-current='true'
                                                    data-bs-toggle='modal' data-bs-target={`#modal${prestamo.libro.id}`}>
                                                    Retornar
                                                </button>
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

                                                                        <div className='list-group mt-3'>

                                                                            <button onClick={() => confirmarRenovacion(prestamo.libro.id, prestamo.correoUsuario)}
                                                                                className='btn btn-md btn-success m-1'
                                                                                data-bs-dismiss='modal'>
                                                                                Confirmar
                                                                            </button>

                                                                            <button
                                                                                className='btn btn-md btn-danger m-1'
                                                                                data-bs-dismiss='modal'>
                                                                                Cancelar
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
                                                <p>Fecha Inicio: {prestamo.fechaPrestamo}</p>
                                                <p>Fecha Retorno: {prestamo.fechaRetorno}</p>
                                            </div>
                                            <div className="mt-3">
                                                <h4>Opciones:</h4>
                                                {/* Button */}
                                                <button className="btn btn-md btn-success m-1" aria-current='true'
                                                    data-bs-toggle='modal' data-bs-target={`#mobilemodal${prestamo.libro.id}`}>
                                                    Retornar
                                                </button>
                                                {/* Modal */}
                                                <div className='modal fade' id={`mobilemodal${prestamo.libro.id}`} data-bs-backdrop='static' data-bs-keyboard='false'
                                                    aria-labelledby='staticBackdropLabel' aria-hidden='true' key={prestamo.libro.id}>
                                                    <div className="modal-dialog">
                                                        {/* Content */}
                                                        <div className="modal-content">
                                                            <div className="modal-header">
                                                                <h5 className="modal-title" id='staticBackdropLabel'>Confirmación de retorno</h5>
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

                                                                        <div className='list-group mt-3'>

                                                                            <button onClick={() => confirmarRenovacion(prestamo.libro.id, prestamo.correoUsuario)}
                                                                                className='btn btn-md btn-success m-1'
                                                                                data-bs-dismiss='modal'>
                                                                                Confirmar
                                                                            </button>

                                                                            <button
                                                                                className='btn btn-md btn-danger m-1'
                                                                                data-bs-dismiss='modal'>
                                                                                Cancelar
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