import React, { useRef, useEffect, useState } from 'react';

import { TextField, Toolbar, AppBar, Button } from '@material-ui/core'
import SimpleBackdrop from './Backdrop';
import SwipeableTemporaryDrawer from './Drawer';

import mapboxgl from '!mapbox-gl';
import axios from 'axios';

// dotenv-webpack gets token from environment variable
const mapboxToken = process.env.MAPBOX_TOKEN
mapboxgl.accessToken = mapboxToken

export default function Map() {
    const mapContainer = useRef(null)
    const map = useRef(null)
    const [lng, setLng] = useState(-73.9855)
    const [lat, setLat] = useState(40.758)
    const [zoom, setZoom] = useState(15)
    let [restaurants, setRestaurants] = useState([])

    // Function to transform yelp api restaurant data into a GEOJSON
    function transformJSON() {
        console.log(restaurants)
        const geoJSONBusinesses = restaurants.map(business => {
            //Map over businesses here
            return {
                type: "Feature",
                properties: {
                    title: business.name,
                    rating: business.rating,

                    // popover formatting
                    popoverDescription: `<h2>${business.name}</h2>
                    <img src="${business.businessUrl}"></img>
                    <h3>Distance: ${business.distance}m</h3>
                    <h5>Price: ${business.price}</h5>
                    <h5>Rating: ${business.rating}</h5>
                    `,

                    price: business.price,
                    id: business.id,
                    distance: business.distance,
                    url: business.url,
                },
                geometry: {
                    type: "Point",
                    coordinates: [
                        business.coordinates.longitude,
                        business.coordinates.latitude,
                    ],
                },
            }
        })
        return geoJSONBusinesses
    }

    // get yelp restaurant data
    // TODO - Does this need other paramters?
    async function getRestaurants(coordinates) {
        try {
            //make term string here
            //const term = ....
            const searchRequest = {
                // Default term = food
                term: "food, bar, restaurant", // term:term,
                latitude: coordinates[1],
                longitude: coordinates[0],
                radius: 4000,
            }
            const { data } = await axios.post("/api/yelp", searchRequest)
            return data
        } catch (error) {
            console.log(error)
        }
    }

    // Set data source to include new restaurant data
    function setSourceData() {
        let newData = transformJSON()
        console.log(newData)
        map.current.getSource("restaurants").setData({
            type: "FeatureCollection",
            features: newData,
        })
    }

    useEffect(() => {
        // initialize map only once
        if (map.current) return
        map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: "mapbox://styles/mapbox/light-v10",
            center: [lng, lat],
            zoom: zoom,
        })

        // geolocation button on map
        const geolocate = new mapboxgl.GeolocateControl({
            positionOptions: {
                enableHighAccuracy: true,
            },
            trackUserLocation: true,
            fitBoundsOptions: { duration: 0 },
            showAccuracyCircle: false,
        })
        map.current.addControl(geolocate)
        // trigger geolocation on load if user gives permission
        map.current.on("load", function () {
            geolocate.trigger()
        })
        // after geolocate triggers on load, get new restaurant data and transform
        // current dataset
        geolocate.once("geolocate", async function (event) {
            const lng = event.coords.longitude
            const lat = event.coords.latitude
            const position = [lng, lat]
            restaurants = await getRestaurants(position)
            console.log('test', restaurants)
            setSourceData()
        })

        // Use this to determine window size
        // console.log("width:", window.innerWidth)
        // console.log("height:", window.innerHeight)

        // search bar with geocoder
        const searchBar = new MapboxGeocoder({
            accessToken: mapboxgl.accessToken,
            mapboxgl: mapboxgl,
        })

        // Searchbar control
        map.current.addControl(searchBar)
        searchBar.on("result", async function  (event) {
            restaurants = await getRestaurants(event.result.center)
            // After searching, set new source data
            setSourceData()
        // event.result = search bar results including full address and coordinates
        // event.result.center = [longitude, latitude]
        })

        // Fullscreen control
        map.current.addControl(new mapboxgl.FullscreenControl())

        // Navigation control
        map.current.addControl(new mapboxgl.NavigationControl())

        // Scale legend
        var scale = new mapboxgl.ScaleControl({
            maxWidth: 150,
            unit: "imperial",
        })
        map.current.addControl(scale)
        scale.setUnit("imperial")

        // Mouse pointer functionality - onmouseenter, change cursor
        map.current.on("mouseenter", "restaurants", function () {
            map.current.getCanvas().style.cursor = "pointer"
        })

        // Change it back to a pointer when it leaves.
        map.current.on("mouseleave", "restaurants", function () {
            map.current.getCanvas().style.cursor = ""
        })
        // OnClick functionality - open popup
        map.current.on("click", "restaurants", function (e) {
            var coordinates = e.features[0].geometry.coordinates.slice()
            var popoverDescription = e.features[0].properties.popoverDescription

            // Ensure that if the map is zoomed out such that multiple
            // copies of the feature are visible, the popup appears
            // over the copy being pointed to.
            while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360
            }

            new mapboxgl.Popup()
                .setLngLat(coordinates)
                .setHTML(popoverDescription)
                .addTo(map.current)
        })

        // On Map load
        map.current.on("load", function () {


            map.current.addSource("restaurants", {
                type: "geojson",
                data: {
                    type: "FeatureCollection",
                    features: transformJSON(),
                },
            })

            // Add layer to draw circles using restaurant source data points
            map.current.addLayer({
                id: "restaurants",
                type: "circle",
                source: "restaurants",
                // minzoom: 14,
                paint: {
                    "circle-color": "#00ff00", // Set this equal to price
                    "circle-radius": {
                        'base': 1.75,
                        'stops': [
                            [12, 10],
                            [22, 180]
                        ]
                    }, // Set this equal to rating
                    "circle-stroke-width": .6,
                    "circle-stroke-color": "#000000",
                    "circle-opacity": 0.45,
                },
                layout: {},
            })
        })
    })

    return (
        <div>
            <div ref={mapContainer} className="map-container" />
            <SimpleBackdrop />
            <Button>Bottom Text</Button>
            <Button>Bottom Text 2</Button>
            <Button></Button>
            <SwipeableTemporaryDrawer />
        </div>
    )
}
