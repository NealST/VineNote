import Header from "./header";
import MainEditor from "./main";
import { useSelectedFile } from "../notes-list/controllers/selected-file";
import Empty from "./empty";
import styles from "./index.module.css";

const Editor = function () {
  const selectedFile = useSelectedFile((state) => state.selectedFile);
  const isFileEmpty = !selectedFile || !selectedFile.path;

  return (
    <div className={styles.editor}>
      {isFileEmpty ? (
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
