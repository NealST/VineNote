import SideBar from "./components/side-bar";
import Editor from "./components/editor";
import RssDetail from "./components/rss-detail";
import { useSelectedNav } from '@/components/navigation-bar/controllers/selected-nav';
import { SettingsProvider } from "./components/settings";
import "./App.css";

function App() {

  const selectedNav = useSelectedNav(state => state.id);

  return (
    <SettingsProvider>
      <main className="main">
        <SideBar />
        {
          ['notes', 'tags'].includes(selectedNav) && <Editor />
        }
        {
          selectedNav === 'rss' && <RssDetail />
        }
      </main>
    </SettingsProvider>
  );
}

export default App;
