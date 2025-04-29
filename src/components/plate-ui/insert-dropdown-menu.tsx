'use client';

import React from 'react';

import type { DropdownMenuProps } from '@radix-ui/react-dropdown-menu';

import { BlockquotePlugin } from '@udecode/plate-block-quote/react';
import { CodeBlockPlugin } from '@udecode/plate-code-block/react';
import { DatePlugin } from '@udecode/plate-date/react';
import { ExcalidrawPlugin } from '@udecode/plate-excalidraw/react';
import { HEADING_KEYS } from '@udecode/plate-heading';
import { TocPlugin } from '@udecode/plate-heading/react';
import { HorizontalRulePlugin } from '@udecode/plate-horizontal-rule/react';
import { INDENT_LIST_KEYS, ListStyleType } from '@udecode/plate-indent-list';
import { LinkPlugin } from '@udecode/plate-link/react';
import {
  EquationPlugin,
  InlineEquationPlugin,
} from '@udecode/plate-math/react';
import { ImagePlugin, MediaEmbedPlugin } from '@udecode/plate-media/react';
import { TablePlugin } from '@udecode/plate-table/react';
import { TogglePlugin } from '@udecode/plate-toggle/react';
import {
  type PlateEditor,
  ParagraphPlugin,
  useEditorRef,
} from '@udecode/plate/react';
import {
  CalendarIcon,
  ChevronRightIcon,
  Columns3Icon,
  FileCodeIcon,
  FilmIcon,
  Heading1Icon,
  Heading2Icon,
  Heading3Icon,
  ImageIcon,
  Link2Icon,
  ListIcon,
  ListOrderedIcon,
  MinusIcon,
  PenToolIcon,
  PilcrowIcon,
  PlusIcon,
  QuoteIcon,
  RadicalIcon,
  SquareIcon,
  TableIcon,
  TableOfContentsIcon,
} from 'lucide-react';

import {
  insertBlock,
  insertInlineElement,
} from '@/components/editor/transforms';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
  useOpenState,
} from './dropdown-menu';
import { ToolbarButton } from './toolbar';
import i18n from '@/i18n';

type Group = {
  id: string;
  group: string;
  items: Item[];
};

interface Item {
  icon: React.ReactNode;
  value: string;
  onSelect: (editor: PlateEditor, value: string) => void;
  focusEditor?: boolean;
  label?: string;
}

const t = i18n.t;

const groups: Group[] = [
  {
    id: 'basicBlocks',
    group: t('basicBlocks'),
    items: [
      {
        icon: <PilcrowIcon />,
        label: t('paragraph'),
        value: ParagraphPlugin.key,
      },
      {
        icon: <Heading1Icon />,
        label: t('heading1'),
        value: HEADING_KEYS.h1,
      },
      {
        icon: <Heading2Icon />,
        label: t('heading2'),
        value: HEADING_KEYS.h2,
      },
      {
        icon: <Heading3Icon />,
        label: t('heading3'),
        value: HEADING_KEYS.h3,
      },
      {
        icon: <TableIcon />,
        label: t('table'),
        value: TablePlugin.key,
      },
      {
        icon: <FileCodeIcon />,
        label: t('code'),
        value: CodeBlockPlugin.key,
      },
      {
        icon: <QuoteIcon />,
        label: t('quote'),
        value: BlockquotePlugin.key,
      },
      {
        icon: <MinusIcon />,
        label: t('divider'),
        value: HorizontalRulePlugin.key,
      },
    ].map((item) => ({
      ...item,
      onSelect: (editor, value) => {
        insertBlock(editor, value);
      },
    })),
  },
  {
    id: 'lists',
    group: t('lists'),
    items: [
      {
        icon: <ListIcon />,
        label: t('bulletedList'),
        value: ListStyleType.Disc,
      },
      {
        icon: <ListOrderedIcon />,
        label: t('numberedList'),
        value: ListStyleType.Decimal,
      },
      {
        icon: <SquareIcon />,
        label: t('todoList'),
        value: INDENT_LIST_KEYS.todo,
      },
      {
        icon: <ChevronRightIcon />,
        label: t('toggleList'),
        value: TogglePlugin.key,
      },
    ].map((item) => ({
      ...item,
      onSelect: (editor, value) => {
        insertBlock(editor, value);
      },
    })),
  },
  {
    id: 'media',
    group: t('media'),
    items: [
      {
        icon: <ImageIcon />,
        label: t('image'),
        value: ImagePlugin.key,
      },
      {
        icon: <FilmIcon />,
        label: t('embed'),
        value: MediaEmbedPlugin.key,
      },
      {
        icon: <PenToolIcon />,
        label: t('excalidraw'),
        value: ExcalidrawPlugin.key,
      },
    ].map((item) => ({
      ...item,
      onSelect: (editor, value) => {
        insertBlock(editor, value);
      },
    })),
  },
  {
    id: 'advanceBlocks',
    group: t('advancedBlocks'),
    items: [
      {
        icon: <TableOfContentsIcon />,
        label: t('toc'),
        value: TocPlugin.key,
      },
      {
        icon: <Columns3Icon />,
        label: t('3colums'),
        value: 'action_three_columns',
      },
      {
        focusEditor: false,
        icon: <RadicalIcon />,
        label: t('equation'),
        value: EquationPlugin.key,
      },
    ].map((item) => ({
      ...item,
      onSelect: (editor, value) => {
        insertBlock(editor, value);
      },
    })),
  },
  {
    id: 'inline',
    group: t('inline'),
    items: [
      {
        icon: <Link2Icon />,
        label: t('link'),
        value: LinkPlugin.key,
      },
      {
        focusEditor: true,
        icon: <CalendarIcon />,
        label: t('date'),
        value: DatePlugin.key,
      },
      {
        focusEditor: false,
        icon: <RadicalIcon />,
        label: t('inlineEquation'),
        value: InlineEquationPlugin.key,
      },
    ].map((item) => ({
      ...item,
      onSelect: (editor, value) => {
        insertInlineElement(editor, value);
      },
    })),
  },
];

export function InsertDropdownMenu(props: DropdownMenuProps) {
  const editor = useEditorRef();
  const openState = useOpenState();

  return (
    <DropdownMenu modal={false} {...openState} {...props}>
      <DropdownMenuTrigger asChild>
        <ToolbarButton pressed={openState.open} tooltip="Insert" isDropdown>
          <PlusIcon />
        </ToolbarButton>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className="flex max-h-[500px] min-w-0 flex-col overflow-y-auto"
        align="start"
      >
        {groups.map(({ id, group, items: nestedItems }) => (
          <DropdownMenuGroup key={id} label={group}>
            {nestedItems.map(({ icon, label, value, onSelect }) => (
              <DropdownMenuItem
                key={value}
                className="min-w-[180px]"
                onSelect={() => {
                  onSelect(editor, value);
                  editor.tf.focus();
                }}
              >
                {icon}
                {label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuGroup>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
