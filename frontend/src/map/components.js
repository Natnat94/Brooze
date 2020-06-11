import L from 'leaflet';
import React from 'react';
import { GeoJSON, Map, TileLayer, Marker } from 'react-leaflet'; //Import React-Leaflet, who provides an abstraction of Leaflet as React components.
import Control from 'react-leaflet-control';
import LocateControl from './location_control/LocateControl';
import { postData, getData } from './ApiDataFunc';
import { customMarkerYellow, customMarkerRed } from './customMarker';

import './maprenderer.css';

let mainurl
mainurl = 'https://nathan-mimoun.live/api'
// if (process.env.NODE_ENV === 'production') {
//   mainurl = 'https://nathan-mimoun.live/api'
// } else {
//   mainurl = 'http://localhost:8000'
// }

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


export class UnlogMap extends React.Component {
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
    getData(mainurl + '/map/all', this.props.token)
      .then(data => {
        this.setState({ barlist: data });
      })
  }

  componentDidUpdate(prevState) {
    // Typical usage (don't forget to compare props):
    if (this.state.user !== prevState.user) {
      console.log('yes !')
    }
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
    layer.bindPopup("<h2>" + feature.properties.name + "</h2>");
  }

  // display the name of the user above the marker
  // when cliqued on.
  displayUserName = (feature, layer) => {
    layer.bindPopup("<h2>" + feature.properties.username + "</h2>");
  }

  // this fonction send a GET request after updating
  // this user position by a POST request, the GET request
  // return the best match for the user is GEOJSON format
  // that is set to the state.
  findMatch(position, token) {
    postData(mainurl + '/user/update/', position, token)
      .then(getData(mainurl + '/map/match/', this.props.token)
        .then(data => this.setState({ match: data })))
        .then(this.setState({ action: true }))
      ;
  }

  // this fonction send a GET request and
  // return an array of user's friends data in GEOJSON format
  // that is set to the state.
  findFriends = () => {
    getData(mainurl + '/user/friends_location/', this.props.token)
      .then(data => {
        this.setState({ friends: data })
      }
      )
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
    const position = [48.8597, 2.349];
    let button;
    if (this.props.is_logged) {
      button = <Control position="bottomright" >
        <button onClick={
          this.findCoordinates
        }>
          <i className="fa fa-smile-o fa-2x"></i>
        </button>
      </Control>;
    }

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
          {this.state.action === true ? '' : <GeoJSON key={Math.random()} data={this.state.barlist} pointToLayer={this.yellowPointer} onEachFeature={this.displayBarname} /> }
          {this.state.friends ? <GeoJSON key={Math.random()} data={this.state.friends} onEachFeature={this.displayUserName} /> : ''}
          {button}
          {/* {button2} */}
          {this.state.user ? <Marker position={this.state.user} icon={customMarkerRed} /> : ''}
          {this.state.match ? <GeoJSON key={Math.random()} data={this.state.match} pointToLayer={this.yellowPointer} onEachFeature={this.displayBarname} /> : ''}
          {/* {marker()} */}
          <LocateControl options={locateOptions} />
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


























