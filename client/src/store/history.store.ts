import { createSignal } from "solid-js";
import { RedoObject, UndoObject } from "./utils/types";

export const [undoStack, setUndoStack] = createSignal<UndoObject[]>([]);
export const [redoStack, setRedoStack] = createSignal<RedoObject[]>([]);
export const [distMetric, setDistMetric] = createSignal<"kilometre" | "mile">(
  "kilometre"
);
