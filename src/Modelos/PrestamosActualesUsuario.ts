import LibroModelo from "./LibroModelo";

class PrestamosActualesUsuario {
    idPrestamo: number;
    libro: LibroModelo;
    estado: string;
    correoUsuario: string;
    diasAlquilerRestantes: number;
    fechaPrestamo: string;
    fechaRetorno: string;

    constructor (idPrestamo:number, libro: LibroModelo, 
                estado: string, correoUsuario: string,
                diasAlquilerRestantes: number,
                fechaPrestamo:string,
                fechaRetorno: string) {
        this.idPrestamo = idPrestamo;
        this.libro = libro;
        this.estado = estado;
        this.correoUsuario = correoUsuario;
        this.diasAlquilerRestantes = diasAlquilerRestantes;
        this.fechaPrestamo = fechaPrestamo;
        this.fechaRetorno = fechaRetorno;
    }
}

export default PrestamosActualesUsuario;