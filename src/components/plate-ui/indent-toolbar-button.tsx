'use client';

import { withRef } from '@udecode/cn';
import { useIndentButton } from '@udecode/plate-indent/react';
import { Indent } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { ToolbarButton } from './toolbar';

export const IndentToolbarButton = withRef<typeof ToolbarButton>(
  (rest, ref) => {
    const { props } = useIndentButton();
    const { t } = useTranslation();
    return (
      <ToolbarButton ref={ref} tooltip={t("indent")} {...props} {...rest}>
        <Indent />
      </ToolbarButton>
    );
  }
);
