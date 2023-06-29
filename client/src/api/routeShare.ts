import axios from "axios";
import L from "leaflet";
import { toast } from "solid-toast";
import { addNewRoutePrimitive } from "../store/data.store";
import { RouteShare, RouteShareSchema } from "../store/utils/schemas";
import { RoutePrimitive } from "../store/utils/types";
import { changeCurrentRoute } from "./routeControl";
export const getRouteShare = async () => {
  const path = window.location.pathname.split("/");
  const idx = path.indexOf("route");
  if (idx == -1 || idx + 1 >= path.length) return;

  const routeHash = path[idx + 1];
  const endpoint = `${import.meta.env.VITE_SERVER_URL}/decode/${routeHash}`;

  const resp = await axios.get(endpoint);
  if (resp.status === 200 && RouteShareSchema.safeParse(resp.data).success) {
    const routeSharePrimitive = resp.data as RouteShare;
    const newRoutePrimitive: RoutePrimitive = {
      id: crypto.randomUUID(),
      distance: routeSharePrimitive.distance,
      "latlngs": routeSharePrimitive.latlngs.map((ll) =>
        L.latLng(ll[0], ll[1])
      ),
      "markerPos": routeSharePrimitive.markers.map((ll) =>
        L.latLng(ll[0], ll[1])
      ),
      "name": "Imported Route",
      "short": routeHash,
      "type": routeSharePrimitive.route_type
    };

    toast.success("Successfully imported route");
    addNewRoutePrimitive(newRoutePrimitive);
    changeCurrentRoute(newRoutePrimitive);
  } else {
    toast.error("Unable to find shared route!");
  }

  window.history.replaceState(null, "", "/");
};
