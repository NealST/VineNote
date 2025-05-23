'use client';

import React from 'react';

import { cn, withRef } from '@udecode/cn';
import { EraserIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import {
  type TColor,
  ColorDropdownMenuItems,
} from './color-dropdown-menu-items';
import { ColorCustom } from './colors-custom';
import { DropdownMenuGroup, DropdownMenuItem } from './dropdown-menu';

export const ColorPickerContent = withRef<
  'div',
  {
    colors: TColor[];
    customColors: TColor[];
    clearColor: () => void;
    updateColor: (color: string) => void;
    updateCustomColor: (color: string) => void;
    color?: string;
  }
>(
  (
    {
      className,
      clearColor,
      color,
      colors,
      customColors,
      updateColor,
      updateCustomColor,
      ...props
    },
    ref
  ) => {
    const { t } = useTranslation();
    return (
      <div ref={ref} className={cn('flex flex-col', className)} {...props}>
        <DropdownMenuGroup label={t('customColors')}>
          <ColorCustom
            color={color}
            className="px-2"
            colors={colors}
            customColors={customColors}
            updateColor={updateColor}
            updateCustomColor={updateCustomColor}
          />
        </DropdownMenuGroup>
        <DropdownMenuGroup label={t('defaultColors')}>
          <ColorDropdownMenuItems
            color={color}
            className="px-2"
            colors={colors}
            updateColor={updateColor}
          />
        </DropdownMenuGroup>
        {color && (
          <DropdownMenuGroup>
            <DropdownMenuItem className="p-2" onClick={clearColor}>
              <EraserIcon />
              <span>{t('clear')}</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        )}
      </div>
    );
  }
);

export const ColorPicker = React.memo(
  ColorPickerContent,
  (prev, next) =>
    prev.color === next.color &&
    prev.colors === next.colors &&
    prev.customColors === next.customColors
);
