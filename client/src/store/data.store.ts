import { lineString } from "@turf/turf";
import L, { LatLng } from "leaflet";
import { createStore, produce } from "solid-js/store";
import { MARKER_OPTIONS } from "../api/routeCreate";
import { RoutePrimitiveSchema } from "./utils/schemas";
import { getStorageValue, saveToStorage } from "./utils/storage";
import { AppData, Route, RoutePrimitive } from "./utils/types";

const initialiseStateObject = () => {
  const tmpRoutes = getStorageValue<RoutePrimitive[]>("routes");
  var result: AppData = {
    preferences: {
      centre: [1.3524258502305884, 103.82011883781246],
      zoom: 11.905461790921864,
      mode: "foot"
    },
    routes: [],
    map: null,
    currentRoute: null
  };

  if (tmpRoutes && RoutePrimitiveSchema.safeParse(tmpRoutes).success) {
    const newRoutePrimitive = tmpRoutes as RoutePrimitive[];
    result.routes = newRoutePrimitive;
  } else {
    window.localStorage.removeItem("routes");
  }

  return result;
};

export const [data, setData] = createStore<AppData>(initialiseStateObject());

export const getPreferences = () => data.preferences;
export const getAllRoutes = () => data.routes;
export const getMapObject = () => data.map;
export const getCurrentRoute = () => data.currentRoute;

export const setCurrentRoute = (a: Route | null) =>
  setData("currentRoute", (s) => (s = a));
export const setMode = (mode: "foot" | "bicycle") =>
  setData("preferences", (p) => ({ ...p, mode }));
export const setAllRoutes = (r: RoutePrimitive[]) =>
  setData("routes", (s) => (s = r));

export const addNewRoutePrimitive = (r: RoutePrimitive) =>
  setData(produce((s) => s.routes.unshift(r)));

export const findRoutePrimitive = (id: string) => {
  return getAllRoutes().findIndex((v) => v.id === id);
};

export const updateRoutePrimitive = (r: RoutePrimitive) => {
  const idx = findRoutePrimitive(r.id);
  if (idx != -1) {
    const allRoutes = getAllRoutes();
    const newRoutes = [...allRoutes];
    newRoutes[idx] = r;
    setAllRoutes(newRoutes);
    saveToStorage<RoutePrimitive[]>("routes", newRoutes);
  }
};

export const routeToRoutePrimitive = (r: Route): RoutePrimitive => {
  return {
    id: r.id,
    name: r.name,
    distance: r.path.distance,
    latlngs: r.path.polyline.getLatLngs() as LatLng[],
    markerPos: r.path.markers.map((m) => m.getLatLng()),
    type: r.type,
    short: r.short
  };
};

export const routePrimitiveToRoute = (r: RoutePrimitive): Route => {
  const newLatLngs = r.latlngs.map(
    (ll) => [ll.lat, ll.lng] as [number, number]
  );
  return {
    id: r.id,
    name: r.name,
    type: r.type,
    path: {
      distance: r.distance,
      latlngs: newLatLngs,
      polyline: L.polyline(r.latlngs),
      turfLine: lineString(newLatLngs),
      markers: r.markerPos.map((ll, idx) =>
        L.circleMarker(ll, {
          ...MARKER_OPTIONS,
          fillColor:
            idx == 0 ? "green" : idx == r.markerPos.length - 1 ? "red" : "white"
        })
      )
    },
    short: r.short
  };
};

export const clearEmptyRoutePrimitives = () => {
  const newRoutePrimitive = [
    ...getAllRoutes().filter((r) => r.latlngs.length > 1 && r.distance > 0)
  ];
  setAllRoutes(newRoutePrimitive);
  saveToStorage<RoutePrimitive[]>("routes", newRoutePrimitive);
};
