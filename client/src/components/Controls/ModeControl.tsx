import type { Component } from "solid-js";
import { BiRegularRun } from "solid-icons/bi";
import { IoBicycleSharp } from "solid-icons/io";
import { FaSolidExpand } from "solid-icons/fa";
import {
  getCurrentRoute,
  getMapObject,
  getPreferences,
  setMode
} from "../../store/data.store";
const ModeControl: Component = () => {
  const currentMode = () => getPreferences().mode;
  return (
    <div class="absolute z-[1000] left-2 bottom-2 sm:left-4 sm:bottom-4">
      <div class="bg-white h-8 flex rounded-md shadow-md">
        <div
          class={`flex w-12 justify-center items-center h-full cursor-pointer hover:bg-gray-200 shadow-md rounded-tl-md rounded-bl-md ${
            currentMode() == "foot" ? "bg-gray-200" : "bg-white"
          }`}
          onClick={() => setMode("foot")}
        >
          <BiRegularRun class="w-5 h-5 stroke-2 fill-gray-500" />
        </div>
        <div
          class={`flex w-12 justify-center items-center h-full cursor-pointer hover:bg-gray-200 shadow-md ${
            currentMode() == "bicycle" ? "bg-gray-200" : "bg-white"
          }`}
          onClick={() => setMode("bicycle")}
        >
          <IoBicycleSharp class="w-6 h-6 fill-gray-500 " />
        </div>
        <div
          class="flex w-12 bg-white justify-center items-center h-full cursor-pointer hover:bg-gray-200 shadow-md rounded-tr-md rounded-br-md"
          onClick={() =>
            getMapObject()?.fitBounds(
              getCurrentRoute()?.path.polyline.getBounds()!
            )
          }
        >
          <FaSolidExpand class="w-6 h-6 fill-gray-500" />
        </div>
      </div>
    </div>
  );
};

export default ModeControl;
