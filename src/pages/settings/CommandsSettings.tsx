import { useLiveQuery } from "dexie-react-hooks";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { db } from "../../helpers/db/db";
import { addCommand, deleteCommand } from "../../helpers/db/commands";

export function CommandSettings() {
  const navigate = useNavigate();
  const [selectedCommand, setSelectedCommand] = useState("");
  const producers = useLiveQuery(() => db.UserCommands.toArray(), []);

  const [producerData, setProducerData] = useState(
    producers?.find(
      (p) => p.names.join(",") == selectedCommand.replaceAll(" ", "")
    )?.producer ?? ""
  );

  useEffect(() => {
    setProducerData(
      producers?.find(
        (p) => p.names.join(",") == selectedCommand.replaceAll(" ", "")
      )?.producer ?? ""
    );
  }, [producers, selectedCommand]);

  function handleSave() {
    addCommand(
      selectedCommand.replaceAll(" ", "").split(","),
      producerData
    ).then((v) => (v ? navigate(-1) : undefined));
  }

  function handleCancel() {
    navigate(-1);
  }
  function handleDelete() {
    deleteCommand(selectedCommand.replaceAll(" ", "").split(",")).then(() =>
      navigate("/")
    );
  }
  return (
    <main className="scrollable-container">
      <div className="scrollable-content">
        <h2>Commands</h2>
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
          <label htmlFor="CommandNames" className="input-label">
            Command Names
          </label>
          <input
            className="input-control"
            list="Commands"
            name="CommandNames"
            id="CommandNames"
            placeholder="alias1, alias2, alias3"
            onChange={(e) => setSelectedCommand(e.target.value)}
          />
          <datalist id="Commands">
            {(producers ?? []).map((v) => (
              <option value={v.names.join(", ")} key={v.names.join(", ")}>
                {v.names.join(", ")}
              </option>
            ))}
          </datalist>
        </div>
        <div className="input-group">
          <label htmlFor="CommandProducer" className="input-label">
            Command Producer
          </label>
          <textarea
            className="input-control"
            id="CommandProducer"
            value={producerData}
            onChange={(e) => setProducerData(e.target.value)}
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
            To add a new command you must write a Javascript function that takes
            zero arguments and returns an object with the following properties:
          </p>
          <ul>
            <li>
              <code>names</code>: an array of names that could be used for this
              command
            </li>
            <li>
              <code>description</code>: a string that describes the command
            </li>
            <li>
              <code>handler</code>: The handler function that is called when the
              action is triggered. This function takes three arguments:
              <ol>
                <li>
                  <code>store</code>: the store object that is used to interact
                  with the apps state
                </li>
                <li>
                  <code> commandParts</code>: string[],
                </li>
                <li>
                  <code>navigate</code>: NavigateFunction
                </li>
              </ol>
            </li>
          </ul>
          <p>
            Make sure to keep the names array the same in the command names
            input and in the returned object
          </p>
        </article>
      </div>
    </main>
  );
}
