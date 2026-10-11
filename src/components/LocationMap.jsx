import { useEffect, useMemo } from "react";
import {
  CircleMarker,
  MapContainer,
  TileLayer,
  Tooltip,
  useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";

const DEFAULT_CENTER = [20, 0];
const DEFAULT_ZOOM = 2;
const LOCATION_ZOOM = 8;

/**
 * Handles map clicks and keeps the viewport aligned with the selected location.
 *
 * @param {Object} props - Component props.
 * @param {number[] | null} props.position - Selected [latitude, longitude].
 * @param {(latitude: number, longitude: number) => void} props.onSelect - Selection callback.
 * @returns {null} This controller does not render UI.
 */
function MapController({ position, onSelect }) {
  const map = useMapEvents({
    click(event) {
      onSelect(event.latlng.lat, event.latlng.lng);
    },
  });

  useEffect(() => {
    if (!position) return;

    map.flyTo(position, Math.max(map.getZoom(), LOCATION_ZOOM), {
      duration: 0.7,
    });
  }, [map, position]);

  return null;
}

/**
 * Renders an interactive map for selecting weather coordinates.
 *
 * @param {Object} props - Component props.
 * @param {{lat: number, lon: number} | null} props.position - Selected position.
 * @param {string} props.locationName - OpenWeather location name for the marker.
 * @param {(latitude: number, longitude: number) => void} props.onSelect - Selection callback.
 * @returns {JSX.Element} The interactive map.
 */
export default function LocationMap({ position, locationName, onSelect }) {
  const mapPosition = useMemo(() => {
    if (!position) return null;

    return [Number(position.lat), Number(position.lon)];
  }, [position]);

  return (
    <div className="location-map-frame">
      <MapContainer
        center={mapPosition || DEFAULT_CENTER}
        zoom={mapPosition ? LOCATION_ZOOM : DEFAULT_ZOOM}
        minZoom={2}
        maxZoom={18}
        scrollWheelZoom
        className="location-map"
        aria-label="Select a weather location on the map"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
          maxZoom={19}
        />

        <MapController position={mapPosition} onSelect={onSelect} />

        {mapPosition && (
          <CircleMarker
            center={mapPosition}
            radius={8}
            pathOptions={{
              color: "var(--on-accent)",
              fillColor: "var(--accent)",
              fillOpacity: 1,
              weight: 2,
            }}
          >
            {locationName && (
              <Tooltip direction="top" offset={[0, -8]} permanent>
                {locationName}
              </Tooltip>
            )}
          </CircleMarker>
        )}
      </MapContainer>
    </div>
  );
}
