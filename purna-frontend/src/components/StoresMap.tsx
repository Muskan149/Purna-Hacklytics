import { useMemo, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import type { Store } from "@/lib/mock-data";
import "leaflet/dist/leaflet.css";

// Fix default marker icon in Vite/bundlers (leaflet looks for images in wrong path)
const markerIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const DEFAULT_CENTER: [number, number] = [39.8283, -98.5795]; // US center
const DEFAULT_ZOOM = 4;

function storesWithCoords(stores: Store[]): Store[] {
  return stores.filter(
    (s): s is Store & { latitude: number; longitude: number } =>
      typeof s.latitude === "number" && typeof s.longitude === "number"
  );
}

function MapBounds({ stores }: { stores: Store[] }) {
  const map = useMap();
  const withCoords = useMemo(() => storesWithCoords(stores), [stores]);
  useEffect(() => {
    if (withCoords.length === 0) return;
    if (withCoords.length === 1) {
      map.setView([withCoords[0].latitude!, withCoords[0].longitude!], 14);
      return;
    }
    const bounds = L.latLngBounds(
      withCoords.map((s) => [s.latitude!, s.longitude!] as L.LatLngTuple)
    );
    map.fitBounds(bounds, { padding: [24, 24], maxZoom: 14 });
  }, [map, withCoords]);
  return null;
}

export interface StoresMapProps {
  stores: Store[];
  selectedStoreId?: string | null;
  onStoreSelect?: (store: Store) => void;
  className?: string;
  minHeight?: number;
}

export default function StoresMap({
  stores,
  selectedStoreId,
  onStoreSelect,
  className = "",
  minHeight = 400,
}: StoresMapProps) {
  const withCoords = useMemo(() => storesWithCoords(stores), [stores]);

  const center = useMemo((): [number, number] => {
    if (withCoords.length === 0) return DEFAULT_CENTER;
    if (withCoords.length === 1)
      return [withCoords[0].latitude!, withCoords[0].longitude!];
    const sum = withCoords.reduce(
      (acc, s) => [acc[0] + s.latitude!, acc[1] + s.longitude!],
      [0, 0]
    );
    return [sum[0] / withCoords.length, sum[1] / withCoords.length];
  }, [withCoords]);

  const zoom = withCoords.length <= 1 ? 14 : 11;

  if (withCoords.length === 0) {
    return (
      <div
        className={`flex items-center justify-center rounded-2xl border border-border bg-muted/40 text-muted-foreground ${className}`}
        style={{ minHeight }}
      >
        <div className="text-center p-4">
          <p className="text-sm font-medium">No map data</p>
          <p className="text-xs">Stores with coordinates will appear here.</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`rounded-2xl border border-border overflow-hidden ${className}`}
      style={{ height: minHeight }}
    >
      <MapContainer
        center={center}
        zoom={zoom}
        className="h-full w-full rounded-2xl"
        style={{ height: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapBounds stores={stores} />
        {withCoords.map((store) => (
          <Marker
            key={store.id}
            position={[store.latitude!, store.longitude!]}
            icon={markerIcon}
            eventHandlers={
              onStoreSelect
                ? {
                    click: () => onStoreSelect(store),
                  }
                : undefined
            }
          >
            <Popup>
              <div className="text-sm">
                <p className="font-semibold">{store.name}</p>
                <p className="text-muted-foreground text-xs mt-0.5">{store.address}</p>
                <p className="text-xs mt-1">{store.distanceMiles.toFixed(1)} mi</p>
                {onStoreSelect && (
                  <button
                    type="button"
                    className="mt-2 text-xs text-primary hover:underline"
                    onClick={() => onStoreSelect(store)}
                  >
                    View details
                  </button>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
