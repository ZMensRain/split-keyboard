import {
  defaultLayout,
  FallbackLayouts,
  type KeyboardLayout,
} from "../model/keyboardLayout";
import { db } from "./db";

export async function getLayout(layoutName: string): Promise<KeyboardLayout> {
  // handles getting a fallback layout for the layout name provided
  let fallback = FallbackLayouts[layoutName];
  if (fallback == undefined) fallback = defaultLayout;

  try {
    const result = await db.KeyboardLayouts.where("name")
      .equals(layoutName)
      .first();
    if (result == null) return fallback;
    if (!validateLayout(result)) return fallback;

    return result;
  } catch (e) {
    console.log(e);
    return fallback;
  }
}

export function setLayout(layoutName: string, layout: KeyboardLayout) {
  try {
    if (!validateLayout(layout)) return;
    db.KeyboardLayouts.upsert(layoutName, layout);
  } catch (error) {
    if (error) {
      alert(
        "Error saving layout: " +
          error +
          " This may be caused by you blocking all cookies. Please allow cookies and try again."
      );
    }
  }
}

export async function DeleteLayout(name: string) {
  await db.KeyboardLayouts.delete(name);
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
  try {
    const query = await db.KeyboardLayouts.toArray();
    const layoutNames = query.map((l) => l.name);

    for (const layoutName in FallbackLayouts) {
      if (layoutNames.find((l) => l == layoutName) == undefined) {
        layoutNames.push(layoutName);
      }
    }

    return layoutNames;
  } catch (error) {
    alert(
      "Error getting layout names: " +
        error +
        " This may be caused by you blocking all cookies. Please allow cookies to use custom keyboards."
    );
    return [];
  }
}
