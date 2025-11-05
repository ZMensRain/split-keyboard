import { useState } from "react";
import {
  getAllLayoutNames,
  getLayout,
  setLayout,
} from "../helpers/keyboardLayouts";
import { useNavigate } from "react-router";

export default function Settings() {
  const [selectedLayout, setSelectedLayout] = useState("default");
  const layouts = getAllLayoutNames();
  const [layoutData, setLayoutData] = useState(
    JSON.stringify(getLayout(selectedLayout))
  );
  const navigate = useNavigate();

  function handleSave() {
    setLayout(selectedLayout, JSON.parse(layoutData));
    navigate("/");
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
        onBlur={(e) => {
          setSelectedLayout(e.target.value);
          setLayoutData(JSON.stringify(getLayout(e.target.value)));
        }}
      />
      <datalist id="layouts">
        {layouts.map((v) => (
          <option value={v}>{v}</option>
        ))}
      </datalist>

      <label htmlFor="layout-data">Layout Data</label>
      <textarea
        className="layoutInput"
        id="layout-data"
        onChange={(e) => setLayoutData(e.currentTarget.value)}
      >
        {layoutData}
      </textarea>
      <div className="row end">
        <button className="button" onClick={handleSave}>
          Save
        </button>
      </div>
    </div>
  );
}
