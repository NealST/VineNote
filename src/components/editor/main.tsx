'use client';

import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Plate } from '@udecode/plate/react';
import { useCreateEditor } from './controllers/use-create-editor';
import { Editor, EditorContainer } from '@/components/plate-ui/editor';
import { SettingsProvider } from '@/components/settings';
import { Toaster } from 'sonner';

function PlateEditor() {
  const editor = useCreateEditor();

  return (
    <DndProvider backend={HTML5Backend}>
      <Plate editor={editor}>
        <EditorContainer>
          <Editor variant="demo" />
        </EditorContainer>
      </Plate>
    </DndProvider>
  );
}

const MainEditor = function() {
  return (
    <div data-registry="plate">
      <SettingsProvider>
        <PlateEditor />
      </SettingsProvider>

      <Toaster />
    </div>
  )
}

export default MainEditor;
