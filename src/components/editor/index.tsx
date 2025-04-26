import Header from "./header";
import MainEditor from "./main";
import useFocusMode from "./controllers/focus-mode";
import styles from "./index.module.css";

const Editor = function () {
  const { isFocusMode, setFocusMode } = useFocusMode();

  const handleToggleFocusMode = function (focusMode: boolean) {
    setFocusMode(focusMode);
  };

  return (
    <div
      className={styles.editor}
      style={{
        width: isFocusMode ? "100vw" : "calc(100vw - 420px)",
      }}
    >
      <Header
        onToggleFocusMode={handleToggleFocusMode}
        isFocusMode={isFocusMode}
      />
      <MainEditor />
    </div>
  );
};

export default Editor;
