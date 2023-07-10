import { useState, useEffect } from 'react';
import LibroModelo from '../../../Modelos/LibroModelo';
import { SpinnerLoading } from '../../Utilidad/SpinnerLoading';
import { Paginador } from '../../Utilidad/Paginador';
import { ActualizarOpciones } from './ActualizarOpciones';

export const ActualizarLibros = () => {

    const [libros, setLibros] = useState<LibroModelo[]>([]);
    const [librosCargado, setLibrosCargado] = useState(true);
    const [httpError, setHttpError] = useState(null);
    const [paginaActual, setPaginaActual] = useState(1);
    const [librosPorPagina] = useState(5);
    const [totalCantidadLibros, setTotalCantidadLibros] = useState(0);
    const [totalPaginas, setTotalPaginas] = useState(0);

    const [libroBorrado, setLibroBorrado] = useState(false);

    const [formWarning, setFormWarning] = useState(false);
    const [formSuccess, setFormSuccess] = useState(false);

    useEffect(() => {
        const fetchLibros = async () => {
            const apiUrl: string = `https://app-biblioteca-libros-vinia-13e40b77ef4a.herokuapp.com/api/libroes?page=${paginaActual - 1}&size=${librosPorPagina}`;

            const response = await fetch(apiUrl);

            if (!response.ok) {
                throw new Error('Error en useEffect "Cargando libros de la api"');
            }

            const responseJson = await response.json();

            const responseData = responseJson._embedded.libroes;

            setTotalCantidadLibros(responseJson.page.totalElements);
            setTotalPaginas(responseJson.page.totalPages);

            const librosCargados: LibroModelo[] = [];

            for (const key in responseData) {
                librosCargados.push({
                    id: responseData[key].id,
                    titulo: responseData[key].titulo,
                    autor: responseData[key].autor,
                    descripcion: responseData[key].descripcion,
                    copias: responseData[key].copias,
                    copiasDisponibles: responseData[key].copiasDisponibles,
                    categoria: responseData[key].categoria,
                    img: responseData[key].img,
                });
            }
            setLibros(librosCargados);
            setLibrosCargado(false);
        };

        fetchLibros().catch((error: any) => {
            setHttpError(error.message);
            setLibrosCargado(false);
        })

        window.scrollTo(0, 0);

    }, [paginaActual, libroBorrado]);

    if (librosCargado) {
        return (
            <SpinnerLoading />
        );
    }

    if (httpError) {
        return (
            <div className='container m-5'>
                {httpError}
            </div>
        );
    }

    const borrarLibro = () => setLibroBorrado(!libroBorrado);

    //Paginador
    const ultimoLibro: number = paginaActual * librosPorPagina;
    const primerLibro: number = ultimoLibro - librosPorPagina;
    let ultimoItem = librosPorPagina * paginaActual <= totalCantidadLibros ?
        librosPorPagina * paginaActual : totalCantidadLibros;

    const paginador = (numPagina: number) => setPaginaActual(numPagina);

    return (
        <div className='container mt-5'>
            {totalCantidadLibros > 0 ?
                <>
                    <div className="mt-3">
                        <h3>Cantidad de libros: ({totalCantidadLibros})</h3>
                    </div>
                    {libros.map(libro => (
                        <div key={libro.id}><ActualizarOpciones libro={libro} key={libro.id} borrarLibro={borrarLibro} /></div>
                    ))}
                </>
                :
                <h5>Debe añadir libros primero a la colección</h5>
            }
            {totalPaginas > 1 && <Paginador paginaActual={paginaActual} totalPaginas={totalPaginas} paginador={paginador} />}
        </div>
    );
}