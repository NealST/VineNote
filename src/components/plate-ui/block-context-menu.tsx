'use client';

import { useCallback, useState } from 'react';

import { AIChatPlugin } from '@udecode/plate-ai/react';
import { BlockquotePlugin } from '@udecode/plate-block-quote/react';
import { HEADING_KEYS } from '@udecode/plate-heading';
import { IndentListPlugin } from '@udecode/plate-indent-list/react';
import {
  BLOCK_CONTEXT_MENU_ID,
  BlockMenuPlugin,
  BlockSelectionPlugin,
} from '@udecode/plate-selection/react';
import {
  ParagraphPlugin,
  useEditorPlugin,
  usePlateState,
} from '@udecode/plate/react';
import { useTranslation } from 'react-i18next';
import { useIsTouchDevice } from '@/hooks/use-is-touch-device';

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuItem,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from './context-menu';

type Value = 'askAI' | null;

export function BlockContextMenu({ children }: { children: React.ReactNode }) {
  const { api, editor } = useEditorPlugin(BlockMenuPlugin);
  const [value, setValue] = useState<Value>(null);
  const isTouch = useIsTouchDevice();
  const [readOnly] = usePlateState('readOnly');
  const { t } = useTranslation();

  const handleTurnInto = useCallback(
    (type: string) => {
      editor
        .getApi(BlockSelectionPlugin)
        .blockSelection.getNodes()
        .forEach(([node, path]) => {
          if (node[IndentListPlugin.key]) {
            editor.tf.unsetNodes([IndentListPlugin.key, 'indent'], {
              at: path,
            });
          }

          editor.tf.toggleBlock(type, { at: path });
        });
    },
    [editor]
  );

  const handleAlign = useCallback(
    (align: 'center' | 'left' | 'right') => {
      editor
        .getTransforms(BlockSelectionPlugin)
        .blockSelection.setNodes({ align });
    },
    [editor]
  );

  if (isTouch) {
    return children;
  }

  return (
    <ContextMenu
      onOpenChange={(open) => {
        if (!open) {
          // prevent unselect the block selection
          setTimeout(() => {
            api.blockMenu.hide();
          }, 0);
        }
      }}
      modal={false}
    >
      <ContextMenuTrigger
        asChild
        onContextMenu={(event) => {
          const dataset = (event.target as HTMLElement).dataset;

          const disabled = dataset?.slateEditor === 'true' || readOnly;

          if (disabled) return event.preventDefault();

          api.blockMenu.show(BLOCK_CONTEXT_MENU_ID, {
            x: event.clientX,
            y: event.clientY,
          });
        }}
      >
        <div className="w-full">{children}</div>
      </ContextMenuTrigger>
      <ContextMenuContent
        className="w-64"
        onCloseAutoFocus={(e) => {
          e.preventDefault();
          editor.getApi(BlockSelectionPlugin).blockSelection.focus();

          if (value === 'askAI') {
            editor.getApi(AIChatPlugin).aiChat.show();
          }

          setValue(null);
        }}
      >
        <ContextMenuGroup>
          {/* todo: add ai function */}
          {/* <ContextMenuItem
            onClick={() => {
              setValue('askAI');
            }}
          >
            {t('askAi')}
          </ContextMenuItem> */}
          <ContextMenuItem
            onClick={() => {
              editor
                .getTransforms(BlockSelectionPlugin)
                .blockSelection.removeNodes();
              editor.tf.focus();
            }}
          >
            {t('delete')}
          </ContextMenuItem>
          <ContextMenuItem
            onClick={() => {
              editor
                .getTransforms(BlockSelectionPlugin)
                .blockSelection.duplicate();
            }}
          >
            {t('duplicate')}
            {/* <ContextMenuShortcut>⌘ + D</ContextMenuShortcut> */}
          </ContextMenuItem>
          <ContextMenuSub>
            <ContextMenuSubTrigger>{t('turnInto')}</ContextMenuSubTrigger>
            <ContextMenuSubContent className="w-48">
              <ContextMenuItem
                onClick={() => handleTurnInto(ParagraphPlugin.key)}
              >
                {t('paragraph')}
              </ContextMenuItem>

              <ContextMenuItem onClick={() => handleTurnInto(HEADING_KEYS.h1)}>
                {t('heading1')}
              </ContextMenuItem>
              <ContextMenuItem onClick={() => handleTurnInto(HEADING_KEYS.h2)}>
                {t('heading2')}
              </ContextMenuItem>
              <ContextMenuItem onClick={() => handleTurnInto(HEADING_KEYS.h3)}>
                {t('heading3')}
              </ContextMenuItem>
              <ContextMenuItem
                onClick={() => handleTurnInto(BlockquotePlugin.key)}
              >
                {t('blockQuote')}
              </ContextMenuItem>
            </ContextMenuSubContent>
          </ContextMenuSub>
        </ContextMenuGroup>

        <ContextMenuGroup>
          <ContextMenuItem
            onClick={() =>
              editor
                .getTransforms(BlockSelectionPlugin)
                .blockSelection.setIndent(1)
            }
          >
            {t('indent')}
          </ContextMenuItem>
          <ContextMenuItem
            onClick={() =>
              editor
                .getTransforms(BlockSelectionPlugin)
                .blockSelection.setIndent(-1)
            }
          >
            {t('outdent')}
          </ContextMenuItem>
          <ContextMenuSub>
            <ContextMenuSubTrigger>{t('align')}</ContextMenuSubTrigger>
            <ContextMenuSubContent className="w-48">
              <ContextMenuItem onClick={() => handleAlign('left')}>
                {t('left')}
              </ContextMenuItem>
              <ContextMenuItem onClick={() => handleAlign('center')}>
                {t('center')}
              </ContextMenuItem>
              <ContextMenuItem onClick={() => handleAlign('right')}>
                {t('right')}
              </ContextMenuItem>
            </ContextMenuSubContent>
          </ContextMenuSub>
        </ContextMenuGroup>
      </ContextMenuContent>
    </ContextMenu>
  );
}
