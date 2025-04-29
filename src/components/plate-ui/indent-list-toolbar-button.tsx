'use client';

import {
  ListStyleType,
  someIndentList,
  toggleIndentList,
} from '@udecode/plate-indent-list';
import { useEditorRef, useEditorSelector } from '@udecode/plate/react';
import { List, ListOrdered } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
  useOpenState,
} from './dropdown-menu';
import {
  ToolbarSplitButton,
  ToolbarSplitButtonPrimary,
  ToolbarSplitButtonSecondary,
} from './toolbar';

export function NumberedIndentListToolbarButton() {
  const editor = useEditorRef();
  const openState = useOpenState();
  const { t } = useTranslation();
  const pressed = useEditorSelector(
    (editor) =>
      someIndentList(editor, [
        ListStyleType.Decimal,
        ListStyleType.LowerAlpha,
        ListStyleType.UpperAlpha,
        ListStyleType.LowerRoman,
        ListStyleType.UpperRoman,
      ]),
    []
  );

  return (
    <ToolbarSplitButton pressed={openState.open}>
      <ToolbarSplitButtonPrimary
        className="data-[state=on]:bg-accent data-[state=on]:text-accent-foreground"
        onClick={() =>
          toggleIndentList(editor, {
            listStyleType: ListStyleType.Decimal,
          })
        }
        data-state={pressed ? 'on' : 'off'}
        tooltip={t('numberedList')}
      >
        <ListOrdered className="size-4" />
      </ToolbarSplitButtonPrimary>

      <DropdownMenu {...openState} modal={false}>
        <DropdownMenuTrigger asChild>
          <ToolbarSplitButtonSecondary />
        </DropdownMenuTrigger>

        <DropdownMenuContent align="start" alignOffset={-32}>
          <DropdownMenuGroup>
            <DropdownMenuItem
              onSelect={() =>
                toggleIndentList(editor, {
                  listStyleType: ListStyleType.Decimal,
                })
              }
            >
              {t('decimal')} (1, 2, 3)
            </DropdownMenuItem>
            <DropdownMenuItem
              onSelect={() =>
                toggleIndentList(editor, {
                  listStyleType: ListStyleType.LowerAlpha,
                })
              }
            >
              {t('lowerAlpha')} (a, b, c)
            </DropdownMenuItem>
            <DropdownMenuItem
              onSelect={() =>
                toggleIndentList(editor, {
                  listStyleType: ListStyleType.UpperAlpha,
                })
              }
            >
              {t('upperAlpha')} (A, B, C)
            </DropdownMenuItem>
            <DropdownMenuItem
              onSelect={() =>
                toggleIndentList(editor, {
                  listStyleType: ListStyleType.LowerRoman,
                })
              }
            >
              {t('lowerRoman')} (i, ii, iii)
            </DropdownMenuItem>
            <DropdownMenuItem
              onSelect={() =>
                toggleIndentList(editor, {
                  listStyleType: ListStyleType.UpperRoman,
                })
              }
            >
              {t('upperRoman')} (I, II, III)
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </ToolbarSplitButton>
  );
}

export function BulletedIndentListToolbarButton() {
  const editor = useEditorRef();
  const openState = useOpenState();
  const { t } = useTranslation();
  const pressed = useEditorSelector(
    (editor) =>
      someIndentList(editor, [
        ListStyleType.Disc,
        ListStyleType.Circle,
        ListStyleType.Square,
      ]),
    []
  );

  return (
    <ToolbarSplitButton pressed={openState.open}>
      <ToolbarSplitButtonPrimary
        className="data-[state=on]:bg-accent data-[state=on]:text-accent-foreground"
        onClick={() => {
          toggleIndentList(editor, {
            listStyleType: ListStyleType.Disc,
          });
        }}
        data-state={pressed ? 'on' : 'off'}
        tooltip={t('bulletedList')}
      >
        <List className="size-4" />
      </ToolbarSplitButtonPrimary>

      <DropdownMenu {...openState} modal={false}>
        <DropdownMenuTrigger asChild>
          <ToolbarSplitButtonSecondary />
        </DropdownMenuTrigger>

        <DropdownMenuContent align="start" alignOffset={-32}>
          <DropdownMenuGroup>
            <DropdownMenuItem
              onClick={() =>
                toggleIndentList(editor, {
                  listStyleType: ListStyleType.Disc,
                })
              }
            >
              <div className="flex items-center gap-2">
                <div className="size-2 rounded-full border border-current bg-current" />
                {t('default')}
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() =>
                toggleIndentList(editor, {
                  listStyleType: ListStyleType.Circle,
                })
              }
            >
              <div className="flex items-center gap-2">
                <div className="size-2 rounded-full border border-current" />
                {t('circle')}
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() =>
                toggleIndentList(editor, {
                  listStyleType: ListStyleType.Square,
                })
              }
            >
              <div className="flex items-center gap-2">
                <div className="size-2 border border-current bg-current" />
                {t('square')}
              </div>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </ToolbarSplitButton>
  );
}
