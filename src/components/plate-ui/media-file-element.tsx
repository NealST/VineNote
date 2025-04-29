'use client';

import { cn, withRef } from '@udecode/cn';
import { useMediaState } from '@udecode/plate-media/react';
import { ResizableProvider } from '@udecode/plate-resizable';
import { PlateElement, useReadOnly, withHOC } from '@udecode/plate/react';
import { FileUp } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Caption, CaptionTextarea } from './caption';

export const MediaFileElement = withHOC(
  ResizableProvider,
  withRef<typeof PlateElement>(
    ({ children, className, nodeProps, ...props }, ref) => {
      const readOnly = useReadOnly();
      const { t } = useTranslation();
      const { name, unsafeUrl } = useMediaState();

      return (
        <PlateElement
          ref={ref}
          className={cn(className, 'my-px rounded-sm')}
          {...props}
        >
          <a
            className="group relative m-0 flex cursor-pointer items-center rounded px-0.5 py-[3px] hover:bg-muted"
            contentEditable={false}
            download={name}
            href={unsafeUrl}
            rel="noopener noreferrer"
            role="button"
            target="_blank"
          >
            <div className="flex items-center gap-1 p-1">
              <FileUp className="size-5" />

              <div>{name}</div>

              {/* TODO: add size */}
              {/* <div className="text-muted-foreground">{element.size}</div> */}
            </div>

            <Caption align="left">
              <CaptionTextarea
                className="text-left"
                readOnly={readOnly}
                placeholder={t('writeCaption')}
              />
            </Caption>
          </a>
          {children}
        </PlateElement>
      );
    }
  )
);
