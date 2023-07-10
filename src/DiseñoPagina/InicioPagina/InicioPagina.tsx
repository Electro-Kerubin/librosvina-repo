import { Carousel } from "./Componentes/Carousel";
import { Header } from "./Componentes/Header";
import { PortadaInicio } from "./Componentes/PortadaInicio";
import { Servicios } from "./Componentes/Servicios";



export const InicioPagina = () => {

    window.scrollTo(0, 0);

    return (
        <>
            <Header />
            <Carousel />
            <PortadaInicio />
            <Servicios />
        </>
    );
}