import React, { useRef, useEffect, useState } from "react"
import mapboxgl from "!mapbox-gl"
import axios from "axios"

// dotenv-webpack gets token from environment variable
const mapboxToken = process.env.MAPBOX_TOKEN
mapboxgl.accessToken = mapboxToken

export default function Map() {
    // get request to fetch coordinates on searched address
    // TODO update encodeURIComponent to variable - COMMENT IN IF NEEDED

    // useEffect(async () => {
    //   try {
    //     const result = await axios.get(
    //       `https://api.tiles.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
    //         '3000 N Clark, Chicago'
    //       )}.json?access_token=${mapboxToken}`
    //     );
    //     // TODO update props with info instead of console log
    //     // console log prints --> [longitude,latitude]
    //     console.log(result.data.features[0].center);
    //   } catch (error) {
    //     console.log(error);
    //   }
    // }, []);

    var url = "https://wanderdrone.appspot.com/"
    const mapContainer = useRef(null)
    const map = useRef(null)
    const [lng, setLng] = useState(-73.9855)
    const [lat, setLat] = useState(40.758)
    const [zoom, setZoom] = useState(15)

    function transformJSON(businesses) {
        const geoJSONBusinesses = [...businesses]
        geoJSONBusinesses.forEach(business => {
            //Transform here
            return {
                type: "Feature",
                properties: {
                    title: business.name,
                    rating: business.rating,
                    price: business.price,
                    id: business.id,
                    distance: business.distance,
                },
                geometry: {
                    type: "Point",
                    coordinates: [business.longitude, business.latitude],
                },
            }
        })
        return geoJSONBusinesses
    }
    useEffect(() => {
        // TODO SAVE LOGIC IF WE WANT TO SAVE BROWSER LOCATION TO LOCAL STORAGE OR ETC
        // if set state is reset, change const to let in useState above
        // sets latitude & longitude with geolocation if user gives permission
        // if (navigator.geolocation) {
        // navigator.geolocation.getCurrentPosition((position) => {
        //   setLat(lat = position.coords.latitude)
        //   setLng(lng = position.coords.longitude)
        // });
        // }

        // initialize map only once
        if (map.current) return
        map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: "mapbox://styles/mapbox/streets-v11",
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

        // search bar with geocoder
        map.current.addControl(
            new MapboxGeocoder({
                accessToken: mapboxgl.accessToken,
                mapboxgl: mapboxgl,
                // TODO set up animation duration = 0
            })
        )

        map.current.addControl(new mapboxgl.FullscreenControl())
        map.current.addControl(new mapboxgl.NavigationControl())

        map.current.on("mouseenter", "drone", function () {
            map.current.getCanvas().style.cursor = "pointer"
        })

        // Change it back to a pointer when it leaves.
        map.current.on("mouseleave", "drone", function () {
            map.current.getCanvas().style.cursor = ""
        })
        map.current.on("click", "drone", function (e) {
            // var coordinates = e.features[0].geometry.coordinates.slice();
            // var description = e.features[0].properties.description;

            // Ensure that if the map is zoomed out such that multiple
            // copies of the feature are visible, the popup appears
            // over the copy being pointed to.
            // while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
            // coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
            // }
            console.log("hi ive been clicked")
            // new mapboxgl.Popup()
            // .setLngLat(coordinates)
            // .setHTML(description)
            // .addTo(map);
        })
        map.current.on("load", function () {
            map.current.addSource("drone", {
                type: "geojson",
                data: {
                    type: "FeatureCollection",
                    features: [
                        {
                            type: "Feature",
                            properties: {
                                title: "A",
                            },
                            geometry: {
                                type: "Point",
                                coordinates: [
                                    -76.53063297271729, 39.18174077994108,
                                ],
                            },
                        },
                        {
                            type: "Feature",
                            properties: {
                                title: "B",
                            },
                            geometry: {
                                type: "Point",
                                coordinates: [
                                    -76.03063297271729, 39.48174077994108,
                                ],
                            },
                        },
                        {
                            type: "Feature",
                            properties: {
                                title: "C",
                            },
                            geometry: {
                                type: "Point",
                                coordinates: [
                                    -76.73063297271729, 39.18174077994108,
                                ],
                            },
                        },
                        {
                            type: "Feature",
                            properties: {
                                title: "D",
                            },
                            geometry: {
                                type: "Point",
                                coordinates: [
                                    -76.51063297271729, 39.48174077994108,
                                ],
                            },
                        },
                    ],
                },
            })

            map.current.addLayer({
                id: "drone",
                type: "circle",
                source: "drone",
                // minzoom: 14,
                paint: {
                    "circle-color": "#00ff00", // Set this equal to price
                    "circle-radius": 20, // Set this equal to rating
                    // "circle-stroke-width": 3,
                    // "circle-stroke-color": "#fff",
                    "circle-opacity": 0.7,
                },
                layout: {},
            })
        })
    })

    return (
        <div>
            <div ref={mapContainer} className="map-container" />
        </div>
    )
}

/*
        {
            id: '4aF0F8w7yXX9o5_QFky_ig',
            alias: 'celestine-brooklyn',
            name: 'Celestine',
            image_url: 'https://s3-media4.fl.yelpcdn.com/bphoto/J5HuHor_cmVEG6HhQtFeDw/o.jpg',
            is_closed: false,
            url: 'https://www.yelp.com/biz/celestine-brooklyn?adjust_creative=lXwNMOnoO3qbv5EBsmc8vA&utm_campaign=yelp_api_v3&utm_medium=api_v3_business_search&utm_source=lXwNMOnoO3qbv5EBsmc8vA',
            review_count: 227,
            categories: [ [Object], [Object] ],
            rating: 4,
            coordinates: { latitude: 40.704676, longitude: -73.987975 },
            transactions: [ 'delivery' ],
            price: '$$$',
            location: {
                address1: '1 John St',
                address2: '',
                address3: null,
                city: 'Brooklyn',
                zip_code: '11201',
                country: 'US',
                state: 'NY',
                display_address: [Array]
            },
            phone: '+17185225356',
            display_phone: '(718) 522-5356',
            distance: 539.4069533813018
    }
        */
