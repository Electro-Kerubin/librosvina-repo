import { useOktaAuth } from "@okta/okta-react";
import { Link } from "react-router-dom";
import Mapa from "../../../Geolocalizacion/Mapa";

export const PortadaInicio = () => {

    const { authState } = useOktaAuth();

    return (
        <div>
            <div className="d-none d-lg-block">
                <div className="row g-0 mt-5">
                    <div className="col-sm-6 col-md-6">
                        <div className="col-image-left">
                            <div className="map-container">
                                <Mapa />
                            </div>
                        </div>
                    </div>
                    {/** col-4 col-md-4 container d-flex justify-content-center align-items-center */}
                    <div className="col-4 col-md-4 container d-flex justify-content-center align-items-center">
                        <div className="ml-2">
                            <h1>¿Que has estado leyendo?</h1>
                            <p className="lead">
                                Nos encantaria saber que has estado leyendo. <br />
                                Ya sea una novela o enciclopedia, te proveeremos de los mejores libros.
                            </p>
                            {authState?.isAuthenticated ?
                                <Link type="button" className="btn main-color text-white btn-lg" to='/buscar'>Encuentra mas libros</Link>
                                :
                                <Link className="btn main-color text-white btn-lg" to='/login'>Ingresar</Link>
                            }

                        </div>
                    </div>
                </div>
                <div className="row g-0">
                    <div className="col-2 col-md-4 container d-flex justify-content-center align-items-center">
                        <div className="ml-2">
                            <h1>En nuestra colección podras encontrar</h1>
                            <p className="lead">En nuestra biblioteca online con sistema de préstamos, podrás encontrar una amplia variedad de libros para disfrutar. Tenemos una colección diversa que abarca diferentes géneros literarios y temas de interés. Nuestro objetivo es brindarte opciones para satisfacer tus gustos y necesidades de lectura.</p>
                        </div>
                    </div>
                    <div className="col-sm-6 col-md-6">
                        <div className="col-image-right"></div>
                    </div>
                </div>
            </div>

            {/**Mobile*/}
            <div className="d-lg-none">
                <div className="container">
                    <div className="m-2">
                        <div className="map-container">
                            <Mapa />
                        </div>
                        <div className="mt-2">
                            <h1>¿Que has estado leyendo?</h1>
                            <p className="lead">
                            Nos encantaria saber que has estado leyendo. <br />
                                Ya sea una novela o enciclopedia, te proveeremos de los mejores libros.
                            </p>
                            {authState?.isAuthenticated ?
                                <Link to='/buscar' className="btn main-color text-white btn-lg">Encuentra mas libros</Link>
                                :
                                <Link className="btn main-color text-white btn-lg" to='/login'>Ingresar</Link>
                            }
                        </div>
                    </div>
                    <div className="m-2">
                        <div className="col-image-right"></div>
                        <div className="mt-2">
                            <h1>En nuestra colección podras encontrar</h1>
                            <p className="lead">En nuestra biblioteca online con sistema de préstamos, podrás encontrar una amplia variedad de libros para disfrutar. Tenemos una colección diversa que abarca diferentes géneros literarios y temas de interés. Nuestro objetivo es brindarte opciones para satisfacer tus gustos y necesidades de lectura.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}