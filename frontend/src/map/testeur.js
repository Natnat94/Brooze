import React from 'react';


function success(pos) {
  const crd = pos.coords;

  console.log('Your current position is:');
  console.log(`Latitude : ${crd.latitude}`);
  console.log(`Longitude: ${crd.longitude}`);
  console.log(`More or less ${crd.accuracy} meters.`);
}

function errors(err) {
  console.warn(`ERROR(${err.code}): ${err.message}`);
  console.log("Geolocation is not supported by this browser.");
}
function getLocation() {
  return new Promise((success, error) => { navigator.geolocation.getCurrentPosition(success, error); })

}