import { Component, Show } from "solid-js";
import { Portal } from "solid-js/web";
import {
  attributionModalOpen,
  setAttributionModalOpen
} from "../../store/settings.store";
import { AiOutlineClose } from "solid-icons/ai";

const Attribution: Component = () => {
  return (
    <>
      <Show when={attributionModalOpen()}>
        <Portal>
          <div
            class="fixed left-0 top-0 z-[1001] h-full w-full bg-gray-500 opacity-75"
            onClick={() => setAttributionModalOpen(false)}
          />
        </Portal>
      </Show>
      <div
        class={`fixed inset-0 w-full h-full overflow-y-auto p-4 px-3 sm:px-4 ${
          !attributionModalOpen() && "hidden"
        } z-[1002]`}
      >
        <div class="flex justify-center items-center min-h-full ">
          <div class="w-full overflow-y-auto min-h-56 max-h-[36rem] shadow-lg bg-white rounded-md max-w-screen-sm ">
            <div class="w-full h-full px-2 py-4 sm:px-4 flex flex-col overflow-y-auto">
              <div class="w-full h-8 flex-1 flex justify-between items-center">
                <h1 class="text-xl font-bold">Map Attribution & Credits</h1>
                <div
                  class="w-8 h-8 hover:bg-gray-200 rounded-md flex justify-center items-center cursor-pointer"
                  onClick={() => setAttributionModalOpen(false)}
                >
                  <AiOutlineClose size={18} class="cursor-pointer" />
                </div>
              </div>
              <div class="border-t border-gray-300 mt-3"></div>
              <div class="w-full h-full pt-2">
                <ul class="space-y-4">
                  <li>
                    Map Tiles and Data -{" "}
                    <a
                      class="text-blue-500 hover:text-blue-700 hover:underline"
                      href="https://stadiamaps.com/"
                      target="_blank"
                    >
                      Stadia Maps
                    </a>
                    , ©{" "}
                    <a
                      class="text-blue-500 hover:text-blue-700 hover:underline"
                      href="https://openmaptiles.org/"
                      target="_blank"
                    >
                      OpenMapTiles
                    </a>
                    , ©{" "}
                    <a
                      class="text-blue-500 hover:text-blue-700 hover:underline"
                      href="https://openstreetmap.org"
                      target="_blank"
                    >
                      OpenStreetMap
                    </a>{" "}
                  </li>
                  <li>
                    Routing Engine -{" "}
                    <a
                      class="text-blue-500 hover:text-blue-700 hover:underline"
                      href="https://project-osrm.org/"
                      target="_blank"
                    >
                      Project OSRM
                    </a>{" "}
                  </li>
                  <li>
                    Search Geocoding -{" "}
                    <a
                      class="text-blue-500 hover:text-blue-700 hover:underline"
                      href="https://www.arcgis.com/index.html/"
                      target="_blank"
                    >
                      ArcGIS
                    </a>{" "}
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Attribution;
