import type { Component } from "solid-js";
import { FaSolidPlus } from "solid-icons/fa";
import { BiRegularUndo, BiRegularRedo } from "solid-icons/bi";
import { CgRedo } from "solid-icons/cg";
import { redoStack, undoStack } from "../../store/history.store";
import { addNewRoute, onRedoClick, onUndoClick } from "../../api/routeControl";
import { getAllRoutes, setCurrentRoute } from "../../store/data.store";
const RouteControl: Component = () => {
  const undoClickable = () => undoStack().length > 0;
  const redoClickable = () => redoStack().length > 0;

  return (
    <div class="absolute z-[1000] left-2 top-2 sm:left-4 sm:top-4">
      <div class="bg-white h-8 flex rounded-md">
        <div
          class="flex w-12 bg-white justify-center items-center h-full cursor-pointer hover:bg-gray-200 shadow-md rounded-tl-md rounded-bl-md"
          onClick={() => addNewRoute()}
        >
          <FaSolidPlus class="w-5 h-5 stroke-2 fill-gray-500" />
        </div>
        <div
          onClick={() => onUndoClick()}
          class={`flex w-12 bg-white justify-center items-center h-full  ${
            undoClickable() && "cursor-pointer hover:bg-gray-200"
          }  shadow-md`}
        >
          <BiRegularUndo
            class={`w-6 h-6 ${
              undoClickable() ? "fill-gray-500" : "fill-gray-300"
            } `}
          />
        </div>
        <div
          onClick={() => onRedoClick()}
          class={`flex w-12 bg-white justify-center items-center h-full ${
            redoClickable() && "cursor-pointer hover:bg-gray-200"
          } shadow-md rounded-tr-md rounded-br-md`}
        >
          <BiRegularRedo
            class={`w-6 h-6  ${
              redoClickable() ? "fill-gray-500" : "fill-gray-300"
            }`}
          />
        </div>
      </div>
    </div>
  );
};

export default RouteControl;
