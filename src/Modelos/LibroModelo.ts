class LibroModelo {
    id: number;
    titulo: string;
    autor?: string;
    descripcion?: string;
    copias?: number;
    copiasDisponibles?: number;
    categoria?: string;
    img?: string;

    constructor(id: number, titulo: string, autor: string, descripcion: string, copias: number,
        copiasDisponibles: number, categoria: string, img: string) {
        this.id = id;
        this.titulo = titulo;
        this.autor = autor;
        this.descripcion = descripcion;
        this.copias = copias;
        this.copiasDisponibles = copiasDisponibles;
        this.categoria = categoria;
        this.img = img;
    }

}

export default LibroModelo;