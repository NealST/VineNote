'use client';

import { withRef } from '@udecode/cn';
import {
  useToggleToolbarButton,
  useToggleToolbarButtonState,
} from '@udecode/plate-toggle/react';
import { ListCollapseIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { ToolbarButton } from './toolbar';

export const ToggleToolbarButton = withRef<typeof ToolbarButton>(
  (rest, ref) => {
    const state = useToggleToolbarButtonState();
    const { props } = useToggleToolbarButton(state);
    const { t } = useTranslation();
    return (
      <ToolbarButton ref={ref} tooltip={t('toggle')} {...props} {...rest}>
        <ListCollapseIcon />
      </ToolbarButton>
    );
  }
);
