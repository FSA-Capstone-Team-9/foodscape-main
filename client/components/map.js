import React, { useRef, useEffect, useState } from "react";
import mapboxgl from "!mapbox-gl";
import axios from "axios";

import { data } from "../../data";
console.log(data);
// dotenv-webpack gets token from environment variable
const mapboxToken = process.env.MAPBOX_TOKEN;
mapboxgl.accessToken = mapboxToken;

export default function Map() {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng, setLng] = useState(-73.9855);
  const [lat, setLat] = useState(40.758);
  const [zoom, setZoom] = useState(15);
  let restaurants;

  // Function to transform yelp api restaurant data into a GEOJSON
  function transformJSON(businesses) {
    const geoJSONBusinesses = businesses.map((business) => {
      //Transform here
      return {
        type: "Feature",
        properties: {
          title: business.name,
          rating: business.rating,

          popoverDescription: `<h2>${business.name}</h2><p>Did you know that 1 out of 100 Albanians are actually Joshuas?</p>
                    <h3>${business.distance}mi</h3>`,

          price: business.price,
          id: business.id,
          distance: business.distance,
          url: "https://www.yelp.com/biz/celestine-brooklyn?adjust_creative=lXwNMOnoO3qbv5EBsmc8vA&utm_campaign=yelp_api_v3&utm_medium=api_v3_business_search&utm_source=lXwNMOnoO3qbv5EBsmc8vA",
        },
        geometry: {
          type: "Point",
          coordinates: [
            business.coordinates.longitude,
            business.coordinates.latitude,
          ],
        },
      };
    });
    return geoJSONBusinesses;
  }
  async function getRestaurants(coordinates) {
    const searchRequest = {
      term: "food",
      latitude: coordinates[1],
      longitude: coordinates[0],
      radius: 4000,
    };
    try {
      const restaurants = await axios.post("/api/yelp", searchRequest);
      console.log(restaurants.data);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    // initialize map only once
    if (map.current) return;
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v11",
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
    map.current.on("load", function () {
      geolocate.trigger();
    });
    // after geolocate triggers on load, console log coordinates
    geolocate.once("geolocate", function (event) {
      const lng = event.coords.longitude;
      const lat = event.coords.latitude;
      const position = [lng, lat];
      restaurants = getRestaurants(position);
    });
    // Use this to determine window size
    // console.log("width:", window.innerWidth)
    // console.log("height:", window.innerHeight)

    // search bar with geocoder
    const searchBar = new MapboxGeocoder({
      accessToken: mapboxgl.accessToken,
      mapboxgl: mapboxgl,
    });

    // Searchbar control
    map.current.addControl(searchBar);
    // event.result = search bar results including full address and coordinates
    // event.result.center = [longitude, latitude]
    searchBar.on("result", function (event) {
      getRestaurants(event.result.center);
    });
    // Fullscreen control
    map.current.addControl(new mapboxgl.FullscreenControl());

    // Navigation control
    map.current.addControl(new mapboxgl.NavigationControl());

    map.current.on("mouseenter", "restaurants", function () {
      map.current.getCanvas().style.cursor = "pointer";
    });

    // Change it back to a pointer when it leaves.
    map.current.on("mouseleave", "restaurants", function () {
      map.current.getCanvas().style.cursor = "";
    });
    map.current.on("click", "restaurants", function (e) {
      var coordinates = e.features[0].geometry.coordinates.slice();
      var popoverDescription = e.features[0].properties.popoverDescription;

      // Ensure that if the map is zoomed out such that multiple
      // copies of the feature are visible, the popup appears
      // over the copy being pointed to.
      while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
        coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
      }

      new mapboxgl.Popup()
        .setLngLat(coordinates)
        .setHTML(popoverDescription)
        .addTo(map.current);
    });
    map.current.on("load", function () {
      console.log("transformed", transformJSON(data));

      map.current.addSource("restaurants", {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: transformJSON(data),
        },
      });

      map.current.addLayer({
        id: "restaurants",
        type: "circle",
        source: "restaurants",
        // minzoom: 14,
        paint: {
          "circle-color": "#00ff00", // Set this equal to price
          "circle-radius": 20, // Set this equal to rating
          // "circle-stroke-width": 3,
          // "circle-stroke-color": "#fff",
          "circle-opacity": 0.7,
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
