import { useNavigate } from "react-router";

export default function IndexSettings() {
  const navigate = useNavigate();
  return (
    <main className="scrollable-container">
      <div className="scrollable-content">
        <p>
          For faster access to a particular settings page you can type{" "}
          <code>settings</code> followed by the page name for example '
          <code>settings actions</code>'{" "}
        </p>
        <h2>Settings Pages</h2>
        <button
          className="button"
          onClick={() => navigate("/settings/actions")}
        >
          Actions
        </button>
        <button
          className="button"
          onClick={() => navigate("/settings/layouts")}
        >
          Layouts
        </button>
        <button
          className="button"
          onClick={() => navigate("/settings/commands")}
        >
          Commands
        </button>
        <button className="button" onClick={() => navigate("/")}>
          Back to App
        </button>
      </div>
    </main>
  );
}
