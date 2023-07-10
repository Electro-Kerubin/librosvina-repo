import { useEffect, useState } from "react";
import ResenaModel from "../../Modelos/ResenaModel";
import { SpinnerLoading } from "../Utilidad/SpinnerLoading";
import { Resena } from "../Utilidad/Resena";
import { Paginador } from "../Utilidad/Paginador";
export const ListaResenaPage = () => {

    const [resenas, setResenas] = useState<ResenaModel[]>([]);
    const [resenasCargadas, setResenasCargadas] = useState(true);
    const [httpError, setHttpError] = useState(null);

    //Paginas
    const [paginaActual, setPaginaActual] = useState(1);
    const [resenasPorPagina] = useState(5);
    const [totalResenas, setTotalResenas] = useState(0);
    const [totalPaginas, setTotalPaginas] = useState(0);

    const libroId = (window.location.pathname).split('/')[2];

    useEffect(() => {
        const buscarResenas = async () => {
            const apiUrl: string = `https://app-biblioteca-libros-vinia-13e40b77ef4a.herokuapp.com/api/resenas/search/findByLibroId?libroId=${libroId}&page=${paginaActual - 1}&size=${resenasPorPagina}`;

            const responseResena = await fetch(apiUrl);

            if (!responseResena.ok) {
                throw new Error("Problemas en fetch buscarResenas");
            }

            const responseJsonResena = await responseResena.json();

            //Toma la lista de reseñas de la api rest y solo extrae lo la lista que se llama resenas
            const responseData = responseJsonResena._embedded.resenas;

            setTotalResenas(responseJsonResena.page.totalElements);
            setTotalPaginas(responseJsonResena.page.totalPages);

            const resenas: ResenaModel[] = [];


            for (const resenaProps in responseData) {
                resenas.push({
                    id: responseData[resenaProps].id,
                    usuarioEmail: responseData[resenaProps].usuarioEmail,
                    fecha: responseData[resenaProps].fecha,
                    puntaje: responseData[resenaProps].puntaje,
                    libroId: responseData[resenaProps].libroId,
                    resenaDescripcion: responseData[resenaProps].resenaDescripcion,
                });
            }


            setResenas(resenas);
            setResenasCargadas(false);
        };

        buscarResenas().catch((error: any) => {
            setResenasCargadas(false);
            setHttpError(error.message);
        });
    }, [paginaActual]);

    if (resenasCargadas) {
        return (
            <SpinnerLoading />
        );
    }

    if (httpError) {
        return (
            <div className="container m-5">
                <p>{httpError}</p>
            </div>
        )
    }

    const indiceUltimaResena: number = paginaActual * resenasPorPagina;
    const indicePrimeraResena: number = indiceUltimaResena - resenasPorPagina;

    let lastItem = resenasPorPagina * paginaActual <= totalResenas ? resenasPorPagina * paginaActual : totalResenas;

    const paginador = (numPagina: number) => setPaginaActual(numPagina);

    return (
        <div className="container m-5">
            <div className="">
                <h3></h3>
            </div>
            <p>
                {totalResenas} Resenas:
            </p>
            <div className="row">
                {resenas.map(resena => (
                    <Resena resena={resena} key={resena.id} />
                ))}
            </div>

            {totalPaginas > 1 && <Paginador paginaActual={paginaActual} totalPaginas={totalPaginas} paginador={paginador} />}

        </div>
    );
}