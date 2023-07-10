class AnadirLibroRequest {
    titulo: string;
    autor: string;
    descripcion: string;
    copias: number;
    categoria: string;
    img?: string;

    constructor(
        titulo: string,
        autor: string,
        descripcion: string,
        copias: number,
        categoria: string) {
        this.titulo = titulo;
        this.autor = autor;
        this.descripcion = descripcion;
        this.copias = copias;
        this.categoria = categoria;
    }
}

export default AnadirLibroRequest;