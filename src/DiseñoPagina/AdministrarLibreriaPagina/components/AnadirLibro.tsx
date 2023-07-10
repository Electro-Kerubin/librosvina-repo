import { useOktaAuth } from "@okta/okta-react";
import { useState } from 'react';
import AnadirLibroRequest from "../../../Modelos/AnadirLibroRequest";
import { EnviarNuevoMensaje } from "../../MensajesPagina/components/EnviarNuevoMensaje";

export const AnadirLibro = () => {

    const { authState } = useOktaAuth();

    // Nuevo Libro
    const [titulo, setTitulo] = useState('');
    const [autor, setAutor] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [copias, setCopias] = useState<number>(0);
    const [categoria, setCategoria] = useState('Categoria');
    const [imagen, setImagen] = useState<any>(null);

    //estados de enviado
    const [formWarning, setFormWarning] = useState(false);
    const [formSuccess, setFormSuccess] = useState(false);

    //utlilidad de categoria
    const [displayCategoria, setDisplayCategoria] = useState('Categoria');

    function categoriaSelect(value: string) {

        setCategoria(value);

        if (value == 'HI') {
            setDisplayCategoria('Historia');
        } else if (value == 'FI') {
            setDisplayCategoria('Ciencia Ficción');
        } else if (value == 'PR') {
            setDisplayCategoria('Programación');
        } else if (value == 'PS') {
            setDisplayCategoria('Psicologia');
        }
    }

    async function conversorDeImagenesBase64(img: any) {
        console.log(img)
        if (img.target.files[0]) {
            base64(img.target.files[0]);
        }
    }

    function base64(file: any) {
        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function () {
            setImagen(reader.result);
        };
        reader.onerror = function (error) {
            console.log('Error al transformar a base64', error);
        }
    }

    async function anadirLibroButton() {
        const apiUrl = `https://app-biblioteca-libros-vinia-13e40b77ef4a.herokuapp.com/api/admin/confidencial/anadir/libro`;
        if (authState?.isAuthenticated && titulo !== '' && autor !== '' && descripcion !== '' &&
            categoria !== 'Categoria' && copias >= 0) {
            const libro: AnadirLibroRequest = new AnadirLibroRequest(titulo, autor, descripcion, copias, categoria);
            libro.img = imagen;
            const peticion = {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${authState?.accessToken?.accessToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(libro)
            };

            const anadirLibroButtonResponse = await fetch(apiUrl, peticion);
            if (!anadirLibroButtonResponse.ok) {
                throw new Error('problemas en anadirLibroButtonResponse');
            }

            setTitulo('');
            setAutor('');
            setDescripcion('');
            setCopias(0);
            setCategoria('Categoria');
            setImagen(null)
            setFormWarning(false);
            setFormSuccess(true);
        } else {
            setFormWarning(true);
            setFormSuccess(false);
        }
    }



    return (
        <div className="container mt-3 mb-5">
            {formSuccess &&
                <div className="alert alert-success" role="alert">
                    Se añadio el libro exitosamente!
                </div>
            }
            {formWarning &&
                <div className="alert alert-danger">
                    Todos los campos deben estar completos.
                </div>
            }
            <div className="card">
                <div className="card-header">
                    Añadir nuevo libro.
                </div>
                <div className="card-body">
                    <form action="POST">
                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <label className="form-label">Titulo</label>
                                <input type="text" className="form-control" name="titulo" required
                                    onChange={e => setTitulo(e.target.value)} value={titulo} />
                            </div>
                            <div className="col-md-3 mb-3">
                                <label className="form-label">Autor</label>
                                <input type="text" className="form-control" name="autor" required
                                    onChange={e => setAutor(e.target.value)} value={autor} />
                            </div>
                            <div className="col-md-3 mb-3">
                                <label className="form-label">Categoria</label>
                                <div className="dropdown">
                                    <button className="form-control btn btn-secondary dropdown-toggle" type="button"
                                        id="categoriaButtonId" data-bs-toggle='dropdown' aria-expanded='false'>
                                        {displayCategoria}
                                    </button>
                                    <div className="dropdown-menu" aria-labelledby="categoriaButtonId">
                                        <a onClick={() => categoriaSelect('FI')} className="dropdown-item">Ciencia Ficción</a>
                                        <a onClick={() => categoriaSelect('HI')} className="dropdown-item">Historia</a>
                                        <a onClick={() => categoriaSelect('PR')} className="dropdown-item">Programación</a>
                                        <a onClick={() => categoriaSelect('PS')} className="dropdown-item">Psicologia</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-12 mb-3">
                            <label className="form-label">Descripción</label>
                            <textarea className="form-control" id="descripcionTextareaId" rows={4}
                                onChange={e => setDescripcion(e.target.value)} value={descripcion}></textarea>
                        </div>
                        <div className="col-md-3 mb-3">
                            <label className="form-label">Copias</label>
                            <input type="number" className="form-control mb-2" name="copias" required
                                onChange={e => setCopias(Number(e.target.value))} value={copias} />
                        </div>
                        <input type="file" onChange={e => conversorDeImagenesBase64(e)} />
                        <div className="">
                            <button type="button" className="btn btn-primary mt-3"
                                onClick={anadirLibroButton}>
                                Añadir Libro
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}