import { useState, useEffect } from 'react';
import { useOktaAuth } from '@okta/okta-react';
import LibroModelo from '../../../Modelos/LibroModelo';

export const ActualizarOpciones: React.FC<{ libro: LibroModelo, borrarLibro: any }> = (props, key) => {

    const { authState } = useOktaAuth();
    const [cantidad, setCantidad] = useState<number>(0);
    const [restante, setRestante] = useState<number>(0);

    //Booleanos para activar las alertas


    useEffect(() => {
        const librosDisponibles = () => {
            props.libro.copias ? setCantidad(props.libro.copias) : setCantidad(0);
            props.libro.copiasDisponibles ? setRestante(props.libro.copiasDisponibles) : setRestante(0);
        };
        librosDisponibles();
    }, []);

    async function borrarLibro() {
        const apiUrl = `https://app-biblioteca-libros-vinia-13e40b77ef4a.herokuapp.com/api/admin/confidencial/eliminar/libro/?libroId=${props.libro?.id}`;
        const peticion = {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${authState?.accessToken?.accessToken}`,
                'Content-Type': 'application/json'
            }
        };

        const borrarLibroResponse = await fetch(apiUrl, peticion);
        if (!borrarLibroResponse.ok) {
            throw new Error("Error en borrarLibroResponse");
        }

        props.borrarLibro();
    }

    async function incrementarCantidad() {
        const apiUrl = `https://app-biblioteca-libros-vinia-13e40b77ef4a.herokuapp.com/api/admin/confidencial/incrementar/libro/?libroId=${props.libro?.id}`;
        const peticion = {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${authState?.accessToken?.accessToken}`,
                'Content-Type': 'application/json'
            }
        };

        const incrementarCantidadResponse = await fetch(apiUrl, peticion);

        if (!incrementarCantidadResponse.ok) {
            throw new Error("Error en incrementarCantidadResponse");
        }

        setCantidad(cantidad + 1);
        setRestante(restante + 1);
    }

    async function disminuirCantidad() {
        const apiUrl = `https://app-biblioteca-libros-vinia-13e40b77ef4a.herokuapp.com/api/admin/confidencial/disminuir/libro/?libroId=${props.libro?.id}`;
        const peticion = {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${authState?.accessToken?.accessToken}`,
                'Content-Type': 'application/json'
            }
        };

        const disminuirCantidadResponse = await fetch(apiUrl, peticion);

        if (!disminuirCantidadResponse.ok) {
            throw new Error("Error en disminuirCantidadResponse");
        }

        setCantidad(cantidad - 1);
        setRestante(restante - 1);
    }

    return (
        <div className='card mt-3 shadow p-3 mb-3 bg-body rounded'>
            <div className="row g-0">
                <div className="col-md-2">
                    {/* Escritorio */}
                    <div className="d-none d-lg-block">
                        {props.libro.img ?
                            <img src={props.libro.img} width='123' height='196' alt='libro' />
                            :
                            <img src={require("./../../../ImagenesWeb/Libros/rubius.jpg")} width='123' height='196' alt='libro' />
                        }
                    </div>
                    {/* Mobile */}
                    <div className="d-lg-none d-flex justify-content-center align-items-center">
                        {props.libro.img ?
                            <img src={props.libro.img} width='123' height='196' alt='libro' />
                            :
                            <img src={require("./../../../ImagenesWeb/Libros/rubius.jpg")} width='123' height='196' alt='libro' />
                        }
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="card-body">
                        <h5 className="card-title">{props.libro.autor}</h5>
                        <h4>{props.libro.titulo}</h4>
                        <p className="card-text">{props.libro.descripcion}</p>
                    </div>
                </div>
                <div className="mt-3 col-md-4">
                    <div className="d-flex justify-content-center align-items-center">
                        <p>Stock total: {cantidad}</p>
                    </div>
                    <div className="d-flex justify-content-center align-items-center">
                        <p>Stock disponible: {restante}</p>
                    </div>
                </div>
                <div className="mt-3 col-md-1">
                    <div className="d-flex justify-content-start">
                        <button className="btn btn-md btn-danger m-1" onClick={borrarLibro}>
                            Eliminar libro
                        </button>
                    </div>
                </div>
                <button className="btn btn-md btn-info text-white m-1" onClick={incrementarCantidad}>Incrementar cantidad</button>
                <button className="btn btn-md btn-warning m-1" onClick={disminuirCantidad}>Disminuir cantidad</button>
            </div>
        </div>
    );
}