import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from '!mapbox-gl';
import axios from 'axios';

// dotenv-webpack gets token from environment variable
const mapboxToken = process.env.MAPBOX_TOKEN;
mapboxgl.accessToken = mapboxToken;

export default function Map() {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng, setLng] = useState(-73.9855);
  const [lat, setLat] = useState(40.758);
  const [zoom, setZoom] = useState(15);

  function transformJSON(businesses) {
    const geoJSONBusinesses = [...businesses];
    geoJSONBusinesses.forEach((business) => {
      //Transform here
      return {
        type: 'Feature',
        properties: {
          title: business.name,
          rating: business.rating,
          price: business.price,
          id: business.id,
          distance: business.distance,
        },
        geometry: {
          type: 'Point',
          coordinates: [business.longitude, business.latitude],
        },
      };
    });
    return geoJSONBusinesses;
  }

  useEffect(() => {
    // initialize map only once
    if (map.current) return;
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [lng, lat],
      zoom: zoom,
    });

    // geolocation button on map
    const geolocate = new mapboxgl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true,
      },
      trackUserLocation: true,
      fitBoundsOptions: { duration: 0 },
      showAccuracyCircle: false,
    });
    map.current.addControl(geolocate);
    // trigger geolocation on load if user gives permission
    map.current.on('load', function () {
      geolocate.trigger();
    });
    // after geolocate triggers on load, console log coordinates
    geolocate.once('geolocate', function (event) {
      const lng = event.coords.longitude;
      const lat = event.coords.latitude;
      const position = [lng, lat];
      console.log('after geolocate trigger on load, position is -->', position);
    });

    // search bar with geocoder
    const searchBar = new MapboxGeocoder({
      accessToken: mapboxgl.accessToken,
      mapboxgl: mapboxgl,
    });
    map.current.addControl(searchBar);
    // event.result = search bar results including full address and coordinates
    // event.result.center = [longitude, latitude]
    searchBar.on('result', function (event) {
      console.log('search bar result data -->', event.result);
    });

    map.current.addControl(new mapboxgl.FullscreenControl());
    map.current.addControl(new mapboxgl.NavigationControl());

    map.current.on('mouseenter', 'drone', function () {
      map.current.getCanvas().style.cursor = 'pointer';
    });

    // Change it back to a pointer when it leaves.
    map.current.on('mouseleave', 'drone', function () {
      map.current.getCanvas().style.cursor = '';
    });
    map.current.on('click', 'drone', function (e) {
      // var coordinates = e.features[0].geometry.coordinates.slice();
      // var description = e.features[0].properties.description;

      // Ensure that if the map is zoomed out such that multiple
      // copies of the feature are visible, the popup appears
      // over the copy being pointed to.
      // while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
      // coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
      // }
      console.log('hi ive been clicked');
      // new mapboxgl.Popup()
      // .setLngLat(coordinates)
      // .setHTML(description)
      // .addTo(map);
    });
    map.current.on('load', function () {
      map.current.addSource('drone', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: [
            {
              type: 'Feature',
              properties: {
                title: 'A',
              },
              geometry: {
                type: 'Point',
                coordinates: [-76.53063297271729, 39.18174077994108],
              },
            },
            {
              type: 'Feature',
              properties: {
                title: 'B',
              },
              geometry: {
                type: 'Point',
                coordinates: [-76.03063297271729, 39.48174077994108],
              },
            },
            {
              type: 'Feature',
              properties: {
                title: 'C',
              },
              geometry: {
                type: 'Point',
                coordinates: [-76.73063297271729, 39.18174077994108],
              },
            },
            {
              type: 'Feature',
              properties: {
                title: 'D',
              },
              geometry: {
                type: 'Point',
                coordinates: [-76.51063297271729, 39.48174077994108],
              },
            },
          ],
        },
      });

      map.current.addLayer({
        id: 'drone',
        type: 'circle',
        source: 'drone',
        // minzoom: 14,
        paint: {
          'circle-color': '#00ff00', // Set this equal to price
          'circle-radius': 20, // Set this equal to rating
          // "circle-stroke-width": 3,
          // "circle-stroke-color": "#fff",
          'circle-opacity': 0.7,
        },
        layout: {},
      });
    });
  });

  return (
    <div>
      <div ref={mapContainer} className="map-container" />
    </div>
  );
}
