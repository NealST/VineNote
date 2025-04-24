import SideBar from "./components/side-bar";
import NotesList from "./components/notes-list";
import "./App.css";

function App() {
 
  return (
    <main className="container">
      <SideBar />
      <NotesList />
    </main>
  );
}

export default App;
