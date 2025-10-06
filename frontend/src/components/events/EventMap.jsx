import React from 'react';

// This is a simplified version. In a real application, you would use a mapping library like Leaflet or Google Maps
function EventMap({ location }) {
  return (
    <div className="w-full h-full bg-muted relative overflow-hidden rounded-lg border">
      <div className="absolute inset-0 flex items-center justify-center flex-col">
        <div className="text-4xl mb-4">🗺️</div>
        <p className="text-center text-muted-foreground">
          Map view for {location.address}
          <br />
          <span className="text-sm">(Lat: {location.lat}, Lng: {location.lng})</span>
        </p>
      </div>
      
      {/* In a real implementation, you would use something like: */}
      {/* 
      <MapContainer 
        center={[location.lat, location.lng]} 
        zoom={13} 
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[location.lat, location.lng]}>
          <Popup>{location.address}</Popup>
        </Marker>
      </MapContainer>
      */}
    </div>
  );
}

export default EventMap;