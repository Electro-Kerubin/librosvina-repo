import { MapContainer, TileLayer } from "react-leaflet";
import { Marker, Popup } from "react-leaflet";
import { Icon } from "leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";

import "leaflet/dist/leaflet.css";

export default function Mapa() {

    // Ubicacion del mapa
    const markers = [
        {
            geocode: [-33.033355710, -71.532859800],
            popUp: "Estación Chorrillos, Viña del Mar"
        },
        /*{
            geocode: [48.85, 2.3522],
            popUp: "Posicion 2"
        },
        {
            geocode: [48.855, 2.3522],
            popUp: "Posicion 3"
        }*/
    ];

    const customIcon = new Icon({
        iconUrl: require("./img/marker-icon.png"),
        iconSize: [38, 38],
        iconAnchor: [12, 41],
    });

    return (
        <MapContainer
            center={[-33.033355710, -71.532859800]}
            zoom={13}
            style={{ height: "100%", width: "100%" }}
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <MarkerClusterGroup
                chunkedLoading

            >
                {markers.map(marker => (
                    <Marker
                        position={marker.geocode}
                        icon={customIcon}>
                        <Popup>
                            {marker.popUp}
                        </Popup>
                    </Marker>
                ))}
            </MarkerClusterGroup>

        </MapContainer>
    );
}