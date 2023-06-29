import type { Component } from "solid-js";
import { FiMenu } from "solid-icons/fi";
import { setRoutesModalOpen } from "../../store/settings.store";
import { AiFillGithub } from "solid-icons/ai";
const Menu: Component = () => {
  return (
    <div class="absolute z-[1000] top-11 right-2 sm:top-4 sm:right-4 ">
      <div
        class="bg-white rounded-md w-8 h-8 flex justify-center items-center hover:bg-gray-200 cursor-pointer shadow-md"
        onClick={() => setRoutesModalOpen(true)}
      >
        <FiMenu />
      </div>
      <div
        class="mt-1 bg-white rounded-md w-8 h-8 flex justify-center items-center hover:bg-gray-200 cursor-pointer shadow-md"
        onClick={() => window.open(import.meta.env.VITE_GITHUB_URL, "_blank")}
      >
        <AiFillGithub size={20} />
      </div>
    </div>
  );
};

export default Menu;
