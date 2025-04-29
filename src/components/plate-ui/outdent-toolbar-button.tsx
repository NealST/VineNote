'use client';

import { withRef } from '@udecode/cn';
import { useOutdentButton } from '@udecode/plate-indent/react';
import { Outdent } from 'lucide-react';
import i18n from '@/i18n';
import { ToolbarButton } from './toolbar';

export const OutdentToolbarButton = withRef<typeof ToolbarButton>(
  (rest, ref) => {
    const { props } = useOutdentButton();

    return (
      <ToolbarButton ref={ref} tooltip={i18n.t('outdent')} {...props} {...rest}>
        <Outdent />
      </ToolbarButton>
    );
  }
);
