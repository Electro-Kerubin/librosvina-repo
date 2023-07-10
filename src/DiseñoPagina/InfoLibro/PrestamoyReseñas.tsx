import { Link } from "react-router-dom";
import LibroModelo from "../../Modelos/LibroModelo";
import { DejarResenaBox } from "../Utilidad/DejarResenaBox";

export const PrestamoyReseña: React.FC<{
  libro: LibroModelo | undefined;
  movil: boolean;
  prestamosDisponibles: number;
  autentificacion: any;
  prestado: boolean;
  prestamoLibroFuncionalidad: any;
  resenaExiste: boolean;
  enviarResena: any;
}> = (props) => {
  // Funcion para cambiar el estado del boton si esta autentificado o no
  function buttonAuth() {
    if (props.autentificacion) {
      if (!props.prestado && props.prestamosDisponibles < 5) {
        return (
          <button
            onClick={() => props.prestamoLibroFuncionalidad()}
            className="btn btn-success btn-lg"
          >
            Alquilar libro
          </button>
        );
      } else if (props.prestado) {
        return (
          <p>
            <b>Ya has alquilado el libro</b>
          </p>
        );
      } else if (!props.prestado) {
        return (
          <p className="text-danger">No puedes alquilar mas de 5 libros</p>
        );
      }
    }
    return (
      <Link to={"/login"} className="btn btn-success btn-lg">
        Iniciar Sesión
      </Link>
    );
  }

  function resenaOpcion() {
    if (props.autentificacion && !props.resenaExiste) {
      return <p><DejarResenaBox enviarResena={props.enviarResena} /></p>;
    } else if (props.autentificacion && props.resenaExiste) {
      return <p>Ya has hecho una reseña.</p>;
    }


    return (
      <div>
        <hr />
        <p>Inicia sesión para poder dejar una reseña.</p>
      </div>
    );
  }

  return (
    <div
      className={
        props.movil ? "card d-flex mt-5" : "card col-3 container d-flex mb-5"
      }
    >
      <div className="card-body container">
        <div className="mt-3">
          <p>
            <b>{props.prestamosDisponibles}/5 </b>
            Prestamos disponibles
          </p>
          <hr />
          {props.libro &&
            props.libro.copiasDisponibles &&
            props.libro.copiasDisponibles > 0 ? (
            <h4 className="text-success">Disponible</h4>
          ) : (
            <h4 className="text-danger">Lista de espera</h4>
          )}
          <div className="row">
            <p className="col-6 lead">
              <b>{props.libro?.copias} </b>
              Copias
            </p>
            <p className="col-6 lead">
              <b>{props.libro?.copiasDisponibles} </b>
              Disponible
            </p>
          </div>
        </div>
        {buttonAuth()}
        <hr />
        {resenaOpcion()}

        

      </div>
    </div>
  );
};
