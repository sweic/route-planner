import { Feature, LineString } from "@turf/turf";
import {
  CircleMarker,
  Map,
  Marker,
  Polyline,
  LatLng as LatLngLeaflet
} from "leaflet";
export type LatLng = [number, number];
export interface PathObject {
  latlngs: LatLng[]; // raw coords
  markers: CircleMarker[]; // marker of each coords
  polyline: Polyline; // polyline drawn on map
  turfLine: Feature<LineString> | null; // calculate distance from origin
  distance: number;
}

export type Mode = "foot" | "bicycle";

export interface Route {
  id: string;
  path: PathObject;
  name: string;
  type: Mode | "mixed";
  short: string;
}

export interface RoutePrimitive {
  id: string;
  name: string;
  latlngs: LatLngLeaflet[];
  markerPos: LatLngLeaflet[];
  distance: number;
  type: Mode | "mixed";
  short: string;
}

export interface Preferences {
  mode: Mode | "mixed";
  centre: LatLng;
  zoom: number;
}

export interface AppData {
  routes: RoutePrimitive[];
  preferences: Preferences;
  map: Map | null;
  currentRoute: Route | null;
}

export interface UndoObject {
  // Remove = When user clicks a new point
  // Add = User removes last point
  action: "remove" | "add";
  id: string;
  name: string;
  idx: number; // If action is add. If this idx is not the last idx, add point in the middle
  data: LatLngLeaflet[];
  dist: number;
}

export interface RedoObject extends UndoObject {
  pos: LatLngLeaflet;
}

export interface History {
  undoStack: UndoObject[];
  redoStack: RedoObject[];
  distanceMetric: "kilometre" | "mile";
}
