import { onMount, type Component } from "solid-js";

import { Toaster } from "solid-toast";
import Controls from "./components/Controls/Controls";
import Map from "./components/Map/Map";
import RoutesViewer from "./components/Routes/RoutesViewer";
import { getRouteShare } from "./api/routeShare";
import Attribution from "./components/Attribution/Attribution";

const App: Component = () => {
  onMount(() => {
    getRouteShare();
  });

  return (
    <>
      <Toaster position="top-center" />
      <Controls />
      <RoutesViewer />
      <Attribution />
      <Map />
    </>
  );
};

export default App;
