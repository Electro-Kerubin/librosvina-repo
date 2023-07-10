import { useState, useEffect } from "react";
import LibroModelo from "../../Modelos/LibroModelo";
import { CarouselCards } from "../InicioPagina/Componentes/CarouselCards";
import { Paginador } from "../Utilidad/Paginador";
import { SpinnerLoading } from "../Utilidad/SpinnerLoading";
import { RetornaLibro } from "./components/RetornaLibro";

export const BuscarLibrosPagina = () => {

    const [libros, setLibros] = useState<LibroModelo[]>([]);
    const [cargandoCarousel, setCargandoCarousel] = useState(true);
    const [httpError, setHttpError] = useState(null);
    const [paginaActual, setPaginaActual] = useState(1);
    const [librosPorPagina] = useState(5);
    const [totalCantidadLibros, setTotalCantidadLibros] = useState(0);
    const [totalPaginas, setTotalPaginas] = useState(0);
    const [buscarLibro, setBuscarLibro] = useState('');
    const [searchUrl, setSearchUrl] = useState('');
    const [categoriaOpt, setCategoriaOpt] = useState('Categoria');

    // buscar libros
    useEffect(() => {
        const fetchLibros = async () => {
            const apiUrl: string = "http://localhost:8080/api/libroes";

            let finalUrl: string = '';

            if (searchUrl === '') {
                finalUrl = `${apiUrl}?page=${paginaActual - 1}&size=${librosPorPagina}`;
            } else {
                let searchUrlCambios = searchUrl.replace('<pageNumber>', `${paginaActual - 1}`)
                finalUrl = apiUrl + searchUrlCambios;
            }

            const response = await fetch(finalUrl);

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
            setCargandoCarousel(false);
        };

        fetchLibros().catch((error: any) => {
            setCargandoCarousel(false);
            setHttpError(error.message);
        })

        window.scrollTo(0, 0);

    }, [paginaActual, searchUrl]);

    if (cargandoCarousel) {
        return (
            <SpinnerLoading />
        );
    }

    if (httpError) {
        return (
            <div className="container m-5">
                <p>{httpError}</p>
            </div>
        );
    }

    const buscarLibroHandle = () => {

        setPaginaActual(1);

        if (buscarLibro === '') {
            setSearchUrl('');
        } else {
            setSearchUrl(`/search/findByTitulo?titulo=${buscarLibro}&page=<pageNumber>&size=${librosPorPagina}`);
        }
    }

    const categoriaSelectOption = (value: string) => {

        setPaginaActual(1);

        if (value.toLowerCase() === 'ps' ||
            value.toLowerCase() === 'pr' ||
            value.toLowerCase() === 'hi' ||
            value.toLowerCase() === 'fi'
        ) {
            setCategoriaOpt(value);
            setSearchUrl(`/search/findByCategoria?categoria=${value}&page=<pageNumber>&size=${librosPorPagina}`)
        } else {
            setCategoriaOpt('Todo');
            setSearchUrl(`?page=<pageNumber>&size=${librosPorPagina}`)
        }
        setCategoriaOpt('Categoria')
    }

    const ultimoLibro: number = paginaActual * librosPorPagina;
    const primerLibro: number = ultimoLibro - librosPorPagina;
    let ultimoItem = librosPorPagina * paginaActual <= totalCantidadLibros ?
        librosPorPagina * paginaActual : totalCantidadLibros;

    const paginador = (numPagina: number) => setPaginaActual(numPagina);

    return (
        <div>
            <div className="container">
                <div>
                    <div className="row mt-5">
                        <div className="col-6">
                            <div className="d-flex">
                                <input className="form-control m-2" type="search"
                                    placeholder="Buscar Libro" aria-labelledby="Search"
                                    onChange={val => setBuscarLibro(val.target.value)}
                                    style={{ height: '40px' }}
                                />
                                <button className="btn btn-outline-success mt-2"
                                    onClick={() => buscarLibroHandle()}
                                    style={{ height: '40px' }}>
                                    Buscar
                                </button>
                            </div>
                        </div>
                        <div className="col-4 mt-2">
                            <div className="dropdown">
                                <button className="btn btn-secondary dropdown-toggle" type="button"
                                    id="dropdownCategoriaBoton" data-bs-toggle="dropdown" aria-expanded="false">
                                    {categoriaOpt}
                                </button>
                                <ul className="dropdown-menu" aria-labelledby="dropdownCategoriaBoton">
                                    <li onClick={() => categoriaSelectOption('Todo')}>
                                        <a className="dropdown-item" href="#">Todo</a>
                                    </li>
                                    <li onClick={() => categoriaSelectOption('HI')}>
                                        <a className="dropdown-item" href="#">Historia</a>
                                    </li>
                                    <li onClick={() => categoriaSelectOption('PS')}>
                                        <a className="dropdown-item" href="#">Psicologia</a>
                                    </li>
                                    <li onClick={() => categoriaSelectOption('FI')}>
                                        <a className="dropdown-item" href="#">Ciencia Ficción</a>
                                    </li>
                                    <li onClick={() => categoriaSelectOption('PR')}>
                                        <a className="dropdown-item" href="#">Programación</a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {totalCantidadLibros > 0 ?
                        <>
                            <div className="mt-3">
                                <h5>Numero de resultados: ({totalCantidadLibros})</h5>
                            </div>
                            {libros.map(libro => (
                                <RetornaLibro libro={libro} key={libro.id} />
                            ))}
                        </>
                        :
                        <div className="m-5">
                            <h3>
                                No puedes encontrar lo que buscabas?
                            </h3>
                            <a type="button" className="btn main-color btn-md px-4 me-md-2 fw-bold text-white" href="#">Contactanos</a>
                        </div>
                    }
                    {totalPaginas > 1 &&
                        <Paginador paginaActual={paginaActual} totalPaginas={totalPaginas} paginador={paginador} />
                    }
                </div>
            </div>
        </div>
    );
}