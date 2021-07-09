import React, { useRef, useEffect, useState } from 'react';

import { TextField, Toolbar, AppBar } from '@material-ui/core'

import mapboxgl from '!mapbox-gl';
import axios from 'axios';

// dotenv-webpack gets token from environment variable
const mapboxToken = process.env.MAPBOX_TOKEN;
mapboxgl.accessToken = mapboxToken;

export default function Map() {
  // get request to fetch coordinates on searched address
  // TODO update encodeURIComponent to variable - COMMENT IN IF NEEDED

//   useEffect(async () => {
//     try {
//       const result = await axios.get(
//         `https://api.tiles.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
//           '3000 N Clark, Chicago'
//         )}.json?access_token=${mapboxToken}`
//       );
//       // TODO update props with info instead of console log
//       // console log prints --> [longitude,latitude]
//       console.log(result.data.features[0].center);
//     } catch (error) {
//       console.log(error);
//     }
//   }, []);

  const mapContainer = useRef(null);
  const map = useRef(null);
  let [lng, setLng] = useState(-73.9855);
  let [lat, setLat] = useState(40.758);
  const [zoom, setZoom] = useState(15);

useEffect(() => {
    // sets latitude & longitude with geolocation if user gives permission
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setLat(lat = position.coords.latitude)
        setLng(lng = position.coords.longitude)
      });
    } 
    
    // if (map.current) return; // initialize map only once
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [lng, lat],
      zoom: zoom,
    });

    // geolocation button on map
    map.current.addControl(
      new mapboxgl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true,
        },
        trackUserLocation: true,
      })
    );
  });

  return (
    <div>
        <AppBar position="fixed"><TextField id="filled-basic">Search</TextField></AppBar>
      <div ref={mapContainer} className="map-container" />
    </div>
  );
}
