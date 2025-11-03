import { useState } from "react";
import { getAllLayoutNames, getLayout } from "../helpers/keyboardLayouts";

export default function Settings() {
  const [selectedLayout, setSelectedLayout] = useState("default");
  const layouts = getAllLayoutNames();
  const layout = JSON.stringify(getLayout(selectedLayout));

  function handleSave() {
    console.log("saving");
  }

  return (
    <div className="settings">
      <h2>Layouts</h2>
      <label htmlFor="layout">Layout Name</label>
      <input
        list="layouts"
        name="layout"
        id="layout"
        onChange={(e) => setSelectedLayout(e.target.value)}
        className="layoutNameInput"
        placeholder="Default"
        defaultValue={selectedLayout}
      />
      <datalist id="layouts">
        {layouts.map((v) => (
          <option value={v}>{v}</option>
        ))}
      </datalist>
      <textarea className="layoutInput">{layout}</textarea>
      <div className="row end">
        <button className="button" onClick={handleSave}>
          Save
        </button>
      </div>
    </div>
  );
}
