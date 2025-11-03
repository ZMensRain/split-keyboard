import { defaultLayout, type KeyboardLayout } from "../model/keyboardLayout";
const prefix = "keyboardLayout-";

export function getLayout(layout: string): KeyboardLayout {
  const fetchedLayout = localStorage.getItem(prefix + layout);
  if (fetchedLayout == null) return defaultLayout;
  const parsedLayout: KeyboardLayout = JSON.parse(fetchedLayout);
  if (parsedLayout == null) return defaultLayout;
  if (parsedLayout.left == null || parsedLayout.right == null)
    return defaultLayout;
  return parsedLayout;
}

export function setLayout(layoutName: string, layout: KeyboardLayout) {
  if (!validateLayout(layout)) return;
  localStorage.setItem(prefix + layoutName, JSON.stringify(layout));
}

export function validateLayout(layout: KeyboardLayout): boolean {
  if (layout.left == null || layout.right == null) return false;
  //check if there is at least one switchInput for command mode
  const allKeys = layout.left.concat(layout.right);
  if (
    allKeys.find(
      (v) => v.action == "switchInput" && v.payload == "commandMode"
    ) == undefined
  )
    return false;
  return true;
}

export function getAllLayoutNames(): string[] {
  let layoutNames: string[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    console.log(localStorage.key(i));
    const key = localStorage.key(i);
    if (key == null) continue;
    if (key.startsWith(prefix)) layoutNames.push(key.replace(prefix, ""));
  }
  if (!layoutNames.includes("default")) {
    layoutNames = ["default"].concat(layoutNames);
  }
  return layoutNames;
}
