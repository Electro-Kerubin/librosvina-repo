import { Link, NavLink } from "react-router-dom";
import { useOktaAuth } from '@okta/okta-react';
import { SpinnerLoading } from "../Utilidad/SpinnerLoading";

export const Navbar = () => {

    const { oktaAuth, authState } = useOktaAuth();

    if (!authState) {
        return <SpinnerLoading />;
    }

    const handleLogout = async () => oktaAuth.signOut();

    console.log(authState);

    return (
        <nav className='navbar navbar-expand-lg navbar-dark main-color py-3'>
            <div className='container-fluid'>
                <NavLink className='navbar-brand' to="/">Biblioteca LibrosViña</NavLink>
                <button className='navbar-toggler' type='button' data-bs-toggle='collapse'
                    data-bs-target='#navbarNavDespliege'
                    aria-controls='navbarNavDespliege' aria-expended='false' aria-label='Toggle Navigation' >

                    <span className='navbar-toggler-icon'></span>
                </button>
                <div className='collapse navbar-collapse' id='navbarNavDespliege'>
                    <ul className='navbar-nav'>
                        <li className='nav-item'>
                            <NavLink className='nav-link' to='/'>Inicio</NavLink>
                        </li>
                        <li className='nav-item'>
                            <NavLink className='nav-link' to='/buscar'>Buscar Libros</NavLink>
                        </li>
                        <li>
                            {authState.isAuthenticated &&
                                <li className="nav-item">
                                    <NavLink className='nav-link' to='/tusprestamos'>Tus Prestamos</NavLink>
                                </li>
                            }
                        </li>
                        <li>
                            {authState.isAuthenticated &&
                                <li className="nav-item">
                                    <NavLink className='nav-link' to='/mensajes'>Mensajes</NavLink>
                                </li>
                            }
                        </li>
                        <li>
                            {authState.isAuthenticated && authState.accessToken?.claims.usuarioRol == "admin" ?
                                <li className="nav-item">
                                    <NavLink className='nav-link' to='/administracion'>Administrar Libreria</NavLink>
                                </li>
                                :
                                <></>
                            }
                        </li>
                    </ul>
                    <ul className='navbar-nav ms-auto'>
                        {!authState.isAuthenticated ?
                            <li className='nav-item m-1'>
                                <Link type='button' className='btn btn-outline-light' to='/login'>Ingresar</Link>
                            </li>
                            :
                            <li>
                                <button className="btn btn-outline-light" onClick={handleLogout}>Cerrar Sesión</button>
                            </li>
                        }
                    </ul>
                </div>
            </div>
        </nav>
    );
}