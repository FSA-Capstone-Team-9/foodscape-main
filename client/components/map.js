import React, { useRef, useEffect, useState } from 'react';
// TODO
// import 'mapbox-gl/dist/mapbox-gl.css';
// import '../../public/style.css';

import mapboxgl from '!mapbox-gl';
import axios from 'axios';

// dotenv-webpack gets token from environment variable
const mapboxToken = process.env.MAPBOX_TOKEN;
mapboxgl.accessToken = mapboxToken;

export default function Map() {
  // get request to fetch coordinates on searched address
  // TODO update encodeURIComponent to variable
  useEffect(async () => {
    try {
      const result = await axios.get(
        `https://api.tiles.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
          '3000 N Clark, Chicago'
        )}.json?access_token=${mapboxToken}`
      );
      // TODO update props with info instead of console log
      // console log prints --> [longitude,latitude]
      console.log(result.data.features[0].center);
    } catch (error) {
      console.log(error);
    }
  }, []);

  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng, setLng] = useState(-73.9855);
  const [lat, setLat] = useState(40.758);
  const [zoom, setZoom] = useState(15);

  useEffect(() => {
    if (map.current) return; // initialize map only once
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [lng, lat],
      zoom: zoom,
    });
  });

  return (
    <div>
      <div ref={mapContainer} className="map-container" />
    </div>
  );
}
