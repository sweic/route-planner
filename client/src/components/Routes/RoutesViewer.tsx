import {
  AiOutlineCheck,
  AiOutlineClose,
  AiOutlineDelete
} from "solid-icons/ai";
import {
  BiRegularRun,
  BiRegularShareAlt,
  BiRegularStreetView
} from "solid-icons/bi";
import { FaSolidWheelchairMove } from "solid-icons/fa";
import { IoBicycleSharp, IoLocationSharp } from "solid-icons/io";
import { Component, Match, Show, Switch, createEffect } from "solid-js";
import { Portal } from "solid-js/web";
import { getAllRoutes } from "../../store/data.store";
import { distMetric } from "../../store/history.store";
import {
  routesModalOpen,
  setRoutesModalOpen
} from "../../store/settings.store";
import {
  changeCurrentRoute,
  deleteRoutePrimitive
} from "../../api/routeControl";
import {
  changeEditRoute,
  copyShareHash,
  deleteConfirm,
  editRoute,
  saveRoute,
  setDeleteConfirm,
  setEditRoute
} from "../../api/options";
const Routes: Component = () => {
  let inputRef: HTMLInputElement;

  const enterPress = (ev: KeyboardEvent) => {
    if (ev.key === "Enter") {
      saveRoute();
    }
  };

  createEffect(() => {
    if (editRoute().id) {
      inputRef.focus();
      document.addEventListener("keypress", enterPress);
    } else {
      document.removeEventListener("keypress", enterPress);
    }
  });

  createEffect(() => {
    if (!routesModalOpen()) setDeleteConfirm("");
  });

  return (
    <>
      <Show when={routesModalOpen()}>
        <Portal>
          <div
            class="fixed left-0 top-0 z-[1001] h-full w-full bg-gray-500 opacity-75"
            onClick={() => setRoutesModalOpen(false)}
          />
        </Portal>
      </Show>
      <div
        class={`fixed inset-0 w-full h-full overflow-y-auto p-4 px-3 sm:px-4 ${
          !routesModalOpen() && "hidden"
        } z-[1002]`}
      >
        <div class="flex justify-center items-center min-h-full select-none">
          <div class="w-full overflow-y-auto min-h-80 max-h-[36rem] shadow-lg bg-white rounded-md max-w-screen-sm ">
            <div class="w-full h-full px-2 py-4 sm:px-4 flex flex-col overflow-y-auto">
              <div class="w-full flex justify-between items-center">
                <h1 class="text-xl font-bold">All Routes</h1>
                <div
                  class="w-8 h-8 hover:bg-gray-200 rounded-md flex justify-center items-center cursor-pointer"
                  onClick={() => setRoutesModalOpen(false)}
                >
                  <AiOutlineClose size={18} class="cursor-pointer" />
                </div>
              </div>
              <div class="border-t border-gray-300 mt-3"></div>

              <div>
                {getAllRoutes().map((r) => {
                  const dist =
                    r.distance / (distMetric() === "kilometre" ? 1000 : 1609);

                  return (
                    <>
                      <div class="bg-white min-h-24 w-full mt-2 flex flex-col justify-between pl-0 sm:pl-2">
                        <div class="w-full flex justify-between h-8 items-center hover:bg-gray-200">
                          <Switch
                            fallback={
                              <div
                                class="w-full h-full cursor-pointer flex items-center"
                                onClick={() => changeEditRoute(r)}
                              >
                                <h1 class="text-md sm:text-lg font-semibold w-full px-2 rounded-sm">
                                  {r.name}
                                </h1>
                              </div>
                            }
                          >
                            <Match when={editRoute().id === r.id}>
                              <input
                                placeholder="Enter name for your route"
                                class="w-full rounded-sm shadow-md px-2 h-8"
                                ref={inputRef}
                                value={editRoute().value}
                                onFocusOut={() => saveRoute()}
                                oninput={(e) => {
                                  setEditRoute({
                                    ...editRoute(),
                                    value: e.currentTarget.value
                                  });
                                }}
                              ></input>
                            </Match>
                          </Switch>
                        </div>
                        <div class="flex justify-between items-center h-12">
                          <div class="flex gap-4">
                            <div class="flex items-center gap-1 h-full">
                              <Switch>
                                <Match when={r.type === "bicycle"}>
                                  <IoBicycleSharp
                                    class="fill-gray-500"
                                    size={18}
                                  />
                                </Match>
                                <Match when={r.type === "foot"}>
                                  <BiRegularRun
                                    class="fill-gray-500"
                                    size={22}
                                  />
                                </Match>
                                <Match when={r.type === "mixed"}>
                                  <FaSolidWheelchairMove
                                    class="fill-gray-500"
                                    size={22}
                                  />
                                </Match>
                              </Switch>
                              <p>
                                {dist == 0 ? 0 : dist.toFixed(2)}{" "}
                                {distMetric() === "kilometre" ? "km" : "mi"}
                              </p>
                            </div>
                            <div class="flex items-center h-full gap-1">
                              <IoLocationSharp
                                size={22}
                                class="fill-gray-500"
                              />
                              <p>{r.markerPos.length} pts </p>
                            </div>
                          </div>
                          <div class="flex gap-2">
                            <div
                              class="w-8 h-8 hover:bg-gray-200 rounded-md flex justify-center items-center cursor-pointer"
                              onClick={async () => await copyShareHash(r)}
                            >
                              <BiRegularShareAlt
                                class="fill-gray-500"
                                size={22}
                              />
                            </div>
                            <div
                              class="w-8 h-8 hover:bg-gray-200 rounded-md flex justify-center items-center cursor-pointer"
                              onClick={() => changeCurrentRoute(r)}
                            >
                              <BiRegularStreetView
                                class="fill-gray-500"
                                size={22}
                              />
                            </div>
                            <Switch
                              fallback={
                                <div
                                  class="w-8 h-8 hover:bg-gray-200 rounded-md flex justify-center items-center cursor-pointer"
                                  onClick={() => setDeleteConfirm(r.id)}
                                >
                                  <AiOutlineDelete
                                    class="fill-gray-500"
                                    size={22}
                                    color="red"
                                  />
                                </div>
                              }
                            >
                              <Match when={deleteConfirm() === r.id}>
                                <div
                                  class="w-8 h-8 hover:bg-gray-200 rounded-md flex justify-center items-center cursor-pointer"
                                  onClick={() => deleteRoutePrimitive(r)}
                                >
                                  <AiOutlineCheck
                                    class="fill-gray-500"
                                    size={22}
                                    color="red"
                                  />
                                </div>
                                <div
                                  class="w-8 h-8 hover:bg-gray-200 rounded-md flex justify-center items-center cursor-pointer"
                                  onClick={() => setDeleteConfirm("")}
                                >
                                  <AiOutlineClose
                                    class="fill-gray-500"
                                    size={22}
                                    color="red"
                                  />
                                </div>
                              </Match>
                            </Switch>
                          </div>
                        </div>
                      </div>
                      <div class="border-t border-gray-300 mt-3"></div>
                    </>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Routes;
