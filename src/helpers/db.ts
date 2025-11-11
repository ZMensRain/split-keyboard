// db.ts
import Dexie, { type EntityTable } from "dexie";
import type { KeyboardLayout } from "../model/keyboardLayout";

const db = new Dexie("KeyboardLayouts") as Dexie & {
  KeyboardLayouts: EntityTable<
    KeyboardLayout,
    "name" // primary key "name" (for the typings only)
  >;
};

// Schema declaration:
db.version(1).stores({
  KeyboardLayouts: "name, layout",
});

export { db };
