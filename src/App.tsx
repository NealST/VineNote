import SideBar from "./components/side-bar";
import NotesList from "./components/notes-list";
import Editor from "./components/editor";
import "./App.css";

function App() {
 
  return (
    <main className="container">
      <SideBar />
      <NotesList />
      <Editor />
    </main>
  );
}

export default App;
