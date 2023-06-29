import { createSignal } from "solid-js";
import {
  findRoutePrimitive,
  getAllRoutes,
  updateRoutePrimitive
} from "../store/data.store";
import { RoutePrimitive } from "../store/utils/types";
import axios from "axios";
import { isLoading, setIsLoading } from "../store/settings.store";
import toast from "solid-toast";

// EDIT FUNCTIONALITY

export const [editRoute, setEditRoute] = createSignal({
  id: "",
  value: ""
});

export const changeEditRoute = (r: RoutePrimitive) => {
  setEditRoute({
    id: r.id,
    value: r.name
  });
};

export const saveRoute = () => {
  const idx = findRoutePrimitive(editRoute().id);
  if (idx != -1) {
    const r = getAllRoutes()[idx];
    updateRoutePrimitive({
      ...r,
      name: editRoute().value ? editRoute().value : "New Route"
    });
  }
  setEditRoute({
    id: "",
    value: ""
  });
};

// DELETE FUNCTIONALITY

export const [deleteConfirm, setDeleteConfirm] = createSignal("");

export const confirmDelete = () => {};

export const copyShareHash = async (r: RoutePrimitive) => {
  if (r.short) {
    await navigator.clipboard.writeText(
      `${window.location.protocol}//${window.location.hostname}/route/${r.short}`
    );
    toast.success("Link copied to clipboard!");
  } else {
    if (isLoading()) return;
    setIsLoading(true);
    const endpoint = `${import.meta.env.VITE_SERVER_URL}/encode`;
    const body = {
      latlngs: r.latlngs.map((ll) => [
        parseFloat(ll.lat.toFixed(5)),
        parseFloat(ll.lng.toFixed(5))
      ]),
      markers: r.markerPos.map((ll) => [
        parseFloat(ll.lat.toFixed(5)),
        parseFloat(ll.lng.toFixed(5))
      ]),
      distance: r.distance,
      route_type: r.type
    };
    const resp = await axios.post(endpoint, body);
    if (resp.status === 200) {
      const newRoutePrimitive: RoutePrimitive = { ...r, "short": resp.data };
      updateRoutePrimitive(newRoutePrimitive);
    }
    setIsLoading(false);
    await navigator.clipboard.writeText(
      `${window.location.protocol}//${window.location.hostname}/route/${resp.data}`
    );

    toast.success("Link copied to clipboard!");
  }
};
