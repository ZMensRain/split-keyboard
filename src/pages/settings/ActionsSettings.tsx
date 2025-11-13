import { useLiveQuery } from "dexie-react-hooks";
import { db } from "../../helpers/db";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { AddAction } from "../../helpers/actions";

export default function ActionSettings() {
  const navigate = useNavigate();
  const [selectedAction, setSelectedAction] = useState("");
  const producers = useLiveQuery(() => db.UserActions.toArray(), []);

  const [producerData, setProducerData] = useState(
    producers?.find((p) => p.name == selectedAction)?.producer ?? ""
  );

  useEffect(() => {
    setProducerData(
      producers?.find((p) => p.name == selectedAction)?.producer ?? ""
    );
  }, [producers, selectedAction]);

  function handleSave() {
    AddAction(selectedAction, producerData).then((v) =>
      v ? navigate("/") : undefined
    );
  }

  function handleCancel() {
    navigate(-1);
  }

  return (
    <main className="scrollable-container">
      <div className="scrollable-content">
        <h2>Actions</h2>
        <p className="warning">
          WARNING: This feature requires localstorage capabilities through
          IndexedDB.{" "}
        </p>
        <p className="warning">
          WARNING: This feature allows you to execute javascript not checked for
          safety on your device make sure you trust the source of the code
          before using it.
        </p>
        <div className="input-group">
          <label htmlFor="ActionName" className="input-label">
            Action Name
          </label>
          <input
            className="input-control"
            list="actions"
            name="ActionName"
            id="ActionName"
            onChange={(e) => setSelectedAction(e.target.value)}
          />
          <datalist id="actions">
            {(producers ?? []).map((v) => (
              <option value={v.name} key={v.name}>
                {v.name}
              </option>
            ))}
          </datalist>
        </div>
        <div className="input-group">
          <label htmlFor="ActionProducer" className="input-label">
            Action Producer
          </label>
          <textarea
            className="input-control"
            id="ActionProducer"
            value={producerData}
            onChange={(e) => setProducerData(e.target.value)}
          ></textarea>
        </div>

        <div className="row end">
          <button className="button" onClick={handleCancel}>
            Cancel
          </button>
          <button className="button" onClick={handleSave}>
            Save
          </button>
        </div>

        <article>
          <h2>Format</h2>
          <p>
            To add a new action you must write a Javascript function that takes
            zero arguments and returns an object with the following properties:
          </p>
          <ul>
            <li>
              <code>name</code>: The name of the action. This is used to
              identify the action
            </li>
            <li>
              <code>description</code>: A description of the action
            </li>
            <li>
              <code>handler</code>: The handler function that is called when the
              action is triggered. This function takes three arguments:
              <ul>
                <li>
                  <code>payload</code>: The payload that was passed to the
                  action
                </li>
                <li>
                  <code>store</code>: The store object that is used to interact
                  with the apps state
                </li>
                <li>
                  <code>handleCommand</code>: A function that can be used to
                  handle commands
                </li>
              </ul>
            </li>
          </ul>
        </article>
      </div>
    </main>
  );
}
