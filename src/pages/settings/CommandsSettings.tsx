import { useLiveQuery } from "dexie-react-hooks";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { db } from "../../helpers/db";
import { AddCommand } from "../../helpers/commands";

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
    AddCommand(
      selectedCommand.replaceAll(" ", "").split(","),
      producerData
    ).then((v) => (v ? navigate(-1) : undefined));
  }

  function handleCancel() {
    navigate(-1);
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
          <button className="button" onClick={handleSave}>
            Save
          </button>
        </div>
      </div>
    </main>
  );
}
