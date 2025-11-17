import { useEffect, useMemo, useState } from "react";
import {
  DeleteLayout,
  getAllLayoutNames,
  getLayout,
  setLayout,
} from "../../helpers/keyboardLayouts";

import { useLiveQuery } from "dexie-react-hooks";
import { useNavigate } from "react-router";

export default function KeyboardSettings() {
  const navigate = useNavigate();
  const [selectedLayout, setSelectedLayout] = useState("default");
  const layouts = useLiveQuery(() => getAllLayoutNames(), []) ?? [];

  const DBData = useLiveQuery(
    () => getLayout(selectedLayout),
    [selectedLayout]
  );
  const editableData = useMemo(() => {
    return {
      left: DBData?.left ?? [],
      right: DBData?.right ?? [],
    };
  }, [DBData]);

  const [state, setState] = useState(JSON.stringify(editableData));

  // handles keeping the database data and the input data in sync
  // this was needed to prevent a blank layout from being displayed
  useEffect(() => setState(JSON.stringify(editableData)), [editableData]);

  function handleSave() {
    setLayout(selectedLayout, JSON.parse(state));
    navigate("/");
  }
  function handleCancel() {
    navigate(-1);
  }
  function handleDelete() {
    DeleteLayout(selectedLayout).then(() => navigate("/"));
  }

  return (
    <div className="settings scrollable-container">
      <div className="scrollable-content">
        <h2>Layouts</h2>
        <p className="warning">
          WARNING: This feature requires localstorage capabilities through
          IndexedDB.{" "}
        </p>
        <div className="input-group">
          <label htmlFor="layout" className="input-label">
            Layout Name
          </label>
          <input
            list="layouts"
            name="layout"
            id="layout"
            onChange={(e) => setSelectedLayout(e.target.value)}
            className="input-control"
            placeholder="Default"
            defaultValue={selectedLayout}
          />
          <datalist id="layouts">
            {layouts.map((v) => (
              <option value={v} key={v}>
                {v}
              </option>
            ))}
          </datalist>
        </div>
        <div className="input-group">
          <label htmlFor="layout-data" className="input-label">
            Layout Data
          </label>
          <textarea
            className="input-control"
            id="layout-data"
            value={state}
            onChange={(e) => setState(e.target.value)}
          ></textarea>
        </div>
        <div className="row end">
          <button className="button" onClick={handleCancel}>
            Cancel
          </button>
          <button className="button button-danger" onClick={handleDelete}>
            Delete
          </button>
          <button className="button" onClick={handleSave}>
            Save
          </button>
        </div>
        <article>
          <h2>Format</h2>
          <p>
            The format is written in JSON. The left and right keys are arrays of
            Key objects.
          </p>
          <section>
            <h3>Key Objects</h3>
            <ul>
              <li>
                <code>action</code>: The action to perform. See below for more
              </li>
              <li>
                <code>payload</code>: The payload to pass to the action handler,
                It can be any value.
              </li>
              <li>
                <code>width</code>: The width of the key.
              </li>
              <li>
                <code>height</code>: The height of the key.
              </li>
              <li>
                <code>label</code>: The label to display on the key. This can be
                left out and the value will come from the payload.
              </li>
            </ul>
          </section>
          <section>
            <h3>Available Actions</h3>
            <p>The following actions are available:</p>
            <ul>
              <li>
                <code>insert</code>: Inserts the payload at the cursor position.
              </li>
              <li>
                <code>remove</code>: Removes the specified amount of characters
                from the cursor position.
              </li>
              <li>
                <code>cursor</code>: Moves the cursor by the specified amount.
              </li>
              <li>
                <code>switchInput</code>: Switches to the specified input.
              </li>
              <li>
                <code>enter</code>: Enter a new line or execute a command
                depending on the selected input.
              </li>
              <li>
                <code>blank</code>: Displays a blank key. used for positioning
                surrounding keys.
              </li>
            </ul>
          </section>
        </article>
      </div>
    </div>
  );
}
