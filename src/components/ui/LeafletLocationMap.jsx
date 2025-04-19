import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Fix marker icon issue in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: markerIcon2x,
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
});

const LeafletLocationMap = ({ onLocationSelect }) => {
  const [position, setPosition] = useState(null);
  const [address, setAddress] = useState(null); // For storing reverse geocoding result
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const coords = [pos.coords.latitude, pos.coords.longitude];
          setPosition(coords);
          if (onLocationSelect) {
            onLocationSelect(coords); // Pass the location to parent
          }

          // Fetch address using reverse geocoding
          const reverseGeocode = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${coords[0]}&lon=${coords[1]}&format=json`);
          const data = await reverseGeocode.json();
          if (data && data.address) {
            setAddress(data.address);
          }

          setLoading(false);
        },
        (error) => {
          console.error("Geolocation error:", error);
          setLoading(false);
          alert("Error fetching location, please try again.");
        }
      );
    }
  }, [onLocationSelect]);

  return (
    <div className='h-[300px] w-full rounded overflow-hidden'>
      {loading ? (
        <p>Loading your location...</p>
      ) : position ? (
        <MapContainer center={position} zoom={13} scrollWheelZoom={true} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
          />
          <Marker position={position}>
            <Popup>
              You are here! <br /> Latitude: {position[0]} <br /> Longitude: {position[1]} <br />
              {address && address.city && <span>{address.city}, {address.state}</span>}
            </Popup>
          </Marker>
        </MapContainer>
      ) : (
        <p>Unable to fetch location.</p>
      )}
    </div>
  );
};

export default LeafletLocationMap;
