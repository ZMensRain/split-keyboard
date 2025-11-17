// db.ts
import Dexie, { type EntityTable } from "dexie";
import type { KeyboardLayout } from "../../model/keyboardLayout";

import type { ActionProducer } from "../../model/action";
import type { CommandProducer } from "../../model/command";

const db = new Dexie("KeyboardLayouts") as Dexie & {
  KeyboardLayouts: EntityTable<
    KeyboardLayout,
    "name" // primary key "name" (for the typings only)
  >;
  UserActions: EntityTable<
    ActionProducer,
    "name" // primary key "name" (for the typings only)
  >;
  UserCommands: EntityTable<
    CommandProducer,
    "names" // primary key "name" (for the typings only)
  >;
};

// Schema declaration:
db.version(3).stores({
  KeyboardLayouts: "name, layout",
  UserActions: "name, producer",
  UserCommands: "names, producer",
});

export { db };
