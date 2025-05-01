import Header from "./header";
import MainEditor from "./main";
import { useSelectedFile } from "../notes-list/controllers/selected-file";
import Empty from "./empty";
import styles from "./index.module.css";

const Editor = function () {
  const selectedFile = useSelectedFile((state) => state.selectedFile);

  return (
    <div className={styles.editor}>
      {!selectedFile ? (
        <Empty />
      ) : (
        <>
          <Header selectedFile={selectedFile} />
          <MainEditor selectedFile={selectedFile} />
        </>
      )}
    </div>
  );
};

export default Editor;
