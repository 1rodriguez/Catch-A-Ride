import L from 'leaflet'
import { MapContainer, TileLayer, useMap } from 'react-leaflet'
import 'leaflet-routing-machine'
import 'leaflet/dist/leaflet.css'
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css'
import { Box } from '@mui/system';

import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon.src,
  shadowUrl: iconShadow.src,
  iconSize: [25,41], 
  iconAnchor: [12,41],
});

L.Marker.prototype.options.icon = DefaultIcon;

type coordinates = {
    DLat:string,
    DLong:string,
    ALat:string,
    ALong:string,
}

function PostInfoMapComponent({coords}:{coords:coordinates}) {
  const map = useMap()
  const dLat = document.getElementById(`dep-latitude`)! as HTMLInputElement
  const dLong = document.getElementById(`dep-longitude`)! as HTMLInputElement
  const aLat = document.getElementById(`arr-latitude`)! as HTMLInputElement
  const aLong = document.getElementById(`arr-longitude`)! as HTMLInputElement

  var control = L.Routing.control({
      routeWhileDragging: false,
      show: false,
      addWaypoints: false,
      collapsible: false,
  }).addTo(map)

//   control.spliceWaypoints(0, 1, {latLng:L.latLng(+coords.DLat, +coords.DLong)})
//   control.spliceWaypoints(control.getWaypoints().length - 1, 1, {latLng:L.latLng(+coords.ALat, +coords.ALong)})

  function createButton(label:string, container:HTMLDivElement) {
      var btn = L.DomUtil.create('button', '', container)
      btn.setAttribute('type', 'button')
      btn.innerHTML = label
      return btn
  }
  
  map.on('click', function(e) {
      var container = L.DomUtil.create('div')
      var startBtn = createButton('Set Departure Location', container)
      var destBtn = createButton('Set Arrival Location', container)
  
      L.popup()
          .setContent(container)
          .setLatLng(e.latlng)
          .openOn(map)

      L.DomEvent.on(startBtn, 'click', function() {
          control.spliceWaypoints(0, 1, {latLng:e.latlng})
          dLat.value = control.getWaypoints()[0].latLng.lat.toString()
          dLong.value = control.getWaypoints()[0].latLng.lng.toString()
          map.closePopup()
      })  

      L.DomEvent.on(destBtn, 'click', function() {
          control.spliceWaypoints(control.getWaypoints().length - 1, 1, {latLng:e.latlng})
          aLat.value = control.getWaypoints()[1].latLng.lat.toString()
          aLong.value = control.getWaypoints()[1].latLng.lng.toString()
          map.closePopup()
      })
  }); 

  return null;
}

const PostMap = (coords:coordinates) => {
  return (
      <Box>
          <MapContainer 
              style={{height: "300px", minHeight: "300px"}} 
              center={[42.986253, -81.246070]} 
              zoom={10} 
          >
              <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <PostInfoMapComponent coords={coords}/>
          </MapContainer>
      </Box>
  )
}

export default PostMap;