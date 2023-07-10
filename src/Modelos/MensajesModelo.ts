class MensajesModelo {

    id?: number;
    usuarioEmail?: string;
    titulo: string;
    pregunta: string;
    adminEmail?: string;
    respuesta?: string;
    cerrado?: boolean;

    constructor(
        
        titulo: string,
        pregunta: string,
        ) {


        this.titulo = titulo;
        this.pregunta = pregunta;

    }
}

export default MensajesModelo;