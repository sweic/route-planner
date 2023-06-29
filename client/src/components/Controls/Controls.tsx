import type { Component } from "solid-js";
import RouteControl from "./RouteControl";
import Distance from "./Distance";
import ModeControl from "./ModeControl";
import SearchBar from "./SearchBar";
import Menu from "./Menu";

const Controls: Component = () => {
  return (
    <>
      <RouteControl />
      <SearchBar />
      <ModeControl />
      <Distance />
      <Menu />
    </>
  );
};

export default Controls;
