'use client';

import { useRef, useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Plate } from '@udecode/plate/react';
import { useCreateEditor } from './controllers/use-create-editor';
import { Editor, EditorContainer } from '@/components/plate-ui/editor';
import { SettingsProvider } from '@/components/settings';
import { useTextCount } from './controllers/text-count';
import { readFile, writeToFile } from './controllers/file-action';
import debounce from '@/utils/debounce';
import { useSelectedFile } from "../notes-list/controllers/selected-file";
import { Toaster } from 'sonner';
import styles from './index.module.css';

const DELAY_TIME = 2000;

function PlateEditor() {
  const editor = useCreateEditor();
  const selectedFile = useSelectedFile((state) => state.selectedFile);
  const setTextCount = useTextCount(state => state.setCount);
  const editorRef = useRef<HTMLDivElement>(null);
  const isFilePathChangeRef = useRef(false);
  const filePath = selectedFile?.path;
  
  const handleChange = ({ value }: {value: []}) => {
    console.log("editor value", value);
    console.log("editor text content", editorRef.current?.textContent);
    // count the character number of editor
    setTextCount(editorRef.current?.textContent?.trim().length || 0);
    // to avoid the file write caused by the file path change
    if (isFilePathChangeRef.current) {
      isFilePathChangeRef.current = false;
      return;
    }
    // write edit content to file path automatically
    filePath && writeToFile(value, filePath);
  }

  useEffect(() => {
    console.log('selected path', filePath);
    if (filePath) {
      readFile(filePath).then(content => {
        console.log('file content', content);
        isFilePathChangeRef.current = true;
        editor.tf.setValue(JSON.parse(content || '[]'));
      });
    }
  }, [filePath]);

  return (
    <DndProvider backend={HTML5Backend}>
      <Plate editor={editor} onChange={debounce(handleChange, DELAY_TIME)}>
        <EditorContainer className={styles.editor_main_container}>
          <Editor variant="demo" ref={editorRef} />
        </EditorContainer>
      </Plate>
    </DndProvider>
  );
}

const MainEditor = function() {
  return (
    <div data-registry="plate" className={styles.editor_main}>
      <SettingsProvider>
        <PlateEditor />
      </SettingsProvider>

      <Toaster />
    </div>
  )
}

export default MainEditor;
