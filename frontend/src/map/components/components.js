import L from 'leaflet';
import React from 'react';
import { GeoJSON, Map, TileLayer, Marker, Popup} from 'react-leaflet'; //Import React-Leaflet, who provides an abstraction of Leaflet as React components.
import Control from 'react-leaflet-control';
import LocateControl from './LocateControl';
import { postData, getData } from '../ApiDataFunc';
import { customMarkerYellow, customMarkerRed } from './customMarker';
import MarkerClusterGroup from "react-leaflet-markercluster";




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


export default class UnlogMap extends React.Component {
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
      action: false
    };
  }


  //Get asynchronously the GeoJSON Object, immediately after a component is mounted
  componentDidMount() {
    
    //Connect to the api backend to get the GeoJSON Object.
    getData(this.props.mainurl + '/map/all', this.props.token)
      .then(data => this.setState({ barlist: data }))
      .catch(error => console.error('Error: \n' + error.detail))
  }

  handleLoginClick() {
    this.setState({ isLoggedIn: true });
  }

  handleLogoutClick() {
    this.setState({ isLoggedIn: false });
  }

  // provide a yellow pointer
  yellowPointer(point, latlng) {
    return L.marker(latlng, { icon: customMarkerYellow })
  }

  // provide a red pointer
  redPointer(point, latlng) {
    return L.marker(latlng, { icon: customMarkerRed })
  }

  // display the name of the bar above the marker
  // when cliqued on.
  displayBarname = (feature, layer) => {
    layer.bindPopup(
      "<h4>" + feature.properties.name + "</h4>"
      + "Address: " + feature.properties.addrhousenumber + ' ' + feature.properties.addrstreet + ', ' + feature.properties.addrpostcode
      );
  }

  // display the name of the user above the marker
  // when cliqued on.
  displayUserName = (feature, layer) => {
    layer.bindPopup("<h4>" + feature.properties.username + "</h4>");
  }

  // this fonction send a GET request after updating
  // this user position by a POST request, the GET request
  // return the best match for the user is GEOJSON format
  // that is set to the state.
  findMatch(position, token) {
    postData(this.props.mainurl + '/user/update/', position, token)
      .then(
        getData(this.props.mainurl + '/map/match/', this.props.token)
          .then(data => this.setState({ match: data, action: true }))
          .catch(error => console.error('Error: \n' + error.detail))
      )
      .catch(error => console.error('Error: \n' + error.detail));
  }

  // this fonction send a GET request and
  // return an array of user's friends data in GEOJSON format
  // that is set to the state.
  findFriends = () => {
    getData(this.props.mainurl + '/user/friends_location/', this.props.token)
      .then(data => this.setState({ friends: data }))
      .catch(error => console.error('Error: \n' + error.detail))
  }


  // this main function localize the user, run
  // the 'findMatch' & 'finFriends' method
  // and set the user's location to the state
  // in order to be rendered.
  findCoordinates = () => {
    navigator.geolocation.getCurrentPosition(
      position => {
        const location = {
          'long': position.coords.longitude,
          'lat': position.coords.latitude,
          'timestamp': position.timestamp
        }
        this.findMatch(location, this.props.token)
        this.findFriends()
        this.setState({
          user: [position.coords.latitude, position.coords.longitude]
        })
      },
      error => console.log(error.message),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
    );
  };


  //Required method to render React elements 
  render() {
    require('react-leaflet-markercluster/dist/styles.min.css');
    const position = [48.8597, 2.349];
    let button;
    let locate;
    if (this.props.is_logged) {
      locate = <LocateControl options={locateOptions} startDirectly/>;
      button = <Control position="bottomright" >
        <button onClick={
          this.findCoordinates
        } id="thebutton">
          <i className="buttontest"></i>
        </button>
      </Control>;
    }
    // eslint-disable-next-line
    let button2;
    if (this.state.isLoggedIn) {
      button2 = <LogoutButton onClick={this.handleLogoutClick} />;
    } else {
      button2 = <LoginButton onClick={this.handleLoginClick} />;
    }


    return (
      <div id="map">
        <Map center={position} zoom={13} zoomControl={false} doubleClickZoom={false}>
          <TileLayer
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
          />
          <MarkerClusterGroup disableClusteringAtZoom={15} spiderfyOnMaxZoom={false}>
            {this.state.action === true ? '' : <GeoJSON key={Math.random()} data={this.state.barlist} pointToLayer={this.yellowPointer} onEachFeature={this.displayBarname} />}
          </MarkerClusterGroup>
          {this.state.friends ? <GeoJSON key={Math.random()} data={this.state.friends} onEachFeature={this.displayUserName} /> : ''}
          {button}
          {/* {button2} */}
          {this.state.user ? <Marker position={this.state.user} icon={customMarkerRed}>
            <Popup>
              <h4> Me! </h4>
            </Popup> 
          </Marker> : ''}
          {this.state.match ? <GeoJSON key={Math.random()} data={this.state.match} pointToLayer={this.yellowPointer} onEachFeature={this.displayBarname} /> : ''}
          {/* {marker()} */}
          {locate}
        </Map>
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


























