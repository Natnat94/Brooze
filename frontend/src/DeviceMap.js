import React from 'react';
import { Map, Marker, Popup, TileLayer, GeoJSON } from 'react-leaflet';
import L from 'leaflet';
import Control from 'react-leaflet-control';

const customMarker = new L.icon({
  iconUrl: "https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-yellow.png",
  iconSize: [25, 41],
  iconAnchor: [10, 41],
  popupAnchor: [2, -40]
});


export class DeviceMap extends React.Component {
  constructor() {
    super();
    this.state = {
      lat: 48.856613,
      lng: 2.352222,
      zoom: 14,
      geodata: []
    };
  }

  //https://techiediaries.com/react-ajax
  // Get the data from the django API
  componentDidMount() {
    fetch('http://127.0.0.1:8000/data.geojson')
      .then(response => response.json())
      .then(data => this.setState({ geodata: data }));
  }

  render() {
    // Trying here to set that the first object coordinate in geodata is the center position of the map
    var t = "";
    var x = "";
    var y = "";
    for (t in this.state.geodata.features) {
      y = this.state.geodata.features[0].geometry.coordinates[0];
      x = this.state.geodata.features[0].geometry.coordinates[1];
    }
    // for up here, we need to find a better way to do it
    const position = [x, y];
    return (
      <Map center={position} zoom={this.state.zoom} scrollWheelZoom={true} doubleClickZoom={false}>
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url='http://{s}.tile.osm.org/{z}/{x}/{y}.png'
        />

        {/* add a button that will be our main button control */}
        <Control position="bottomright" >
          <button onClick={() => console.log("the button is clicked")}>
            <i class="fa fa-smile-o fa-2x"></i>
          </button>
        </Control>
        <GeoJSON key={this.state.geodata} data={this.state.geodata} pointToLayer={this.pointToLayer} onEachFeature={this.onEachFeature} />
      </Map>
    );
  }
  onEachFeature = (feature, layer) => {
    layer.bindPopup("<h2>" + feature.properties.name + "</h2>");
  }
  pointToLayer(point, latlng) {
    console.log(point.properties.name)
    return L.marker(latlng, { icon: customMarker })
  }
}

export default DeviceMap