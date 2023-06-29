import L, { LatLng } from "leaflet";
import { toast } from "solid-toast";
import {
  getAllRoutes,
  getCurrentRoute,
  getMapObject,
  getPreferences,
  routePrimitiveToRoute,
  routeToRoutePrimitive,
  setAllRoutes,
  setCurrentRoute,
  updateRoutePrimitive
} from "../store/data.store";
import {
  redoStack,
  setRedoStack,
  setUndoStack,
  undoStack
} from "../store/history.store";
import { isLoading, setRoutesModalOpen } from "../store/settings.store";
import {
  RedoObject,
  Route,
  RoutePrimitive,
  UndoObject
} from "../store/utils/types";
import { MARKER_OPTIONS } from "./routeCreate";
export const onUndoClick = () => {
  const len = undoStack().length;
  const currentRoute = getCurrentRoute();
  if (len == 0 || !currentRoute) return;
  const undoObj = undoStack()[len - 1];
  setUndoStack([...undoStack().slice(0, len - 1)]);

  if (undoObj.action === "remove") {
    const currMarkers = currentRoute.path.markers;

    const markerToRemove = currMarkers[undoObj.idx];
    markerToRemove.remove();

    const newMarkers = [
      ...currMarkers.slice(0, undoObj.idx),
      ...currMarkers.slice(undoObj.idx + 1)
    ];
    const polyline = currentRoute.path.polyline;

    const redoObj: RedoObject = {
      action: "add",
      "dist": currentRoute.path.distance,
      id: undoObj.id,
      name: undoObj.name,
      idx: undoObj.idx,
      "data": [...polyline.getLatLngs()] as LatLng[],
      pos: markerToRemove.getLatLng()
    };

    polyline.setLatLngs(undoObj.data);

    setRedoStack([...redoStack(), redoObj]);

    const newRoute: Route | null =
      newMarkers.length === 0
        ? null
        : {
            ...currentRoute,
            path: {
              "distance": undoObj.dist,
              markers: newMarkers,
              latlngs: undoObj.data.map((ll) => [ll.lat, ll.lng]),
              polyline,
              turfLine: currentRoute.path.turfLine
            }
          };

    if (newRoute) updateRoutePrimitive(routeToRoutePrimitive(newRoute));

    setCurrentRoute(newRoute);
  }
};

export const onRedoClick = () => {
  const len = redoStack().length;
  const currentRoute = getCurrentRoute();
  if (len == 0) return;
  const redoObj = redoStack()[len - 1];
  setRedoStack([...redoStack().slice(0, len - 1)]);

  if (redoObj.action === "add") {
    const currMarkers = currentRoute?.path.markers ?? [];
    const idx = redoObj.idx;
    const markerToAdd = L.circleMarker(redoObj.pos, {
      ...MARKER_OPTIONS,
      fillColor: currMarkers.length === 0 ? "green" : "red"
    });
    markerToAdd.addTo(getMapObject()!);
    const newMarkers = [
      ...currMarkers
        .slice(0, redoObj.idx)
        .map((m, i) => m.setStyle({ fillColor: i != 0 ? "white" : "green" })),
      markerToAdd,
      ...currMarkers
        .slice(redoObj.idx + 1)
        .map((m, i) => m.setStyle({ fillColor: i != 0 ? "white" : "green" }))
    ];
    const currPolyline =
      currentRoute?.path.polyline ?? L.polyline([]).addTo(getMapObject()!);
    const prevLatLngs = [...currPolyline.getLatLngs()];
    currPolyline.setLatLngs(redoObj.data);

    const undoObj: UndoObject = {
      action: "remove",
      id: redoObj.id,
      name: redoObj.name,
      data: prevLatLngs as LatLng[],
      dist: currentRoute?.path.distance ?? 0,
      idx
    };

    setUndoStack([...undoStack(), undoObj]);

    const newRoute: Route = {
      id: undoObj.id,
      name: undoObj.name,
      path: {
        distance: redoObj.dist,
        latlngs: redoObj.data.map((ll) => [ll.lat, ll.lng]),
        "markers": newMarkers,
        polyline: currPolyline,
        turfLine: currentRoute?.path.turfLine ?? null
      },
      "type": getPreferences().mode,
      "short": ""
    };
    const newRoutePrimitive = routeToRoutePrimitive(newRoute);

    setCurrentRoute(newRoute);
    updateRoutePrimitive(newRoutePrimitive);
  }
};

export const changeCurrentRoute = (r: RoutePrimitive) => {
  const map = getMapObject();
  if (!map) return;
  removeCurrentRoute();
  const newRoute = routePrimitiveToRoute(r);
  newRoute.path.polyline.addTo(map);
  newRoute.path.markers.forEach((m) => m.addTo(map));
  setCurrentRoute(newRoute);
  setRoutesModalOpen(false);
  toast.success(`Viewing ${r.name}`);
};

export const removeCurrentRoute = () => {
  const currentRoute = getCurrentRoute();
  if (!currentRoute) return;
  currentRoute.path.polyline.remove();
  currentRoute.path.markers.forEach((m) => m.remove());
};

export const addNewRoute = () => {
  if (isLoading()) return;
  removeCurrentRoute();
  setCurrentRoute(null);
  toast.success("Created new route!");
};

export const deleteRoutePrimitive = (r: RoutePrimitive) => {
  const currentRoute = getCurrentRoute();
  if (currentRoute && currentRoute.id === r.id) {
    removeCurrentRoute();
    setCurrentRoute(null);
  }
  const newRoutes = [...getAllRoutes().filter((rp) => rp.id !== r.id)];
  setAllRoutes(newRoutes);
};
