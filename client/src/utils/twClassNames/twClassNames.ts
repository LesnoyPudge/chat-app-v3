import classNames, { Argument } from 'classnames';
import { twMerge } from 'tailwind-merge';



export const twClassNames = (...args: Argument[]) => twMerge(classNames(args));