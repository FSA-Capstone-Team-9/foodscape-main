import React, { useRef, useEffect, useState } from "react"

import { TextField, Toolbar, AppBar, Button } from "@material-ui/core"
import SimpleBackdrop from "./Backdrop"
import SimpleAccordion from "./Accordion"

import mapboxgl from "!mapbox-gl"
import axios from "axios"

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
            let price = 0
            if (business.price) {
                price = business.price.length
            }
            //convert meters to miles jackass
            let meters = Math.floor(business.distance)
            let distance = (meters / 1609.344).toFixed(1)
            return {
                type: "Feature",
                properties: {
                    title: business.name,
                    rating: business.rating,

                    // popover formatting
                    popoverDescription: `<h2>${business.name}</h2>
                    <img src="${business.image_url}" class="popover-img"/>
                    <h3>Distance: ${distance}mi</h3>
                    <h4>Price: ${business.price}</h4>
                    <h4>Rating: ${business.rating}</h4>
                    `,

                    price: price,
                    priceString: business.price,
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
        //.sort((a, b) => b.properties.price - a.properties.price)
        //.sort((a, b) => b.properties.rating - a.properties.rating)
    }

    // get yelp restaurant data
    // TODO - Does this need other paramters?
    async function getRestaurants(coordinates) {
        try {
            //make term string here
            //const term = ....
            const searchRequest = {
                // Default term = food
                term: "food", // term:term,
                latitude: coordinates[1],
                longitude: coordinates[0],
                radius: 4000,
                limit: 40,
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
            console.log("test", restaurants)
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
        searchBar.on("result", async function (event) {
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

        const layers = {
            layers: ["restaurants-1", "restaurants-2", "restaurants-3"],
        }
        // Mouse pointer functionality - onmouseenter, change cursor
        map.current.on("mouseenter", "restaurants-1", function () {
            map.current.getCanvas().style.cursor = "pointer"
        })
        map.current.on("mouseenter", "restaurants-2", function () {
            map.current.getCanvas().style.cursor = "pointer"
        })
        map.current.on("mouseenter", "restaurants-3", function () {
            map.current.getCanvas().style.cursor = "pointer"
        })

        // Change it back to a pointer when it leaves.
        map.current.on("mouseleave", "restaurants-1", function () {
            map.current.getCanvas().style.cursor = ""
        })
        map.current.on("mouseleave", "restaurants-2", function () {
            map.current.getCanvas().style.cursor = ""
        })
        map.current.on("mouseleave", "restaurants-3", function () {
            map.current.getCanvas().style.cursor = ""
        })
        // OnClick functionality - open popup
        map.current.on("click", "restaurants-1", function (e) {
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
        map.current.on("click", "restaurants-2", function (e) {
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
        map.current.on("click", "restaurants-3", function (e) {
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
            // Add source data
            map.current.addSource("restaurants", {
                type: "geojson",
                data: {
                    type: "FeatureCollection",
                    features: transformJSON(),
                },
            })

            // Comparison Expressions for ratings
            const rating1 = ["<", ["get", "rating"], 3]
            const rating2 = [
                "all",
                [">=", ["get", "rating"], 3],
                ["<", ["get", "rating"], 3.5],
            ]
            const rating3 = [
                "all",
                [">=", ["get", "rating"], 3.5],
                ["<", ["get", "rating"], 4],
            ]
            const rating4 = [
                "all",
                [">=", ["get", "rating"], 4],
                ["<", ["get", "rating"], 4.5],
            ]
            const rating5 = [">=", ["get", "rating"], 4.5]

            // colors to use for the categories
            const colors = [
                "#eb3434",
                "#eb3434",
                "#eb9c34",
                "#e8eb34",
                "#00ff00",
            ]
            // test layer 1
            map.current.addLayer({
                id: "restaurants-1",
                type: "circle",
                source: "restaurants",
                paint: {
                    "circle-color": [
                        "case",
                        rating1,
                        colors[0],
                        rating2,
                        colors[1],
                        rating3,
                        colors[2],
                        rating4,
                        colors[3],
                        colors[4],
                    ],
                    "circle-radius": [
                        "step",
                        ["get", "price"],
                        10,
                        1,
                        20,
                        2,
                        30,
                        3,
                        40,
                        4,
                        5,
                    ],
                    "circle-stroke-width": 1,
                    "circle-stroke-color": "#000000",
                    "circle-opacity": 0.45,
                },
                layout: {
                    visibility: "visible",
                },
            })

            // test layer 2
            map.current.addLayer({
                id: "restaurants-2",
                type: "circle",
                source: "restaurants",
                // minzoom: 14,
                paint: {
                    "circle-color": [
                        "match",
                        ["get", "price"],
                        1,
                        colors[4],
                        2,
                        colors[3],
                        3,
                        colors[2],
                        4,
                        colors[1],
                        /* other */ "#000000",
                    ],

                    "circle-radius": [
                        "step",
                        ["get", "rating"],
                        10,
                        3,
                        20,
                        3.5,
                        30,
                        4,
                        40,
                        4.5,
                        50,
                        5,
                        5,
                    ],
                    "circle-stroke-width": 1,
                    "circle-stroke-color": "#000000",
                    "circle-opacity": 0.45,
                },
                layout: {
                    visibility: "none",
                },
            })

            // test layer 3
            map.current.addLayer({
                id: "restaurants-3",
                type: "circle",
                source: "restaurants",
                // minzoom: 14,
                paint: {
                    "circle-color": [
                        "case",
                        rating1,
                        colors[0],
                        rating2,
                        colors[1],
                        rating3,
                        colors[2],
                        rating4,
                        colors[3],
                        colors[4],
                    ],
                    "circle-radius": {
                        base: 1.75,
                        stops: [
                            [12, 20],
                            [22, 90],
                        ],
                    },
                    "circle-stroke-width": 1,
                    "circle-stroke-color": "#000000",
                    "circle-opacity": 0.45,
                },
                layout: {
                    visibility: "none",
                },
            })

            // symbol layer to go with test layer 3
            map.current.addLayer({
                id: "restaurant-price",
                type: "symbol",
                source: "restaurants",
                // minzoom: 14,
                layout: {
                    "text-field": "{priceString}",
                    "text-font": [
                        "DIN Offc Pro Medium",
                        "Arial Unicode MS Bold",
                    ],
                    "text-size": 16,
                    visibility: "none",
                },
            })
        })
    })

    function onButtonChange(clickedLayer) {
        map.current.setLayoutProperty(clickedLayer, "visibility", "visible")
        switch (clickedLayer) {
            case "restaurants-1":
                map.current.setLayoutProperty(
                    "restaurants-2",
                    "visibility",
                    "none"
                )
                map.current.setLayoutProperty(
                    "restaurants-3",
                    "visibility",
                    "none"
                )
                map.current.setLayoutProperty(
                    "restaurant-price",
                    "visibility",
                    "none"
                )
                break
            case "restaurants-2":
                map.current.setLayoutProperty(
                    "restaurants-1",
                    "visibility",
                    "none"
                )
                map.current.setLayoutProperty(
                    "restaurants-3",
                    "visibility",
                    "none"
                )
                map.current.setLayoutProperty(
                    "restaurant-price",
                    "visibility",
                    "none"
                )
                break
            case "restaurants-3":
                map.current.setLayoutProperty(
                    "restaurants-2",
                    "visibility",
                    "none"
                )
                map.current.setLayoutProperty(
                    "restaurants-1",
                    "visibility",
                    "none"
                )
                map.current.setLayoutProperty(
                    "restaurant-price",
                    "visibility",
                    "visible"
                )
                break
            default:
                console.log("error")
                break
        }
    }

    return (
        <div>
            <div ref={mapContainer} className="map-container" />
            {!window.localStorage.getItem("hasVisited") && (
                <div>Display Tutorial</div>
            )}
            <SimpleBackdrop />
            <SimpleAccordion
                onChange={clickedLayer => onButtonChange(clickedLayer)}
            />
        </div>
    )
}
