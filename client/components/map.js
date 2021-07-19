import React, { useRef, useEffect, useState } from "react"

import { TextField, Toolbar, AppBar, Button } from "@material-ui/core"
import SimpleAccordion from "./Accordion"
import SearchBar from "./Search-Bar"
import Tutorial from "./Tutorial"
import Legend from "./Legend"

import mapboxgl from "!mapbox-gl"
import axios from "axios"

export default function Map() {
    // dotenv-webpack gets token from environment variable
    mapboxgl.accessToken = process.env.MAPBOX_TOKEN

    const defaultLng = -73.9855
    const defaultLat = 40.758
    const defaultZoom = 15
    const [lng, setLng] = useState(defaultLng)
    const [lat, setLat] = useState(defaultLat)
    const [firstGeolocate, setFirstGeolocate] = useState(false)
    const [legendValue, setLegendValue] = useState(1)
    const [options, setOptions] = useState({
        rating: [2.5, 5],
        price: ["0", "0", "0", "0"],
        distance: 5,
    })
    const mapContainer = useRef(null)
    const map = useRef(null)
    let [restaurants, setRestaurants] = useState([])
    let [marker, setMarker] = useState(
        new mapboxgl.Marker({
            color: "#d32323",
        })
    )
    let [popup, setPopup] = useState(
        new mapboxgl.Popup({ anchor: "left", closeButton: false })
    )

    // Function to transform yelp api restaurant data into a GEOJSON
    function transformJSON() {
        //options here
        const geoJSONBusinesses = Array.from(restaurants).map(business => {
            //Map over businesses here
            let price = 0
            if (business.price) {
                price = business.price.length
            }
            //convert meters to miles
            let meters = Math.floor(business.distance)
            let distance = (meters / 1609.344).toFixed(1)

            // convert yelp ratings to string for image url
            function stringifiedRating(rating) {
                if (Number.isInteger(rating)) {
                    return `${rating}`
                } else {
                    return `${rating.toString().split(".")[0]}_half`
                }
            }
            const imageUrl = stringifiedRating(business.rating)

            // render price in popup if price exists from yelp api
            const renderPrice = `<h4>Price: ${business.price}</h4>`

            return {
                type: "Feature",
                properties: {
                    title: business.name,
                    rating: business.rating,

                    // popover formatting
                    popoverDescription: `<div class="popover">
                            <h2>${business.name}</h2>
                            <img src="/yelp/regular_${imageUrl}.png" />
                            <div class="popover-image"><img src="${
                                business.image_url
                            }" class="popover-img"/></div>
                            <h3>Distance: ${distance}mi</h3>
                            ${business.price ? renderPrice : ""}
                            <div class="popover-footer">Find out more on <a href="${
                                business.url
                            }" target="_blank"><img src="/yelp/Logo_Stroke_RGB.png" width='50px' style="float: right;" /></a></div>
                            </div>
                            `,

                    price: price,
                    priceString: business.price ? business.price : "-",
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
        return applyOptions(geoJSONBusinesses)
        // return geoJSONBusinesses
    }
    function applyOptions(array) {
        // returns array of businesses.
        // options.price == [0, 0, 0, 0]
        // options.rating == 0
        // options.distance == 5mi
        // [$,$$,$$$,$$$$]
        // [1, 1, 0, 0]
        //.filter((r)=>r.properties.price.length===)
        //.sort((a, b) => b.properties.price - a.properties.price)
        //.sort((a, b) => b.properties.rating - a.properties.rating)
        //.sort((a, b) => b.properties.distance - a.properties.distance)

        let priceCheck = options.price.every(function (e) {
            return e == "0"
        })

        //Filters data based on options

        return array.filter(restaurant => {
            if (
                (priceCheck ||
                    options.price.includes(
                        restaurant.properties.price.toString()
                    )) &&
                restaurant.properties.rating >= options.rating[0] &&
                restaurant.properties.rating <= options.rating[1]
            ) {
                return restaurant
            }
        })
    }
    // get yelp restaurant data
    async function getRestaurants(coordinates, searchTerms = "food") {
        try {
            const searchRequest = {
                term: searchTerms,
                latitude: coordinates[1],
                longitude: coordinates[0],
                radius: 8000,
                limit: 50,
                offset: 0,
                sort_by: "best_match",
            }
            const { data } = await axios.post("/api/yelp", searchRequest)
            return data
            // return data
        } catch (error) {
            console.log(error)
        }
    }

    // Set data source to include new restaurant data
    function setSourceData() {
        // Check to see if source is created during initial render
        // On intial render, restaurants source is undefined - correct functionality
        if (map.current.getSource("restaurants")) {
            let newData = transformJSON()

            map.current.getSource("restaurants").setData({
                type: "FeatureCollection",
                features: newData,
            })
        }
    }

    useEffect(() => {
        console.log("rendering map here")
        // Create new map
        map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: "mapbox://styles/huckcg/ckr12f5kk28ad18pjhrb713zo/draft",
            center: [lng, lat],
            zoom: defaultZoom,
        })
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
                "#84ff00",
                "#00ff00",
            ]
            // viz layer 1
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
                        50,
                        5,
                        6,
                    ],
                    "circle-stroke-width": 1,
                    "circle-stroke-color": "#808080",
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
                transition: {
                    "fill-opacity-transition": {
                        duration: 300,
                        delay: 0,
                    },
                },
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
                    "circle-stroke-color": "#808080",
                    "circle-opacity": 0.45,
                },
                layout: {
                    visibility: "visible",
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
                    visibility: "visible",
                },
            })
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
            if (!firstGeolocate) {
                console.log("triggered")
                setFirstGeolocate(true)
                geolocate.trigger()
            }
        })
        // after geolocate triggers on load, get new restaurant data and transform
        // current dataset
        geolocate.once("geolocate", async function (event) {
            const lng = event.coords.longitude
            const lat = event.coords.latitude
            const position = [lng, lat]
            const data = await getRestaurants(position)
            setRestaurants(data)
            console.log(map.current.getSource("restaurants"))
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
    }, [lat])

    useEffect(() => {
        // Mouse pointer functionality - onmouseenter, change cursor
        setSourceData()
    }, [restaurants, options])

    // Map Interaction Hook
    useEffect(() => {
        map.current.on("mouseenter", "restaurants-1", function () {
            map.current.getCanvas().style.cursor = "pointer"
        })
        map.current.on("mouseenter", "restaurants-3", function () {
            map.current.getCanvas().style.cursor = "pointer"
        })

        // Change it back to a pointer when it leaves.
        map.current.on("mouseleave", "restaurants-1", function () {
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
            popup
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
            popup
                .setLngLat(coordinates)
                .setHTML(popoverDescription)
                .addTo(map.current)
        })
    })

    //TODO onVizChange, onPriceChange, onRatingChange, onDistanceChange
    function onButtonChange(clickedLayer) {
        setLegendValue(clickedLayer[clickedLayer.length - 1])
        map.current.setLayoutProperty(clickedLayer, "visibility", "visible")
        switch (clickedLayer) {
            case "restaurants-1":
                map.current.setLayoutProperty(
                    "restaurants-1",
                    "visibility",
                    "visible"
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
                    "restaurants-3",
                    "visibility",
                    "visible"
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

    // Filter Option Handler Functions
    function onPriceChange(prices) {
        setOptions({
            ...options,
            price: prices,
        })
    }
    function onRatingChange(rating) {
        if (rating[0] != options.rating[0] || rating[1] != options.rating[1]) {
            setOptions({
                ...options,
                rating,
            })
        }
    }

    async function handleSearchSubmit(coordinates, searchTerms) {
        const data = await getRestaurants(coordinates, searchTerms)
        setRestaurants(data)
        // After searching, set new source data

        map.current.jumpTo({
            center: coordinates,
        })

        marker.setLngLat(coordinates).addTo(map.current)
    }

    return (
        <div>
            {/* {!window.localStorage.getItem('hasVisited') && (
                <div>Display Tutorial</div>
            )} */}
            <div ref={mapContainer} className="map-container" />
            <SearchBar
                handleSearchSubmit={(coordinates, searchTerms) =>
                    handleSearchSubmit(coordinates, searchTerms)
                }
            />
            <SimpleAccordion
                onChange={clickedLayer => onButtonChange(clickedLayer)}
                onPriceChange={prices => onPriceChange(prices)}
                onRatingChange={rating => onRatingChange(rating)}
            />
            <Tutorial />
            <Legend legendValue={legendValue} />
        </div>
    )
}
