'use client';

import { withRef } from '@udecode/cn';
import {
  useLinkToolbarButton,
  useLinkToolbarButtonState,
} from '@udecode/plate-link/react';
import { Link } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { ToolbarButton } from './toolbar';

export const LinkToolbarButton = withRef<typeof ToolbarButton>((rest, ref) => {
  const state = useLinkToolbarButtonState();
  const { props } = useLinkToolbarButton(state);
  const { t } = useTranslation();
  return (
    <ToolbarButton
      ref={ref}
      data-plate-focus
      tooltip={t('link')}
      {...props}
      {...rest}
    >
      <Link />
    </ToolbarButton>
  );
});
