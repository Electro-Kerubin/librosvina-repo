import ResenaModel from "../../Modelos/ResenaModel";
import { ReseñaStar } from "./ReseñaStar";

export const Resena: React.FC<{ resena: ResenaModel }> = (props) => {
    
    const fechaResena = new Date(props.resena.fecha);

    const mesResena = fechaResena.toLocaleString("es-CL", { month: 'long'});
    const diaResena = fechaResena.getDate();
    const anoResena = fechaResena.getFullYear();

    const fechaTotal = mesResena + ' ' + diaResena + ', ' + anoResena;

    return(
        <div>
            <div className="col-sm-8 col-md-8">
                <h5>{props.resena.usuarioEmail}</h5>
                <div className="row">
                    <div className="col">
                        {fechaTotal}
                    </div>
                    <div className="col">
                        <ReseñaStar puntuacion={props.resena.puntaje} tamaño={16} />
                    </div>
                </div>
                <div className="mt-2">
                    <p>
                        {props.resena.resenaDescripcion}
                    </p>
                </div>
            </div>
            <hr />
        </div>
    );
}