import NavigationBar from "../navigation-bar";
import NotesList from "../notes-list";
import useFocusMode from "../editor/controllers/focus-mode";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import styles from "./index.module.css";

const SideBar = function () {
  const isEditorInFocusMode = useFocusMode((state) => state.isFocusMode);

  return (
    <motion.div
      className={cn(styles.side_bar)}
      animate={{
        display: isEditorInFocusMode ? "none" : "flex",
        transition: {
          type: 'tween',
          duration: 0.2
        }
      }}
    >
      <NavigationBar />
      <NotesList />
    </motion.div>
  );
};

export default SideBar;
