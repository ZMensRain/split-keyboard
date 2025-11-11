import { defaultLayout, type KeyboardLayout } from "../model/keyboardLayout";
import { db } from "./db";

export async function getLayout(layoutName: string): Promise<KeyboardLayout> {
  const result = await db.KeyboardLayouts.where("name")
    .equals(layoutName)
    .first();
  if (result == null) return defaultLayout;
  if (!validateLayout(result)) return defaultLayout;

  return result;
}

export function setLayout(layoutName: string, layout: KeyboardLayout) {
  if (!validateLayout(layout)) return;
  db.KeyboardLayouts.upsert(layoutName, layout);
}

export function validateLayout(layout: KeyboardLayout): boolean {
  if (layout.left == null || layout.right == null) return false;

  // check if there is at least one switchInput for command mode.
  // this is done to prevent users from soft locking themselves with
  // a keyboard layout that cannot be used to navigate to settings
  const allKeys = layout.left.concat(layout.right);
  const switchKey = allKeys.find(
    (k) => k.action == "switchInput" && k.payload == "commandMode"
  );
  if (switchKey == undefined) return false;
  return true;
}

export async function getAllLayoutNames(): Promise<string[]> {
  const query = await db.KeyboardLayouts.toArray();
  const layoutNames = query.map((l) => l.name);

  if (layoutNames.find((l) => l == "default") == undefined) {
    layoutNames.push("default");
  }
  return layoutNames;
}
