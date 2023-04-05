import L from 'leaflet'
import { MapContainer, TileLayer, useMap, Marker, Popup } from 'react-leaflet'
import 'leaflet-routing-machine'
import 'leaflet/dist/leaflet.css'
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css'

import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon.src,
  shadowUrl: iconShadow.src,
  iconSize: [25,41], 
  iconAnchor: [12,41],
});

L.Marker.prototype.options.icon = DefaultIcon;

type dataProps = {
  _id: string,
  driverId: number,
  departingLocation: string[],
  departingTime: string,
  arrivingLocation: string[],
  numAvailableSeats: number
}

function MapComponent({postInfo}:{postInfo:dataProps}) {
  const map = useMap()

  L.Routing.control({
      waypoints: [
          L.latLng(+postInfo.departingLocation[0], +postInfo.departingLocation[1]),
          L.latLng(+postInfo.arrivingLocation[0], +postInfo.arrivingLocation[1])
      ],
      addWaypoints: false,
      fitSelectedRoutes: true,
      show: false,
      draggableWaypoints: false,
  }).addTo(map)

  return null
}

const StaticPostMap = ({postInfo}:{postInfo:dataProps}) => {
  return (
    <MapContainer 
      style={{height: "100%", minHeight: "100%"}} 
      center={[(+postInfo.departingLocation[0] + +postInfo.arrivingLocation[0])/2, (+postInfo.departingLocation[1] + +postInfo.arrivingLocation[1])/2]} 
      zoom={10} 
    >
      <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MapComponent postInfo={postInfo}/>
      <Marker position={[+postInfo.departingLocation[0], +postInfo.departingLocation[1]]}>
          <Popup>
              Departing Here
          </Popup>
      </Marker>
      <Marker position={[+postInfo.arrivingLocation[0], +postInfo.arrivingLocation[1]]}>
          <Popup>
              Arriving Here
          </Popup>
      </Marker>
    </MapContainer>
  )
}

export default StaticPostMap;