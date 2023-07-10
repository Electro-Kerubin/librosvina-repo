import { Link } from "react-router-dom";

export const Header = () => {
    return (
        <div className="p-5 mb-4 bg-dark header">
            <div className="container-fluid py-5 text-white d-flex justify-content-center">
                <div>
                    <h1 className="display-5 fw-bold">Nuevas aventuras esperan por ti!</h1>
                    <p className="col-md-8 fs-4">Este es el lugar de tus libros favoritos.</p>
                    <Link type="button" className="btn text button-inicio button-arounder " to="/buscar">Busca tus libros aqui!</Link>
                </div>
            </div>
        </div>
    );
}