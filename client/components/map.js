import React, { useRef, useEffect, useState } from "react"
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

    const mapContainer = useRef(null)
    const map = useRef(null)
    const [lng, setLng] = useState(defaultLng)
    const [lat, setLat] = useState(defaultLat)
    const [firstGeolocate, setFirstGeolocate] = useState(false)
    let restaurants = []
    const [legendValue, setLegendValue] = useState(1)
    const [options, setOptions] = useState({
        rating: 0,
        price: [],
        distance: 5,
    })

    // Function to transform yelp api restaurant data into a GEOJSON
    function transformJSON() {
        //options here
        const geoJSONBusinesses = restaurants.map(business => {
            //Map over businesses here
            let price = 0
            if (business.price) {
                price = business.price.length
            }
            //convert meters to miles
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
                    <h4>Price: ${business.price ? business.price : "-"}</h4>
                    <h4>Rating: ${business.rating}</h4>
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
        return geoJSONBusinesses
        // return applyOptions(geoJSONBusinesses)
        // [$,$$,$$$,$$$$]
        // [1, 1, 0, 0]
        //.filter((r)=>r.properties.price.length===)
        //.sort((a, b) => b.properties.price - a.properties.price)
        //.sort((a, b) => b.properties.rating - a.properties.rating)
        //.sort((a, b) => b.properties.distance - a.properties.distance)
    }
    function applyOptions(array) {
        // returns array of businesses.
        // options.price == [0, 0, 0, 0]
        // options.rating == 0
        // options.distance == 5mi
        return array.filter(restaurant => {
            if (
                options.distance >= restaurant.properties.distance &&
                restaurant.properties.rating >= options.rating
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
        } catch (error) {
            console.log(error)
        }
    }

    // Set data source to include new restaurant data
    function setSourceData() {
        let newData = transformJSON()
        map.current.getSource("restaurants").setData({
            type: "FeatureCollection",
            features: newData,
        })
    }

    useEffect(() => {
        map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: "mapbox://styles/huckcg/ckr12f5kk28ad18pjhrb713zo/draft",
            center: [lng, lat],
            zoom: defaultZoom,
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
            restaurants = await getRestaurants(position)
            setSourceData()
        })

        // search bar with geocoder
        const searchBar = new MapboxGeocoder({
            accessToken: mapboxgl.accessToken,
            mapboxgl: mapboxgl,
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
    }, [lat])

    //TODO onVizChange, onPriceChange, onRatingChange, onDistanceChange
    function onButtonChange(clickedLayer) {
        setLegendValue(clickedLayer[clickedLayer.length - 1])
        map.current.setLayoutProperty(clickedLayer, "visibility", "visible")
        switch (clickedLayer) {
            case "restaurants-1":
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

    async function handleSearchSubmit(coordinates, searchTerms) {
        restaurants = await getRestaurants(coordinates, searchTerms)
        // After searching, set new source data
        setSourceData()
        map.current.jumpTo({
            center: coordinates,
        })
        var markerHeight = 50,
            markerRadius = 10,
            linearOffset = 25
        var popupOffsets = {
            top: [0, 0],
            "top-left": [0, 0],
            "top-right": [0, 0],
            bottom: [0, -markerHeight],
            "bottom-left": [
                linearOffset,
                (markerHeight - markerRadius + linearOffset) * -1,
            ],
            "bottom-right": [
                -linearOffset,
                (markerHeight - markerRadius + linearOffset) * -1,
            ],
            left: [markerRadius, (markerHeight - markerRadius) * -1],
            right: [-markerRadius, (markerHeight - markerRadius) * -1],
        }
        new mapboxgl.Marker({
            offset: popupOffsets,
            id: "location",
            color: "#d32323",
        })
            .setLngLat(coordinates)
            .addTo(map.current)
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
            />
            <Tutorial />
            <Legend legendValue={legendValue} />
        </div>
    )
}
