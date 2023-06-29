import { createSignal } from "solid-js";

export const [isLoading, setIsLoading] = createSignal(false);
export const [focused, setFocused] = createSignal(false);
export const [mobileFocused, setMobileFocused] = createSignal(false);
export const [routesModalOpen, setRoutesModalOpen] = createSignal(false);
export const [attributionModalOpen, setAttributionModalOpen] =
  createSignal(false);
