import { lineString } from "@turf/turf";
import axios from "axios";
import L, { CircleMarkerOptions, LatLng, Map } from "leaflet";
import {
  addNewRoutePrimitive,
  clearEmptyRoutePrimitives,
  getCurrentRoute,
  getPreferences,
  routeToRoutePrimitive,
  setCurrentRoute,
  updateRoutePrimitive
} from "../store/data.store";
import { setRedoStack, setUndoStack, undoStack } from "../store/history.store";
import { focused, isLoading, setIsLoading } from "../store/settings.store";
import { appendToStorage } from "../store/utils/storage";
import {
  PathObject,
  Route,
  RoutePrimitive,
  UndoObject
} from "../store/utils/types";

export const routeHandler = (map: Map) => {
  map.on("click", async (e) => {
    if (isLoading() || focused()) return;

    const currentRoute = getCurrentRoute();
    const latlngs = [[e.latlng.lat, e.latlng.lng]] as [number, number][];
    const polyline = L.polyline([]);
    polyline.addTo(map);

    if (!currentRoute) {
      const id = crypto.randomUUID();
      const marker = L.circleMarker(e.latlng, {
        ...MARKER_OPTIONS,
        fillColor: currentRoute ? "red" : "green"
      })
        .addTo(map)
        .on("contextmenu", () => {});

      const newRoute: Route = {
        id,
        name: "New Route",
        path: {
          latlngs,
          markers: [marker],
          polyline,
          turfLine: null,
          distance: 0
        },
        "type": getPreferences().mode,
        "short": ""
      };

      const newRoutePrimitive = routeToRoutePrimitive(newRoute);
      const undoObject: UndoObject = {
        "action": "remove",
        data: [],
        idx: 0,
        dist: 0,
        id,
        name: newRoute.name
      };

      clearEmptyRoutePrimitives();
      setCurrentRoute(newRoute);
      setUndoStack([...undoStack(), undoObject]);
      setRedoStack([]);
      appendToStorage<RoutePrimitive>("routes", newRoutePrimitive);
      addNewRoutePrimitive(newRoutePrimitive);
      return;
    }

    const { markers, latlngs: currLatLngs } = currentRoute.path;

    const tmpPolyline = L.polyline([
      markers[markers.length - 1].getLatLng(),
      e.latlng
    ]).addTo(map);

    const tmpMarker = L.circleMarker(e.latlng, {
      ...MARKER_OPTIONS,
      fillColor: "red"
    }).addTo(map);

    if (markers.length >= 2) {
      const m = markers[markers.length - 1];
      m.setStyle({
        ...MARKER_OPTIONS,
        fillColor: "#ffffff"
      });
    }

    setIsLoading(true);

    const body = {
      "mode": "Foot",
      "coords": [currLatLngs[currLatLngs.length - 1], ...latlngs]
    };

    try {
      const resp = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/route`,
        body,

        {
          headers: {
            "Content-Type": "application/json"
          }
        }
      );
      if (resp.status === 200) {
        const dist = resp.data.distance;
        const currPolyline = currentRoute.path.polyline;
        const prevLatLngs = [...currPolyline.getLatLngs()];
        if (currPolyline.getLatLngs().length === 0)
          prevLatLngs.push(currentRoute.path.markers[0].getLatLng());
        for (const ll of resp.data.coords) currPolyline.addLatLng(ll); // Add calculated polyline
        const startPoint = resp.data.coords[0]; // Corrected starting coordinate
        const lastPoint = resp.data.coords[resp.data.coords.length - 1]; // Corrected ending coordinate
        const removeMarker = markers[markers.length - 1];

        removeMarker.remove(); // Remove wrong (possibly) starting coordinate marker
        tmpMarker.remove(); // Remove wrong (possibly) ending coordinate marker

        const startMarker = L.circleMarker(startPoint, {
          ...MARKER_OPTIONS,
          fillColor: markers.length == 1 ? "green" : "white"
        })
          .addTo(map)
          .on("contextmenu", (e) => {}); // Corrected starting marker

        const endMarker = L.circleMarker(lastPoint, {
          ...MARKER_OPTIONS,
          fillColor: currentRoute ? "red" : "green"
        })
          .addTo(map)
          .on("contextmenu", () => {}); // Corrected ending marker

        const newLatLngs = [
          ...currLatLngs.slice(0, currLatLngs.length - 2),
          ...resp.data.coords
        ];

        const newMarkers = [
          ...markers.slice(0, markers.length - 1),
          startMarker,
          endMarker
        ];

        const newPath: PathObject = {
          ...currentRoute.path,
          latlngs: newLatLngs,
          markers: newMarkers,
          turfLine: lineString(newLatLngs),
          distance: currentRoute.path.distance + dist
        };

        const undoObject: UndoObject = {
          "action": "remove",
          data: prevLatLngs as LatLng[],
          "idx": currentRoute.path.markers.length,
          dist: currentRoute.path.distance,
          id: currentRoute.id,
          name: currentRoute.name
        };

        setUndoStack([...undoStack(), undoObject]);

        const currentMode = currentRoute.type;

        const newRoute: Route = {
          ...currentRoute,
          path: newPath,
          type: currentMode != getPreferences().mode ? "mixed" : currentMode,
          short: ""
        };
        const newRoutePrimitive = routeToRoutePrimitive(newRoute);
        setCurrentRoute(newRoute);
        updateRoutePrimitive(newRoutePrimitive);
      }
    } catch (e: any) {
      console.log(e);
      // TODO: Error toast here
    } finally {
      setRedoStack([]);
      setIsLoading(false);
      tmpPolyline.remove();
      tmpMarker.remove();
    }
  });
};

export const MARKER_OPTIONS: CircleMarkerOptions = {
  fill: true,
  fillColor: "#ffffff",
  fillOpacity: 1,
  stroke: true,
  color: "#000000",
  weight: 2,
  bubblingMouseEvents: false,
  radius: 5
};
