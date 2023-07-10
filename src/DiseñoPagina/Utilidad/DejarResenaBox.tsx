import { useState } from "react";
import { Rate } from 'antd';

export const DejarResenaBox: React.FC<{ enviarResena: any }> = (props) => {

    const [puntajeInput, setPuntajeIntpu] = useState(0);
    const [displayInput, setDisplayInput] = useState(false);
    const [resenaDescripcion, setResenaDescripcion] = useState('');

    const metodoPuntajeStar = (num: number) => {
        setPuntajeIntpu(num);
        setDisplayInput(true);
    };

    return (
        <div>
            <h5>Deja tu Puntaje</h5>
            <Rate value={puntajeInput} onChange={metodoPuntajeStar} defaultValue={0} allowHalf />
        
            {displayInput &&
                <form method="POST" action="#">
                    <hr />

                    <div className="mb-3">
                        <label htmlFor="" className="form-label">
                            Descripción
                        </label>
                        <textarea className="form-control" id="idReseñaDescripcion" placeholder="" 
                            rows={3} onChange={e => setResenaDescripcion(e.target.value)}>
                        </textarea>
                    </div>

                    <div>
                        <button type="button" onClick={() => props.enviarResena(puntajeInput, resenaDescripcion)} className="btn btn-primary mt-3">Enviar</button>
                    </div>

                </form>
            }

        </div>
    );
}