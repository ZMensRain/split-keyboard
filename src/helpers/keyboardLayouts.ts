import { defaultLayout, type KeyboardLayout } from "../model/keyboardLayout";
const prefix = "keyboardLayout-";

export function getLayout(layout: string): KeyboardLayout {
  // fetch layout from localStorage and return default layout if it does not exist
  const fetchedLayout = localStorage.getItem(prefix + layout);
  if (fetchedLayout == null) return defaultLayout;

  const parsedLayout: KeyboardLayout = JSON.parse(fetchedLayout);

  //validate keyboard layout
  if (parsedLayout == null || !validateLayout(parsedLayout))
    return defaultLayout;

  return parsedLayout;
}

export function setLayout(layoutName: string, layout: KeyboardLayout) {
  if (!validateLayout(layout)) return;
  localStorage.setItem(prefix + layoutName, JSON.stringify(layout));
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

export function getAllLayoutNames(): string[] {
  let layoutNames: string[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key == null) continue;
    if (key.startsWith(prefix)) layoutNames.push(key.replace(prefix, ""));
  }
  // makes sure that there is always at least one keyboard layout
  if (!layoutNames.includes("default"))
    layoutNames = ["default", ...layoutNames];

  return layoutNames;
}
