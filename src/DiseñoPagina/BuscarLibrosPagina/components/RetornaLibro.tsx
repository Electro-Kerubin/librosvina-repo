import { Link } from "react-router-dom";
import LibroModelo from "../../../Modelos/LibroModelo"

export const RetornaLibro: React.FC<{ libro: LibroModelo }> = (info) => {

    return (
        <div className="card mt-3 shadow p-3 mb-3 bg-body rounded">
            <div className="row g-0">
                <div className="col-md-2">

                    <div className="d-none d-lg-block">
                        {info.libro.img ?
                            <img src={info.libro.img} alt="libro" width="123" height="196" />
                            :
                            <img src={require("../../../ImagenesWeb//Libros/rubius.jpg")}
                                alt="libro" width="123" height="196" />
                        }
                    </div>
                    <div className="d-lg-none d-flex justify-content-center align-items-center">
                        {info.libro.img ?
                            <img src={info.libro.img} alt="libro" width="123" height="196" />
                            :
                            <img src={require("../../../ImagenesWeb/Libros/rubius.jpg")}
                                alt="libro" width="123" height="196" />
                        }
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="card-body">
                        <h3 className="card-title">
                            {info.libro.titulo}
                        </h3>
                        <h6>
                            {info.libro.autor}
                        </h6>
                        <p className="card-text">
                            {info.libro.descripcion}
                        </p>
                    </div>
                </div>
                <div className="col-md-4 d-flex justify-content-center align-items-center">
                    <Link to={`/info/${info.libro.id}`} className="btn btn-md main-color text-white">
                        Ver libro
                    </Link>
                </div>
            </div>
        </div>
    );
}