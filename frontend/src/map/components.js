import L, { map } from 'leaflet';
import React from 'react';
import { GeoJSON, Map, TileLayer, Marker } from 'react-leaflet'; //Import React-Leaflet, who provides an abstraction of Leaflet as React components.
import Control from 'react-leaflet-control';
import LocateControl from './location_control/LocateControl';
import { postData, getData } from './ApiDataFunc';
import { customMarkerYellow, customMarkerRed } from './customMarker';

import './maprenderer.css';

const mainurl = 'http://127.0.0.1:8000'

//https://techiediaries.com/react-ajax



const locateOptions = {
  position: 'bottomright',
  flyTo: false,
  setView: 'untilPan',
  locateOptions: {
    maxZoom: 14,
    watch: true,   // if you overwrite this, visualization cannot be updated
    setView: false // have to set this to false because we have to
    // do setView manually
  },
  onActivate: () => { } // callback before engine starts retrieving locations
}




async function findMatch(position, token) {
  await postData(mainurl+'/user/update/', position, token)
    .then(data => {
      return data; // JSON data parsed by `response.json()` call
    })
    .then(console.log("la position est à jour"));
}


export class UnlogMap extends React.Component {
  constructor(props) {
    super(props);
    //Default state to initialize leaflet map. Default center to Paris with zoom to 14
    this.state = {
      lat: 48.856613,
      lng: 2.352222,
      zoom: 14,
      isLoading: true,
    };
  }


  //Get asynchronously the GeoJSON Object, immediately after a component is mounted
  async componentDidMount() {
    //Connect to the api backend to get the GeoJSON Object.
    this.json = await getData(mainurl+'/map/all', this.props.token);
    

    this.setState({
      isLoading: false
    });
  }
  //Template for rendering a loader
  renderLoading() {
    return (
      <h4>Loading...</h4>
    );
  }

  yellowPointer(point, latlng) {
    return L.marker(latlng, { icon: customMarkerYellow })
  }

  redPointer(point, latlng) {
    return L.marker(latlng, { icon: customMarkerRed })
  }

  displayBarname = (feature, layer) => {
    layer.bindPopup("<h2>" + feature.properties.name + "</h2>");
  }

  displayUserName = (feature, layer) => {
    layer.bindPopup("<h2>" + feature.properties.username + "</h2>");
  }


  //Template for rendering the GeoJSON data inside a leaflet map using react-leaflet component
  renderGeoJSON() {
    const position = [48.8597, 2.349];

    return (
      <div id="map">
        <Map center={position} zoom={13} zoomControl={false} doubleClickZoom={false}>
          <TileLayer
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
          />
          <GeoJSON key={Math.random()} data={this.json} pointToLayer={this.yellowPointer} onEachFeature={this.displayBarname} />
          <LocateControl options={locateOptions} startDirectly/>
        </Map>
      </div>
    );
  }


  //Required method to render React elements 
  render() {
    return (
      <div>
        {this.state.isLoading ? this.renderLoading() : this.renderGeoJSON()}
      </div>
    );
  }
}


function LoginButton(props) {
  return (
    <Control position="bottomright" >
      <button onClick={props.onClick}>
        Login
    </button>
    </Control>
  );
}

function LogoutButton(props) {
  return (<>
    <Control position="bottomright" >
      <button onClick={props.onClick}>
        Logout
    </button>
    </Control>

  </>
  );
}



// ---------------------------------------------------------------------------------------------------------- //

export class MapRenderer extends React.Component {
  constructor(props) {
    super(props);
    this.handleLoginClick = this.handleLoginClick.bind(this);
    this.handleLogoutClick = this.handleLogoutClick.bind(this);
    //Default state to initialize leaflet map. Default center to Paris with zoom to 14
    this.state = {
      lat: 48.856613,
      lng: 2.352222,
      zoom: 14,
      isLoading: true,
      isLoggedIn: false,
      markers: [],
      rien: false
    };
  }

  findCoordinates = () => {
    navigator.geolocation.getCurrentPosition(
      position => {
        const location = {
          'long': position.coords.longitude,
          'lat': position.coords.latitude,
          'timestamp': position.timestamp
        }
        findMatch(location, this.props.token);
        this.setState({ rien: true })
      },
      error => console.log(error.message),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
    );
  };

  handleLoginClick() {
    this.setState({ isLoggedIn: true });
  }

  handleLogoutClick() {
    this.setState({ isLoggedIn: false });
  }

  //Get asynchronously the GeoJSON Object, immediately after a component is mounted
  async componentDidMount() {
    //Connect to the api backend to get the GeoJSON Object.
    this.json = await getData('http://127.0.0.1:8000/map/all', this.props.token);
    this.userdata = await getData('http://127.0.0.1:8000/user/', this.props.token);
    this.friendata = await getData('http://127.0.0.1:8000/user/friends_list/', this.props.token);
    this.bestmatch = await getData('http://127.0.0.1:8000/map/match/', this.props.token);
    this.setState({
      lat: this.userdata.features[0].geometry.coordinates[1],
      lng: this.userdata.features[0].geometry.coordinates[0],
      isLoading: false
    });
  }
  //Template for rendering a loader
  renderLoading() {
    return (
      <h4>Loading...</h4>
    );
  }
  componentDidUpdate(prevProps, prevState) {
    if (prevState.rien !== this.state.rien) {
      this.bestmatch = getData('http://127.0.0.1:8000/map/match/', this.props.token);

      console.log('pokemons state has changed.');
    }
  }

  yellowPointer(point, latlng) {
    return L.marker(latlng, { icon: customMarkerYellow })
  }

  redPointer(point, latlng) {
    return L.marker(latlng, { icon: customMarkerRed })
  }

  displayBarname = (feature, layer) => {
    layer.bindPopup("<h2>" + feature.properties.name + "</h2>");
  }

  displayUserName = (feature, layer) => {
    layer.bindPopup("<h2>" + feature.properties.username + "</h2>");
  }


  //Template for rendering the GeoJSON data inside a leaflet map using react-leaflet component
  renderGeoJSON() {
    const position = [48.8597, 2.349];

    return (
      <div id="map">
        <Map center={position} zoom={13} zoomControl={false} doubleClickZoom={false}>
          <TileLayer
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
          />
          <GeoJSON key={Math.random()} data={this.userdata} pointToLayer={this.redPointer} onEachFeature={this.displayUserName} />
          <GeoJSON key={Math.random()} data={this.json} pointToLayer={this.yellowPointer} onEachFeature={this.displayBarname} />
          <Control position="bottomright" >
            <button onClick={
              this.findCoordinates
            }>
              <i className="fa fa-smile-o fa-2x"></i>
            </button>
          </Control>
          <LocateControl options={locateOptions} />
        </Map>
      </div>
    );
  }


  renderGeo() {
    let button;
    const match = [this.bestmatch.features[0].geometry.coordinates[1], this.bestmatch.features[0].geometry.coordinates[0]]

    if (this.state.isLoggedIn) {
      button = <LogoutButton onClick={this.handleLogoutClick} />;
    } else {
      button = <LoginButton onClick={this.handleLoginClick} />;
    }

    return (
      <div id="map">
        <Map center={match} zoom={this.state.zoom} zoomControl={false} doubleClickZoom={false} onClick={this.addMarker}>
          <TileLayer
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
          />
          <GeoJSON key={Math.random()} data={this.userdata} pointToLayer={this.yellowPointer} onEachFeature={this.displayUserName} />
          {button}
          <GeoJSON key={Math.random()} data={this.friendata} onEachFeature={this.displayUserName} />
          <Marker position={match} icon={customMarkerRed} />
        </Map>
      </div>
    );
  }
























  addMarker = (e) => {
    console.log(e)
    const { markers } = this.state
    markers.push(e.latlng)
    this.setState({ markers })
  }
  //Required method to render React elements 
  render() {
    return (
      <div>
        {this.state.isLoading ? this.renderLoading() :  this.renderGeo() }
      </div>
    );
  }



}
