import React, { useRef, useEffect, useState } from 'react';
import tt from '@tomtom-international/web-sdk-maps';
import './maps.css';

const TomTomMap = () => {
  const mapContainer = useRef(null);
  const mapInstance = useRef(null);
  const [coordinates, setCoordinates] = useState({});
  const keyTT = process.env.REACT_APP_TT;

  useEffect(() => {
    // Initialize the map
    mapInstance.current = tt.map({
      key: keyTT,
      container: mapContainer.current,
      center: [35, 39],
      zoom: 5.5,
    });

    // Add a click event listener to the map
    mapInstance.current.on('click', async (event) => {
      try {
        // Retrieve the clicked location's coordinates
        const { lngLat } = event;
        console.log(lngLat);
        // Fetch the reverse geocoding data from the TomTom API
        const response = await fetch(
          `https://api.tomtom.com/search/2/reverseGeocode/${lngLat.lat},${lngLat.lng}.json?key=${keyTT}`
        );

        if (!response.ok) {
          throw new Error('Reverse geocoding request failed');
        }

        const data = await response.json();

        // Log the reverse geocoding data
        const result = data.addresses[0].position.split(',');
        setCoordinates({
          longitude: result[0],
          latitude: result[1],
        });
      } catch (error) {
        console.error(error);
      }
    });

    return () => {
      // Clean up the map instance
      mapInstance.current.remove();
    };
  }, [keyTT]);

  return (
    <div>
      <div className='coordinates'>
        <div>Longitude: {coordinates.longitude}</div>{' '}
        <div>Latitude: {coordinates.latitude}</div>
      </div>
      <div ref={mapContainer} className='map' />
    </div>
  );
};

export default TomTomMap;
