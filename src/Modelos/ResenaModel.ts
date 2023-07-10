class ResenaModel {
    id: number;
    usuarioEmail: string;
    fecha: string;
    puntaje: number;
    libroId: number;
    resenaDescripcion: string;

    constructor(id: number, usuarioEmail: string, fecha: string, puntaje: number, libroId: number, resenaDescripcion: string) {
        this.id = id;
        this.usuarioEmail = usuarioEmail;
        this.fecha = fecha;
        this.puntaje = puntaje;
        this.libroId = libroId;
        this.resenaDescripcion = resenaDescripcion;
    }
}

export default ResenaModel;