'use client';

import {
  BoldPlugin,
  CodePlugin,
  ItalicPlugin,
  StrikethroughPlugin,
  UnderlinePlugin,
} from '@udecode/plate-basic-marks/react';
import {
  FontBackgroundColorPlugin,
  FontColorPlugin,
} from '@udecode/plate-font/react';
import { HighlightPlugin } from '@udecode/plate-highlight/react';
import {
  AudioPlugin,
  FilePlugin,
  ImagePlugin,
  VideoPlugin,
} from '@udecode/plate-media/react';
import { useEditorReadOnly } from '@udecode/plate/react';
import {
  // ArrowUpToLineIcon,
  BaselineIcon,
  BoldIcon,
  Code2Icon,
  HighlighterIcon,
  ItalicIcon,
  PaintBucketIcon,
  StrikethroughIcon,
  UnderlineIcon,
  // WandSparklesIcon,
} from 'lucide-react';

import { MoreDropdownMenu } from '@/components/plate-ui/more-dropdown-menu';

// import { AIToolbarButton } from './ai-toolbar-button';
import { AlignDropdownMenu } from './align-dropdown-menu';
import { ColorDropdownMenu } from './color-dropdown-menu';
import { CommentToolbarButton } from './comment-toolbar-button';
import { EmojiDropdownMenu } from './emoji-dropdown-menu';
import { ExportToolbarButton } from './export-toolbar-button';
import { FontSizeToolbarButton } from './font-size-toolbar-button';
import { RedoToolbarButton, UndoToolbarButton } from './history-toolbar-button';
// import { ImportToolbarButton } from './import-toolbar-button';
import {
  BulletedIndentListToolbarButton,
  NumberedIndentListToolbarButton,
} from './indent-list-toolbar-button';
import { IndentTodoToolbarButton } from './indent-todo-toolbar-button';
import { IndentToolbarButton } from './indent-toolbar-button';
import { InsertDropdownMenu } from './insert-dropdown-menu';
import { LineHeightDropdownMenu } from './line-height-dropdown-menu';
import { LinkToolbarButton } from './link-toolbar-button';
import { MarkToolbarButton } from './mark-toolbar-button';
import { MediaToolbarButton } from './media-toolbar-button';
// import { ModeDropdownMenu } from './mode-dropdown-menu';
import { OutdentToolbarButton } from './outdent-toolbar-button';
import { TableDropdownMenu } from './table-dropdown-menu';
import { ToggleToolbarButton } from './toggle-toolbar-button';
import { ToolbarGroup } from './toolbar';
import { TurnIntoDropdownMenu } from './turn-into-dropdown-menu';
import { useTranslation } from 'react-i18next';

export function FixedToolbarButtons() {
  const readOnly = useEditorReadOnly();
  const { t } = useTranslation();
  return (
    <div className="flex w-full">
      {!readOnly && (
        <>
          <ToolbarGroup>
            <UndoToolbarButton />
            <RedoToolbarButton />
          </ToolbarGroup>
          
          {/* todo: add ai function */}
          {/* <ToolbarGroup>
            <AIToolbarButton tooltip={t('aiCommands')}>
              <WandSparklesIcon />
            </AIToolbarButton>
          </ToolbarGroup> */}

          <ToolbarGroup>
            <ExportToolbarButton>
            </ExportToolbarButton>
            {/* <ImportToolbarButton /> */}
          </ToolbarGroup>

          <ToolbarGroup>
            <InsertDropdownMenu />
            <TurnIntoDropdownMenu />
            <FontSizeToolbarButton />
          </ToolbarGroup>

          <ToolbarGroup>
            <MarkToolbarButton nodeType={BoldPlugin.key} tooltip={`${t('bold')} (⌘+B)`}>
              <BoldIcon />
            </MarkToolbarButton>

            <MarkToolbarButton
              nodeType={ItalicPlugin.key}
              tooltip={`${t('italic')} (⌘+I)`}
            >
              <ItalicIcon />
            </MarkToolbarButton>

            <MarkToolbarButton
              nodeType={UnderlinePlugin.key}
              tooltip={`${t('underline')} (⌘+U)`}
            >
              <UnderlineIcon />
            </MarkToolbarButton>

            <MarkToolbarButton
              nodeType={StrikethroughPlugin.key}
              tooltip={`${t('strikethrough')} (⌘+⇧+M)`}
            >
              <StrikethroughIcon />
            </MarkToolbarButton>

            <MarkToolbarButton nodeType={CodePlugin.key} tooltip={`${t('code')} (⌘+E)`}>
              <Code2Icon />
            </MarkToolbarButton>

            <ColorDropdownMenu
              nodeType={FontColorPlugin.key}
              tooltip={t('textColor')}
            >
              <BaselineIcon />
            </ColorDropdownMenu>

            <ColorDropdownMenu
              nodeType={FontBackgroundColorPlugin.key}
              tooltip={t('bgColor')}
            >
              <PaintBucketIcon />
            </ColorDropdownMenu>
          </ToolbarGroup>

          <ToolbarGroup>
            <AlignDropdownMenu />

            <NumberedIndentListToolbarButton />
            <BulletedIndentListToolbarButton />
            <IndentTodoToolbarButton />
            <ToggleToolbarButton />
          </ToolbarGroup>

          <ToolbarGroup>
            <LinkToolbarButton />
            <TableDropdownMenu />
            <EmojiDropdownMenu />
          </ToolbarGroup>

          <ToolbarGroup>
            <MediaToolbarButton nodeType={ImagePlugin.key} />
            <MediaToolbarButton nodeType={VideoPlugin.key} />
            <MediaToolbarButton nodeType={AudioPlugin.key} />
            <MediaToolbarButton nodeType={FilePlugin.key} />
          </ToolbarGroup>

          <ToolbarGroup>
            <LineHeightDropdownMenu />
            <OutdentToolbarButton />
            <IndentToolbarButton />
          </ToolbarGroup>

          <ToolbarGroup>
            <MoreDropdownMenu />
          </ToolbarGroup>
        </>
      )}

      <div className="grow" />

      <ToolbarGroup>
        <MarkToolbarButton nodeType={HighlightPlugin.key} tooltip={t("highlight")}>
          <HighlighterIcon />
        </MarkToolbarButton>
        <CommentToolbarButton />
      </ToolbarGroup>

      {/* <ToolbarGroup>
        <ModeDropdownMenu />
      </ToolbarGroup> */}
    </div>
  );
}
