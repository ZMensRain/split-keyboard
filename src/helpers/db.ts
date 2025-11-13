// db.ts
import Dexie, { type EntityTable } from "dexie";
import type { KeyboardLayout } from "../model/keyboardLayout";
import type { ActionProducer } from "./actions";

const db = new Dexie("KeyboardLayouts") as Dexie & {
  KeyboardLayouts: EntityTable<
    KeyboardLayout,
    "name" // primary key "name" (for the typings only)
  >;
  UserActions: EntityTable<
    ActionProducer,
    "name" // primary key "name" (for the typings only)
  >;
};

// Schema declaration:
db.version(2).stores({
  KeyboardLayouts: "name, layout",
  UserActions: "name, description",
});

export { db };
