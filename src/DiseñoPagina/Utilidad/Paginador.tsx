export const Paginador: React.FC<{
    paginaActual: number,
    totalPaginas: number,
    paginador: any
}> = (props) => {

    // Mejorar paginador

    const numeroPagina = [];

    if (props.paginaActual === 1) {
        numeroPagina.push(props.paginaActual);
        if (props.totalPaginas >= props.paginaActual + 1) {
            numeroPagina.push(props.paginaActual + 1);
        }

        if (props.totalPaginas >= props.paginaActual + 2) {
            numeroPagina.push(props.paginaActual + 2);
        }
    } else if (props.paginaActual > 1) {
        if (props.paginaActual >= 3) {
            numeroPagina.push(props.paginaActual - 2);
            numeroPagina.push(props.paginaActual - 1);
        } else {
            numeroPagina.push(props.paginaActual - 1);
        }

        numeroPagina.push(props.paginaActual);

        if (props.totalPaginas >= props.paginaActual + 1) {
            numeroPagina.push(props.paginaActual + 1);
        }

        if (props.totalPaginas >= props.paginaActual + 2) {
            numeroPagina.push(props.paginaActual + 2);
        }
    }

    return (
        <nav aria-label="...">
            <ul className="pagination">
                {/* <li className="page-item" onClick={(() => props.pagina(1))}>
                    <button className="page-link">
                        1
                    </button>
                </li> */}
                {numeroPagina.map(number => (
                    <li key={number} onClick={() => props.paginador(number)} className={'page-item' + (props.paginaActual === number ? 'active' : '')}>
                        <button className="page-link">
                            {number}
                        </button>
                    </li>
                ))}

                {/* <li className="page-item" onClick={() => props.pagina(props.totalPaginas)}>
                    <button className="page-link">
                        {props.totalPaginas}
                    </button>
                </li> */}
            </ul>
        </nav>
    );


}