import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { MapPin, ExternalLink, ArrowRight, Search, Loader2 } from "lucide-react";
import PurnaHeader from "@/components/PurnaHeader";
import SnapBadge from "@/components/SnapBadge";
import AvailabilityMeter from "@/components/AvailabilityMeter";
import StoresMap from "@/components/StoresMap";
import { demoSupermarkets, demoSupermarkets30332, DEMO_ZIP_SUPERMARKETS, DEMO_ZIP_30332, type Store } from "@/lib/mock-data";
import { fetchSnapStores, mapBackendSnapStoreToStore } from "@/lib/api";

const Stores = () => {
  const [zip, setZip] = useState("30058");
  const [radius, setRadius] = useState("5");
  const [snapOnly, setSnapOnly] = useState(true);
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const z = zip.replace(/\D/g, "").slice(0, 5);
    if (z.length !== 5) {
      setStores([]);
      setError(null);
      return;
    }
    setError(null);
    setLoading(true);
    fetchSnapStores(z)
      .then((list) => {
        const snapStores = list.map(mapBackendSnapStoreToStore);
        const extraStores =
          z === DEMO_ZIP_SUPERMARKETS
            ? demoSupermarkets
            : z === DEMO_ZIP_30332
              ? demoSupermarkets30332
              : [];
        const withSupermarkets = [...snapStores, ...extraStores];
        withSupermarkets.sort((a, b) => a.distanceMiles - b.distanceMiles);
        setStores(withSupermarkets);
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : "Failed to load stores");
        setStores([]);
      })
      .finally(() => setLoading(false));
  }, [zip]);

  const filtered = stores
    .filter((s) => (!snapOnly || s.supportsSNAP) && s.distanceMiles <= Number(radius))
    .sort((a, b) => a.distanceMiles - b.distanceMiles);

  return (
    <div className="min-h-screen bg-background">
      <PurnaHeader />
      <div className="container py-8">
        <h1 className="text-3xl font-bold text-foreground mb-6">Find SNAP-Friendly Stores</h1>

        {/* Search controls */}
        <div className="mb-6 flex flex-wrap items-end gap-4 rounded-2xl border border-border bg-card p-4 shadow-card">
          <div className="flex-1 min-w-[140px]">
            <Label className="text-xs">Zip code</Label>
            <div className="relative mt-1">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={zip}
                onChange={(e) => setZip(e.target.value.replace(/\D/g, "").slice(0, 5))}
                className="pl-8 rounded-xl"
                placeholder="30058"
              />
            </div>
          </div>
          <div className="w-32">
            <Label className="text-xs">Radius</Label>
            <Select value={radius} onValueChange={setRadius}>
              <SelectTrigger className="mt-1 rounded-xl"><SelectValue /></SelectTrigger>
              <SelectContent>
                {["1", "3", "5", "10"].map((r) => (
                  <SelectItem key={r} value={r}>{r} miles</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <Switch checked={snapOnly} onCheckedChange={setSnapOnly} id="snap-toggle" />
            <Label htmlFor="snap-toggle" className="text-sm">SNAP only</Label>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Store list */}
          <div className="space-y-3">
            {error && (
              <div className="rounded-2xl border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
                {error}
              </div>
            )}
            {loading && (
              <div className="rounded-2xl border border-border bg-card p-10 text-center">
                <Loader2 size={32} className="mx-auto mb-3 animate-spin text-primary" />
                <p className="text-sm text-muted-foreground">Loading nearby stores…</p>
              </div>
            )}
            {!loading && filtered.length === 0 && (
              <div className="rounded-2xl border border-border bg-card p-10 text-center">
                <MapPin size={36} className="mx-auto mb-3 text-muted-foreground/40" />
                <p className="text-sm text-muted-foreground">
                  {zip.replace(/\D/g, "").length === 5
                    ? "No stores found. Try expanding your radius or turn off “SNAP only”."
                    : "Enter a 5-digit zip code to find stores."}
                </p>
              </div>
            )}
            {!loading && filtered.map((store) => (
              <motion.div
                key={store.id}
                className="rounded-2xl border border-border bg-card p-4 shadow-card cursor-pointer hover:shadow-elevated transition-shadow"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={() => setSelectedStore(store)}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-foreground">{store.name}</h3>
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                      <MapPin size={12} /> {store.address}
                    </p>
                  </div>
                  {store.supportsSNAP && <SnapBadge />}
                </div>
                <div className="mt-2 text-xs text-muted-foreground">{store.distanceMiles.toFixed(1)} miles away</div>
                {store.availability.totalCount > 0 && (
                  <div className="mt-3">
                    <AvailabilityMeter have={store.availability.haveCount} total={store.availability.totalCount} />
                  </div>
                )}
                <div className="mt-3 flex gap-2">
                  <Button variant="outline" size="sm" className="rounded-xl text-xs gap-1" onClick={(e) => { e.stopPropagation(); setSelectedStore(store); }}>
                    <ArrowRight size={12} /> View matches
                  </Button>
                  <Button variant="outline" size="sm" className="rounded-xl text-xs gap-1" asChild>
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(store.address)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <ExternalLink size={12} /> Directions
                    </a>
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Map */}
          <div className="hidden lg:block min-h-[500px]">
            <StoresMap
              stores={filtered}
              selectedStoreId={selectedStore?.id}
              onStoreSelect={setSelectedStore}
              minHeight={500}
            />
          </div>
        </div>
      </div>

      {/* Store detail modal */}
      <Dialog open={!!selectedStore} onOpenChange={() => setSelectedStore(null)}>
        <DialogContent className="max-w-md rounded-2xl">
          {selectedStore && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  {selectedStore.name}
                  {selectedStore.supportsSNAP && <SnapBadge />}
                </DialogTitle>
              </DialogHeader>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <MapPin size={12} /> {selectedStore.address} · {selectedStore.distanceMiles.toFixed(1)} mi
              </p>
              {selectedStore.availability.totalCount > 0 && (
                <div className="mt-4">
                  <AvailabilityMeter have={selectedStore.availability.haveCount} total={selectedStore.availability.totalCount} />
                </div>
              )}

              {selectedStore.matchedIngredients.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-sm font-semibold text-foreground mb-2">Available Ingredients</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedStore.matchedIngredients.map((ing) => (
                      <Badge key={ing} variant="secondary" className="rounded-md text-xs">{ing}</Badge>
                    ))}
                  </div>
                </div>
              )}

              {selectedStore.missingIngredients.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-sm font-semibold text-foreground mb-2">Missing</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedStore.missingIngredients.map((ing) => (
                      <Badge key={ing} variant="outline" className="rounded-md text-xs text-muted-foreground">{ing}</Badge>
                    ))}
                  </div>
                </div>
              )}

              <Button
                className="mt-4 w-full rounded-xl gap-1"
                asChild
              >
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selectedStore.address)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink size={14} /> Get Directions
                </a>
              </Button>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Stores;
