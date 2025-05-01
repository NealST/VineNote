import SideBar from "./components/side-bar";
import Editor from "./components/editor";
import { SettingsProvider } from "./components/settings";
import "./App.css";

function App() {
  return (
    <SettingsProvider>
      <main className="main">
        <SideBar />
        <Editor />
      </main>
    </SettingsProvider>
  );
}

export default App;
