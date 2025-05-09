import DeleteAction from "./header-actions/delete";
import ExportAction from "./header-actions/export";
import FocusAction from "./header-actions/focus";
import FileInfo from "./header-actions/file-info";
import AddTag from "./header-actions/tag";
import styles from "./index.module.css";

const Header = function () {

  return (
    <div className={styles.header}>
      <FileInfo />
      <div className={styles.header_action}>
        <AddTag />
        <FocusAction />
        <ExportAction />
        <DeleteAction />
      </div>
    </div>
  );
};

export default Header;
