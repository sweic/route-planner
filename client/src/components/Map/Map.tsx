import "leaflet/dist/leaflet.css";
import { onMount } from "solid-js";
import { buildMap } from "../../api/map";

function Map() {
  let mapDiv: any;
  onMount(() => buildMap(mapDiv));
  return <div ref={mapDiv} id="main-map" />;
}

export default Map;

// var latlngs = [
//   [1.3516088365134904, 103.77097606658937],
//   [1.3539268555661126, 103.76998901367189],
//   [1.3560624359724394, 103.76903414726257],
// ] as [number, number][];

// var polyline = L.polyline(latlngs, { color: "blue" });
// polyline.addTo(map);

// L.marker([1.3516088365134904, 103.77097606658937]).addTo(map);
