"use client";

import classNames from 'classnames'
import React from 'react';

export type IconProps = {
  className?: string;
  appendClassName?: string;
  color?: string;
  rotate?: number;
  size?: 'mini' | 'tiny' | 'small' | 'large' | 'big' | 'huge' | 'massive';
  ariaLabel?: string;
  ariaHidden?: boolean;
  style?: React.CSSProperties;
  onClick?: (event: React.MouseEvent) => void;
}

export type SvgProps = {
  name?: never;
  as?: never;
  children: React.ReactNode;
};

export type IProps = {
  name: string;
  as?: 'div' | 'i';
  children?: never;
};

export const Icon = ({
  as = "i",
  className = 'asm-icon',
  appendClassName,
  color = '#000',
  name,
  rotate = 0,
  size = 'small',
  ariaLabel,
  ariaHidden,
  children,
  style,
  onClick,
  ...rest
}: IconProps & (SvgProps | IProps)) => {

  const pointerStyling = onClick ? "asm-icon-pointer" : ""

  const getIconAriaOptions = () => {
    const ariaOptions: any = {};
    if (!ariaLabel) {
      ariaOptions['aria-hidden'] = 'true';
    } else {
      ariaOptions['aria-label'] = ariaLabel;
    }

    if (ariaHidden) {
      ariaOptions['aria-hidden'] = ariaHidden;
    }

    return ariaOptions;
  };

  const ariaOptions = getIconAriaOptions();

  const ElementType = as;

  return (
    React.createElement(
      ElementType,
      { ...rest, ...ariaOptions, style: { color: color, transform: `rotate(${rotate}deg)` }, className: classNames(className, name, size, pointerStyling, appendClassName), onClick: onClick },
      children
    )
  );
};

export default Icon;
