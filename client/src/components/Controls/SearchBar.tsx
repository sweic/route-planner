import {
  Component,
  Show,
  createEffect,
  createSignal,
  onCleanup
} from "solid-js";
import { AiOutlineClose, AiOutlineSearch } from "solid-icons/ai";
import { getLocations, goToLocation } from "../../api/search";
import { Suggestion } from "../../store/utils/schemas";
import { IoLocationSharp } from "solid-icons/io";
import { getMapObject } from "../../store/data.store";
import L from "leaflet";
import {
  focused,
  mobileFocused,
  setFocused,
  setMobileFocused
} from "../../store/settings.store";
const [searchText, setSearchText] = createSignal("");
const [suggestions, setSuggestions] = createSignal<Suggestion[]>([]);

createEffect(async () => {
  if (searchText() === "") return;
  let timerId = 1;

  onCleanup(() => clearTimeout(timerId));
  timerId = setTimeout(async () => {
    const locations = await getLocations(searchText());
    setSuggestions(locations);
  }, 200);
});

const suggestionHandler = async (s: Suggestion) => {
  setSearchText(s.text);
  const loc = await goToLocation(s);
  if (!loc) return; // TODO: Error handling
  const map = getMapObject();
  map?.panTo(new L.LatLng(loc.location.y, loc.location.x));
  map?.setZoom(15);
};

const SearchBar: Component = () => {
  return (
    <>
      <div class="absolute z-[1000] right-2 top-1 sm:right-14 sm:top-3">
        <div class="w-72 h-10 rounded-md flex justify-end items-center relative">
          <div class="rounded-tl-md rounded-bl-md shadow-md bg-white w-8 h-8 flex justify-center items-center">
            <AiOutlineSearch size={20} class="fill-gray-500 pl-1" />
          </div>
          <input
            onFocusOut={() => setTimeout(() => setFocused(false), 100)}
            onFocusIn={() => {
              setFocused(true);
              setMobileFocused(true);
            }}
            oninput={(e) => setSearchText(e.target.value)}
            value={searchText()}
            class={`w-32 h-8 ${
              focused() && "focus:w-full"
            } transition-width duration-300 ease-out outline-none relative rounded-tr-md rounded-br-md text-sm px-2 pl-1`}
            placeholder="Find a location..."
          />
          <Show when={focused()}>
            <div class="bg-white w-full flex flex-col absolute top-8">
              {suggestions().map((s) => {
                return (
                  <div
                    class="w-72 text-ellipsis bg-white hover:bg-gray-200 truncate px-2 h-8 flex items-center cursor-pointer"
                    onClick={() => suggestionHandler(s)}
                  >
                    <IoLocationSharp size={18} class="fill-gray-500 mr-2" />
                    <div class="w-full text-ellipsis text-sm truncate">
                      {s.text}
                    </div>
                  </div>
                );
              })}
            </div>
          </Show>
        </div>
      </div>
      <SearchBarMobile />
    </>
  );
};

export default SearchBar;

const SearchBarMobile = () => {
  let inputRef: HTMLInputElement;

  createEffect(() => {
    if (mobileFocused()) inputRef.focus();
  });

  return (
    <Show when={mobileFocused()}>
      <div class="sm:hidden w-screen h-screen absolute left-0 top-0 z-[1003] bg-white">
        <div class="h-full w-full flex flex-col">
          <div class="h-10 min-h-10 px-2 w-full bg-white flex items-center border-b-2 border-solid border-gray-300 ">
            <AiOutlineSearch size={20} class="fill-gray-500" />

            <input
              ref={inputRef!}
              oninput={(e) => setSearchText(e.target.value)}
              value={searchText()}
              placeholder="Find a location..."
              class="w-full mx-2 outline-none rounded-md text-sm"
            />
            <AiOutlineClose
              onClick={() => setMobileFocused(false)}
              class="fill-gray-500 cursor-pointer"
              size={20}
            />
          </div>
          <div class="h-full w-full overflow-y-auto flex-1">
            {suggestions().map((s) => {
              return (
                <div
                  class="w-full text-ellipsis bg-white hover:bg-gray-200 truncate px-2 h-10 flex items-center cursor-pointer py-4"
                  onClick={() => {
                    suggestionHandler(s);
                    setMobileFocused(false);
                  }}
                >
                  <IoLocationSharp size={18} class="fill-gray-500 mr-2" />
                  <div class="w-full text-ellipsis text-sm truncate">
                    {s.text}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </Show>
  );
};
