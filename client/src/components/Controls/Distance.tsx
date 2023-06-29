import type { Component } from "solid-js";
import { getCurrentRoute } from "../../store/data.store";
import { distMetric, setDistMetric } from "../../store/history.store";
const Distance: Component = () => {
  const dist = () =>
    getCurrentRoute()
      ? getCurrentRoute()?.path.distance! /
        (distMetric() == "kilometre" ? 1000 : 1609)
      : 0;
  return (
    <div class="absolute z-[1000] bottom-5 right-2 sm:bottom-6 sm:right-4 ">
      <div
        class="bg-gray-100 h-19 pb-2 px-2 pl-1 rounded-lg flex justify-center items-center cursor-pointer hover:bg-gray-200 opacity-90 shadow-md "
        onClick={() =>
          setDistMetric(distMetric() == "kilometre" ? "mile" : "kilometre")
        }
      >
        <h1 class="text-5xl font-medium tracking-tighter select-none sm:text-7xl ">
          {dist() == 0 ? 0 : dist().toFixed(2)}{" "}
          {distMetric() == "kilometre" ? "km" : "mi"}
        </h1>
      </div>
    </div>
  );
};

export default Distance;
