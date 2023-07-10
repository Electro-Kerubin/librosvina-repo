class MensajesAdminRequestModelo {

    id: number;
    respuesta: string;

    constructor(id: number,
                respuesta: string
    ) {
        this.id = id;
        this.respuesta = respuesta;
    }
}

export default MensajesAdminRequestModelo;