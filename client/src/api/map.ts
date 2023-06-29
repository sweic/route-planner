import L, { Map } from "leaflet";
import { getPreferences, setData } from "../store/data.store";
import { routeHandler } from "./routeCreate";
import { setAttributionModalOpen } from "../store/settings.store";

export function buildMap(div: HTMLDivElement) {
  const { centre, zoom } = getPreferences();
  const map = L.map(div, {
    zoomControl: false
  }).setView(centre, zoom);

  setData("map", (s) => (s = map));

  L.control
    .zoom({
      position: "bottomleft"
    })
    .addTo(map);

  L.tileLayer(
    `https://tiles.stadiamaps.com/tiles/outdoors/{z}/{x}/{y}{r}.png?api_key=${
      import.meta.env.VITE_STADIA_API_KEY
    }`,
    {}
  ).addTo(map);

  const updateAttribution = () => {
    if (window.innerWidth < 640) {
      map.attributionControl.remove();
      L.control.attribution().addTo(map);
      map.attributionControl.addAttribution(
        `<a class="cursor-pointer" id="mapdata">Map Data</a>`
      );
    } else {
      map.attributionControl.remove();
      L.control.attribution().addTo(map);
      map.attributionControl
        .addAttribution(`© <a href="https://stadiamaps.com/">Stadia Maps</a>, © <a
      href="https://openmaptiles.org/">OpenMapTiles</a>, © <a
      href="https://openstreetmap.org">OpenStreetMap</a> contributors | <a class="cursor-pointer" id="mapdata">More</a>`);
    }
    map.attributionControl.getContainer()?.addEventListener("click", (ev) => {
      var elem = ev.target as HTMLElement;
      if (elem.tagName == "A" && elem.id === "mapdata") {
        // OPEN LOGIC HERE
        setAttributionModalOpen(true);
      }
    });
  };

  updateAttribution();

  window.addEventListener("resize", updateAttribution);

  routeHandler(map);
}
