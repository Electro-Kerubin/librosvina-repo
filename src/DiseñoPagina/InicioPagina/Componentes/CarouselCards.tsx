import React from 'react'
import LibroModelo from '../../../Modelos/LibroModelo';
import { Link } from 'react-router-dom';

export const CarouselCards: React.FC<{ libro: LibroModelo }> = (props) => {
    return (
        <div className="col-xs-6 col-sm-6 col-md-4 col-lg-3 mb-3">
            <div className="text-center">
                {props.libro.img ?
                    <img src={props.libro.img} alt="libro"
                        width='151'
                        height='233'
                    />
                    :
                    <img src={require('./../../../ImagenesWeb/Libros/rubius.jpg')} alt="libro"
                        width='151'
                        height='233'
                    />
                }
                <h6 className="mt-2">{props.libro.titulo}</h6>
                <p>{props.libro.autor}</p>
                <Link className="btn main-color text-white" to={`/info/${props.libro.id}`}>Reservar</Link>
            </div>
        </div>
    );
}