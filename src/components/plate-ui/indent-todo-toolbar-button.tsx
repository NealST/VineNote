'use client';

import { withRef } from '@udecode/cn';
import {
  useIndentTodoToolBarButton,
  useIndentTodoToolBarButtonState,
} from '@udecode/plate-indent-list/react';
import { ListTodoIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { ToolbarButton } from './toolbar';

export const IndentTodoToolbarButton = withRef<typeof ToolbarButton>(
  (rest, ref) => {
    const state = useIndentTodoToolBarButtonState({ nodeType: 'todo' });
    const { props } = useIndentTodoToolBarButton(state);
    const { t } = useTranslation();
    return (
      <ToolbarButton ref={ref} tooltip={t("todo")} {...props} {...rest}>
        <ListTodoIcon />
      </ToolbarButton>
    );
  }
);
