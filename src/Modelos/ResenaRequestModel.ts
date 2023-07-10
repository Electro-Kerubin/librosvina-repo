class ResenaRequestModel {
    puntuacion: number;

    libroId: number;

    resenaDescripcion?: string;

    constructor(puntuacion: number, libroId: number, resenaDescripcion: string) {
        this.puntuacion = puntuacion;
        this.libroId = libroId;
        this.resenaDescripcion = resenaDescripcion;
    }
}

export default ResenaRequestModel;