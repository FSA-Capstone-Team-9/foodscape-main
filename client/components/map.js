import React, { useRef, useEffect, useState } from 'react';
// TODO
// import 'mapbox-gl/dist/mapbox-gl.css';
// import '../../public/style.css';

import mapboxgl from '!mapbox-gl';

// TODO add mapbox api key here

export default function Map() {

    const mapContainer = useRef(null);
    const map = useRef(null);
    const [lng, setLng] = useState(-73.9855);
    const [lat, setLat] = useState(40.7580);
    const [zoom, setZoom] = useState(15);
    
    useEffect(() => {
        if (map.current) return; // initialize map only once
        map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [lng, lat],
        zoom: zoom
        });
        });

        return (<div>
            <div ref={mapContainer} className="map-container" />
            </div>)
}