import { useNavigate } from "react-router";
import { commands } from "../helpers/commands";
import { useActions } from "../helpers/actions";

export default function FAQ() {
  const navigate = useNavigate();
  const actions = useActions([]);
  function launchApp() {
    navigate("/");
  }

  return (
    <main className="faq scrollable-container">
      <article className="scrollable-content">
        <h1>FAQ</h1>
        <p>This is a FAQ page</p>
        <section></section>
        <h2>How do I use this app?</h2>
        <p>
          To use the app click the launch app button below and type away. The
          default keyboard layout has a button used for entering{" "}
          <em>command mode</em>. This is used to enter commands that are not
          part of the keyboard layout. For example, to save a file, type{" "}
          <code>w filename</code> and press enter. To exit command mode, type{" "}
          <code>exit</code> or <code>q</code> and hit enter.
        </p>
        <section />
        <section>
          <h2>How Accessible is this app?</h2>
          <p>
            Sadly due to the nature of the app it is not very accessible. You
            would probably be better off using the default os keyboard or
            dictation feature for writing than this app
          </p>
        </section>
        <section>
          <h2>How do I edit a keyboard layout or add a new one?</h2>
          <p>To edit or create a keyboard layout:</p>
          <ol>
            <li>Enter Command Mode using the ፧ key</li>
            <li>
              type <code>settings</code> and press enter
            </li>
            <li>
              Enter the keyboard layout name. layouts that have already been
              created will suggested
            </li>
            <li>
              Once you have selected the name for the layout you want to edit or
              create, you can edit the json data the stores the keyboard layout
            </li>
            <li>To save press the save button</li>
          </ol>
        </section>
        <section>
          <h2>How do I create a new action?</h2>
          <p>To create a new action:</p>
          <ol>
            <li>Enter Command Mode using the ፧ key</li>
            <li>
              Type <code>settings actions</code> and press enter
            </li>
            <li>
              Enter the action name that you want to use when triggering it from
              a keyboard layout. Actions that have already been created will be
              suggested
            </li>
            <li>
              Once you have selected the name for the action you want to edit or
              create, you can edit the action producer arrow function that
              produces the action.
            </li>
            <li>To save press the save button</li>
          </ol>
        </section>
        <section>
          <h2>Can I overwrite a built in action?</h2>
          <p>
            No to prevent you from accidentally bricking the app this is not
            supported. However the function is still stored.
          </p>
        </section>
        <section>
          <h2>What commands are available?</h2>
          <p>The following commands are available:</p>
          <ul>
            {commands.map((c) => (
              <li key={c.names.join(", ")}>
                <code>{c.names.join(", ")}</code>: {c.description}
              </li>
            ))}
          </ul>
        </section>
        <section>
          <h2>What keyboard actions are available?</h2>
          <p>The following actions are available:</p>
          <ul>
            {Object.entries(actions).map((action) => (
              <li key={action[0]}>
                <code>{action[0]}</code>: {action[1].description}
              </li>
            ))}
          </ul>
        </section>
        <button onClick={launchApp} className="button">
          Launch App
        </button>
      </article>
    </main>
  );
}
