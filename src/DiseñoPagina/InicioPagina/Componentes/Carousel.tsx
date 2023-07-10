import { CarouselCards } from "./CarouselCards";
import { useEffect, useState } from "react";
import LibroModelo from "../../../Modelos/LibroModelo";
import { SpinnerLoading } from "../../Utilidad/SpinnerLoading";
import { Link } from "react-router-dom";


export const Carousel = () => {

    const [libros, setLibros] = useState<LibroModelo[]>([]);
    const [cargandoCarousel, setCargandoCarousel] = useState(true);
    const [httpError, setHttpError] = useState(null);

    // Cargando libros de la api
    useEffect(() => {
        const fetchLibros = async () => {
            const apiUrl: string = "https://app-biblioteca-libros-vinia-13e40b77ef4a.herokuapp.com/api/libroes";

            const finalUrl: string = `${apiUrl}?page=0&size=9`;

            const response = await fetch(finalUrl);

            if (!response.ok) {
                throw new Error('Error en useEffect "Cargando libros de la api"');
            }

            const responseJson = await response.json();

            const responseData = responseJson._embedded.libroes;

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

    }, []);

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

    return (
        <div className="container mt-5" style={{ height: 550 }}>
            <div className="inicio-carousel">
                <h3>Nuestros libros de la colección</h3>
            </div>
            <div id="carousel-control" className="carousel slide carousel-dark slide mt-5 d-none d-lg-block"
                data-bs-interval="3000" data-bs-ride="carousel">
                {/**Escritorio */}
                <div className="carousel-inner">
                    <div className="carousel-item active">
                        <div className="row d-flex justify-content-center align-items-center">
                            {libros.slice(0, 3).map(libro => (
                                <CarouselCards libro={libro} key={libro.id} />
                            ))}
                        </div>
                    </div>
                    <div className="carousel-item">
                        <div className="row d-flex justify-content-center align-items-center">
                            {libros.slice(3, 6).map(libro => (
                                <CarouselCards libro={libro} key={libro.id} />
                            ))}
                        </div>
                    </div>
                    <div className="carousel-item">
                        <div className="row d-flex justify-content-center align-items-center">
                            {libros.slice(6, 9).map(libro => (
                                <CarouselCards libro={libro} key={libro.id} />
                            ))}
                        </div>
                    </div>
                </div>
                <button className="carousel-control-prev" type="button" data-bs-target='#carousel-control' data-bs-slide="prev">
                    <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                    <span className="visually-hidden">PREV</span>
                </button>
                <button className="carousel-control-next" type="button" data-bs-target='#carousel-control' data-bs-slide="next">
                    <span className="carousel-control-next-icon" aria-hidden="true"></span>
                    <span className="visually-hidden">PREV</span>
                </button>
            </div>

            {/**Mobile */}
            <div className="d-lg-none mt-3">
                <div className="row d-flex justify-content-center align-items-center">
                    <CarouselCards libro={libros[7]} key={libros[7].id} />
                </div>
            </div>
            <div className="inicio-carousel d-flex justify-content-center mt-3">
                <Link className="btn btn-outline-secondary btn-lg" to="/buscar">Ver más</Link>
            </div>
        </div>
    );
}