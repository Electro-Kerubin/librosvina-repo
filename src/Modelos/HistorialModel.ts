class HistorialModel {
    id: number;
    usuarioEmail: string;
    fechaPrestamo: string;
    fechaRetorno: string;
    titulo: string;
    autor: string;
    descripcion: string;
    img: string;

    constructor(id: number,
        usuarioEmail: string,
        fechaPrestamo: string,
        fechaRetorno: string,
        titulo: string,
        autor: string,
        descripcion: string,
        img: string) {
        this.id = id;
        this.usuarioEmail = usuarioEmail;
        this.fechaPrestamo = fechaPrestamo;
        this.fechaRetorno = fechaRetorno;
        this.titulo = titulo;
        this.autor = autor;
        this.descripcion = descripcion;
        this.img = img;
    }
}

export default HistorialModel;