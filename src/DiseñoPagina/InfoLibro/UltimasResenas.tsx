import { Link } from "react-router-dom";
import ResenaModel from "../../Modelos/ResenaModel"
import { Resena } from "../Utilidad/Resena";

export const UltimasResenas: React.FC<{
    resenas: ResenaModel[], libroId: number | undefined,
    movil: boolean
}> = (props) => {
    return (
        <div className={props.movil ? "mt-3" : "row mt-5"}>
            <div className={props.movil ? "" : "col-sm-2 col-md-2"}>
                <h2>Ultimas Reseñas: </h2>
            </div>
            <div className="col-sm-10 col-md-10">
                {props.resenas.length > 0 ?
                    <>
                        {props.resenas.slice(0, 3).map(listResenas => (
                            <Resena resena={listResenas} key={listResenas.id}></Resena>
                        ))}

                        <div className="m-3">
                            <Link type="button" className="btn main-color btn-md text-white" to={`/resenas/${props.libroId}`}>
                                Ver todas las reseñas.
                            </Link>
                        </div>
                    </>
                    :
                    <div className="m-3">
                        <p className="lead">
                            No hay reseñas todavia!!
                        </p>
                    </div>
                }
            </div>
        </div>
    );
}