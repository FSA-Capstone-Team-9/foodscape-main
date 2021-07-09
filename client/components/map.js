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
            style: `mapbox://styles/huckcg/ckqtv2u0z0mo817qmdvmrn9hg/draft`,
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
        console.log(map.current.source)
        map.current.on("load", function () {
            map.current.addSource("drone", {
                type: "geojson",
                data: {
                    type: "FeatureCollection",
                    features: [
                        {
                            type: "Feature",
                            properties: {},
                            geometry: {
                                type: "Point",
                                coordinates: [
                                    -76.53063297271729, 39.18174077994108,
                                ],
                            },
                        },
                    ],
                },
            })
            map.current.addLayer({
                id: "drone",
                type: "symbol",
                source: "drone",
                layout: {
                    // This icon is a part of the Mapbox Streets style.
                    // To view all images available in a Mapbox style, open
                    // the style in Mapbox Studio and click the "Images" tab.
                    // To add a new image to the style at runtime see
                    // https://docs.mapbox.com/mapbox-gl-js/example/add-image/
                    "icon-image": "rocket-15",
                },
            })
        })
    })

    return (
        <div>
            <div ref={mapContainer} className="map-container" />
        </div>
    )
}
